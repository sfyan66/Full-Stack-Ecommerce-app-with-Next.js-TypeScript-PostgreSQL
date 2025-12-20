"use server";

import { PrismaClient } from "../generated/prisma/client";
import { formateData } from "../utils";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

export async function getProducts() {
  const products = await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: "desc" },
  });
  return formateData(products);
}

export async function getOneProduct(slug: string) {
  return await prisma.product.findFirst({
    where: { slug: slug },
  });
}
