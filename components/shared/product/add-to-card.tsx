"use client";

import type { CartItem, Cart } from "@/types";
import { Plus, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addItemToCart } from "@/lib/actions/cart.actions";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import AddButton from "@/app/(root)/cart/add-button";
import RemoveButton from "@/app/(root)/cart/remove-button";

const AddToCart = ({ cart, item }: { cart?: Cart; item: CartItem }) => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message, {
        action: {
          label: "Go to cart",
          onClick: () => {
            router.push("/cart");
          },
        },
      });
    });
  };

  const existItem =
    cart && cart.items.find((e) => e.productId === item.productId);

  return existItem ? (
    <div>
      {/* <Button type="button" variant="outline" onClick={handleRemoveFromCart}>
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Minus className="w-4 h-4" />
        )}
      </Button> */}
      <RemoveButton item={existItem} />
      <span className="px-2">{existItem.qty}</span>
      {/* <Button type="button" variant="outline" onClick={handleAddToCart}>
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
      </Button> */}
      <AddButton item={existItem} />
    </div>
  ) : (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      {isPending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Plus className="w-4 h-4" />
      )}{" "}
      Add To Cart
    </Button>
  );
};

export default AddToCart;
