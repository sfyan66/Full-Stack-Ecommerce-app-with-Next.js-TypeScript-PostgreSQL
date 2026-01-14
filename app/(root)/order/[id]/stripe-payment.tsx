"use client";

import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useTheme } from "next-themes";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

const StripePayment = ({
  priceInCents,
  orderId,
  clientSecret,
}: {
  priceInCents: number;
  orderId: string;
  clientSecret: string;
}) => {
  const { theme, systemTheme } = useTheme();

  const StripeForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const [email, setEmail] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState();

    return (
      <form className="space-y-4">
        <div className="text-xl">Stripe Checkout</div>
        {errorMessage && <div className="text-destructive">{errorMessage}</div>}
        <PaymentElement />
        <Button
          className="w-full"
          size="lg"
          disabled={stripe == null || elements == null || isLoading}
        >
          {isLoading
            ? "Purchasing..."
            : `Purchase ${formatCurrency(priceInCents / 100)}`}
        </Button>
      </form>
    );
  };

  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
  );

  return (
    <Elements
      options={{
        clientSecret,
        appearance: {
          theme:
            theme === "dark"
              ? "night"
              : theme === "light"
              ? "stripe"
              : systemTheme === "light"
              ? "stripe"
              : "night",
        },
      }}
      stripe={stripePromise}
    >
      <StripeForm />
    </Elements>
  );
};

export default StripePayment;
