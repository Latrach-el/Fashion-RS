from flask import Flask, request, jsonify, send_file
import os
import numpy as np
from numpy.linalg import norm
import tensorflow as tf
from  tensorflow import keras 
from keras.applications import ResNet50
from keras.applications.resnet50 import preprocess_input
from keras.layers import GlobalMaxPool2D
from keras.preprocessing import image
from sklearn.neighbors import NearestNeighbors
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import pickle as pkl
from PIL import Image

app = Flask(__name__)

# Configuration paths
csv_path = r'/home/lenovo/workflow/academic/s3/recommandation-systems/mini-projet/application/dataset/styles.csv'
image_path = r'/home/lenovo/workflow/academic/s3/recommandation-systems/mini-projet/application/dataset/images'
image_features_path = r'/home/lenovo/workflow/academic/s3/recommandation-systems/mini-projet/application/model/Images_features.pkl'
filenames_path = r'/home/lenovo/workflow/academic/s3/recommandation-systems/mini-projet/application/model/filenames.pkl'

class UnifiedRecommendationSystem:
    def __init__(self):
        # Load all required data
        self.metadata = pd.read_csv(csv_path, on_bad_lines='skip')
        self.image_features = np.array(pkl.load(open(image_features_path, 'rb')))
        self.filenames = pkl.load(open(filenames_path, 'rb'))
        
        # Initialize image-based models
        self.model = self._initialize_resnet()
        self.neighbors = self._initialize_neighbors()
        
        # Initialize text-based features
        self.clean_data()
        self.prepare_features()

    def _initialize_resnet(self):
        base_model = ResNet50(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
        base_model.trainable = False
        model = tf.keras.models.Sequential([base_model, GlobalMaxPool2D()])
        return model

    def _initialize_neighbors(self):
        neighbors = NearestNeighbors(n_neighbors=100, algorithm='brute', metric='euclidean')
        neighbors.fit(self.image_features)
        return neighbors

    def clean_data(self):
        columns_to_clean = ['gender', 'season', 'baseColour', 'articleType']
        for col in columns_to_clean:
            self.metadata[col] = self.metadata[col].fillna('')

    def prepare_features(self):
        self.metadata['full_features'] = (
            self.metadata['gender'] + ' ' +
            self.metadata['season'] + ' ' +
            self.metadata['baseColour'] + ' ' +
            self.metadata['articleType']
        )
        self.metadata = self.metadata[self.metadata['full_features'].str.strip() != '']
        self.tfidf = TfidfVectorizer(stop_words='english')
        self.feature_matrix = self.tfidf.fit_transform(self.metadata['full_features'])

    def get_id_from_filename(self, filename):
        return os.path.splitext(os.path.basename(filename))[0]

    def extract_features_from_images(self, image_path):
        img = image.load_img(image_path, target_size=(224, 224))
        img_array = image.img_to_array(img)
        img_expand_dim = np.expand_dims(img_array, axis=0)
        img_preprocess = preprocess_input(img_expand_dim)
        result = self.model.predict(img_preprocess).flatten()
        norm_result = result / norm(result)
        return norm_result

    def recommend_by_image(self, input_images, preferences=None, max_recommendations=3):
        all_recommendations = []
    
        for img_filename in input_images:
            img_path = os.path.join(image_path, img_filename)
            if not os.path.exists(img_path):
                continue

            try:
                feature = self.extract_features_from_images(img_path)
                distances, indices = self.neighbors.kneighbors([feature])
                recommendations_for_image = []

                for idx, distance in zip(indices[0], distances[0]):
                    similar_file_id = self.get_id_from_filename(self.filenames[idx])
                    meta_row = self.metadata[self.metadata['id'].astype(str) == similar_file_id]

                    if not meta_row.empty:
                        row = meta_row.iloc[0]
                        matches_preferences = True
                        if preferences:
                            matches_preferences = all(
                                str(row[key]).lower() == str(value).lower()
                                for key, value in preferences.items()
                                if key in row
                            )

                        if matches_preferences:
                            input_id = self.get_id_from_filename(img_filename)
                            if similar_file_id != input_id:
                                recommendation = {
                                    'id': int(similar_file_id),
                                    'articleType': row['articleType'],
                                    'baseColour': row['baseColour'],
                                    'gender': row['gender'],
                                    'productDisplayName': row['productDisplayName'],
                                    'season': row['season'],
                                    'similarity_score': float(1 - distance),
                                    'image_path': self.filenames[idx]
                                }
                                recommendations_for_image.append(recommendation)

            # Limiter à 3 recommandations uniques par image
                unique_recommendations = []
                seen_ids = set()
                for rec in sorted(recommendations_for_image, key=lambda x: x['similarity_score'], reverse=True):
                    if rec['id'] not in seen_ids:
                        seen_ids.add(rec['id'])
                        unique_recommendations.append(rec)
                        # all_recommendations.append(rec)
                        if len(unique_recommendations) >= max_recommendations:
                            break
                # if(len(unique_recommendations)>0):
                all_recommendations.extend(unique_recommendations)

            except Exception as e:
                print(f"Error processing image {img_filename}: {str(e)}")
                continue

        return all_recommendations


    def recommend_by_preferences(self, preferences, top_n=15):
        query = ' '.join([
            preferences.get('gender', ''),
            preferences.get('season', ''),
            preferences.get('baseColour', ''),
            preferences.get('articleType', '')
        ]).strip()

        query_vector = self.tfidf.transform([query])
        similarity_scores = cosine_similarity(query_vector, self.feature_matrix).flatten()

        mask = np.ones(len(self.metadata), dtype=bool)
        for key, value in preferences.items():
            if value:
                mask &= (self.metadata[key] == value)

        similar_indices = similarity_scores.argsort()[::-1]
        filtered_indices = [idx for idx in similar_indices if mask[idx]][:top_n]

        recommendations = self.metadata.iloc[filtered_indices].copy()
        recommendations['similarity_score'] = similarity_scores[filtered_indices]
        
        return recommendations[['id', 'productDisplayName', 'gender', 'season', 'baseColour', 'articleType', 'similarity_score']]

# Initialize the unified recommender
recommender = UnifiedRecommendationSystem()

@app.route('/recommend_by_image', methods=['POST'])
def recommend_by_image():
    try:
        data = request.get_json()
        input_images = data.get('images', [])
        preferences = data.get('preferences', {})
        
        if not input_images:
            return jsonify({'error': 'No images provided'}), 400

        recommendations = recommender.recommend_by_image(input_images, preferences)
        return jsonify(recommendations)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/recommend_by_preferences', methods=['POST'])
def recommend_by_preferences():
    try:
        preferences = request.json
        recommendations = recommender.recommend_by_preferences(preferences).to_dict(orient='records')
        return jsonify(recommendations)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/image/<int:item_id>', methods=['GET'])
def get_image(item_id):
    image_file = os.path.join(image_path, f"{item_id}.jpg")
    if os.path.exists(image_file):
        return send_file(image_file, mimetype='image/jpeg')
    return jsonify({'error': 'Image not found'}), 404

if __name__ == '__main__':
    app.run(debug=True,
        host='0.0.0.0',
        port=5000
    )