"use client";
import { useState } from "react";
import { auth } from "@/lib/firebase/client";

export default function DescargarMisDatos() {
  const [ocupado, setOcupado] = useState(false), [error, setError] = useState("");
  return <div className="space-y-2 rounded-2xl border border-brand-100 p-4 text-xs text-stone-600">
    <p>Descarga los datos de tu perfil en JSON. Para una copia completa, pedidos, rectificación, bloqueo o eliminación, utiliza el canal de derechos.</p>
    <button disabled={ocupado} className="min-h-11 font-bold text-brand-700 disabled:opacity-50" onClick={async () => {
      setOcupado(true); setError("");
      try {
        const user = auth.currentUser;
        if (!user) throw new Error("Inicia sesión.");
        const r = await fetch("/api/privacidad/mis-datos", { headers: { Authorization: `Bearer ${await user.getIdToken(true)}` }, cache: "no-store" });
        if (!r.ok) throw new Error((await r.json()).error || "No se pudo descargar.");
        const blob = await r.blob();
        if (auth.currentUser?.uid !== user.uid) throw new Error("La sesión cambió. Vuelve a intentarlo.");
        const url = URL.createObjectURL(blob), enlace = document.createElement("a");
        enlace.href = url; enlace.download = "mis-datos-cobrewash.json"; enlace.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } catch (e) { setError(e instanceof Error ? e.message : "No se pudo descargar."); }
      finally { setOcupado(false); }
    }}>{ocupado ? "Preparando descarga…" : "Descargar datos de mi perfil"}</button>
    {error && <p role="alert">{error}</p>}
  </div>;
}
