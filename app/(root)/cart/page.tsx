import CartTable from "./cart-table";
import { getCart } from "@/lib/actions/cart.actions";
import Link from "next/link";

export const metadata = {
  title: "Shopping Cart",
};

export default async function CartPage() {
  const cart = await getCart();

  if (!cart) {
    return (
      <>
        <h1 className="py-4 h2-bold">Shopping Cart</h1>
        <div>
          Cart is empty. <Link href="/">Go Shopping</Link>
        </div>
      </>
    );
  }

  return (
    <div>
      <CartTable cart={cart} />
    </div>
  );
}
