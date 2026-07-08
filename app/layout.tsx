import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lavandería El Cobre | Servicio Industrial y Doméstico en Calama",
  description: "Lavandería El Cobre en Calama ofrece servicios de lavandería industrial, corporativa, doméstica y particular con retiro y entrega a domicilio. ¡Cuidado premium para tus prendas!",
  keywords: ["lavanderia calama", "lavanderia industrial calama", "lavanderia el cobre", "lavado de ropa calama", "lavanderia domicilio calama"],
  authors: [{ name: "Lavandería El Cobre SpA" }],
  openGraph: {
    title: "Lavandería El Cobre | Servicio Industrial y Doméstico en Calama",
    description: "Servicios de lavandería industrial y de hogar con maquinaria de última tecnología y servicio de retiro/entrega a domicilio.",
    url: "https://lavanderiaelcobrespa.com",
    siteName: "Lavandería El Cobre",
    locale: "es_CL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${outfit.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fdfcfb]">
        {children}
      </body>
    </html>
  );
}
