import type { Metadata } from "next";
import Footer from "@/components/layout/Footer";
export const metadata: Metadata = { title: "Mis pedidos | Lavandería El Cobre", robots: { index: false, follow: false } };
export default function CuentaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}<Footer /></>;
}
