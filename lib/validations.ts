import { z } from "zod";
import { formatePrice } from "./utils";

const priceSchema = z.string().refine((val) => {
  const regex = /^\d+(\.\d{2})?$/;
  return regex.test(formatePrice(Number(val)));
}, "The price must be a valid number with two float numbers");

export const productSchema = z.object({
  name: z.string().min(3, "The product name must be at least 3 characters"),
  slug: z.string().min(3, "The slug must be at least 3 characters"),
  category: z.string().min(3, "The category must be at least 3 characters"),
  brand: z.string().min(3, "The brand name must be at least 3 characters"),
  description: z
    .string()
    .min(3, "The description must be at least 3 characters"),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, "There must be at least one image"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: priceSchema,
});
