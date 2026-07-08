"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, User, Building2, Phone, Mail, MapPin, Loader2, Package } from "lucide-react";
import { useRoleGuard } from "@/components/intranet/useRoleGuard";
import { COMANDAS, prendasTotales, valorTotal, type Comanda } from "@/lib/mock/comandas";

const clp = (n: number) => `$${n.toLocaleString("es-CL")}`;

interface ClienteAgg {
  nombre: string;
  tipoCliente: Comanda["tipoCliente"];
  telefono: string;
  email: string;
  direccion?: string;
  comandas: number;
  prendas: number;
  facturado: number;
  ultima: string;
}

export default function ClientesPage() {
  const permitido = useRoleGuard(["admin", "recepcionista"]);
  const [search, setSearch] = useState("");

  const clientes = useMemo<ClienteAgg[]>(() => {
    const map = new Map<string, ClienteAgg>();
    for (const c of COMANDAS) {
      const cur = map.get(c.cliente);
      if (cur) {
        cur.comandas += 1;
        cur.prendas += prendasTotales(c);
        cur.facturado += c.estado === "Anulado" ? 0 : valorTotal(c);
      } else {
        map.set(c.cliente, {
          nombre: c.cliente,
          tipoCliente: c.tipoCliente,
          telefono: c.telefono,
          email: c.email,
          direccion: c.direccion,
          comandas: 1,
          prendas: prendasTotales(c),
          facturado: c.estado === "Anulado" ? 0 : valorTotal(c),
          ultima: c.fechaRecepcion,
        });
      }
    }
    return [...map.values()].sort((a, b) => b.facturado - a.facturado);
  }, []);

  const filtered = clientes.filter((c) => {
    const t = search.toLowerCase();
    return c.nombre.toLowerCase().includes(t) || c.email.toLowerCase().includes(t) || c.telefono.includes(t);
  });

  if (!permitido) {
    return (
      <div className="flex h-full items-center justify-center py-24">
        <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-stone-900 dark:text-stone-100 p-4 sm:p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-extrabold text-stone-900 dark:text-white">Clientes</h1>
        <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">{clientes.length} clientes registrados</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative max-w-md">
        <input
          type="text"
          placeholder="Buscar por nombre, correo o teléfono..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 glass-panel rounded-xl text-sm text-stone-700 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-600 focus:outline-none focus:border-brand-500/50 transition-colors shadow-sm dark:shadow-none"
        />
        <Search className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.16 }} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((c, i) => (
          <motion.div
            key={c.nombre}
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -3 }}
            className="glass-panel rounded-2xl p-5 hover:border-brand-500/30 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-brand flex items-center justify-center text-white shrink-0">
                {c.tipoCliente === "Hotel/Empresa" ? <Building2 className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              <div className="min-w-0">
                <p className="text-stone-900 dark:text-white font-bold text-sm truncate">{c.nombre}</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400">{c.tipoCliente}</span>
              </div>
            </div>
            <div className="space-y-1.5 mb-3 text-xs text-stone-500 dark:text-stone-400">
              <span className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 shrink-0" />{c.telefono}</span>
              <span className="flex items-center gap-2 truncate"><Mail className="w-3.5 h-3.5 shrink-0" />{c.email}</span>
              {c.direccion && <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 shrink-0" />{c.direccion}</span>}
            </div>
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-stone-100 dark:border-white/5 text-center">
              <div>
                <p className="text-sm font-extrabold text-stone-900 dark:text-white">{c.comandas}</p>
                <p className="text-[10px] text-stone-400 dark:text-stone-600">comandas</p>
              </div>
              <div>
                <p className="text-sm font-extrabold text-stone-900 dark:text-white flex items-center justify-center gap-1"><Package className="w-3 h-3 text-stone-400" />{c.prendas}</p>
                <p className="text-[10px] text-stone-400 dark:text-stone-600">prendas</p>
              </div>
              <div>
                <p className="text-sm font-extrabold text-brand-600 dark:text-brand-400">{clp(c.facturado)}</p>
                <p className="text-[10px] text-stone-400 dark:text-stone-600">facturado</p>
              </div>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 text-stone-400 dark:text-stone-600 text-sm">No se encontraron clientes.</div>
        )}
      </motion.div>
    </div>
  );
}
