export const APP_NAME = process.env.APP_NAME || "Sustore";
export const APP_DESC =
  process.env.APP_DESC || "A Modern E-Commerce Store Built with Next.js";
export const SERVER_URL = process.env.SERVER_URL || "http://localhost:3000";

export const PAYMENT_METHOD = process.env.PAYMENT_METHOD
  ? process.env.PAYMENT_METHOD.split(", ")
  : ["PayPal", "Stripe", "CreditCard"];
export const DEFAULT_PAYMENT_METHOD =
  process.env.DEFAULT_PAYMENT_METHOD || "PayPal";
