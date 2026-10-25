import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ShieldCheck, type LucideIcon } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { ReactNode } from "react";

const enlaces = [
  { href: "/privacidad", label: "Privacidad" },
  { href: "/privacidad/derechos", label: "Mis datos personales" },
  { href: "/terminos", label: "Información del portal" },
];

export default function PaginaLegal({ titulo, descripcion, actual, detalle, children }: {
  titulo: string; descripcion: string; actual: string; detalle?: string; children: ReactNode;
}) {
  return <>
    <Navbar paginaInterior />
    <main className="relative isolate flex-1 overflow-hidden pb-16 pt-32 text-stone-900 sm:pb-24 sm:pt-40">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] bg-gradient-to-b from-brand-50/80 via-copper-50/40 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-36 -z-10 h-80 w-80 rounded-full bg-copper-100/60 blur-3xl" />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-stone-500 transition-colors hover:text-brand-700"><ArrowLeft className="h-4 w-4" />Volver al inicio</Link>
        <header className="mb-8 max-w-3xl space-y-5 sm:mb-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200/70 bg-white/70 px-3.5 py-2 text-[11px] font-bold uppercase tracking-widest text-brand-700"><ShieldCheck className="h-4 w-4" />Tu información, con claridad</span>
          <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">{titulo}</h1>
          <div className="h-1 w-20 rounded-full bg-brand-500" />
          <p className="text-base leading-relaxed text-stone-600 sm:text-lg">{descripcion}</p>
          {detalle && <p className="text-xs font-semibold text-stone-500">{detalle}</p>}
        </header>
        <nav aria-label="Privacidad e información legal" className="mb-8 flex flex-wrap gap-2 rounded-2xl border border-white/80 bg-white/60 p-2 shadow-premium backdrop-blur-lg">
          {enlaces.map(e => <Link key={e.href} href={e.href} aria-current={actual === e.href ? "page" : undefined} className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${actual === e.href ? "bg-gradient-brand text-white shadow-premium" : "text-stone-600 hover:bg-brand-50 hover:text-brand-700"}`}>{e.label}{actual !== e.href && <ArrowUpRight className="h-3.5 w-3.5" />}</Link>)}
        </nav>
        <div className="space-y-5 sm:space-y-6">{children}</div>
      </div>
    </main>
    <Footer />
  </>;
}

export function SeccionLegal({ titulo, icon: Icon = ShieldCheck, children }: { titulo: string; icon?: LucideIcon; children: ReactNode }) {
  return <section className="glass-card rounded-3xl bg-white/65 p-5 shadow-premium backdrop-blur-lg sm:p-8">
    <h2 className="mb-5 flex items-center gap-3 font-display text-lg font-extrabold text-stone-900 sm:text-xl"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><Icon className="h-5 w-5" /></span>{titulo}</h2>
    <div className="space-y-4 text-sm leading-7 text-stone-600 [&_a]:font-semibold [&_a]:text-brand-700 [&_a]:underline [&_a]:decoration-brand-200 [&_a]:underline-offset-4">{children}</div>
  </section>;
}
