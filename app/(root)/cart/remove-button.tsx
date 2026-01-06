"use client";

import { Loader, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { toast } from "sonner";
import { removeItemFromCart } from "@/lib/actions/cartaction";
import { CartItem } from "@/types";

export default function RemoveButton({ item }: { item: CartItem }) {
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      disabled={isPending}
      variant="outline"
      type="button"
      onClick={() =>
        startTransition(async () => {
          const res = await removeItemFromCart(item.productId);

          if (!res.success) {
            toast.error(res.message);
            return;
          }

          toast.success(res.message);
        })
      }
    >
      {isPending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Minus className="w-4 h-4" />
      )}
    </Button>
  );
}
