"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { cabeceraEvidencia, endpointEvidencia } from "@/lib/vehiculos/evidencias";

export default function FotoEvidencia({ ruta, descripcion }: { ruta: string; descripcion: string }) {
  const [imagen, setImagen] = useState("");
  const [error, setError] = useState(false);
  useEffect(() => {
    let vigente = true;
    let objectUrl = "";
    const controller = new AbortController();
    void (async () => {
      const endpoint = endpointEvidencia(ruta);
      if (!endpoint) throw new Error("Evidencia anterior sin archivo confirmado.");
      const response = await fetch(endpoint, { headers: await cabeceraEvidencia(), signal: controller.signal });
      if (!response.ok) throw new Error("No disponible");
      objectUrl = URL.createObjectURL(await response.blob());
      if (vigente) setImagen(objectUrl);
    })().catch(() => { if (vigente) setError(true); });
    return () => { vigente = false; controller.abort(); if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [ruta]);
  if (error) return <p className="p-3 text-xs text-amber-700">Archivo de evidencia no disponible. No se ha confirmado su recuperación.</p>;
  return imagen ? <Image src={imagen} alt={descripcion} width={320} height={220} unoptimized className="h-32 w-full object-cover" /> : <p className="p-3 text-xs">Cargando evidencia…</p>;
}
