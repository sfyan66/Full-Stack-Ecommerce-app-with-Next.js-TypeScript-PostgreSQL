import { z } from "zod";
import { formatePrice } from "./utils";
import { PAYMENT_METHOD } from "./constants";

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
    "The price must be a valid number with two float numbers",
  );

export const insertproductSchema = z.object({
  name: z.string().min(3, "The product name must be at least 3 characters"),
  slug: z.string().min(3, "The slug must be at least 3 characters"),
  category: z.string().min(3, "The category must be at least 3 characters"),
  brand: z.string().min(3, "The brand name must be at least 3 characters"),
  description: z
    .string()
    .min(3, "The description must be at least 3 characters"),
  stock: z.number(),
  images: z.array(z.string()).min(1, "There must be at least one image"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: priceSchema,
});

export const updateProductSchema = insertproductSchema.extend({
  id: z.string().min(1, "Id is required"),
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

export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, "Payment method is required"),
  })
  .refine((data) => PAYMENT_METHOD.includes(data.type), {
    path: ["type"],
    message: "Invalid payment method",
  });

export const insertOrderSchema = z.object({
  userId: z.string().min(1, "User is required"),
  itemsPrice: priceSchema,
  shippingPrice: priceSchema,
  taxPrice: priceSchema,
  totalPrice: priceSchema,
  paymentMethod: z.string().refine((data) => PAYMENT_METHOD.includes(data), {
    message: "Invalid payment method",
  }),
  shippingAddress: shippingAddressSchema,
});

export const insertOrderItemSchema = z.object({
  productId: z.string(),
  slug: z.string(),
  image: z.string(),
  name: z.string(),
  price: priceSchema,
  qty: z.number(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(3, "Name must be at leaast 3 characters"),
  email: z.string().min(3, "Email must be at leaast 3 characters"),
});

export const updateUserSchema = updateProfileSchema.extend({
  id: z.string().min(1, "ID is required"),
  role: z.string().min(1, "Role is required"),
});

export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  email_address: z.string(),
  pricePaid: z.string(),
});

export const insertReviewSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  productId: z.string().min(1, "Product is required"),
  userId: z.string().min(1, "User is required"),
  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
});

// export const insertFakeProductsSchema = z.object({
//   id: z.string().min(1, "Id is required"),
//   title: z.string().min(3, "Title must be at least 3 characters"),
//   price: priceSchema,
//   description: z.string().min(3, "Description must be at least 3 characters"),
//   category: z.string().min(3,),
//   image: z.string(),
//   rating: z.string(),

// })
