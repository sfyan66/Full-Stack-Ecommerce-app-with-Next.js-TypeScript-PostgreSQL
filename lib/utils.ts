import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodIssue } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formateData<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export function formatePrice(value: number): string {
  const [int, float] = value.toString().split(".");
  return float ? `${int}.${float.padEnd(2, "0")}` : `${int}.00`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatInputErrors(error: any) {
  if (error.name === "ZodError") {
    const fieldErrors: Record<string, string> = {};

    error.issues.forEach((e: ZodIssue) => {
      const field = e.path[0] as string;
      fieldErrors[field] = e.message;
    });
    return fieldErrors;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any) {
  if (
    error.name === "PrismaClientKnownRequestError" &&
    error.code === "P2002"
  ) {
    const match = error.message.match(/\(`([^`]+)`\)/);
    // const field = error.meta?.target ? error.meta?.target[0] : "Field";
    const field = match[1];
    return `${
      match[1].charAt(0).toUpperCase() + field.slice(1)
    } already exists`;
  } else if (error.name !== "ZodError") {
    return typeof error.message === "string"
      ? error.message
      : JSON.stringify(error.message);
  }
}

export function round2(value: number | string) {
  if (typeof value === "string") {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else if (typeof value === "number") {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error("Value is not a number or string");
  }
}
