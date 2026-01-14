import ProductCarousel from "@/components/shared/product/product-carousel";
import ProductList from "@/components/shared/product/product-list";
import {
  getLatestProducts,
  getFeaturedProducts,
} from "@/lib/actions/product.actions";
import ViewAllProductsButton from "@/components/view-all-products-button";

export default async function Home() {
  const LatestProducts = await getLatestProducts();
  if (!LatestProducts) {
    return <div>Products not found</div>;
  }
  const featuredProducts = await getFeaturedProducts();

  const newProducts = LatestProducts.map((prd) => ({
    ...prd,
    price: prd.price.toString(),
    rating: prd.rating.toString(),
  }));
  return (
    <div>
      {featuredProducts.length > 0 && (
        <ProductCarousel data={featuredProducts} />
      )}
      <ProductList data={newProducts} title="New Arrivals" />
      <ViewAllProductsButton />
    </div>
  );
}
