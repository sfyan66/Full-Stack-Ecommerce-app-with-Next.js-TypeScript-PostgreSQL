import { cn } from "@/lib/utils";

const ProductPrice = ({
  value,
  className,
}: {
  value: number;
  className?: string;
}) => {
  const valueStr = value.toFixed(2);
  const [int, float] = valueStr.split(".");
  return (
    <p className={cn("text-2xl", className)}>
      <span className="text-sm align-super">$</span>
      {int}
      <span className="text-sm align-super">.{float}</span>
    </p>
  );
};

export default ProductPrice;
