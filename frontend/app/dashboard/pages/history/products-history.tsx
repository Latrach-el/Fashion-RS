/* eslint-disable @next/next/no-img-element */
"use client";

import { Product } from "@/lib/types";

interface ProductsHistoryProps {
  products: Product[];
}

export default function ProductsHistory({ products }: ProductsHistoryProps) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 py-6">
      {products.map((product) => (
        <a key={product.id} href={product.imageUrl} className="group">
          <div className="relative">
            <img
              src={product.imageUrl}
              alt={product.productDisplayName}
              className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
            />
            <div className="absolute bottom-2 right-2 flex gap-1">
              <span className="rounded-full px-2 py-1 text-xs shadow">{product.articleType}</span>
            </div>
          </div>
          <h3 className="mt-4 text-sm text-gray-700">{product.productDisplayName}</h3>
        </a>
      ))}
    </div>
  );
}
