import { describe, expect, it } from "vitest";
import { EstadoVehiculo } from "@/src/dataconnect-generated";
import {
  esPatenteValida,
  normalizarPatente,
  validarFormularioVehiculo,
  validarRetornoVehiculo,
  validarSalidaVehiculo,
} from "./validaciones";

describe("validaciones y normalización de patentes de flota", () => {
  it("normaliza patentes chilenas actuales y antiguas con guion en mayúsculas", () => {
    expect(normalizarPatente("hlrt24")).toBe("HLRT-24");
    expect(normalizarPatente("hlrt-24")).toBe("HLRT-24");
    expect(normalizarPatente("ab 1234")).toBe("AB-1234");
    expect(esPatenteValida("HLRT24")).toBe(true);
    expect(esPatenteValida("AB-1234")).toBe(true);
    expect(esPatenteValida("123")).toBe(false);
  });

  it("impide duplicar patentes o desactivar un vehículo con salida activa", () => {
    const existentes = [{ id: "v1", patente: "HLRT-24" }];
    expect(
      validarFormularioVehiculo(
        {
          patente: "hlrt24",
          marca: "Peugeot",
          modelo: "Partner",
          anio: "2022",
          descripcion: "",
          activo: true,
        },
        existentes,
      ),
    ).toMatch(/Ya existe un vehículo/);

    expect(
      validarFormularioVehiculo(
        {
          id: "v1",
          patente: "HLRT-24",
          marca: "Peugeot",
          modelo: "Partner",
          anio: "2022",
          descripcion: "",
          activo: false,
        },
        existentes,
        true,
      ),
    ).toMatch(/salida en curso/);
  });

  it("valida kilometraje no decreciente y bloquea salidas con estado NO_APTO", () => {
    expect(
      validarSalidaVehiculo({
        vehiculoId: "v1",
        repartidorId: "u1",
        kilometraje: "45000",
        kilometrajeMinimo: 45200,
        estadoVehiculo: EstadoVehiculo.APTO,
      }),
    ).toMatch(/no puede ser menor al último registrado/);

    expect(
      validarSalidaVehiculo({
        vehiculoId: "v1",
        repartidorId: "u1",
        kilometraje: "45200",
        kilometrajeMinimo: 45200,
        estadoVehiculo: EstadoVehiculo.NO_APTO,
      }),
    ).toMatch(/NO APTO/);

    expect(
      validarRetornoVehiculo({
        salidaId: "s1",
        kilometrajeSalida: 45200,
        kilometrajeRetorno: "45190",
      }),
    ).toMatch(/no puede ser menor al de salida/);

    expect(
      validarRetornoVehiculo({
        salidaId: "s1",
        kilometrajeSalida: 45200,
        kilometrajeRetorno: "45245.5",
      }),
    ).toBeNull();
  });
});
