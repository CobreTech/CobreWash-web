"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Package,
  Users,
  DollarSign,
  Clock,
  CheckCircle2,
  Star,
  ArrowUpRight,
  Flame,
  MoreVertical,
} from "lucide-react";
import { animate } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useUsuarioActualContext } from "@/components/intranet/AuthGuard";
import { useRoleGuard } from "@/components/intranet/useRoleGuard";

/* ─── Animated counter ─── */
function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v),
    });
    return controls.stop;
  }, [value]);

  const formatted =
    decimals > 0
      ? display.toFixed(decimals)
      : Math.round(display).toLocaleString("es-CL");

  return (
    <>
      {prefix}
      {formatted}
      {suffix}
    </>
  );
}

/* ─── Bar Chart ─── */
function BarChart({
  data,
  labels,
  color = "#f97316",
}: {
  data: number[];
  labels: string[];
  color?: string;
}) {
  const maxVal = Math.max(...data);
  return (
    <div className="flex items-end gap-1.5 h-36 w-full">
      {data.map((val, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
          <motion.div
            className="w-full rounded-t-md"
            style={{ backgroundColor: color }}
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: `${(val / maxVal) * 100}%`,
              opacity: 0.55 + (i / data.length) * 0.45,
            }}
            transition={{ delay: i * 0.07, duration: 0.55, ease: "easeOut" }}
          />
          <span className="text-[10px] text-stone-500 dark:text-stone-500 font-medium">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Donut Chart ─── */
function DonutChart({
  segments,
}: {
  segments: { label: string; value: number; color: string }[];
}) {
  const size = 148;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;
  const total = segments.reduce((s, seg) => s + seg.value, 0);

  let cumulativePercent = 0;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <svg
          width={size}
          height={size}
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* Track */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            className="stroke-stone-200 dark:stroke-stone-800"
            strokeWidth={strokeWidth}
          />

          {segments.map((seg, i) => {
            const percent = seg.value / total;
            const arc = circumference * percent;
            const offset = cumulativePercent * circumference;
            cumulativePercent += percent;

            return (
              <motion.circle
                key={i}
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={`${arc} ${circumference}`}
                strokeDashoffset={-offset}
                initial={{ strokeDasharray: `0 ${circumference}` }}
                animate={{ strokeDasharray: `${arc} ${circumference}` }}
                transition={{ duration: 0.9, delay: 0.3 + i * 0.25, ease: "easeOut" }}
              />
            );
          })}
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-stone-900 dark:text-white font-display font-extrabold text-xl">284</span>
          <span className="text-stone-500 dark:text-stone-500 text-[10px] font-medium">pedidos</span>
        </div>
      </div>

      <div className="w-full space-y-2">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: seg.color }}
              />
              <span className="text-xs text-stone-500 dark:text-stone-400">{seg.label}</span>
            </div>
            <span className="text-xs font-bold text-stone-700 dark:text-stone-200">{seg.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Area / Line Chart (SVG) ─── */
function AreaChart({ data, color = "#f97316" }: { data: number[]; color?: string }) {
  const W = 320;
  const H = 80;
  const maxVal = Math.max(...data);
  const minVal = Math.min(...data);
  const range = maxVal - minVal || 1;

  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - 8 - ((v - minVal) / range) * (H - 16),
  }));

  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${W} ${H} L 0 ${H} Z`;

  return (
    <svg
      width="100%"
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      <motion.path
        d={areaPath}
        fill="url(#areaGrad)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      />
      <motion.path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.6, delay: 0.3, ease: "easeInOut" }}
      />
      {pts.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="3"
          fill={color}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.5 + i * 0.05, duration: 0.2 }}
        />
      ))}
    </svg>
  );
}

/* ─── Status config ─── */
const statusCfg: Record<string, { bg: string; text: string; dot: string }> = {
  Listo: { bg: "bg-green-500/15", text: "text-green-600 dark:text-green-400", dot: "bg-green-400" },
  "En proceso": { bg: "bg-brand-500/15", text: "text-brand-600 dark:text-brand-400", dot: "bg-brand-400" },
  Recibido: { bg: "bg-sky-500/15", text: "text-sky-600 dark:text-sky-400", dot: "bg-sky-400" },
  Pendiente: { bg: "bg-amber-500/15", text: "text-amber-600 dark:text-amber-400", dot: "bg-amber-400" },
};

/* ─── Horario de atención ─── */
const HORARIO = {
  semana: { desde: 8 * 60, hasta: 20 * 60 }, // Lun–Vie 8:00 – 20:00
  sabado: { desde: 9 * 60, hasta: 14 * 60 }, // Sáb 9:00 – 14:00
};

function lavanderiaAbierta(now: Date): boolean {
  const dia = now.getDay(); // 0 dom … 6 sáb
  const min = now.getHours() * 60 + now.getMinutes();
  if (dia >= 1 && dia <= 5) return min >= HORARIO.semana.desde && min < HORARIO.semana.hasta;
  if (dia === 6) return min >= HORARIO.sabado.desde && min < HORARIO.sabado.hasta;
  return false;
}

/* ─── Stagger helpers ─── */
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

/* ══════════════════════════════════════════════════
   DASHBOARD PAGE
══════════════════════════════════════════════════ */
export default function DashboardPage() {
  const permitido = useRoleGuard(["admin"]);
  const usuario = useUsuarioActualContext();
  const primerNombre = usuario?.nombre ?? "Administrador";

  // Hora local para determinar si la lavandería está abierta. Se refresca cada
  // minuto para que el estado cambie al cruzar los límites de horario.
  const [ahora, setAhora] = useState<Date | null>(null);
  useEffect(() => {
    setAhora(new Date());
    const id = setInterval(() => setAhora(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);
  const abierta = ahora ? lavanderiaAbierta(ahora) : false;

  if (!permitido) {
    return (
      <div className="flex h-full items-center justify-center py-24">
        <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
      </div>
    );
  }

  const kpis = [
    {
      label: "Pedidos este mes",
      value: 284,
      trend: 12,
      up: true,
      icon: Package,
      color: "text-brand-600 dark:text-brand-400",
      bg: "bg-brand-100 dark:bg-brand-500/10",
    },
    {
      label: "Ingresos del mes",
      value: 3420000,
      prefix: "$",
      trend: 8,
      up: true,
      icon: DollarSign,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-100 dark:bg-emerald-500/10",
    },
    {
      label: "Clientes activos",
      value: 156,
      trend: 5,
      up: true,
      icon: Users,
      color: "text-sky-600 dark:text-sky-400",
      bg: "bg-sky-100 dark:bg-sky-500/10",
    },
    {
      label: "Pendientes hoy",
      value: 23,
      trend: 3,
      up: false,
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-100 dark:bg-amber-500/10",
    },
    {
      label: "Completados hoy",
      value: 47,
      trend: 15,
      up: true,
      icon: CheckCircle2,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-100 dark:bg-green-500/10",
    },
    {
      label: "Satisfacción",
      value: 4.8,
      suffix: "/5",
      decimals: 1,
      trend: 2,
      up: true,
      icon: Star,
      color: "text-yellow-600 dark:text-yellow-400",
      bg: "bg-yellow-100 dark:bg-yellow-500/10",
    },
  ];

  const weeklyIncome = [1850, 2100, 1650, 2480, 2750, 2120, 3100, 3420];
  const weekLabels = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];
  const dailyOrders = [18, 22, 15, 28, 24, 31, 27, 19, 25, 33, 21, 29, 35, 23];

  const services = [
    { label: "Doméstica y Particular", value: 45, color: "#f97316" },
    { label: "Industrial / Empresa", value: 35, color: "#db541a" },
    { label: "Retiro a Domicilio", value: 20, color: "#fed7aa" },
  ];

  const recentOrders = [
    { id: "COBRE-2847", client: "María González", service: "Doméstica", status: "Listo", amount: 15200 },
    { id: "COBRE-2846", client: "Empresa TechCorp S.A.", service: "Industrial", status: "En proceso", amount: 245000 },
    { id: "COBRE-2845", client: "Pedro Rodríguez", service: "Retiro", status: "Recibido", amount: 8500 },
    { id: "COBRE-2844", client: "Ana Martínez", service: "Doméstica", status: "Listo", amount: 12800 },
    { id: "COBRE-2843", client: "Hotel Plaza Santiago", service: "Industrial", status: "En proceso", amount: 380000 },
  ];

  const activity = [
    { text: "Nuevo pedido #COBRE-2848 recibido", time: "hace 3 min", dot: "bg-sky-400" },
    { text: "COBRE-2847 marcado como Listo", time: "hace 11 min", dot: "bg-green-400" },
    { text: "Stock de Suavizante bajo mínimo", time: "hace 25 min", dot: "bg-amber-400" },
    { text: "Carlos H. inició turno operativo", time: "hace 38 min", dot: "bg-brand-400" },
    { text: "COBRE-2843 ingresó a lavado", time: "hace 52 min", dot: "bg-brand-400" },
    { text: "Factura emitida a TechCorp S.A.", time: "hace 1 h", dot: "bg-emerald-400" },
  ];

  return (
    <div className="min-h-screen text-stone-900 dark:text-stone-100 p-4 sm:p-6 space-y-6">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-display font-extrabold text-stone-900 dark:text-white">
            Buenos días,{" "}
            <span className="text-gradient">{primerNombre}</span>
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm mt-1 capitalize">
            {new Date().toLocaleDateString("es-CL", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          title={"Lunes a Viernes: 8:00 - 20:00\nSábados: 9:00 - 14:00"}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border self-start sm:self-auto cursor-default ${
            abierta
              ? "bg-green-500/10 border-green-500/20"
              : "bg-red-500/10 border-red-500/20"
          }`}
        >
          {abierta ? (
            <Flame className="w-4 h-4 text-green-600 dark:text-green-400" />
          ) : (
            <Clock className="w-4 h-4 text-red-600 dark:text-red-400" />
          )}
          <span
            className={`text-sm font-bold ${
              abierta ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"
            }`}
          >
            {abierta ? "Lavandería abierta" : "Cerrada"}
          </span>
          <div
            className={`w-2 h-2 rounded-full ${
              abierta ? "bg-green-400 animate-pulse" : "bg-red-500"
            }`}
          />
        </motion.div>
      </motion.div>

      {/* ── KPI Cards ── */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3"
      >
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              variants={item}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="glass-panel rounded-2xl p-4 flex flex-col gap-3 hover:border-brand-300 dark:hover:border-brand-500/20 shadow-sm dark:shadow-none transition-colors cursor-default"
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-xl ${kpi.bg}`}>
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
                <div
                  className={`flex items-center gap-0.5 text-[11px] font-bold ${
                    kpi.up ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {kpi.up ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {kpi.trend}%
                </div>
              </div>
              <div>
                <p className={`text-xl font-display font-extrabold ${kpi.color}`}>
                  <AnimatedNumber
                    value={kpi.value}
                    prefix={kpi.prefix}
                    suffix={kpi.suffix}
                    decimals={kpi.decimals ?? 0}
                  />
                </p>
                <p className="text-[11px] text-stone-500 dark:text-stone-500 mt-0.5 font-medium leading-tight">
                  {kpi.label}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="lg:col-span-2 glass-panel rounded-2xl p-5 shadow-sm dark:shadow-none"
        >
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="text-stone-900 dark:text-white font-bold text-sm">Ingresos Semanales</h3>
              <p className="text-stone-500 dark:text-stone-500 text-xs mt-0.5">Últimas 8 semanas · en miles CLP</p>
            </div>
            <div className="text-right">
              <p className="text-brand-600 dark:text-brand-400 font-bold text-sm">$3.42M</p>
              <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-0.5 justify-end mt-0.5">
                <TrendingUp className="w-3 h-3" /> +8% vs anterior
              </p>
            </div>
          </div>
          <BarChart data={weeklyIncome} labels={weekLabels} />
        </motion.div>

        {/* Donut Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-panel rounded-2xl p-5 shadow-sm dark:shadow-none"
        >
          <div className="mb-4">
            <h3 className="text-stone-900 dark:text-white font-bold text-sm">Distribución de Servicios</h3>
            <p className="text-stone-500 dark:text-stone-500 text-xs mt-0.5">Por tipo · este mes</p>
          </div>
          <DonutChart segments={services} />
        </motion.div>
      </div>

      {/* ── Bottom Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="glass-panel rounded-2xl p-5 shadow-sm dark:shadow-none"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-stone-900 dark:text-white font-bold text-sm">Pedidos Diarios</h3>
              <p className="text-stone-500 dark:text-stone-500 text-xs mt-0.5">Últimas 2 semanas</p>
            </div>
            <span className="text-brand-600 dark:text-brand-400 font-bold text-xs">Prom. 24/día</span>
          </div>
          <AreaChart data={dailyOrders} color="#f97316" />

          {/* Activity Feed */}
          <div className="mt-4 pt-4 border-t border-stone-100 dark:border-white/5 space-y-2.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-600">
              Actividad reciente
            </p>
            {activity.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + i * 0.07 }}
                className="flex items-start gap-2.5"
              >
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${a.dot}`} />
                <div className="min-w-0">
                  <p className="text-[11px] text-stone-700 dark:text-stone-300 leading-snug">{a.text}</p>
                  <p className="text-[10px] text-stone-400 dark:text-stone-600 mt-0.5">{a.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="lg:col-span-2 glass-panel rounded-2xl p-5 shadow-sm dark:shadow-none"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-stone-900 dark:text-white font-bold text-sm">Pedidos Recientes</h3>
            <a
              href="/intranet/comandas"
              className="text-brand-600 dark:text-brand-400 text-xs font-bold hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1 transition-colors"
            >
              Ver todos <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-stone-200 dark:border-white/5">
                  <th className="text-left text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-600 pb-2 pr-4">
                    Pedido
                  </th>
                  <th className="text-left text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-600 pb-2 pr-4">
                    Cliente
                  </th>
                  <th className="text-left text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-600 pb-2 pr-4">
                    Servicio
                  </th>
                  <th className="text-left text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-600 pb-2 pr-4">
                    Estado
                  </th>
                  <th className="text-right text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-600 pb-2">
                    Monto
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, i) => {
                  const sc = statusCfg[order.status] ?? statusCfg["Recibido"];
                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.09 }}
                      className="border-b border-stone-100 dark:border-white/5 last:border-0 hover:bg-stone-50 dark:hover:bg-white/3 transition-colors group"
                    >
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${sc.dot}`} />
                          <span className="text-stone-700 dark:text-stone-200 font-bold">{order.id}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-stone-500 dark:text-stone-400">{order.client}</td>
                      <td className="py-3 pr-4 text-stone-500 dark:text-stone-400">{order.service}</td>
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span className="text-stone-700 dark:text-stone-200 font-bold">
                          ${order.amount.toLocaleString("es-CL")}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mini stats row */}
          <div className="mt-4 pt-4 border-t border-stone-100 dark:border-white/5 grid grid-cols-3 gap-3">
            {[
              { label: "Promedio/pedido", value: "$12.450" },
              { label: "Más solicitado", value: "Doméstica" },
              { label: "Tiempo prom.", value: "4.2 hrs" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 + i * 0.1 }}
                className="bg-stone-50 dark:bg-white/3 rounded-xl p-3 text-center"
              >
                <p className="text-stone-900 dark:text-white font-bold text-sm">{stat.value}</p>
                <p className="text-stone-400 dark:text-stone-600 text-[10px] mt-0.5">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
