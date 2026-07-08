"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

export interface GlassSelectOption {
  value: string;
  label: string;
}

/**
 * Desplegable propio con estética liquid-glass, en reemplazo del <select>
 * nativo del navegador (que no se puede estilar de forma consistente).
 * Controla apertura por clic, cierra al hacer clic fuera o con Escape y
 * anima el panel de opciones de forma rápida y fluida.
 */
export default function GlassSelect({
  value,
  onChange,
  options,
  placeholder = "Selecciona…",
  icon: Icon,
  className = "",
  disabled = false,
  ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  options: GlassSelectOption[];
  placeholder?: string;
  icon?: React.ElementType;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={`w-full flex items-center ${Icon ? "pl-10" : "pl-4"} pr-10 py-3 rounded-xl border bg-stone-50 dark:bg-stone-800 text-sm font-medium text-left transition-colors focus:outline-none ${
          open ? "border-brand-500" : "border-stone-200 dark:border-white/10"
        } ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"} ${
          selected ? "text-stone-800 dark:text-stone-200" : "text-stone-500 dark:text-stone-500"
        } ${className}`}
      >
        {Icon && (
          <Icon className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        )}
        <span className="flex-1 truncate">{selected ? selected.label : placeholder}</span>
        <ChevronDown
          className={`w-4 h-4 text-stone-400 dark:text-stone-500 absolute right-3.5 top-1/2 -translate-y-1/2 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-[70] mt-2 w-full max-h-56 overflow-y-auto rounded-2xl border border-white/60 dark:border-white/10 bg-white/85 dark:bg-stone-900/90 backdrop-blur-xl p-1.5 shadow-premium"
            style={{ WebkitBackdropFilter: "blur(20px)" }}
          >
            {options.map((opt) => {
              const active = opt.value === value;
              return (
                <li key={opt.value} role="option" aria-selected={active}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-sm text-left transition-colors cursor-pointer ${
                      active
                        ? "bg-brand-500/12 text-brand-600 dark:text-brand-400 font-semibold"
                        : "text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/5"
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {active && <Check className="w-4 h-4 shrink-0" />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
