"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Archive,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Pencil,
  Trash2,
  Package,
  Loader2,
} from "lucide-react";
import { useRoleGuard } from "@/components/intranet/useRoleGuard";

type StockStatus = "OK" | "Bajo" | "Crítico";

const inventory = [
  { id: 1, name: "Detergente Industrial", category: "Químicos", stock: 45, min: 20, unit: "kg", cost: 3200, location: "Bodega A1" },
  { id: 2, name: "Suavizante Concentrado", category: "Químicos", stock: 12, min: 15, unit: "L", cost: 4500, location: "Bodega A1" },
  { id: 3, name: "Blanqueador Oxígeno", category: "Químicos", stock: 8, min: 10, unit: "L", cost: 2800, location: "Bodega A2" },
  { id: 4, name: "Quitamanchas Premium", category: "Químicos", stock: 23, min: 15, unit: "unid", cost: 1900, location: "Bodega A2" },
  { id: 5, name: "Bolsas de lavado (med)", category: "Embalaje", stock: 250, min: 100, unit: "unid", cost: 180, location: "Bodega B1" },
  { id: 6, name: "Bolsas de lavado (gde)", category: "Embalaje", stock: 180, min: 80, unit: "unid", cost: 240, location: "Bodega B1" },
  { id: 7, name: "Fundas plásticas transparentes", category: "Embalaje", stock: 420, min: 200, unit: "unid", cost: 95, location: "Bodega B2" },
  { id: 8, name: "Perchas metálicas", category: "Equipamiento", stock: 480, min: 200, unit: "unid", cost: 320, location: "Estantería C1" },
  { id: 9, name: "Perchas plásticas", category: "Equipamiento", stock: 310, min: 150, unit: "unid", cost: 220, location: "Estantería C1" },
  { id: 10, name: "Etiquetas numeradas", category: "Insumos", stock: 1200, min: 500, unit: "unid", cost: 15, location: "Oficina" },
  { id: 11, name: "Cinta de embalaje", category: "Insumos", stock: 6, min: 8, unit: "rollos", cost: 890, location: "Bodega B1" },
  { id: 12, name: "Detergente Delicados", category: "Químicos", stock: 18, min: 10, unit: "L", cost: 5600, location: "Bodega A1" },
];

function getStatus(stock: number, min: number): StockStatus {
  if (stock < min * 0.5) return "Crítico";
  if (stock < min) return "Bajo";
  return "OK";
}

const statusCfg: Record<StockStatus, { bg: string; text: string; icon: React.ElementType; bar: string }> = {
  OK: { bg: "bg-green-500/12", text: "text-green-600 dark:text-green-400", icon: CheckCircle2, bar: "bg-green-500" },
  Bajo: { bg: "bg-amber-500/12", text: "text-amber-600 dark:text-amber-400", icon: AlertTriangle, bar: "bg-amber-500" },
  Crítico: { bg: "bg-red-500/12", text: "text-red-600 dark:text-red-400", icon: XCircle, bar: "bg-red-500" },
};

const categories = ["Todos", "Químicos", "Embalaje", "Equipamiento", "Insumos"];

export default function InventarioPage() {
  const permitido = useRoleGuard(["admin"]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");

  if (!permitido) {
    return (
      <div className="flex h-full items-center justify-center py-24">
        <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
      </div>
    );
  }

  const enriched = inventory.map((item) => ({
    ...item,
    status: getStatus(item.stock, item.min) as StockStatus,
  }));

  const filtered = enriched.filter((item) => {
    const matchCat = category === "Todos" || item.category === category;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const critical = enriched.filter((i) => i.status === "Crítico").length;
  const low = enriched.filter((i) => i.status === "Bajo").length;
  const ok = enriched.filter((i) => i.status === "OK").length;
  const totalValue = enriched.reduce((s, i) => s + i.stock * i.cost, 0);

  return (
    <div className="min-h-screen text-stone-900 dark:text-stone-100 p-4 sm:p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-display font-extrabold text-stone-900 dark:text-white">
            Gestión de Inventario
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
            {inventory.length} productos · Valor total: ${totalValue.toLocaleString("es-CL")} CLP
          </p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-brand text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-premium hover:shadow-lg hover:scale-[1.02] transition-all self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          Agregar Producto
        </button>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {[
          { label: "Total productos", value: inventory.length, color: "text-stone-700 dark:text-stone-200", bg: "bg-stone-100 dark:bg-stone-800" },
          { label: "Stock OK", value: ok, color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-500/10" },
          { label: "Stock bajo", value: low, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-500/10" },
          { label: "Stock crítico", value: critical, color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-500/10" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.06 }}
            className={`border border-stone-200 dark:border-white/5 rounded-2xl p-4 shadow-sm dark:shadow-none ${s.bg}`}
          >
            <p className={`text-3xl font-display font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-stone-500 dark:text-stone-500 text-xs mt-1">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Alert for critical items */}
      {critical > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl px-4 py-3"
        >
          <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400 shrink-0" />
          <p className="text-red-700 dark:text-red-300 text-sm font-semibold">
            {critical} producto{critical > 1 ? "s" : ""} en stock crítico. Requieren reposición urgente.
          </p>
        </motion.div>
      )}

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 glass-panel rounded-xl text-sm text-stone-700 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-600 focus:outline-none focus:border-brand-500/50 transition-colors shadow-sm dark:shadow-none"
          />
          <Search className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                category === cat
                  ? "bg-brand-500 text-white"
                  : "bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 hover:text-stone-700 dark:hover:text-stone-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
        className="glass-panel rounded-2xl overflow-hidden shadow-sm dark:shadow-none"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-stone-200 dark:border-white/5 bg-stone-50 dark:bg-stone-800/50">
                {["Producto", "Categoría", "Stock actual", "Stock mínimo", "Nivel", "Ubicación", "Valor unit.", ""].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-500 px-4 py-3 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => {
                const sc = statusCfg[item.status];
                const Icon = sc.icon;
                const pct = Math.min((item.stock / (item.min * 2)) * 100, 100);

                return (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-stone-100 dark:border-white/5 last:border-0 hover:bg-stone-50 dark:hover:bg-white/2 transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-brand-100 dark:bg-brand-500/10 flex items-center justify-center shrink-0">
                          <Archive className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                        </div>
                        <span className="text-stone-700 dark:text-stone-200 font-semibold">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-stone-400 dark:text-stone-500">{item.category}</td>
                    <td className="px-4 py-3">
                      <span className={`font-bold text-sm ${sc.text}`}>
                        {item.stock} {item.unit}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-400 dark:text-stone-500">
                      {item.min} {item.unit}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${sc.bar}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.7, delay: i * 0.04 }}
                          />
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text}`}
                        >
                          <Icon className="w-3 h-3" />
                          {item.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-stone-400 dark:text-stone-500">{item.location}</td>
                    <td className="px-4 py-3 text-stone-500 dark:text-stone-400">
                      ${item.cost.toLocaleString("es-CL")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 rounded-lg text-stone-400 dark:text-stone-500 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-500/10 transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 rounded-lg text-stone-400 dark:text-stone-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-stone-100 dark:border-white/5 flex items-center justify-between">
          <p className="text-stone-400 dark:text-stone-600 text-xs">{filtered.length} productos</p>
          <p className="text-stone-500 dark:text-stone-400 text-xs font-bold">
            Valor total inventario:{" "}
            <span className="text-brand-600 dark:text-brand-400">${totalValue.toLocaleString("es-CL")} CLP</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
