import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import ProductPrice from "./product-price";
import { ProductType } from "@/types";

const ProductCard = ({ product }: { product: ProductType }) => {
  return (
    <div>
      <Card key={product.slug} className="h-full">
        <CardHeader>
          <Link href={`/products/${product.slug}`}>
            <Image
              src={product.images[0]}
              alt={product.images[1]}
              width={300}
              height={300}
            />
          </Link>
        </CardHeader>
        <CardContent className="grid p-4 gap-4">
          <div className="text-xs">{product.brand}</div>
          <Link href={`/products/${product.slug}`}>
            <h2 className="text-sm font-medium">{product.name}</h2>
          </Link>
          <div className="flex-between gap-4">
            <div>{product.rating}</div>
            {product.stock > 0 ? (
              <ProductPrice value={product.price} />
            ) : (
              <div className="text-destructive">Out Of Stock</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductCard;
