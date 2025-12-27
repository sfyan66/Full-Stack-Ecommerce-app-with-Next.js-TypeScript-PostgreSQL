import type { Errors, UserName } from "@/types";
import { prisma } from "@/db/prisma";

export const signUpValidation = async (
  errors: Errors,
  { name, email, password, confirmPassword }: UserName
) => {
  if (!name) {
    errors.name = "Please enter your user name";
  } else if (name.length <= 3) {
    errors.name = "User name must be at least 4 chars";
  }

  const emailRe = new RegExp(
    "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9._]+\\.[a-zA-Z]{2,}$",
    "i"
  );

  if (!email) {
    errors.email = "Please enter your email adress";
  } else if (!emailRe.test(email)) {
    errors.email = "Please enter a valid email adress";
  }

  if (password.length <= 7) {
    errors.password = "Password must be at least 8 chars";
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};

// const priceSchema = z
//   .string()
//   .refine(
//     (val) => /^\d+(\.\d{2})?$/.test(formatePrice(Number(val))),
//     "The price must be a valid number with two float numbers"
//   );

// export const productSchema = ({
//   name,
//   slug,
//   category,
//   brand,
//   description,
//   stock,
//   images,
//   isFeatured,
//   banner,
//   price,
// }: Errors) => {

//   const errors: Errors = {}

//   if (!name) {
//     "Please enter a name for the product"
//   } else if (name.length <= 3) {
//     "Name must be longer than 3 chars"
//   }

//   // name: z.string().min(3, "The product name must be at least 3 characters"),
//   // slug: z.string().min(3, "The slug must be at least 3 characters"),
//   // category: z.string().min(3, "The category must be at least 3 characters"),
//   // brand: z.string().min(3, "The brand name must be at least 3 characters"),
//   // description: z
//   //   .string()
//   //   .min(3, "The description must be at least 3 characters"),
//   // stock: z.coerce.number(),
//   // images: z.array(z.string()).min(1, "There must be at least one image"),
//   // isFeatured: z.boolean(),
//   // banner: z.string().nullable(),
//   // price: priceSchema,
// };

// export const signInSchema = z.object({
//   email: z.string().email("Invalid Email Address"),
//   password: z.string().min(8, "Password must be at least 8 chars"),
// });

// export const signUpSchema = z
//   .object({
//     name: z.string().min(3, "The Name Must Be At Least 3 Chars"),
//     email: z.string().email("Invalid Email Address"),
//     password: z.string().min(8, "Password must be at least 8 chars"),
//     confirmPassword: z.string(),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Confirm Password does not match ",
//     path: ["confirmPassword"],
//   });
