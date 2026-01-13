"use server";

import { formateDataToPlain, formatError } from "../utils";
import { prisma } from "@/db/prisma";
import { PAGE_SIZE } from "../constants";
import { revalidatePath } from "next/cache";
import { insertproductSchema, updateProductSchema } from "../validations";
import z from "zod";
import { Prisma } from "../generated/prisma/client";

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

export async function getAllProducts({
  query,
  category,
  page,
  limit = PAGE_SIZE,
}: {
  query: string;
  page: number;
  category: string;
  limit?: number;
}) {
  const data = await prisma.product.findMany({
    skip: (page - 1) * limit,
    take: limit,
  });

  const dataCount = await prisma.product.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

export async function deleteProduct(id: string) {
  try {
    const isExist = await prisma.product.findFirst({
      where: { id },
    });

    if (!isExist) throw new Error("Product not found");

    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function createProduct(data: z.infer<typeof insertproductSchema>) {
  try {
    const product = insertproductSchema.parse(data);
    await prisma.product.create({
      data: product,
    });

    revalidatePath("admin/products");

    return {
      success: true,
      message: "Product created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
  try {
    const product = updateProductSchema.parse(data);
    const productExist = await prisma.product.findFirst({
      where: { id: product.id },
    });

    if (!productExist) throw new Error("Product not found");

    await prisma.product.update({
      where: { id: product.id },
      data: product,
    });

    return {
      success: true,
      message: "Product updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
