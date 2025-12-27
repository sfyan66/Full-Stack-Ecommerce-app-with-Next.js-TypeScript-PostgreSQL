import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/lib/generated/prisma/client";
import ws from "ws";

// WebSocket for Neon
neonConfig.webSocketConstructor = ws;

// Neon connection pool

// Prisma adapter for Neon
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });

// Prisma client with result transforms
export const prisma = new PrismaClient({ adapter }).$extends({
  result: {
    product: {
      price: {
        compute(product) {
          return product.price.toString();
        },
      },
      rating: {
        compute(product) {
          return product.rating.toString();
        },
      },
    },
    // Extend other models if needed (cart, order, etc.)
  },
});
