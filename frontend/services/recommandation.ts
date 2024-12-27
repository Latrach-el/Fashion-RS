import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000"
  // timeout: 8000
});

export interface Recommandation {
  id: number;
  articleType: string;
  gender: string;
  season: string;
  baseColor: string;
  productDisplayName: string;
  similarity_score: number;
}

interface PreferencesBody {
  gender: string;
  season: string;
}

export const getRecommandationByPreferences = async (
  gender: string,
  season: string
): Promise<Recommandation[]> => {
  const body: PreferencesBody = {
    gender,
    season
  };
  const response = await axiosInstance.post<Recommandation[]>(`/recommend_by_preferences`, body);
  // const response = await axiosInstance.get<Recommandation[]>(`/recommend_by_preferences`,);
  return response.data;
};

export const getRecommandationByImages = async (
  images: string[],
  preferences: PreferencesBody
): Promise<Recommandation[]> => {
  const body = {
    images,
    preferences
  };
  console.log(body);
  const response = await axiosInstance.post<Recommandation[]>(`/recommend_by_image`, body);
  // const response = await axiosInstance.get<Recommandation[]>(`/recommend_by_preferences`,);
  return response.data;
};

export async function getProducts(recommandations: Recommandation[]) {
  const products = await Promise.all(
    recommandations.map(async (rec) => {
      const filename = `${rec.id}.jpg`;
      return {
        ...rec,
        imageUrl: `/dataset/images/${filename}`
      };
    })
  );

  return products;
}
