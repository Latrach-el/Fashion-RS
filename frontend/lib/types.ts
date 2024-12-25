import { Recommandation } from "@/services/recommandation";

export interface Product extends Recommandation {
  imageUrl: string;
}