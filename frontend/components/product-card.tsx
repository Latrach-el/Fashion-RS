/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Heart } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { Product } from "@/lib/types";

export interface UserMetadata {
  favoriteProducts: number[];
  gender: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { user } = useUser();
  console.log(user?.unsafeMetadata.favoriteProducts);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    toast("Product liked!");

    const currentMetadata = user?.unsafeMetadata as UserUnsafeMetadata;
    const favorites = (currentMetadata?.favoriteProducts as number[]) || [];
    const updatedFavorites =
      favorites && favorites?.includes(product.id)
        ? favorites.filter((id) => id !== product.id)
        : [...favorites, product.id];

    await user?.update({
      unsafeMetadata: {
        ...currentMetadata,
        favoriteProducts: updatedFavorites
      }
    });
  };

  const isFavorited =
    Array.isArray(user?.unsafeMetadata?.favoriteProducts) &&
    user.unsafeMetadata.favoriteProducts.includes(product.id);

  return (
    <a key={product.id} href={product.imageUrl} className="group relative">
      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.productDisplayName}
          className="aspect-square w-full rounded-lg bg-gray-200 object-contain group-hover:opacity-75 xl:aspect-[7/8]"
        />
        <button
          onClick={handleLike}
          className="absolute right-2 top-2 rounded-full bg-white p-2 opacity-0 shadow-lg transition-transform hover:scale-110 group-hover:opacity-100">
          <Heart 
            className={`h-5 w-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
          />
        </button>
        <div className="absolute bottom-2 right-2 flex gap-1">
          <span className="rounded-full px-2 py-1 text-xs shadow">{product.articleType}</span>
        </div>
      </div>
      <h3 className="mt-4 text-sm text-gray-700">{product.productDisplayName}</h3>
      {/* <p className="mt-1 text-lg font-medium text-gray-900">{product.similarity_score}</p> */}
    </a>
  );
};

export default ProductCard;
