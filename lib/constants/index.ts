export const APP_NAME = process.env.APP_NAME || "Sustore";
export const APP_DESC =
  process.env.APP_DESC || "A Modern E-Commerce Store Built with Next.js";
export const SERVER_URL = process.env.SERVER_URL || "http://localhost:3000";

export const PAYMENT_METHOD = process.env.PAYMENT_METHOD
  ? process.env.PAYMENT_METHOD.split(", ")
  : ["PayPal", "Stripe", "CashOnDelivery"];
export const DEFAULT_PAYMENT_METHOD =
  process.env.DEFAULT_PAYMENT_METHOD || "PayPal";

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 12;

export const productDefaultValues = {
  name: "",
  slug: "",
  category: "",
  images: [],
  brand: "",
  description: "",
  price: "0",
  stock: 0,
  rating: "0",
  numReviews: "0",
  isFeatured: false,
  banner: null,
};

export const USER_ROLES = process.env.USER_ROLES
  ? process.env.USER_ROLES.split(", ")
  : ["admin", "user"];

export const reviewFormDefaultValues = {
  title: "",
  comment: "",
  rating: 0,
};
