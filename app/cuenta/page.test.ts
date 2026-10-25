// @vitest-environment jsdom
import { createElement } from "react";
import { writeFileSync } from "node:fs";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ perfil: vi.fn(), pedidos: vi.fn(), vincular: vi.fn(), actualizar: vi.fn(), replace: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: mocks.replace }) }));
vi.mock("@/lib/firebase/client", () => ({ auth: {} }));
vi.mock("@/lib/firebase/useUsuarioActual", () => ({ useUsuarioActual: mocks.perfil }));
vi.mock("@/lib/portal/usePedidosCliente", () => ({ usePedidosCliente: mocks.pedidos }));
vi.mock("@/lib/portal/consultar", () => ({ TAMANO_PAGINA: 10, vincularPedido: mocks.vincular }));
import CuentaPage from "./page";
beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("NEXT_PUBLIC_SEGUIMIENTO_BASE_URL", "https://lavanderia-elcobre.vercel.app");
  mocks.perfil.mockReturnValue({ loading: false, usuario: { id: "cliente", nombre: "Ana", email: "ana@example.test", activo: true, rol: { nombre: "cliente" }, clientes_on_usuario: [{ tipoCliente: "HOTEL" }] } });
  mocks.pedidos.mockReturnValue({ pedidos: [], total: 0, cargando: false, error: "", actualizar: mocks.actualizar });
  mocks.vincular.mockResolvedValue(undefined);
});
afterEach(() => { cleanup(); vi.unstubAllEnvs(); });

it("muestra vacío real, vincula y refresca; filtra desde la primera página", async () => {
  render(createElement(CuentaPage));
  expect(screen.getByText(/Todavía no tienes pedidos/)).toBeTruthy();
  expect(screen.getByText("Cliente · Empresa")).toBeTruthy();
  fireEvent.change(screen.getByLabelText("Número de comanda"), { target: { value: "14r3" } });
  await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Vincular pedido" })); });
  expect(mocks.vincular).toHaveBeenCalledWith("14r3");
  expect(mocks.actualizar).toHaveBeenCalled();
  expect(screen.getByRole("status").textContent).toMatch(/vinculada/);
  fireEvent.click(screen.getByRole("button", { name: "Filtrar por estado" }));
  fireEvent.click(screen.getByRole("button", { name: "Entregado" }));
  expect(mocks.pedidos).toHaveBeenLastCalledWith("cliente", "ENTREGADA", 0, "todos");
});

it("presenta prendas, servicio y montos persistidos, sin pedidos de demostración", () => {
  mocks.pedidos.mockReturnValue({ pedidos: [{
    id: "real", codigoQr: "12345678-1234-4234-8234-123456789abc", numeroComanda: "ELCOBRE-real", estado: "FINALIZADA", valorTotal: 4500,
    fechaRecepcion: "2026-10-23T12:00:00Z", actualizadoEn: "2026-10-23T13:00:00Z",
    comandaDetalles_on_comanda: [{ id: "linea", cantidad: 3, subtotal: 4500, precioUnitario: 1500, tipoPrenda: { nombre: "Camisa real" }, tipoServicio: { nombre: "Lavado real" } }],
    comandaEtapas_on_comanda: [],
  }], total: 1, cargando: false, error: "", actualizar: mocks.actualizar });
  const { container } = render(createElement(CuentaPage));
  if (process.env.COBRE_EXPORT_PREVIEW === "1") writeFileSync("scratch/portal-cuenta-preview.html", container.innerHTML);
  expect(screen.getAllByText("ELCOBRE-real").length).toBeGreaterThan(0);
  expect(screen.getByText("Camisa real")).toBeTruthy();
  expect(screen.getAllByText("Lavado real").length).toBeGreaterThan(0);
  expect(screen.getAllByText(/4.500/).length).toBeGreaterThan(0);
  expect(screen.getByText("Listo para retirar", { selector: "span" })).toBeTruthy();
});

it("redirige a acceso sin consultar comandas cuando no existe sesión", async () => {
  mocks.perfil.mockReturnValue({ usuario: null, loading: false });
  render(createElement(CuentaPage));
  await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith("/?login=1"));
  expect(mocks.pedidos).toHaveBeenLastCalledWith(null, null, 0, "todos");
});
it("cambiar entre activos e historial reinicia la página y los filtros incompatibles", () => {
  mocks.pedidos.mockReturnValue({ pedidos: [], total: 25, cargando: false, error: "", actualizar: mocks.actualizar });
  render(createElement(CuentaPage));
  fireEvent.click(screen.getByRole("button", { name: "Siguiente" }));
  expect(mocks.pedidos).toHaveBeenLastCalledWith("cliente", null, 1, "todos");
  fireEvent.click(screen.getByRole("button", { name: "Activos" }));
  expect(mocks.pedidos).toHaveBeenLastCalledWith("cliente", null, 0, "activos");
  fireEvent.click(screen.getByRole("button", { name: "Filtrar por estado" }));
  expect(screen.queryByRole("button", { name: "Entregado" })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "En proceso" }));
  expect(mocks.pedidos).toHaveBeenLastCalledWith("cliente", "EN_PROCESO", 0, "activos");
  fireEvent.click(screen.getByRole("button", { name: "Historial" }));
  expect(mocks.pedidos).toHaveBeenLastCalledWith("cliente", null, 0, "historial");
});
