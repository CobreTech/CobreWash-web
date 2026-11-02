// @vitest-environment jsdom
import { createElement } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import ConsumoEstimado from "./ConsumoEstimado";
import type { ModeloComanda } from "@/lib/ia/comanda";

const LAV = "20000000-0000-4000-8000-000000000001";
const modelo: ModeloComanda = {
  configuracionIa: { margenSeguridad: 0.15 },
  tasaConsumos: [
    { tipoServicioId: LAV, insumoId: "det", tasaInicial: 12, tasaActual: 12, unidad: "ml" },
    { tipoServicioId: LAV, insumoId: "clo", tasaInicial: 3, tasaActual: 3, unidad: "ml" },
  ],
  insumos: [{ id: "det", nombre: "Detergente", unidadMedida: "L", stockActual: 40 }, { id: "clo", nombre: "Cloro", unidadMedida: "L", stockActual: 0.2 }],
  modeloVigente: [{ desviacionRelativa: 0.1, tasasJson: null }],
};
const props = { modelo, error: false, servicioId: LAV, servicioNombre: "Lavado", pesoTexto: "12,5", verStock: false };
afterEach(cleanup);

it("muestra el rango por insumo y si el stock alcanza, sin cantidades para recepción", () => {
  render(createElement(ConsumoEstimado, props));
  const panel = screen.getByRole("region", { name: "Consumo estimado de insumos" });
  expect(panel.textContent).toContain("Detergente135 a 165 mlAlcanza");
  expect(panel.textContent).toMatch(/Cloro33,8 a 41,3 mlAlcanza/);
  expect(panel.textContent).not.toContain("stock");
  expect(screen.queryByRole("alert")).toBeNull();
});

it("alerta cuando el stock no alcanza y administración ve el stock disponible", () => {
  render(createElement(ConsumoEstimado, { ...props, pesoTexto: "80", verStock: true }));
  expect(screen.getByRole("alert").textContent).toContain("No hay stock suficiente de Cloro para esta comanda");
  expect(screen.getByText(/No alcanza/).textContent).toContain("stock 0,2 L");
  expect(screen.getByText(/Detergente/).parentElement!.textContent).toContain("Alcanza");
});

it("marca como justo cuando solo falta el margen", () => {
  render(createElement(ConsumoEstimado, { ...props, pesoTexto: "60" }));
  expect(screen.getByText("Justo, sin margen")).toBeTruthy();
});

it.each([
  [{ pesoTexto: "" }, "Ingresa el peso total"],
  [{ pesoTexto: "abc" }, "Ingresa el peso total"],
  [{ modelo: null }, "Cargando estimación"],
  [{ error: true }, "No se pudo cargar la estimación"],
  [{ servicioId: "otro", servicioNombre: "Planchado" }, "«Planchado» aún no tiene tasas"],
  [{ servicioId: null, servicioNombre: "" }, "«sin servicio»"],
])("explica por qué no hay estimación (%#)", (extra, texto) => {
  render(createElement(ConsumoEstimado, { ...props, ...extra }));
  expect(screen.getByRole("region", { name: "Consumo estimado de insumos" }).textContent).toContain(texto);
});

it("usa litros cuando el consumo supera una unidad", () => {
  render(createElement(ConsumoEstimado, { ...props, pesoTexto: "200", verStock: false }));
  expect(screen.getByText(/2,16 a 2,64 L/)).toBeTruthy();
});
