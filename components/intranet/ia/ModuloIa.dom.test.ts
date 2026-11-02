// @vitest-environment jsdom
import { createElement } from "react";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi, type Mock } from "vitest";
const api = vi.hoisted(() => ({ tasa: vi.fn(), borrar: vi.fn(), config: vi.fn(), conteo: vi.fn(), entrada: vi.fn(), token: vi.fn() }));
vi.mock("@/lib/firebase/client", () => ({ dataConnect: {}, auth: { currentUser: { getIdToken: api.token } } }));
vi.mock("@/lib/registro-seguro", () => ({ registrarError: () => {} }));
vi.mock("@/src/dataconnect-generated", () => ({
  guardarTasaConsumo: api.tasa, eliminarTasaConsumo: api.borrar, guardarConfiguracionIa: api.config,
  registrarConteoFisicoIa: api.conteo, registrarEntradaInventario: api.entrada,
}));
import TasasIa from "./TasasIa";
import DatosIa from "./DatosIa";
import type { Avisar } from "./ui";

const DET = "10000000-0000-4000-8000-000000000001", CLORO = "10000000-0000-4000-8000-000000000002", BOLSAS = "10000000-0000-4000-8000-000000000003";
const LAV = "20000000-0000-4000-8000-000000000001", DES = "20000000-0000-4000-8000-000000000002";
const panel = {
  configuracionIa: null,
  tasaConsumos: [{
    tipoServicioId: LAV.replaceAll("-", ""), insumoId: DET.replaceAll("-", ""), tasaInicial: 12, tasaActual: 10.5, unidad: "ml", fuente: "Ficha técnica",
    actualizadoEn: "2026-10-01T00:00:00Z", tipoServicio: { id: LAV, nombre: "Lavado" }, insumo: { id: DET, nombre: "Detergente", unidadMedida: "L" },
  }],
  modeloVigente: [],
  insumos: [
    { id: DET, nombre: "Detergente", unidadMedida: "L", stockActual: 80, stockMinimo: 10, revisionStock: 3 },
    { id: CLORO, nombre: "Cloro", unidadMedida: "L", stockActual: 20, stockMinimo: 5, revisionStock: 0 },
    { id: BOLSAS, nombre: "Bolsas", unidadMedida: "unidad", stockActual: 500, stockMinimo: 50, revisionStock: 0 },
  ],
  tipoServicios: [{ id: LAV, nombre: "Lavado", unidadCobro: "KILO" }, { id: DES, nombre: "Desmanchado", unidadCobro: "PRENDA" }],
  conteosReales: [{ _count: 0 }], conteosSimulados: [{ _count: 0 }], simulaciones: [],
} as never;

let recargar: Mock<() => Promise<void>>, avisar: Mock<Avisar>;
beforeEach(() => {
  vi.clearAllMocks();
  recargar = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
  avisar = vi.fn<Avisar>();
  for (const f of [api.tasa, api.borrar, api.config, api.conteo, api.entrada]) f.mockResolvedValue({});
  api.token.mockResolvedValue("token-admin");
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

const elegir = (etiqueta: string, opcion: string, contenedor: HTMLElement = document.body) => {
  fireEvent.click(within(contenedor).getByRole("button", { name: etiqueta }));
  fireEvent.click(within(contenedor).getByRole("button", { name: opcion }));
};

it("muestra la matriz de tasas y deja fuera los insumos sin volumen ni masa", () => {
  render(createElement(TasasIa, { panel, recargar, avisar }));
  expect(screen.getByRole("button", { name: "Editar tasa de Detergente para Lavado" }).textContent).toContain("actual 10,5");
  expect(screen.getByRole("button", { name: "Definir tasa de Cloro para Desmanchado" })).toBeTruthy();
  expect(screen.queryByRole("button", { name: /Bolsas/ })).toBeNull();
  expect(screen.getByText(/No entran al modelo por su unidad: Bolsas \(unidad\)/)).toBeTruthy();
});

it("una tasa nueva parte con la tasa actual igual a la inicial", async () => {
  render(createElement(TasasIa, { panel, recargar, avisar }));
  fireEvent.click(screen.getByRole("button", { name: "Definir tasa de Cloro para Desmanchado" }));
  fireEvent.change(screen.getByPlaceholderText("Ej: 12"), { target: { value: "4,5" } });
  fireEvent.click(screen.getByRole("button", { name: "Guardar tasa" }));
  await waitFor(() => expect(api.tasa).toHaveBeenCalledWith({}, { tipoServicioId: DES, insumoId: CLORO, tasaInicial: 4.5, tasaActual: 4.5, unidad: "ml", fuente: null }));
  expect(recargar).toHaveBeenCalled();
  expect(avisar).toHaveBeenCalledWith(expect.stringContaining("guardada"), "success");
});

it("al cambiar la unidad convierte la tasa actual y permite reiniciarla", async () => {
  render(createElement(TasasIa, { panel, recargar, avisar }));
  fireEvent.click(screen.getByRole("button", { name: "Editar tasa de Detergente para Lavado" }));
  const dialogo = screen.getByRole("dialog");
  fireEvent.change(within(dialogo).getByPlaceholderText("Ej: 12"), { target: { value: "0,012" } });
  elegir("Unidad de la tasa", "L/kg", dialogo);
  fireEvent.click(within(dialogo).getByRole("button", { name: "Guardar tasa" }));
  await waitFor(() => expect(api.tasa).toHaveBeenCalledTimes(1));
  expect(api.tasa.mock.calls[0][1]).toMatchObject({ tasaInicial: 0.012, unidad: "L", fuente: "Ficha técnica" });
  expect(api.tasa.mock.calls[0][1].tasaActual).toBeCloseTo(0.0105);

  fireEvent.click(screen.getByRole("button", { name: "Editar tasa de Detergente para Lavado" }));
  fireEvent.click(screen.getByRole("checkbox", { name: "Reiniciar la tasa actual a la inicial" }));
  fireEvent.click(screen.getByRole("button", { name: "Guardar tasa" }));
  await waitFor(() => expect(api.tasa).toHaveBeenCalledTimes(2));
  expect(api.tasa.mock.calls[1][1]).toMatchObject({ tasaInicial: 12, tasaActual: 12 });
});

it("pide confirmación antes de eliminar una tasa", async () => {
  render(createElement(TasasIa, { panel, recargar, avisar }));
  fireEvent.click(screen.getByRole("button", { name: "Editar tasa de Detergente para Lavado" }));
  fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));
  expect(api.borrar).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Confirmar eliminación" }));
  await waitFor(() => expect(api.borrar).toHaveBeenCalledWith({}, { tipoServicioId: LAV, insumoId: DET }));
});

it("valida y guarda los parámetros del modelo con el margen como fracción", async () => {
  render(createElement(TasasIa, { panel, recargar, avisar }));
  const margen = screen.getByRole("textbox", { name: /Margen de seguridad/ });
  expect((margen as HTMLInputElement).value).toBe("15");
  fireEvent.change(margen, { target: { value: "150" } });
  fireEvent.click(screen.getByRole("button", { name: "Guardar parámetros" }));
  expect(avisar).toHaveBeenCalledWith("El margen debe estar entre 0% y 100%.", "error");
  fireEvent.change(margen, { target: { value: "20" } });
  fireEvent.change(screen.getByRole("textbox", { name: /Regularización/ }), { target: { value: "2,5" } });
  fireEvent.click(screen.getByRole("checkbox", { name: "Incluir datos simulados" }));
  fireEvent.click(screen.getByRole("button", { name: "Guardar parámetros" }));
  await waitFor(() => expect(api.config).toHaveBeenCalledWith({}, { margenSeguridad: 0.2, lambda: 2.5, incluirSimulado: true }));
});

it("registra un conteo físico con la revisión de stock que leyó", async () => {
  render(createElement(DatosIa, { panel, recargar, avisar }));
  const formConteo = screen.getByRole("button", { name: "Registrar conteo" }).closest("form")!;
  elegir("Insumo", "Detergente (L)", formConteo);
  expect(within(formConteo).getByText("Stock en el sistema: 80 L")).toBeTruthy();
  fireEvent.change(within(formConteo).getByPlaceholderText("Ej: 82,5"), { target: { value: "61,5" } });
  fireEvent.click(within(formConteo).getByRole("button", { name: "Registrar conteo" }));
  await waitFor(() => expect(api.conteo).toHaveBeenCalledWith({}, expect.objectContaining({ insumoId: DET, cantidad: 61.5, revisionStock: 3 })));
  expect(avisar).toHaveBeenCalledWith(expect.stringContaining("el stock quedó en 61,5 L"), "success");
});

it("registra una compra con su referencia", async () => {
  render(createElement(DatosIa, { panel, recargar, avisar }));
  const formCompra = screen.getByRole("button", { name: "Registrar compra" }).closest("form")!;
  fireEvent.click(within(formCompra).getByRole("button", { name: "Registrar compra" }));
  expect(avisar).toHaveBeenCalledWith("Selecciona el insumo comprado.", "error");
  elegir("Insumo", "Cloro (L)", formCompra);
  fireEvent.change(within(formCompra).getByPlaceholderText("Ej: 40"), { target: { value: "25" } });
  fireEvent.change(within(formCompra).getByPlaceholderText(/factura/), { target: { value: "Factura 991" } });
  fireEvent.click(within(formCompra).getByRole("button", { name: "Registrar compra" }));
  await waitFor(() => expect(api.entrada).toHaveBeenCalledWith({}, { insumoId: CLORO, cantidad: 25, motivo: "Compra: Factura 991" }));
});

const subir = (texto: string) => {
  const entrada = document.querySelector('input[type="file"]') as HTMLInputElement;
  fireEvent.change(entrada, { target: { files: [new File([texto], "datos.csv", { type: "text/csv" })] } });
};

it("muestra la vista previa del CSV y no permite importar si hay errores", async () => {
  render(createElement(DatosIa, { panel, recargar, avisar }));
  subir("insumo;cantidad;fecha\nCloro;5;2026-10-01\nJabón;1;2026-10-02");
  expect(await screen.findByText("1 filas válidas")).toBeTruthy();
  expect(screen.getByText(/Jabón/).textContent).toContain("no existe");
  expect(screen.getByRole("button", { name: "Importar 1 filas" }).hasAttribute("disabled")).toBe(true);
});

it("importa el CSV con el token de la sesión y muestra los errores que devuelva el servidor", async () => {
  const fetch = vi.fn()
    .mockResolvedValueOnce({ ok: false, json: async () => ({ error: "Algunas filas ya estaban registradas.", errores: [{ linea: 2, mensaje: "Ya estaba registrada (Cloro)." }] }) })
    .mockResolvedValueOnce({ ok: true, json: async () => ({ guardadas: 1 }) });
  vi.stubGlobal("fetch", fetch);
  render(createElement(DatosIa, { panel, recargar, avisar }));
  fireEvent.click(screen.getByRole("radio", { name: "Compras" }));
  subir("insumo;cantidad;fecha\nCloro;5;2026-10-01");
  fireEvent.click(await screen.findByRole("button", { name: "Importar 1 filas" }));
  await waitFor(() => expect(screen.getByText(/Ya estaba registrada/)).toBeTruthy());
  const [url, opciones] = fetch.mock.calls[0];
  expect(url).toBe("/api/ia/importar");
  expect(opciones.headers.Authorization).toBe("Bearer token-admin");
  expect(JSON.parse(opciones.body)).toMatchObject({ tipo: "compras" });
  expect(avisar).toHaveBeenCalledWith("Algunas filas ya estaban registradas.", "error");

  subir("insumo;cantidad;fecha\nCloro;6;2026-10-03");
  fireEvent.click(await screen.findByRole("button", { name: "Importar 1 filas" }));
  await waitFor(() => expect(avisar).toHaveBeenCalledWith("Se importaron 1 compras.", "success"));
  expect(recargar).toHaveBeenCalled();
});
