"use client";
import { useState } from "react";
import { auth } from "@/lib/firebase/client";
import { cambiarContrasena } from "@/lib/firebase/seguridad-cuenta";
import { mapAuthError } from "@/lib/firebase/errors";

export default function CambiarContrasena() {
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  return <form className="space-y-4" onSubmit={async e => {
    e.preventDefault(); if (guardando) return;
    setGuardando(true); setMensaje(""); setError("");
    try {
      await cambiarContrasena(auth, actual, nueva, confirmacion);
      setActual(""); setNueva(""); setConfirmacion(""); setMensaje("Tu contraseña se actualizó correctamente.");
    } catch (cause) {
      setError(cause && typeof cause === "object" && "code" in cause ? mapAuthError(cause) : cause instanceof Error ? cause.message : "No se pudo actualizar tu contraseña.");
    } finally { setGuardando(false); }
  }}>
    <h2 className="font-bold">Cambiar contraseña</h2>
    {[["Contraseña actual", actual, setActual, "current-password"], ["Nueva contraseña", nueva, setNueva, "new-password"], ["Confirmar nueva contraseña", confirmacion, setConfirmacion, "new-password"]].map(([label, value, cambiar, autocomplete]) =>
      <label key={label as string} className="block text-sm font-semibold">{label as string}<input required type="password" disabled={guardando} autoComplete={autocomplete as string} value={value as string} onChange={e => (cambiar as (s: string) => void)(e.target.value)} className="mt-1 w-full rounded-xl border border-stone-300 bg-transparent p-3" /></label>)}
    <button disabled={guardando} className="rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-50">{guardando ? "Actualizando…" : "Actualizar contraseña"}</button>
    {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
    {mensaje && <p role="status" className="text-sm text-green-700">{mensaje}</p>}
  </form>;
}
