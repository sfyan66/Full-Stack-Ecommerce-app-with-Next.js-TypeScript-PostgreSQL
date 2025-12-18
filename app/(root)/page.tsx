import ProductList from "@/components/shared/product/product-list";
import { getProducts } from "@/lib/actions/productsaction";

export default async function Home() {
  const products = await getProducts();
  return (
    <div>
      <ProductList data={products} title="New Arrivals" />
    </div>
  );
}
