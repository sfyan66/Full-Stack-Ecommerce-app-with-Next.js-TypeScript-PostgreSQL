"use client";

import { Loader, Plus } from "lucide-react";
import { toast } from "sonner";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/types";
import { addItemToCart } from "@/lib/actions/cartaction";
import { usePathname, useRouter } from "next/navigation";

export default function AddButton({ item }: { item: CartItem }) {
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Button
      disabled={isPending}
      variant="outline"
      type="button"
      onClick={() =>
        startTransition(async () => {
          const res = await addItemToCart(item);

          if (!res.success) {
            toast.error(res.message);
            return;
          }

          if (pathname === "/cart") {
            return;
          } else {
            toast.success(res.message, {
              action: {
                label: "Go to cart",
                onClick: () => {
                  router.push("/cart");
                },
              },
            });
          }
        })
      }
    >
      {isPending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Plus className="w-4 h-4" />
      )}
    </Button>
  );
}
