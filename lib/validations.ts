import { z } from "zod";
import { formatePrice } from "./utils";

export const signInSchema = z.object({
  email: z.string().email("Invalid Email Address"),
  password: z.string().min(6, "Password must be at least 6 chars"),
});

export const signUpSchema = z
  .object({
    name: z.string().min(3, "The name must be at least 3 chars"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 chars"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm Password does not match",
    path: ["confirmPassword"],
  });

const priceSchema = z
  .string()
  .refine(
    (val) => /^\d+(\.\d{2})?$/.test(formatePrice(Number(val))),
    "The price must be a valid number with two float numbers"
  );

export const insertproductSchema = z.object({
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

export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  qty: z.number().int().nonnegative("Quantity must be a positive number"),
  image: z.string().min(1, "Image is required"),
  price: priceSchema,
});

export const insertCartItemSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: priceSchema,
  totalPrice: priceSchema,
  shippingPrice: priceSchema,
  taxPrice: priceSchema,
  sessionCartId: z.string().min(1, "Session cart id is required"),
  userId: z.string().optional().nullable(),
});

export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  streetAddress: z.string().min(3, "Address must be at least 3 characters"),
  city: z.string().min(3, "City must be at least 3 characters"),
  postalCode: z.string().min(3, "Postal code must be at least 3 characters"),
  country: z.string().min(3, "Country must be at least 3 characters"),
  lat: z.number().optional(),
  lng: z.number().optional(),
});
