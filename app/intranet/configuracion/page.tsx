"use client";

import { useState } from "react";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/client";
import { useTheme, type Theme } from "@/components/providers/ThemeProvider";
import { useRoleGuard } from "@/components/intranet/useRoleGuard";
import { useUsuarioActualContext } from "@/components/intranet/AuthGuard";
import LimitesEtapasConfig from "@/components/intranet/LimitesEtapasConfig";
import CambiarContrasena from "@/components/intranet/CambiarContrasena";

type Tab = "apariencia" | "perfil" | "seguridad" | "limites";
export default function ConfiguracionPage() {
  const permitido = useRoleGuard(["admin", "recepcionista", "operario"]);
  const usuario = useUsuarioActualContext();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("apariencia");
  const [error, setError] = useState("");
  const tabs: { id: Tab; label: string }[] = [
    { id: "apariencia", label: "Apariencia" }, { id: "perfil", label: "Mi perfil" }, { id: "seguridad", label: "Seguridad" },
    ...(usuario?.rol.nombre === "admin" ? [{ id: "limites" as const, label: "Límites de etapas" }] : []),
  ];
  if (!permitido || !usuario) return <p className="p-6">Cargando configuración…</p>;
  return <main className="space-y-6 p-4 text-stone-900 sm:p-6 dark:text-stone-100">
    <h1 className="font-display text-2xl font-extrabold">Configuración</h1>
    <nav aria-label="Secciones de configuración" className="flex flex-wrap gap-2">{tabs.map(t => <button key={t.id} aria-pressed={tab === t.id} onClick={() => setTab(t.id)} className={`rounded-xl px-4 py-2 text-sm font-bold ${tab === t.id ? "bg-brand-600 text-white" : "bg-stone-100 dark:bg-white/10"}`}>{t.label}</button>)}</nav>
    <section className="glass-panel max-w-3xl space-y-5 rounded-2xl p-6">
      {tab === "apariencia" && <><h2 className="font-bold">Apariencia</h2><p className="text-sm text-stone-500">Se guarda automáticamente en este navegador.</p><div className="flex flex-wrap gap-3">{([["light", "Claro"], ["dark", "Oscuro"], ["system", "Sistema"]] as [Theme, string][]).map(([id, label]) => <button key={id} onClick={() => setTheme(id)} aria-pressed={theme === id} className={`rounded-xl border px-5 py-3 ${theme === id ? "border-brand-500 text-brand-600" : "border-stone-300"}`}>{label}</button>)}</div></>}
      {tab === "perfil" && <><h2 className="font-bold">Mi perfil</h2><dl className="space-y-3 text-sm">{[["Nombre", [usuario.nombre, usuario.apellido].filter(Boolean).join(" ")], ["Correo", usuario.email], ["RUT", usuario.rut], ["Teléfono", usuario.telefono], ["Rol", usuario.rol.nombre]].map(([label, value]) => <div key={label} className="border-b border-stone-200 pb-2"><dt className="text-stone-500">{label}</dt><dd className="break-words font-semibold">{value || "Sin registrar"}</dd></div>)}</dl><p className="text-sm text-stone-500">Para corregir los datos de tu perfil, solicita el cambio a administración en la sección Usuarios.</p></>}
      {tab === "seguridad" && <><CambiarContrasena /><div className="space-y-3 border-t border-stone-200 pt-5"><h2 className="font-bold">Sesión de este navegador</h2><p className="text-sm text-stone-500">Sesión iniciada con {usuario.email}.</p><button onClick={async () => { try { await signOut(auth); router.replace("/?login=1"); } catch { setError("No se pudo cerrar la sesión. Intenta nuevamente."); } }} className="rounded-xl border border-red-300 px-4 py-2 text-sm font-bold text-red-600">Cerrar esta sesión</button>{error && <p role="alert">{error}</p>}</div></>}
      {tab === "limites" && usuario.rol.nombre === "admin" && <LimitesEtapasConfig />}
    </section>
  </main>;
}
