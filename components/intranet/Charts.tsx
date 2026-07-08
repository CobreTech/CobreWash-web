"use client";

import { motion } from "framer-motion";

/* ─── Vertical Bar Chart ─── */
export function BarChart({
  data,
  labels,
  color = "#f97316",
  height = 144,
}: {
  data: number[];
  labels: string[];
  color?: string;
  height?: number;
}) {
  const maxVal = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1.5 w-full" style={{ height }}>
      {data.map((val, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
          <motion.div
            className="w-full rounded-t-md"
            style={{ backgroundColor: color }}
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: `${(val / maxVal) * 100}%`,
              opacity: 0.55 + (i / data.length) * 0.45,
            }}
            transition={{ delay: i * 0.06, duration: 0.55, ease: "easeOut" }}
          />
          <span className="text-[10px] text-stone-500 dark:text-stone-500 font-medium text-center leading-tight">
            {labels[i]}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Horizontal Bar / Ranking Chart ─── */
export function HBarChart({
  items,
  formatValue = (v) => v.toLocaleString("es-CL"),
  color = "#f97316",
}: {
  items: { label: string; value: number; hint?: string }[];
  formatValue?: (v: number) => string;
  color?: string;
}) {
  const maxVal = Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={item.label} className="space-y-1">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-xs font-semibold text-stone-700 dark:text-stone-200 truncate">
              {item.label}
            </span>
            <span className="text-xs font-bold text-stone-900 dark:text-white shrink-0">
              {formatValue(item.value)}
              {item.hint && (
                <span className="text-stone-400 dark:text-stone-600 font-medium ml-1">{item.hint}</span>
              )}
            </span>
          </div>
          <div className="h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: color }}
              initial={{ width: 0 }}
              animate={{ width: `${(item.value / maxVal) * 100}%` }}
              transition={{ delay: 0.15 + i * 0.08, duration: 0.7, ease: "easeOut" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Donut Chart ─── */
export function DonutChart({
  segments,
  centerValue,
  centerLabel,
}: {
  segments: { label: string; value: number; color: string }[];
  centerValue: string | number;
  centerLabel: string;
}) {
  const size = 148;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;

  // Offsets acumulados precalculados (sin mutar variables durante el render).
  const arcs: { arc: number; offset: number; color: string }[] = [];
  segments.reduce((acc, seg) => {
    const percent = seg.value / total;
    arcs.push({ arc: circumference * percent, offset: acc * circumference, color: seg.color });
    return acc + percent;
  }, 0);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            className="stroke-stone-200 dark:stroke-stone-800"
            strokeWidth={strokeWidth}
          />
          {arcs.map((a, i) => (
            <motion.circle
              key={i}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={a.color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={`${a.arc} ${circumference}`}
              strokeDashoffset={-a.offset}
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray: `${a.arc} ${circumference}` }}
              transition={{ duration: 0.9, delay: 0.3 + i * 0.2, ease: "easeOut" }}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-stone-900 dark:text-white font-display font-extrabold text-xl">
            {centerValue}
          </span>
          <span className="text-stone-500 dark:text-stone-500 text-[10px] font-medium">
            {centerLabel}
          </span>
        </div>
      </div>

      <div className="w-full space-y-2">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
              <span className="text-xs text-stone-500 dark:text-stone-400 truncate">{seg.label}</span>
            </div>
            <span className="text-xs font-bold text-stone-700 dark:text-stone-200 shrink-0">
              {Math.round((seg.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
