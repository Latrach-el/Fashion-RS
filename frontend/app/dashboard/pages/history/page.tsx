import { generateMeta } from "@/lib/utils";
import { getProducts, getRecommandationByImages } from "@/services/recommandation";
import { getCurrentSeason } from "@/utils/date";
import { currentUser } from "@clerk/nextjs/server";
import ProductsHistory from "./products-history";

export async function generateMetadata() {
  return generateMeta({
    title: "Products History - FashionFit",
    description: "A list of products created to recommand to users based on their preferences.",
    canonical: "/pages/products"
  });
}

export default async function Page() {
  const user = await currentUser();

  if (user?.unsafeMetadata.favoriteProducts === undefined) {
    return (
      <div className="flex h-96 items-center justify-center">
        <h1 className="text-2xl font-bold tracking-tight">No products found</h1>
      </div>
    );
  }

  const updatedFavorites = (user?.unsafeMetadata.favoriteProducts as string[]).map(
    (product) => `${product}.jpg`
  );
  const recommandations = await getRecommandationByImages(updatedFavorites, {
    gender: user?.unsafeMetadata.gender as string,
    season: getCurrentSeason()
  });
  const products = await getProducts(recommandations);

  return (
    <>
      <div className="flex flex-col items-start justify-between space-y-2 border-b pb-4">
        <h1 className="text-2xl font-bold tracking-tight">Products Purchase History</h1>
        <p>
          This is a list of products that match your preferences based on your purchase history.
        </p>
        <p>{products.length} products</p>
      </div>
      <ProductsHistory products={products} />
    </>
  );
}
