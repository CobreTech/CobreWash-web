"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { QueryFetchPolicy } from "firebase/data-connect";
import { auth, dataConnect } from "@/lib/firebase/client";
import { getMiPerfil, type GetMiPerfilData } from "@/src/dataconnect-generated";

export type UsuarioActual = GetMiPerfilData["usuario"];

export function useUsuarioActual() {
  const [usuario, setUsuario] = useState<UsuarioActual | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUsuario(null);
        setLoading(false);
        return;
      }

      const { data } = await getMiPerfil(dataConnect, { fetchPolicy: QueryFetchPolicy.SERVER_ONLY });
      setUsuario(data.usuario ?? null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { usuario, loading };
}
