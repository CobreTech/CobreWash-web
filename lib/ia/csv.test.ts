import { describe, expect, it } from "vitest";
import { leerCantidad, leerCsv, leerFecha, MAXIMO_FILAS_CSV, separarLinea } from "./csv";

const insumos = [{ id: "det", nombre: "Detergente Líquido" }, { id: "clo", nombre: "Cloro" }];
const ahora = new Date("2026-11-01T12:00:00Z");

describe("valores del CSV", () => {
  it.each([
    ["12,5", 12.5], ["12.5", 12.5], ["1.234", 1234], ["1.234,75", 1234.75], [" 3 ", 3], ["-2", -2], ["0", 0],
  ])("lee la cantidad %s", (texto, valor) => expect(leerCantidad(texto)).toBe(valor));

  it.each(["", "abc", "1.2.3", "12,5,1", "1e3"])("rechaza la cantidad %j", (texto) => expect(leerCantidad(texto)).toBeNull());

  it("interpreta fechas en hora de Chile y ubica la compra antes del conteo del mismo día", () => {
    expect(leerFecha("2026-10-25", "conteos")).toBe("2026-10-26T02:59:59.000Z");
    expect(leerFecha("25-10-2026", "compras")).toBe("2026-10-25T15:00:00.000Z");
    expect(leerFecha("25/07/2026 08:30", "conteos")).toBe("2026-07-25T12:30:00.000Z");
    expect(leerFecha("2026-07-25T08:30:15", "compras")).toBe("2026-07-25T12:30:15.000Z");
  });

  it.each(["2026-02-30", "2026/10/25", "25-10-26", "2026-10-25 25:00", "2026-10-25 10:61", "ayer"])("rechaza la fecha %j", (texto) => {
    expect(leerFecha(texto, "conteos")).toBeNull();
  });

  it("respeta comillas y comillas escapadas", () => {
    expect(separarLinea('"Cloro; concentrado";"1,5";"2026-10-01"', ";")).toEqual(["Cloro; concentrado", "1,5", "2026-10-01"]);
    expect(separarLinea('"Dice ""hola""",2', ",")).toEqual(['Dice "hola"', "2"]);
  });
});

describe("lectura y validación del CSV", () => {
  it("lee un CSV de Excel en español con BOM, tildes y columnas en otro orden", () => {
    const texto = "﻿Fecha;Insumo;Cantidad\r\n2026-10-01;detergente liquido;12,5\r\n\r\n02/10/2026;CLORO;3\r\n";
    const r = leerCsv(texto, "conteos", insumos, ahora);
    expect(r.errores).toEqual([]);
    expect(r.filas).toEqual([
      { linea: 2, insumoId: "det", insumoNombre: "Detergente Líquido", cantidad: 12.5, fecha: "2026-10-02T02:59:59.000Z" },
      { linea: 4, insumoId: "clo", insumoNombre: "Cloro", cantidad: 3, fecha: "2026-10-03T02:59:59.000Z" },
    ]);
  });

  it("acepta separadores coma y tabulación", () => {
    expect(leerCsv("insumo,cantidad,fecha\nCloro,2.5,2026-10-01", "compras", insumos, ahora).filas[0].cantidad).toBe(2.5);
    expect(leerCsv("insumo\tcantidad\tfecha\nCloro\t4\t2026-10-01", "compras", insumos, ahora).filas[0].cantidad).toBe(4);
  });

  it("informa archivos vacíos, columnas faltantes y exceso de filas", () => {
    expect(leerCsv(" \n", "conteos", insumos, ahora).errores[0].mensaje).toContain("vacío");
    expect(leerCsv("insumo;cantidad\nCloro;2", "conteos", insumos, ahora).errores[0].mensaje).toContain("Faltan columnas: fecha");
    const muchas = "insumo;cantidad;fecha\n" + "Cloro;1;2026-10-01\n".repeat(MAXIMO_FILAS_CSV + 1);
    expect(leerCsv(muchas, "conteos", insumos, ahora).errores[0].mensaje).toContain("máximo");
  });

  it("valida cada fila y reúne todos los problemas con su número de línea", () => {
    const texto = [
      "insumo;cantidad;fecha",
      "Jabón;1;2026-10-01",
      "Cloro;-1;2026-10-01",
      "Cloro;abc;2026-13-01",
      "Cloro;2;2026-12-01",
      "Cloro;2;2026-10-05",
      "Cloro;3;2026-10-05",
      "Cloro",
    ].join("\n");
    const r = leerCsv(texto, "conteos", insumos, ahora);
    expect(r.filas.map((f) => f.linea)).toEqual([6]);
    expect(r.errores).toEqual([
      { linea: 2, mensaje: 'Insumo "Jabón" no existe o está inactivo.' },
      { linea: 3, mensaje: "La cantidad contada no puede ser negativa." },
      { linea: 4, mensaje: "Cantidad inválida. Fecha inválida (usa AAAA-MM-DD o DD-MM-AAAA, con hora HH:MM opcional)." },
      { linea: 5, mensaje: "La fecha está en el futuro." },
      { linea: 7, mensaje: "Fila repetida: ya hay un conteo de ese insumo en la misma fecha y hora." },
      { linea: 8, mensaje: 'Cantidad inválida. Fecha inválida (usa AAAA-MM-DD o DD-MM-AAAA, con hora HH:MM opcional).' },
    ]);
  });

  it("exige compras mayores que cero y limita cantidades enormes", () => {
    const r = leerCsv("insumo;cantidad;fecha\nCloro;0;2026-10-01\nCloro;99999999999;2026-10-01", "compras", insumos, ahora);
    expect(r.errores.map((e) => e.mensaje)).toEqual(["La cantidad comprada debe ser mayor que cero.", "Cantidad demasiado grande."]);
    const repetida = leerCsv("insumo;cantidad;fecha\nCloro;1;2026-10-01\nCloro;1;2026-10-01", "compras", insumos, ahora);
    expect(repetida.errores[0].mensaje).toContain("una compra");
  });
});
