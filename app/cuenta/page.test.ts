// @vitest-environment jsdom
import { createElement } from "react";
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
  mocks.perfil.mockReturnValue({ loading: false, usuario: { id: "cliente", nombre: "Ana", email: "ana@example.test", activo: true, rol: { nombre: "cliente" }, clientes_on_usuario: [{ tipoCliente: "HOTEL" }] } });
  mocks.pedidos.mockReturnValue({ pedidos: [], total: 0, cargando: false, error: "", actualizar: mocks.actualizar });
  mocks.vincular.mockResolvedValue(undefined);
});
afterEach(cleanup);

it("muestra vacío real, vincula y refresca; filtra desde la primera página", async () => {
  render(createElement(CuentaPage));
  expect(screen.getByText(/Todavía no tienes pedidos/)).toBeTruthy();
  expect(screen.getByText("Cliente · Empresa")).toBeTruthy();
  fireEvent.change(screen.getByLabelText("Número de comanda"), { target: { value: "14r3" } });
  await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Vincular pedido" })); });
  expect(mocks.vincular).toHaveBeenCalledWith("14r3");
  expect(mocks.actualizar).toHaveBeenCalled();
  expect(screen.getByRole("status").textContent).toMatch(/vinculada/);
  fireEvent.change(screen.getByLabelText("Filtrar por estado"), { target: { value: "ENTREGADA" } });
  expect(mocks.pedidos).toHaveBeenLastCalledWith("cliente", "ENTREGADA", 0);
});

it("presenta prendas, servicio y montos persistidos, sin pedidos de demostración", () => {
  mocks.pedidos.mockReturnValue({ pedidos: [{
    id: "real", numeroComanda: "ELCOBRE-real", estado: "FINALIZADA", valorTotal: 4500,
    fechaRecepcion: "2026-10-23T12:00:00Z", actualizadoEn: "2026-10-23T13:00:00Z",
    comandaDetalles_on_comanda: [{ id: "linea", cantidad: 3, subtotal: 4500, precioUnitario: 1500, tipoPrenda: { nombre: "Camisa real" }, tipoServicio: { nombre: "Lavado real" } }],
    comandaEtapas_on_comanda: [],
  }], total: 1, cargando: false, error: "", actualizar: mocks.actualizar });
  render(createElement(CuentaPage));
  expect(screen.getByText("ELCOBRE-real")).toBeTruthy();
  expect(screen.getByText("Camisa real")).toBeTruthy();
  expect(screen.getByText("Lavado real")).toBeTruthy();
  expect(screen.getAllByText(/4.500/).length).toBeGreaterThan(0);
  expect(screen.getByText("Listo para retirar", { selector: "span" })).toBeTruthy();
});

it("redirige a acceso sin consultar comandas cuando no existe sesión", async () => {
  mocks.perfil.mockReturnValue({ usuario: null, loading: false });
  render(createElement(CuentaPage));
  await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith("/?login=1"));
  expect(mocks.pedidos).toHaveBeenLastCalledWith(null, null, 0);
});
