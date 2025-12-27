export type Errors = {
  name?: string;
  slug?: string;
  category?: string;
  brand?: string;
  description?: string;
  stock?: string;
  images?: string;
  isFeatured?: boolean;
  banner?: string;
  price?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};
export type FormState = {
  errors?: Errors;
  success?: boolean;
  message?: string;
};

export type ProductType = {
  id: string;
  productName: string;
  slug: string;
  category: string;
  brand: string;
  description: string;
  stock: number;
  images: string[];
  isFeatured: boolean;
  banner: string;
  price: string;
  rating: string;
  createdAt: Date;
};

export type UserName = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};
