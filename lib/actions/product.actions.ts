"use server";

import { formateDataToPlain, formatError } from "../utils";
import { prisma } from "@/db/prisma";
import { PAGE_SIZE } from "../constants";
import { revalidatePath } from "next/cache";
import { insertproductSchema, updateProductSchema } from "../validations";
import z from "zod";
import { Prisma } from "../generated/prisma/client";

export async function getLatestProducts() {
  const products = await prisma.product.findMany({
    take: 4,
    orderBy: {
      createdAt: "desc",
    },
  });
  return formateDataToPlain(products);
}

export async function getOneProduct(slug: string) {
  if (!slug) return null;
  return await prisma.product.findFirst({
    where: {
      slug,
    },
  });
}

export async function getAllProducts({
  query,
  category,
  page,
  price,
  rating,
  sort,
  limit = PAGE_SIZE,
}: {
  query: string;
  category: string;
  page: number;
  price?: string;
  rating?: string;
  sort?: string;
  limit?: number;
}) {
  const queryFilter: Prisma.ProductWhereInput =
    query && query !== "all"
      ? {
          name: {
            contains: query,
            mode: "insensitive",
          } as Prisma.StringFilter,
        }
      : {};

  const categoryFilter: Prisma.ProductWhereInput =
    category && category !== "all"
      ? {
          category,
        }
      : {};

  const priceFilter: Prisma.ProductWhereInput =
    price && price !== "all"
      ? {
          price: {
            gte: Number(price.split("-")[0]),
            lte: Number(price.split("-")[1]),
          },
        }
      : {};

  const ratingFilter: Prisma.ProductWhereInput =
    rating && rating !== "all"
      ? {
          rating: {
            gte: Number(rating),
          },
        }
      : {};

  const data = await prisma.product.findMany({
    where: {
      ...queryFilter,
      ...priceFilter,
      ...categoryFilter,
      ...ratingFilter,
    },
    orderBy:
      sort === "lowest"
        ? { price: "asc" }
        : sort === "highest"
          ? { price: "desc" }
          : sort === "rating"
            ? { rating: "desc" }
            : { createdAt: "desc" },
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
      where: {
        id,
      },
    });

    if (!isExist) throw new Error("Product not found");

    await prisma.product.delete({
      where: {
        id,
      },
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

    console.log("Product created successfully");

    return {
      success: true,
      message: "Product created successfully",
    };
  } catch (error) {
    console.log((error as Error).message);

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
      where: {
        id: product.id,
      },
    });

    if (!productExist) throw new Error("Product not found");

    await prisma.product.update({
      where: {
        id: product.id,
      },
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

export async function getProductById(id: string) {
  const product = await prisma.product.findFirst({
    where: {
      id,
    },
  });

  return formateDataToPlain(product);
}

export async function getAllCategories() {
  const data = await prisma.product.groupBy({
    by: ["category"],
    _count: true,
  });

  return data;
}

export async function getFeaturedProducts() {
  const data = await prisma.product.findMany({
    where: {
      isFeatured: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 4,
  });

  return formateDataToPlain(data);
}

export async function addFakeStoreAPIProducts() {}
