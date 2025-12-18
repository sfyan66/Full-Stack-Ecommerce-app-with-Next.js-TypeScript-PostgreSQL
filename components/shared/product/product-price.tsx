import { cn } from "@/lib/utils";

const ProductPrice = ({
  value,
  className,
}: {
  value: string;
  className?: string;
}) => {
  const [int, float] = value.split(".");
  return (
    <p className={cn("text-2xl", className)}>
      <span className="text-sm align-super">$</span>
      {int}
      <span className="text-sm align-super">.{float}</span>
    </p>
  );
};

export default ProductPrice;
