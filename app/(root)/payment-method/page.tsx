import { Metadata } from "next";
import { auth } from "@/auth";
import { getUserById } from "@/lib/actions/useraction";
import CheckoutSteps from "@/components/shared/checkout-steps";
import PaymentMethodForm from "./payment-method-form";

export const metadata: Metadata = {
  title: "Payment Method",
};

export default async function PaymentMethod() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("User not Found");

  const user = await getUserById(userId);

  return (
    <>
      <CheckoutSteps current={2} />
      <PaymentMethodForm preferredPaymentMethod={user.paymentMethod} />
    </>
  );
}
