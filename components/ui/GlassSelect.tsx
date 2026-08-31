"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, Search } from "lucide-react";

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
  searchable = false,
  searchPlaceholder = "Buscar…",
}: {
  value: string;
  onChange: (value: string) => void;
  options: GlassSelectOption[];
  placeholder?: string;
  icon?: React.ElementType;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);
  const normalizedSearch = search
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase("es-CL");
  const filteredOptions = normalizedSearch
    ? options.filter((option) => option.label
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("es-CL")
      .includes(normalizedSearch))
    : options;

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
        onClick={() => {
          if (disabled) return;
          setSearch("");
          setOpen((o) => !o);
        }}
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
            {searchable && (
              <li className="sticky top-0 z-10 mb-1 bg-white/95 p-1 dark:bg-stone-900/95">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-400" />
                  <input
                    autoFocus
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    onKeyDown={(event) => event.stopPropagation()}
                    placeholder={searchPlaceholder}
                    aria-label={searchPlaceholder}
                    className="w-full rounded-lg border border-stone-200 bg-stone-50 py-2 pl-8 pr-3 text-sm text-stone-800 outline-none focus:border-brand-500 dark:border-white/10 dark:bg-stone-800 dark:text-stone-200"
                  />
                </div>
              </li>
            )}
            {filteredOptions.map((opt) => {
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
            {filteredOptions.length === 0 && (
              <li className="px-3 py-4 text-center text-xs text-stone-400">Sin resultados</li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
