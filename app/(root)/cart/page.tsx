import CartTable from "./cart-table";
import { getCart } from "@/lib/actions/cart.actions";

export const metadata = {
  title: "Shopping Cart",
};

export default async function CartPage() {
  const cart = await getCart();

  return (
    <div>
      <CartTable cart={cart} />
    </div>
  );
}
