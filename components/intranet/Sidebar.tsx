"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useUsuarioActualContext } from "@/components/intranet/AuthGuard";
import { NAV_POR_ROL, type NavItem, type Rol } from "@/lib/roles";

const rolLabel: Record<Rol, string> = {
  admin: "Administrador",
  recepcionista: "Recepcionista",
  operario: "Operario",
  cliente: "Cliente",
};

export default function IntranetSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const usuario = useUsuarioActualContext();

  const rol = (usuario?.rol.nombre as Rol) ?? "admin";
  const navItems: NavItem[] = NAV_POR_ROL[rol as Exclude<Rol, "cliente">] ?? NAV_POR_ROL.admin;

  const nombreCompleto = usuario ? `${usuario.nombre} ${usuario.apellido ?? ""}`.trim() : "Usuario";
  const inicial = usuario?.nombre?.charAt(0).toUpperCase() ?? "U";

  // Previsualización de la última notificación (mock — aún sin backend).
  const ultimaNotif = {
    total: 3,
    titulo: "Nuevo pedido recibido",
    detalle: "Comanda #COBRE-2848",
    tiempo: "hace 3 min",
  };

  const isActive = (item: (typeof navItems)[0]) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  const renderSidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 p-5 pb-5 border-b border-stone-200 dark:border-white/5">
        <Image
          src="/logo.webp"
          alt="Logo"
          width={36}
          height={36}
          className="h-9 w-auto object-contain shrink-0"
        />
        <AnimatePresence>
          {(!collapsed || isMobile) && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <p className="text-stone-900 dark:text-white font-display font-extrabold text-sm tracking-tight leading-none">
                Lavandería
              </p>
              <p className="text-brand-500 dark:text-brand-400 font-display font-extrabold text-sm tracking-tight leading-none mt-0.5">
                El Cobre
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        {isMobile && (
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto overflow-x-hidden">
        <AnimatePresence>
          {(!collapsed || isMobile) && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[10px] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-600 px-3 pb-2 pt-2"
            >
              Menú Principal
            </motion.p>
          )}
        </AnimatePresence>

        {navItems.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => isMobile && setMobileOpen(false)}
              title={collapsed && !isMobile ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative overflow-hidden ${
                active
                  ? "bg-brand-500/12 text-brand-600 dark:text-brand-400"
                  : "text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-white/5 hover:text-stone-900 dark:hover:text-stone-200"
              }`}
            >
              {active && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-brand-500/10 rounded-xl border border-brand-500/20"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
                />
              )}
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-brand-500 rounded-r-full" />
              )}

              <Icon className="w-[18px] h-[18px] shrink-0 relative z-10" />

              <AnimatePresence>
                {(!collapsed || isMobile) && (
                  <motion.span
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -5 }}
                    transition={{ duration: 0.15 }}
                    className="text-sm font-semibold flex-1 relative z-10 whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {(!collapsed || isMobile) && item.badge && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                  className="relative z-10 bg-brand-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center"
                >
                  {item.badge}
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Notificaciones — tarjeta con previsualización de la última */}
      <AnimatePresence>
        {(!collapsed || isMobile) && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mx-3 mb-1 block text-left relative overflow-hidden rounded-2xl bg-white/60 dark:bg-white/5 border border-stone-200/70 dark:border-white/5 backdrop-blur-sm p-3.5 hover:border-brand-300 dark:hover:border-brand-500/25 transition-colors cursor-pointer"
            style={{ width: "calc(100% - 1.5rem)" }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="relative w-7 h-7 rounded-lg bg-brand-500/12 grid place-items-center text-brand-600 dark:text-brand-400">
                  <Bell className="w-3.5 h-3.5" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-brand-500 rounded-full ring-2 ring-white dark:ring-stone-950" />
                </div>
                <span className="text-xs font-bold text-stone-800 dark:text-white">Notificaciones</span>
              </div>
              <span className="bg-brand-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {ultimaNotif.total}
              </span>
            </div>
            <p className="text-[11px] font-semibold text-stone-700 dark:text-stone-200 truncate">
              {ultimaNotif.titulo}
            </p>
            <p className="text-[10px] text-stone-400 dark:text-stone-500 truncate mt-0.5">
              {ultimaNotif.detalle} · {ultimaNotif.tiempo}
            </p>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Bottom Section */}
      <div className="p-3 border-t border-stone-200 dark:border-white/5 space-y-1">
        {/* Acceso rápido a notificaciones cuando la barra está colapsada */}
        {collapsed && !isMobile && (
          <button
            title="Notificaciones"
            className="relative flex items-center justify-center w-full px-3 py-2.5 rounded-xl text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-white/5 hover:text-stone-900 dark:hover:text-stone-200 transition-all duration-200"
          >
            <Bell className="w-[18px] h-[18px] shrink-0" />
            <span className="absolute top-1.5 right-3.5 w-2 h-2 bg-brand-500 rounded-full" />
          </button>
        )}

        {/* La identidad del usuario vive en la barra superior en escritorio; aquí
            sólo se muestra dentro del cajón móvil (donde la topbar está oculta). */}
        {isMobile && (
          <div className="flex items-center gap-2.5 px-3 py-2.5 bg-stone-100 dark:bg-white/5 rounded-xl">
            <div className="w-7 h-7 rounded-full bg-gradient-brand flex items-center justify-center text-white text-xs font-bold shrink-0">
              {inicial}
            </div>
            <div className="overflow-hidden min-w-0">
              <p className="text-stone-900 dark:text-white text-xs font-bold truncate">{nombreCompleto}</p>
              <p className="text-brand-500 dark:text-brand-400 text-[10px] font-semibold truncate">
                {rolLabel[rol]}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={() => signOut(auth).then(() => router.push("/"))}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-red-500 dark:text-red-400 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300 transition-all duration-200"
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          <AnimatePresence>
            {(!collapsed || isMobile) && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-semibold whitespace-nowrap"
              >
                Cerrar Sesión
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 248 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="relative hidden lg:flex flex-col glass-shell border-r border-stone-200/70 dark:border-white/5 h-screen sticky top-0 shrink-0 z-40"
      >
        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3.5 top-[4.5rem] z-10 bg-white dark:bg-stone-800 border border-stone-200 dark:border-white/10 rounded-full p-1 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-700 transition-all shadow-lg"
        >
          {collapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>

        {renderSidebarContent({})}
      </motion.aside>

      {/* Mobile Topbar trigger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 glass-shell border-b border-stone-200/70 dark:border-white/5 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Image src="/logo.webp" alt="Logo" width={28} height={28} className="h-7 w-auto" />
        <span className="text-stone-900 dark:text-white font-display font-extrabold text-sm">
          Lavandería <span className="text-brand-500 dark:text-brand-400">El Cobre</span>
        </span>
      </div>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-[260px] glass-shell border-r border-stone-200/70 dark:border-white/5 flex flex-col"
            >
              {renderSidebarContent({ isMobile: true })}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
