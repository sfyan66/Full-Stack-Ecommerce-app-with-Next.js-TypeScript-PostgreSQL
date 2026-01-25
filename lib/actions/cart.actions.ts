"use server";

import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import type { CartItem } from "@/types";
import { cookies } from "next/headers";
import { formateDataToPlain, formatError, round2 } from "../utils";
import { cartItemSchema, insertCartItemSchema } from "../validations";
import { revalidatePath } from "next/cache";
import { Prisma } from "../generated/prisma/client";

const sumPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0),
  );
  const shippingPrice = round2(itemsPrice > 100 ? 0 : 5);
  const taxPrice = round2(itemsPrice * 0.1);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export async function addItemToCart(data: CartItem) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("No cookies found");

    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    const cart = await getCart();

    const item = cartItemSchema.parse(data);

    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });
    if (!product) throw new Error("Product not found");

    if (!cart) {
      const newCart = insertCartItemSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...sumPrice([item]),
      });

      await prisma.cart.create({
        data: newCart,
      });

      revalidatePath(`/products/${product.slug}`);

      return {
        success: true,
        message: `${product.name} added to cart`,
      };
    } else {
      const existItem = (cart.items as CartItem[]).find(
        (e) => e.productId === item.productId,
      );

      if (existItem) {
        if (product.stock < existItem.qty + 1) {
          throw new Error("Not enough quantity");
        }

        (cart.items as CartItem[]).find(
          (e) => e.productId === item.productId,
        )!.qty = existItem.qty + 1;
      } else {
        if (product.stock < 1) throw new Error("Not enough quantity");

        cart.items.push(item);
      }

      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...sumPrice(cart.items as CartItem[]),
        },
      });

      revalidatePath(`/products/${product.slug}`);

      return {
        success: true,
        message: `${product.name} ${
          existItem ? "updated in" : "added to"
        } cart`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getCart() {
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) throw new Error("No cookies found");

  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  if (!cart) return undefined;

  return formateDataToPlain({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}

export async function removeItemFromCart(productId: string) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!product) throw new Error("Product was not found");

    const cart = await getCart();
    if (!cart) throw new Error("Cart was not found");

    const existItem = (cart.items as CartItem[]).find(
      (e) => e.productId === productId,
    );
    if (!existItem) throw new Error("Item was not found");

    if (existItem.qty === 1) {
      cart.items = (cart.items as CartItem[]).filter(
        (e) => e.productId !== productId,
      );
    } else {
      (cart.items as CartItem[]).find((e) => e.productId === productId)!.qty =
        existItem.qty - 1;
    }

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...sumPrice(cart.items as CartItem[]),
      },
    });

    revalidatePath(`/products/${product.slug}`);

    return {
      success: true,
      message: `${product.name} was removed from cart`,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
