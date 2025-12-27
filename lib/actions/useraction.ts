"use server";

import { signIn, signOut } from "@/auth";
import { signUpValidation } from "../validations";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { Errors, FormState, UserName } from "@/types";

export async function signInUser(prevState: FormState, formData: FormData) {
  const errors: Errors = {};

  const user = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  if (!user.email) {
    errors.email = "Please enter your email";
  }
  if (!user.password) {
    errors.password = "Please enter your password";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, message: "Invalid Email Or Password", errors };
  }

  await signIn("credentials", {
    email: user.email,
    password: user.password,
  });

  return { success: true, message: "Signed In Successfully" };
}

export async function signUpUser(prevState: FormState, formData: FormData) {
  const user: UserName = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const errors: Errors = {};

  const emaill = await prisma.user.findUnique({
    where: { email: user.email },
  });

  if (emaill) {
    errors.email = "This email already exists";
    return { success: false, message: "An exiting email", errors };
  }

  signUpValidation(errors, user);

  if (Object.keys(errors).length > 0) {
    return { success: false, message: "Failed to sign user up", errors };
  }

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

  return { success: true, message: "Signed Up Successfully" };
}

export async function signOutUser() {
  return signOut();
}
