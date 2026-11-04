import type { Metadata } from "next";
import { Dashboard } from "@/components/dashboard/Dashboard";

export const metadata: Metadata = { title: "Babe HQ (demo dashboard)", robots: { index: false } };

export default function DashboardPage() {
  return <Dashboard />;
}
