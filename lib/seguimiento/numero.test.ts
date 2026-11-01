import { afterEach, expect, it, vi } from "vitest";
import { generarNumeroComanda } from "./numero";
afterEach(() => vi.restoreAllMocks());

it("descarta candidatos sin mezcla y bytes que introducen sesgo", () => {
  const valores = [[10, 11, 12, 13], [0, 1, 2, 3], [255, 1, 10, 11], [1, 10, 11, 12]];
  const random = vi.spyOn(crypto, "getRandomValues").mockImplementation(array => {
    (array as Uint8Array).set(valores.shift()!); return array;
  });
  expect(generarNumeroComanda()).toBe("ELCOBRE-1ABC");
  expect(random).toHaveBeenCalledTimes(4);
});

it("genera códigos nuevos en mayúsculas con letras y números en el sufijo", () => {
  for (let i = 0; i < 500; i++) {
    const numero = generarNumeroComanda();
    expect(numero).toMatch(/^ELCOBRE-[A-Z0-9]{4}$/);
    expect(numero.slice(7)).toMatch(/[A-Z]/);
    expect(numero.slice(7)).toMatch(/[0-9]/);
  }
});
