// @vitest-environment jsdom
import { createElement } from "react";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  acceso: true,
  getFlotaVehiculos: vi.fn(),
  registrarVehiculoFlota: vi.fn(),
  editarVehiculoFlota: vi.fn(),
  registrarSalidaFlota: vi.fn(),
  registrarRetornoFlota: vi.fn(),
  adjuntarFotoInspeccionFlota: vi.fn(),
}));

vi.mock("@/components/intranet/useRoleGuard", () => ({
  useRoleGuard: () => mocks.acceso,
}));

vi.mock("@/components/intranet/AuthGuard", () => ({
  useUsuarioActualContext: () => ({ id: "u-admin", nombre: "Admin" }),
}));

vi.mock("@/lib/firebase/client", () => ({
  dataConnect: {},
  storage: {},
}));

vi.mock("firebase/storage", () => ({
  ref: (_storage: unknown, path: string) => ({ fullPath: path }),
  uploadBytes: vi.fn().mockResolvedValue({}),
  getDownloadURL: vi
    .fn()
    .mockResolvedValue("https://storage.elcobre.cl/evidencia.jpg"),
}));

vi.mock("firebase/data-connect", () => ({
  QueryFetchPolicy: { SERVER_ONLY: "SERVER_ONLY" },
  subscribe: (_ref: unknown, onNext: (res: { data: unknown }) => void) => {
    void mocks.getFlotaVehiculos().then((res: { data: unknown }) => onNext(res));
    return () => {};
  },
}));

vi.mock("@/src/dataconnect-generated", () => ({
  EstadoVehiculo: {
    APTO: "APTO",
    CON_OBSERVACIONES: "CON_OBSERVACIONES",
    NO_APTO: "NO_APTO",
  },
  SalidaVehiculoEstado: {
    PROGRAMADA: "PROGRAMADA",
    EN_SERVICIO: "EN_SERVICIO",
    FINALIZADA: "FINALIZADA",
    CANCELADA: "CANCELADA",
  },
  getFlotaVehiculosRef: () => ({}),
  getFlotaVehiculos: (...args: unknown[]) => mocks.getFlotaVehiculos(...args),
  registrarVehiculoFlota: (...args: unknown[]) =>
    mocks.registrarVehiculoFlota(...args),
  editarVehiculoFlota: (...args: unknown[]) =>
    mocks.editarVehiculoFlota(...args),
  registrarSalidaFlota: (...args: unknown[]) =>
    mocks.registrarSalidaFlota(...args),
  registrarRetornoFlota: (...args: unknown[]) =>
    mocks.registrarRetornoFlota(...args),
  adjuntarFotoInspeccionFlota: (...args: unknown[]) =>
    mocks.adjuntarFotoInspeccionFlota(...args),
}));

import VehiculosPage from "./page";

const fixtureData = {
  vehiculos: [
    {
      id: "v-disponible",
      patente: "HLRT-24",
      marca: "Peugeot",
      modelo: "Partner",
      anio: 2023,
      descripcion: "Furgón ruta norte",
      activo: true,
      creadoEn: "2026-10-10T12:00:00Z",
    },
    {
      id: "v-ruta",
      patente: "KLPW-88",
      marca: "Hyundai",
      modelo: "H-100",
      anio: 2022,
      descripcion: "Camioneta hoteles",
      activo: true,
      creadoEn: "2026-10-10T12:00:00Z",
    },
  ],
  conductores: [
    {
      id: "u-repartidor",
      rut: "12345678-9",
      nombre: "Carlos",
      apellido: "Rojas",
      email: "carlos@elcobre.cl",
      telefono: "+56911111111",
      rol: { nombre: "repartidor" },
    },
    {
      id: "u-conductor",
      rut: "98765432-1",
      nombre: "Miguel",
      apellido: "Soto",
      email: "miguel@elcobre.cl",
      telefono: "+56922222222",
      rol: { nombre: "conductor" },
    },
    {
      id: "u-operario-excluido",
      rut: "11223344-5",
      nombre: "Pedro",
      apellido: "Operario",
      email: "pedro@elcobre.cl",
      telefono: "+56933333333",
      rol: { nombre: "operario" },
    },
  ],
  salidas: [
    {
      id: "s-activa",
      estado: "EN_SERVICIO",
      fechaSalida: "2026-10-17T10:00:00Z",
      fechaRetorno: null,
      observaciones: "Reparto Hotel Calama",
      creadoEn: "2026-10-17T10:00:00Z",
      vehiculo: {
        id: "v-ruta",
        patente: "KLPW-88",
        marca: "Hyundai",
        modelo: "H-100",
        anio: 2022,
        activo: true,
      },
      repartidor: {
        id: "u-operario",
        rut: "12345678-9",
        nombre: "Carlos",
        apellido: "Rojas",
        email: "carlos@elcobre.cl",
        telefono: "+56911111111",
        rol: { nombre: "operario" },
      },
      inspecciones: [
        {
          id: "i-antes-1",
          momento: "ANTES",
          estadoVehiculo: "APTO",
          kilometraje: 31000,
          observaciones: "Niveles OK",
          registradoEn: "2026-10-17T10:00:00Z",
          fotos: [
            {
              id: "f-1",
              rutaStorage: "vehiculos/KLPW-88/antes-1.jpg",
              descripcion: "Frontal",
              orden: 1,
              creadoEn: "2026-10-17T10:00:00Z",
            },
          ],
        },
      ],
    },
    {
      id: "s-finalizada",
      estado: "FINALIZADA",
      fechaSalida: "2026-10-16T09:00:00Z",
      fechaRetorno: "2026-10-16T13:30:00Z",
      observaciones: "Ruta completada",
      creadoEn: "2026-10-16T09:00:00Z",
      vehiculo: {
        id: "v-disponible",
        patente: "HLRT-24",
        marca: "Peugeot",
        modelo: "Partner",
        anio: 2023,
        activo: true,
      },
      repartidor: {
        id: "u-operario",
        rut: "12345678-9",
        nombre: "Carlos",
        apellido: "Rojas",
        email: "carlos@elcobre.cl",
        telefono: "+56911111111",
        rol: { nombre: "operario" },
      },
      inspecciones: [
        {
          id: "i-antes-2",
          momento: "ANTES",
          estadoVehiculo: "APTO",
          kilometraje: 12000,
          observaciones: "Sin detalles",
          registradoEn: "2026-10-16T09:00:00Z",
          fotos: [],
        },
        {
          id: "i-despues-2",
          momento: "DESPUES",
          estadoVehiculo: "CON_OBSERVACIONES",
          kilometraje: 12085,
          observaciones: "Polvo en carrocería",
          registradoEn: "2026-10-16T13:30:00Z",
          fotos: [],
        },
      ],
    },
  ],
};

beforeEach(() => {
  mocks.acceso = true;
  mocks.getFlotaVehiculos.mockReset().mockResolvedValue({ data: fixtureData });
  mocks.registrarVehiculoFlota
    .mockReset()
    .mockResolvedValue({ data: { vehiculo_insert: { id: "v-nuevo" } } });
  mocks.editarVehiculoFlota.mockReset().mockResolvedValue({ data: {} });
  mocks.registrarSalidaFlota.mockReset().mockResolvedValue({
    data: {
      salida: { id: "s-nueva" },
      inspeccion: { id: "i-nueva" },
    },
  });
  mocks.registrarRetornoFlota.mockReset().mockResolvedValue({
    data: {
      inspeccion: { id: "i-retorno" },
    },
  });
  mocks.adjuntarFotoInspeccionFlota.mockReset().mockResolvedValue({ data: {} });
});

afterEach(cleanup);

describe("página administrativa de control de vehículos (Sprint 08)", () => {
  it("muestra catálogo de flota, registra un vehículo (RF-VE01) y despacha con foto (RF-VE02)", async () => {
    render(createElement(VehiculosPage));

    await waitFor(() => {
      expect(screen.getByText("HLRT-24")).toBeTruthy();
      expect(screen.getByText("KLPW-88")).toBeTruthy();
    });

    // Abrir modal de alta de vehículo (RF-VE01)
    fireEvent.click(screen.getByRole("button", { name: /Registrar vehículo/i }));
    fireEvent.change(screen.getByLabelText(/Patente/i), {
      target: { value: "bcdf99" },
    });
    fireEvent.change(screen.getByLabelText(/Marca/i), {
      target: { value: "Citroën" },
    });
    fireEvent.change(screen.getByLabelText(/Modelo/i), {
      target: { value: "Berlingo" },
    });
    fireEvent.click(
      screen.getAllByRole("button", { name: /Registrar vehículo/i })[1],
    );

    await waitFor(() => {
      expect(mocks.registrarVehiculoFlota).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          patente: "BCDF-99",
          marca: "Citroën",
          modelo: "Berlingo",
        }),
      );
    });

    // Abrir modal de salida (RF-VE02)
    fireEvent.click(screen.getByRole("button", { name: /Dar salida/i }));
    fireEvent.change(screen.getByLabelText(/Kilometraje de salida/i), {
      target: { value: "12100" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Adjuntar evidencia/i }));
    fireEvent.click(screen.getByRole("button", { name: /Confirmar salida/i }));

    await waitFor(() => {
      expect(mocks.registrarSalidaFlota).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          vehiculoId: "v-disponible",
          kilometraje: 12100,
        }),
      );
      expect(mocks.adjuntarFotoInspeccionFlota).toHaveBeenCalledTimes(1);
    });
  });

  it("registra el regreso de un vehículo en ruta (RF-VE03) y audita el historial con comparativa (RF-VE04)", async () => {
    render(createElement(VehiculosPage));

    await waitFor(() => {
      expect(screen.getByText("KLPW-88")).toBeTruthy();
    });

    // Registrar regreso desde tarjeta o pestaña en ruta (RF-VE03)
    fireEvent.click(screen.getByRole("button", { name: /Registrar regreso/i }));
    fireEvent.change(screen.getByLabelText(/Kilometraje de retorno/i), {
      target: { value: "31055" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Confirmar regreso/i }));

    await waitFor(() => {
      expect(mocks.registrarRetornoFlota).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          salidaId: "s-activa",
          kilometraje: 31055,
        }),
      );
    });

    // Cambiar a la pestaña de Historial e Inspecciones (RF-VE04)
    fireEvent.click(
      screen.getByRole("button", { name: /Historial e Inspecciones/i }),
    );

    await waitFor(() => {
      expect(screen.getByText("+85 km recorridos")).toBeTruthy();
    });

    // Abrir modal de auditoría comparativa ANTES vs DESPUÉS
    fireEvent.click(screen.getAllByRole("button", { name: /Ver inspección/i })[1]);
    expect(screen.getByText(/Ficha de Auditoría de Viaje/i)).toBeTruthy();
    expect(screen.getByText(/Polvo en carrocería/i)).toBeTruthy();
  });
});
