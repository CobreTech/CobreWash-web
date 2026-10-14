import { describe, expect, it } from "vitest";
import {
  EstadoVehiculo,
  SalidaVehiculoEstado,
  type MomentoInspeccion,
} from "@/src/dataconnect-generated";
import { construirResumenFlota } from "./validaciones";
import {
  calcularMinutosEnRuta,
  crearCsvHistorialVehiculos,
  filtrarResumenFlota,
  filtrarSalidasHistorial,
  formatearDuracionRuta,
  mapearErrorVehiculos,
} from "./flota";
import type { SalidaFlota, VehiculoFlota } from "./modelo";

const vehiculosFixture: VehiculoFlota[] = [
  {
    id: "v1",
    patente: "HLRT-24",
    marca: "Peugeot",
    modelo: "Partner",
    anio: 2022,
    descripcion: "Furgón reparto norte",
    activo: true,
    creadoEn: "2026-10-10T12:00:00Z",
  },
  {
    id: "v2",
    patente: "KLPW-88",
    marca: "Hyundai",
    modelo: "H-100",
    anio: 2021,
    descripcion: "Camioneta hoteles",
    activo: false,
    creadoEn: "2026-10-10T12:00:00Z",
  },
];

const salidasFixture: SalidaFlota[] = [
  {
    id: "s1",
    estado: SalidaVehiculoEstado.EN_SERVICIO,
    fechaSalida: "2026-10-15T12:00:00Z",
    fechaRetorno: null,
    observaciones: "Ruta Hotelera Calama",
    creadoEn: "2026-10-15T12:00:00Z",
    vehiculo: {
      id: "v1",
      patente: "HLRT-24",
      marca: "Peugeot",
      modelo: "Partner",
      anio: 2022,
      activo: true,
    },
    repartidor: {
      id: "u1",
      rut: "12345678-9",
      nombre: "Carlos",
      apellido: "Rojas",
      email: "carlos@elcobre.cl",
      telefono: "+56911111111",
      rol: { nombre: "operario" },
    },
    inspecciones: [
      {
        id: "i1",
        momento: "ANTES" as MomentoInspeccion,
        estadoVehiculo: EstadoVehiculo.APTO,
        kilometraje: 42150,
        observaciones: "Sin abolladuras",
        registradoEn: "2026-10-15T12:00:00Z",
        fotos: [
          {
            id: "f1",
            rutaStorage: "vehiculos/HLRT-24/salida-1.jpg",
            descripcion: "Frontal",
            orden: 1,
            creadoEn: "2026-10-15T12:00:00Z",
          },
        ],
      },
    ],
  },
];

describe("resumen, filtros y utilidades de flota", () => {
  it("calcula KPIs, kilometraje actual y filtra por patente, conductor o estado", () => {
    const { resumen, kpis } = construirResumenFlota(vehiculosFixture, salidasFixture);
    expect(kpis).toEqual({
      total: 2,
      disponibles: 0,
      enRuta: 1,
      inactivos: 1,
    });
    expect(resumen[0].kilometrajeActual).toBe(42150);

    expect(filtrarResumenFlota(resumen, "carlos", "Todos")).toHaveLength(1);
    expect(filtrarResumenFlota(resumen, "hyundai", "Inactivo")).toHaveLength(1);
    expect(filtrarResumenFlota(resumen, "", "Disponible")).toHaveLength(0);
  });

  it("calcula duración en ruta, filtra historial y protege fórmulas en CSV", () => {
    const min = calcularMinutosEnRuta(
      "2026-10-15T12:00:00Z",
      Date.parse("2026-10-15T14:30:00Z"),
    );
    expect(min).toBe(150);
    expect(formatearDuracionRuta(min)).toBe("2 h 30 min");

    const filtradas = filtrarSalidasHistorial(salidasFixture, {
      vehiculoId: "v1",
      repartidorId: "u1",
      estado: "TODOS",
      desde: "2026-10-15",
      hasta: "2026-10-15",
    });
    expect(filtradas).toHaveLength(1);

    const csv = crearCsvHistorialVehiculos(salidasFixture);
    expect(csv).toContain("HLRT-24");
    expect(csv).toContain("Carlos Rojas");
    expect(csv).toContain("42150");
  });

  it("traduce errores de Data Connect a mensajes claros en español", () => {
    expect(mapearErrorVehiculos(new Error("unique constraint patente"))).toMatch(
      /Ya existe un vehículo/,
    );
    expect(
      mapearErrorVehiculos(new Error("El kilometraje de retorno no puede ser menor")),
    ).toMatch(/kilometraje de retorno/);
  });
});
