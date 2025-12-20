import ProductList from "@/components/shared/product/product-list";
import { getProducts } from "@/lib/actions/productsaction";

export default async function Home() {
  const products = await getProducts();
  const newProducts = products.map((prd) => ({
    ...prd,
    price: prd.price.toString(),
    rating: prd.rating.toString(),
  }));
  return (
    <div>
      <ProductList data={newProducts} title="New Arrivals" />
    </div>
  );
}
