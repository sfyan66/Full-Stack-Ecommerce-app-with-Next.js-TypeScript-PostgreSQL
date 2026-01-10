"use server";

// import { PrismaClient } from "../generated/prisma/client";
// import { PrismaPg } from "@prisma/adapter-pg";
import { formateDataToPlain } from "../utils";
import { prisma } from "@/db/prisma";

// const adapter = new PrismaPg({
//   connectionString: process.env.DATABASE_URL,
// });
// const prisma = new PrismaClient({ adapter });

export async function getProducts() {
  const products = await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: "desc" },
  });
  return formateDataToPlain(products);
}
export async function getOneProduct(slug: string) {
  if (!slug) return null;
  return await prisma.product.findFirst({
    where: { slug },
  });
}
