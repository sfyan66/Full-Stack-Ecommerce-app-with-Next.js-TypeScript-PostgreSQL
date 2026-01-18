import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import ProductPrice from "./product-price";
import { Product } from "@/types";
import Rating from "./rating";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div>
      <Card key={product.slug} className="h-full">
        <CardHeader className="h-65 flex items-center">
          <Link href={`/products/${product.slug}`}>
            <Image
              src={product.images[0]}
              alt={product.images[1] ? product.images[1] : product.name}
              width={300}
              height={300}
              className="max-h-65"
            />
          </Link>
        </CardHeader>
        <CardContent className="grid p-4 gap-4">
          <div className="text-xs">{product.brand}</div>
          <Link href={`/products/${product.slug}`}>
            <h2 className="text-sm font-medium">{product.name}</h2>
          </Link>
          <div className="flex-between gap-4">
            <Rating value={Number(product.rating)} />
            {product.stock > 0 ? (
              <ProductPrice value={Number(product.price)} />
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
