"use client";

import { Search, Bell, Mail, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useUsuarioActualContext } from "@/components/intranet/AuthGuard";
import { useTheme } from "@/components/providers/ThemeProvider";
import { type Rol } from "@/lib/roles";

const rolLabel: Record<Rol, string> = {
  admin: "Administrador",
  recepcionista: "Recepcionista",
  operario: "Operario",
  cliente: "Cliente",
};

/**
 * Barra superior compartida de la intranet (estilo dashboard moderno):
 * buscador global, accesos rápidos y la identidad del usuario. Sólo se
 * muestra en pantallas grandes; en móvil la navegación la resuelve el
 * encabezado con menú hamburguesa del Sidebar.
 */
export default function IntranetTopbar() {
  const usuario = useUsuarioActualContext();
  const { theme, setTheme } = useTheme();

  const rol = (usuario?.rol.nombre as Rol) ?? "admin";
  const nombreCompleto = usuario ? `${usuario.nombre} ${usuario.apellido ?? ""}`.trim() : "Usuario";
  const inicial = usuario?.nombre?.charAt(0).toUpperCase() ?? "U";

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <header className="hidden lg:flex items-center gap-4 px-6 py-4">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <input
          type="text"
          placeholder="Buscar comandas, clientes…"
          className="w-full pl-4 pr-11 py-2.5 rounded-2xl bg-white/70 dark:bg-white/5 border border-stone-200/70 dark:border-white/5 text-sm text-stone-700 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-600 focus:outline-none focus:border-brand-500/40 backdrop-blur-sm transition-colors"
        />
        <Search className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      <div className="flex-1" />

      {/* Quick actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          title="Cambiar tema"
          className="grid place-items-center w-10 h-10 rounded-2xl bg-white/70 dark:bg-white/5 border border-stone-200/70 dark:border-white/5 text-stone-500 dark:text-stone-400 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-300 dark:hover:border-brand-500/20 transition-colors cursor-pointer"
        >
          <Sun className="w-[18px] h-[18px] hidden dark:block" />
          <Moon className="w-[18px] h-[18px] dark:hidden" />
        </button>
        <button className="relative grid place-items-center w-10 h-10 rounded-2xl bg-white/70 dark:bg-white/5 border border-stone-200/70 dark:border-white/5 text-stone-500 dark:text-stone-400 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-300 dark:hover:border-brand-500/20 transition-colors cursor-pointer">
          <Mail className="w-[18px] h-[18px]" />
        </button>
        <button className="relative grid place-items-center w-10 h-10 rounded-2xl bg-white/70 dark:bg-white/5 border border-stone-200/70 dark:border-white/5 text-stone-500 dark:text-stone-400 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-300 dark:hover:border-brand-500/20 transition-colors cursor-pointer">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-brand-500 rounded-full ring-2 ring-white dark:ring-stone-950" />
        </button>
      </div>

      {/* User chip */}
      <motion.div
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-2xl bg-white/70 dark:bg-white/5 border border-stone-200/70 dark:border-white/5"
      >
        <div className="text-right leading-tight">
          <p className="text-xs font-bold text-stone-800 dark:text-white truncate max-w-[10rem]">
            {nombreCompleto}
          </p>
          <p className="text-[10px] text-stone-400 dark:text-stone-500 truncate max-w-[10rem]">
            {rolLabel[rol]}
          </p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-gradient-brand grid place-items-center text-white text-sm font-bold shrink-0">
          {inicial}
        </div>
      </motion.div>
    </header>
  );
}
