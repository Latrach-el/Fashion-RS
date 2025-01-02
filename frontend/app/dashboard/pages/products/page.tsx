import { generateMeta } from "@/lib/utils";
import { getProducts, getRecommandationByPreferences } from "@/services/recommandation";
import { getCurrentSeason } from "@/utils/date";
import { currentUser } from "@clerk/nextjs/server";
import ProductsList from "./products-list";

export async function generateMetadata() {
  return generateMeta({
    title: "Products - FashionFit",
    description: "A list of products created to recommand to users based on their preferences.",
    canonical: "/pages/products"
  });
}

export default async function Page() {
  const user = await currentUser();

  const recommandations = await getRecommandationByPreferences(
    user?.unsafeMetadata.gender as string,
    getCurrentSeason()
  );

  const products = await getProducts(recommandations);

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Products</h1>
      </div>
      <ProductsList products={products} />
    </>
  );
}
