import { z } from "zod";
import {
  insertCartItemSchema,
  cartItemSchema,
  insertproductSchema,
  shippingAddressSchema,
} from "@/lib/validations";

export type Product = z.infer<typeof insertproductSchema> & {
  id: string;
  rating: string;
  numReviews: number;
  createdAt: Date;
};

export type CartItem = z.infer<typeof cartItemSchema>;
export type Cart = z.infer<typeof insertCartItemSchema>;

export type Errors = {
  name?: string;
  slug?: string;
  category?: string;
  brand?: string;
  description?: string;
  stock?: string;
  images?: string;
  isFeatured?: boolean;
  banner?: string;
  price?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};
export type FormState = {
  errors?: Errors;
  success?: boolean;
  message?: string;
};

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
