import type { Metadata } from "next";
import { OrderFlow } from "@/components/order/OrderFlow";

export const metadata: Metadata = { title: "Pre-order" };

export default function OrderPage() {
  return <OrderFlow />;
}
