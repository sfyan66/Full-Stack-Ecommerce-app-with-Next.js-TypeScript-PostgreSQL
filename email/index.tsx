import { SENDER_EMAIL, APP_NAME } from "@/lib/constants";
import { Order } from "@/types";
import PurchaseReceiptEmail from "./purchase-receipt";
import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend("API_KEY" as string);

export async function sendPurchaseReceipt({ order }: { order: Order }) {
  await resend.emails.send({
    from: `${APP_NAME} <${SENDER_EMAIL}>`,
    to: order.user.email,
    subject: `Order Confirmation ${order.id}`,
    react: <PurchaseReceiptEmail order={order} />,
  });
}
