"use client";

import type { CartItem } from "@/types";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addItemToCart } from "@/lib/actions/cartaction";
import { Button } from "@/components/ui/button";

const AddToCart = ({ item }: { item: CartItem }) => {
  const router = useRouter();

  const handleAddToCart = async () => {
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
  };

  return (
    <div>
      <Button onClick={handleAddToCart}>
        <Plus />
        Add to cart
      </Button>
    </div>
  );
};

export default AddToCart;
