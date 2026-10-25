import type { Metadata } from "next";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Seguimiento de pedido · Lavandería El Cobre",
  robots: { index: false, follow: false },
};

export default function SeguimientoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}<Footer /></>;
}
