"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function IntranetError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error en módulo de intranet:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h2 className="font-display text-xl font-extrabold text-stone-900 dark:text-white">
        Ocurrió un error al cargar la información
      </h2>
      <p className="mt-2 max-w-md text-sm text-stone-500 dark:text-stone-400">
        {error.message || "No se pudo completar la operación. Por favor intenta recargar la vista."}
      </p>
      <button
        onClick={() => reset()}
        className="mt-6 flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-2.5 text-sm font-bold text-white shadow-premium transition-all hover:shadow-lg"
      >
        <RefreshCw className="h-4 w-4" />
        Reintentar
      </button>
    </div>
  );
}
