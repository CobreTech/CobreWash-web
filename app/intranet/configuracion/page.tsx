"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  User,
  Bell,
  Shield,
  Save,
  CheckCircle2,
  Eye,
  EyeOff,
  MapPin,
  Phone,
  Globe,
  Clock,
  Mail,
  Palette,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useTheme, type Theme } from "@/components/providers/ThemeProvider";
import { useRoleGuard } from "@/components/intranet/useRoleGuard";
import { useUsuarioActualContext } from "@/components/intranet/AuthGuard";

type Tab = "apariencia" | "empresa" | "perfil" | "notificaciones" | "seguridad";

type TabDef = { id: Tab; label: string; icon: React.ElementType; adminOnly?: boolean };

const tabs: TabDef[] = [
  { id: "apariencia", label: "Apariencia", icon: Palette },
  { id: "perfil", label: "Mi Perfil", icon: User },
  { id: "notificaciones", label: "Notificaciones", icon: Bell },
  { id: "seguridad", label: "Seguridad", icon: Shield },
];

const themeOptions: { id: Theme; label: string; description: string; icon: React.ElementType }[] = [
  { id: "light", label: "Claro", description: "Fondo claro en toda la intranet", icon: Sun },
  { id: "dark", label: "Oscuro", description: "Fondo oscuro en toda la intranet", icon: Moon },
  { id: "system", label: "Sistema", description: "Sigue la preferencia de tu sistema operativo", icon: Monitor },
];

function SaveButton({ onClick, saved }: { onClick: () => void; saved: boolean }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
        saved
          ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20"
          : "bg-gradient-brand text-white shadow-premium hover:shadow-lg"
      }`}
    >
      {saved ? (
        <>
          <CheckCircle2 className="w-4 h-4" />
          Guardado
        </>
      ) : (
        <>
          <Save className="w-4 h-4" />
          Guardar cambios
        </>
      )}
    </motion.button>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  icon: Icon,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  icon?: React.ElementType;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-500">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="w-4 h-4 text-stone-400 dark:text-stone-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-white/5 rounded-xl text-sm text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-600 focus:outline-none focus:border-brand-500/40 transition-colors ${
            Icon ? "pl-10 pr-4" : "px-4"
          } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
        />
      </div>
    </div>
  );
}

function Toggle({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-stone-100 dark:border-white/5 last:border-0">
      <div>
        <p className="text-sm text-stone-700 dark:text-stone-200 font-semibold">{label}</p>
        {description && <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-10 h-5.5 rounded-full transition-colors cursor-pointer ${
          value ? "bg-brand-500" : "bg-stone-300 dark:bg-stone-700"
        }`}
        style={{ height: "22px" }}
      >
        <motion.div
          className="absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow-sm"
          animate={{ left: value ? "calc(100% - 20px)" : "2px" }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          style={{ width: "18px", height: "18px" }}
        />
      </button>
    </div>
  );
}

export default function ConfiguracionPage() {
  const permitido = useRoleGuard(["admin", "recepcionista", "operario"]);
  const usuario = useUsuarioActualContext();
  const isAdmin = usuario?.rol.nombre === "admin";
  const visibleTabs = tabs.filter((t) => !t.adminOnly || isAdmin);
  const [activeTab, setActiveTab] = useState<Tab>("apariencia");
  const [saved, setSaved] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { theme, setTheme } = useTheme();

  // Empresa fields
  const [empresa, setEmpresa] = useState({
    nombre: "Lavandería El Cobre",
    rut: "76.543.210-8",
    direccion: "Av. El Cobre 1234, Santiago",
    telefono: "+56 2 2345 6789",
    email: "contacto@lavelcobre.cl",
    web: "www.lavanderiael cobre.cl",
    horario: "Lun-Vie 08:00-19:00 · Sáb 09:00-14:00",
    region: "Región Metropolitana",
  });

  // Notificaciones
  const [notifs, setNotifs] = useState({
    nuevoPedido: true,
    pedidoListo: true,
    stockBajo: true,
    stockCritico: true,
    nuevaReg: false,
    resumenDiario: true,
    resumenSemanal: false,
    sonido: true,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (!permitido) {
    return (
      <div className="flex h-full items-center justify-center py-24">
        <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-stone-900 dark:text-stone-100 p-4 sm:p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-extrabold text-stone-900 dark:text-white">Configuración</h1>
        <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
          Gestiona los ajustes del sistema y tu cuenta
        </p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tab Sidebar */}
        <motion.nav
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:w-52 flex lg:flex-col gap-1 flex-row flex-wrap lg:shrink-0"
        >
          {visibleTabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  active
                    ? "bg-brand-500/12 text-brand-600 dark:text-brand-400 border border-brand-500/20"
                    : "text-stone-500 dark:text-stone-500 hover:bg-stone-100 dark:hover:bg-white/5 hover:text-stone-800 dark:hover:text-stone-300"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </motion.nav>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex-1 min-w-0"
        >
          <AnimatePresence mode="wait">
            {/* APARIENCIA */}
            {activeTab === "apariencia" && (
              <motion.div
                key="apariencia"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="glass-panel rounded-2xl p-6 space-y-6"
              >
                <h2 className="text-stone-900 dark:text-white font-bold">Tema de la Intranet</h2>
                <p className="text-sm text-stone-500 dark:text-stone-500">
                  Elige cómo se ve el panel de administración en este dispositivo.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {themeOptions.map((opt) => {
                    const Icon = opt.icon;
                    const active = theme === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setTheme(opt.id)}
                        className={`flex flex-col items-start gap-3 p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                          active
                            ? "border-brand-500 bg-brand-500/10"
                            : "border-stone-200 dark:border-white/5 bg-stone-50 dark:bg-stone-800/50 hover:border-stone-300 dark:hover:border-white/10"
                        }`}
                      >
                        <div
                          className={`p-2.5 rounded-xl ${
                            active ? "bg-brand-500 text-white" : "bg-stone-200 dark:bg-stone-700 text-stone-500 dark:text-stone-400"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className={`text-sm font-bold ${active ? "text-brand-600 dark:text-brand-400" : "text-stone-700 dark:text-stone-200"}`}>
                            {opt.label}
                          </p>
                          <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">{opt.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* PERFIL */}
            {activeTab === "perfil" && (
              <motion.div
                key="perfil"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="glass-panel rounded-2xl p-6 space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-stone-900 dark:text-white font-bold">Mi Perfil</h2>
                  <SaveButton onClick={handleSave} saved={saved} />
                </div>

                {/* Avatar */}
                <div className="flex items-center gap-4 pb-4 border-b border-stone-100 dark:border-white/5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-brand flex items-center justify-center text-white font-bold text-xl">
                    A
                  </div>
                  <div>
                    <p className="text-stone-900 dark:text-white font-bold">Administrador Principal</p>
                    <p className="text-stone-400 dark:text-stone-500 text-xs mt-0.5">administrador@gmail.com</p>
                    <button className="mt-2 px-3 py-1.5 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-300 rounded-lg text-xs font-bold hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors cursor-pointer">
                      Cambiar foto
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label="Nombre completo" value="Administrador Principal" onChange={() => {}} icon={User} />
                  <InputField label="Correo electrónico" value="administrador@gmail.com" onChange={() => {}} icon={Mail} disabled />
                  <InputField label="Teléfono" value="+56 9 9000 0001" onChange={() => {}} icon={Phone} />
                  <InputField label="Cargo" value="Administrador del Sistema" onChange={() => {}} disabled />
                </div>
              </motion.div>
            )}

            {/* NOTIFICACIONES */}
            {activeTab === "notificaciones" && (
              <motion.div
                key="notificaciones"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="glass-panel rounded-2xl p-6 space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-stone-900 dark:text-white font-bold">Preferencias de Notificaciones</h2>
                  <SaveButton onClick={handleSave} saved={saved} />
                </div>

                {[
                  {
                    title: "Pedidos",
                    items: [
                      { key: "nuevoPedido" as const, label: "Nuevo pedido recibido", desc: "Alerta al ingresar una nueva comanda" },
                      { key: "pedidoListo" as const, label: "Pedido listo para retiro", desc: "Cuando un pedido completa el proceso" },
                    ],
                  },
                  {
                    title: "Inventario",
                    items: [
                      { key: "stockBajo" as const, label: "Stock bajo el mínimo", desc: "Cuando un ítem cae bajo su nivel mínimo" },
                      { key: "stockCritico" as const, label: "Stock crítico", desc: "Alerta de reposición urgente" },
                    ],
                  },
                  {
                    title: "Sistema",
                    items: [
                      { key: "nuevaReg" as const, label: "Nuevo registro de usuario", desc: "Cuando alguien se registra en la plataforma" },
                      { key: "resumenDiario" as const, label: "Resumen diario", desc: "Reporte de actividad al final del día" },
                      { key: "resumenSemanal" as const, label: "Resumen semanal", desc: "Estadísticas de la semana cada lunes" },
                      { key: "sonido" as const, label: "Sonido de notificaciones", desc: "Reproducir sonido al recibir alertas" },
                    ],
                  },
                ].map((group) => (
                  <div key={group.title}>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-600 mb-3">
                      {group.title}
                    </p>
                    <div className="bg-stone-50 dark:bg-stone-800/50 rounded-xl px-4 divide-y divide-stone-100 dark:divide-white/5">
                      {group.items.map((item) => (
                        <Toggle
                          key={item.key}
                          label={item.label}
                          description={item.desc}
                          value={notifs[item.key]}
                          onChange={(v) => setNotifs({ ...notifs, [item.key]: v })}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* SEGURIDAD */}
            {activeTab === "seguridad" && (
              <motion.div
                key="seguridad"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="glass-panel rounded-2xl p-6 space-y-6"
              >
                <h2 className="text-stone-900 dark:text-white font-bold">Seguridad y Acceso</h2>

                {/* Change password */}
                <div className="bg-stone-50 dark:bg-stone-800/50 rounded-xl p-5 space-y-4">
                  <p className="text-sm font-bold text-stone-700 dark:text-stone-200">Cambiar Contraseña</p>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-500">
                      Contraseña actual
                    </label>
                    <div className="relative">
                      <input
                        type={showPass ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full pl-4 pr-10 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-white/5 rounded-xl text-sm text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-600 focus:outline-none focus:border-brand-500/40 transition-colors"
                      />
                      <button
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 transition-colors cursor-pointer"
                      >
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-500">
                        Nueva contraseña
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-white/5 rounded-xl text-sm text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-600 focus:outline-none focus:border-brand-500/40 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-500">
                        Confirmar contraseña
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-white/5 rounded-xl text-sm text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-600 focus:outline-none focus:border-brand-500/40 transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-gradient-brand text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-premium hover:shadow-lg transition-all cursor-pointer"
                  >
                    <Shield className="w-4 h-4" />
                    Actualizar contraseña
                  </button>
                </div>

                {/* Session info */}
                <div className="bg-stone-50 dark:bg-stone-800/50 rounded-xl p-5 space-y-3">
                  <p className="text-sm font-bold text-stone-700 dark:text-stone-200">Sesiones Activas</p>
                  {[
                    { device: "Chrome · Windows 11", location: "Santiago, CL", time: "Ahora mismo", current: true },
                    { device: "Firefox · MacOS", location: "Santiago, CL", time: "hace 2 días", current: false },
                  ].map((session, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-stone-100 dark:border-white/5 last:border-0">
                      <div>
                        <p className="text-xs text-stone-600 dark:text-stone-300 font-semibold">
                          {session.device}
                          {session.current && (
                            <span className="ml-2 text-[10px] bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full font-bold">
                              Actual
                            </span>
                          )}
                        </p>
                        <p className="text-[11px] text-stone-400 dark:text-stone-600 mt-0.5">
                          {session.location} · {session.time}
                        </p>
                      </div>
                      {!session.current && (
                        <button className="text-[11px] font-bold text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors cursor-pointer">
                          Cerrar
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Danger Zone */}
                <div className="border border-red-200 dark:border-red-500/20 rounded-xl p-5">
                  <p className="text-sm font-bold text-red-500 dark:text-red-400 mb-3">Zona de Peligro</p>
                  <p className="text-xs text-stone-500 dark:text-stone-500 mb-4">
                    Estas acciones son irreversibles. Procede con precaución.
                  </p>
                  <button className="px-4 py-2.5 border border-red-300 dark:border-red-500/30 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl text-xs font-bold transition-colors cursor-pointer">
                    Eliminar cuenta de administrador
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
