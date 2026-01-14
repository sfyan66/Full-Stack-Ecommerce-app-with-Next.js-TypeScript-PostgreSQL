import { auth } from "@/auth";
import { getOrderById } from "@/lib/actions/order.actions";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import OrderDetailsTable from "./order-details-table";
import { ShippingAddress } from "@/types";
import Stripe from "stripe";

export const metadata: Metadata = {
  title: "Order Details",
};

export default async function OrderDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const order = await getOrderById(id);
  if (!order) notFound();

  const session = await auth();

  if (order.userId !== session?.user?.id && session?.user?.role !== "admin") {
    redirect("/unauthorized");
  }

  let client_secret = null;

  if (order.paymentMethod === "Stripe" && !order.isPaid) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.totalPrice) * 100),
      currency: "USD",
      metadata: { orderId: order.id },
    });

    client_secret = paymentIntent.client_secret;
  }

  return (
    <OrderDetailsTable
      order={{
        ...order,
        shippingAddress: order.shippingAddress as ShippingAddress,
      }}
      stripeClientSecret={client_secret}
      isAdmin={session?.user?.role === "admin" || false}
    />
  );
}
