"use server";

import { signIn, signOut } from "@/auth";
import {
  signUpSchema,
  signInSchema,
  shippingAddressSchema,
} from "../validations";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { FormState, ShippingAddress } from "@/types";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { formatError, formatInputErrors } from "../utils";
import { auth } from "@/auth";

export async function signInUser(prevState: FormState, formData: FormData) {
  try {
    const user = signInSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await signIn("credentials", {
      email: user.email,
      password: user.password,
    });

    return { success: true, message: "Signed In Successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: "Invalid Email Address or Password" };
  }
}

export async function signUpUser(prevState: FormState, formData: FormData) {
  try {
    const user = signUpSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    const signingPassword = user.password;

    user.password = hashSync(user.password, 10);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    await signIn("credentials", {
      email: user.email,
      password: signingPassword,
    });

    console.log("signed in user");
    return { success: true, message: "Signed Up Successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return {
      success: false,
      message: formatError(error),
      errors: formatInputErrors(error),
    };
  }
}

export async function signOutUser() {
  return signOut();
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });
  if (!user) throw new Error("User not found");
  return user;
}

export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error("User not Found");

    const address = shippingAddressSchema.parse(data);

    await prisma.user.update({
      where: { id: session?.user?.id },
      data: { address },
    });

    return {
      success: true,
      message: "Address updated Successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
