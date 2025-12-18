import { z } from "zod";
import { productSchema } from "@/lib/validations";

export type ProductType = z.infer<typeof productSchema> & {
  id: string;
  createdAt: Date;
  rating: number;
};
