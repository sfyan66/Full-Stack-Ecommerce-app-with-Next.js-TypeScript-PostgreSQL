import { Metadata } from "next";
import CreateProductForm from "./create-product-form";
import { requireAdmin } from "@/lib/auth-guard";

export const metadata: Metadata = {
  title: "Create Product",
};

export default async function CreateProductPage() {
  await requireAdmin();
  return (
    <>
      <h2 className="h2-bold">Create Product</h2>
      <div className="my-8">
        <CreateProductForm type="Create" />
      </div>
    </>
  );
}
