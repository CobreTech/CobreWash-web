import { createHmac } from "node:crypto";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { ErrorOrigenSolicitud, origenSolicitud } from "./origen";

const secreto = "s".repeat(32);
const solicitud = (headers: HeadersInit) => new Request("https://web.test/api/contacto", { headers });
const firmar = (ip: string, timestamp = String(Math.floor(Date.now() / 1000))) => ({
  "x-cobre-client-ip": ip,
  "x-cobre-client-timestamp": timestamp,
  "x-cobre-client-signature": createHmac("sha256", secreto).update(`cobre-solicitudes\n${timestamp}\n${ip}`).digest("hex"),
});

beforeEach(() => {
  vi.stubEnv("VERCEL", "");
  vi.stubEnv("CONTACT_PROXY_SECRET", "");
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-11-01T12:00:00Z"));
});
afterEach(() => { vi.unstubAllEnvs(); vi.useRealTimers(); });

it("no acepta encabezados de IP ni de plataforma como prueba de un origen directo", () => {
  expect(() => origenSolicitud(solicitud({ "x-forwarded-for": "198.51.100.1", "x-vercel-forwarded-for": "198.51.100.2", "x-vercel-id": "falso" }))).toThrow(ErrorOrigenSolicitud);
});

it("en Vercel el cliente no puede rotar el contador cambiando X-Forwarded-For", () => {
  vi.stubEnv("VERCEL", "1");
  for (const falso of ["198.51.100.1", "198.51.100.2, 203.0.113.5"]) {
    expect(origenSolicitud(solicitud({ "x-vercel-forwarded-for": "203.0.113.10", "x-forwarded-for": falso }))).toBe("203.0.113.10");
  }
  expect(() => origenSolicitud(solicitud({ "x-forwarded-for": "198.51.100.1" }))).toThrow(ErrorOrigenSolicitud);
});

it.each(["no-es-ip", "198.51.100.1, 198.51.100.2", "198.51.100.1:443", "fe80::1%eth0"])("rechaza la dirección no canónica del proxy: %s", ip => {
  vi.stubEnv("VERCEL", "1");
  expect(() => origenSolicitud(solicitud({ "x-vercel-forwarded-for": ip }))).toThrow(ErrorOrigenSolicitud);
});

it("otros hosts requieren una firma vigente y válida del proxy", () => {
  vi.stubEnv("CONTACT_PROXY_SECRET", secreto);
  const headers = firmar("198.51.100.10");
  expect(origenSolicitud(solicitud(headers))).toBe("198.51.100.10");
  expect(() => origenSolicitud(solicitud({ ...headers, "x-cobre-client-ip": "198.51.100.11" }))).toThrow(ErrorOrigenSolicitud);
  expect(() => origenSolicitud(solicitud({ ...headers, "x-cobre-client-signature": "a".repeat(64) }))).toThrow(ErrorOrigenSolicitud);
  for (const segundos of [-61, 61]) {
    expect(() => origenSolicitud(solicitud(firmar("198.51.100.10", String(Math.floor(Date.now() / 1000) + segundos))))).toThrow(ErrorOrigenSolicitud);
  }
});

it("normaliza IPv6 para no crear contadores distintos con la misma dirección", () => {
  vi.stubEnv("CONTACT_PROXY_SECRET", secreto);
  const ips = ["2001:0DB8:0000:0000:0000:0000:0000:0001", "2001:db8::1"];
  expect(ips.map(ip => origenSolicitud(solicitud(firmar(ip))))).toEqual(["2001:db8::1", "2001:db8::1"]);
});
