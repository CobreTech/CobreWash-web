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
    let version = 0;
    let montado = true;
    const actualizar = (user: typeof auth.currentUser) => {
      const solicitud = ++version;
      setUsuario(null);
      if (!user) {
        setUsuario(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      void loadActiveUserProfile({ auth, dataConnect })
        .then(perfil => { if (montado && solicitud === version && auth.currentUser?.uid === user.uid) setUsuario(perfil); })
        .catch(() => { if (montado && solicitud === version) setUsuario(null); })
        .finally(() => { if (montado && solicitud === version) setLoading(false); });
    };
    const unsubscribe = onAuthStateChanged(auth, actualizar);
    const refrescar = () => actualizar(auth.currentUser);
    window.addEventListener("cobre:perfil-actualizado", refrescar);

    return () => { montado = false; version++; unsubscribe(); window.removeEventListener("cobre:perfil-actualizado", refrescar); };
  }, []);

  return { usuario, loading };
}
