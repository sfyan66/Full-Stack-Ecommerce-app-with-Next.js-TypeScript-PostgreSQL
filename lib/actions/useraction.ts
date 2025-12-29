"use server";

import { signIn, signOut } from "@/auth";
import { signUpSchema, signInSchema } from "../validations";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { FormState } from "@/types";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { formatError, formatInputErrors } from "../utils";

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
    console.log(error.name);
    console.log(error.code);
    console.log(error.meta?.target);
    console.log(error.message);

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
