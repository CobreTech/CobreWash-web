"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, dataConnect } from "@/lib/firebase/client";
import {
  loadActiveUserProfile,
  type ActiveUserProfile,
} from "@/lib/firebase/auth-flows";

export type UsuarioActual = ActiveUserProfile;

export function useUsuarioActual() {
  const [usuario, setUsuario] = useState<UsuarioActual | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setUsuario(null);
        setLoading(false);
        return;
      }

      void loadActiveUserProfile({ auth, dataConnect })
        .then(setUsuario)
        .catch(() => setUsuario(null))
        .finally(() => setLoading(false));
    });

    return () => unsubscribe();
  }, []);

  return { usuario, loading };
}
