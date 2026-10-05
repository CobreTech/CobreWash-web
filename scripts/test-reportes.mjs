import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

// Fixtures y escrituras exclusivamente en el emulador aislado.
const host = (process.env.FIREBASE_DATA_CONNECT_EMULATOR_HOST ?? "127.0.0.1:9499").replace(/^http:\/\//, "");
assert.match(host, /^(127\.0\.0\.1|localhost):9499$/);
const endpoint = `http://${host}/v1/projects/demo-production/locations/southamerica-west1/services/lavanderia-el-cobre:executeGraphql`;
const queries = await readFile("dataconnect/example/reportes-queries.gql", "utf8");
async function execute(query, operationName, variables = {}, user = undefined) {
  const impersonate = user === null ? { unauthenticated: true } : user ? { authClaims: { sub: user, firebase: { sign_in_provider: "password" } } } : undefined;
  const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query, operationName, variables, extensions: { impersonate } }) });
  const body = await res.json();
  if (!res.ok || body.errors?.length || !body.data) throw new Error(JSON.stringify(body));
  return body.data;
}
let count = 0;
async function check(name, fn) { await fn(); count++; console.log("OK " + name); }
const id = (n) => "00000000-0000-4000-8000-" + String(n).padStart(12, "0");
const vars = { desde: "2026-10-01T03:00:00Z", hasta: "2026-11-01T03:00:00Z" };
const consultar = (op, variables = vars, user = "test-admin") => execute(queries, op, variables, user);
await execute(await readFile("dataconnect/seed_data.gql", "utf8"), "SeedProduccion");
await execute(`mutation Fixtures {
  cliente_upsertMany(data: [{id:"${id(100)}",nombre:"Cuenta repetida"}, {id:"${id(101)}",nombre:"Cuenta repetida"}])
  tipoServicio_upsert(data: {id:"${id(102)}", nombre:"Planchado"})
}`, "Fixtures");
for (const [n, cliente, empresa, estado, fecha, cantidad, total] of [
  [200, 100, "Minera", "FINALIZADA", "2026-10-01T03:00:00Z", 4, 4000],
  [201, 100, "Minera", "ENTREGADA", "2026-11-01T02:59:59Z", 3, 3000],
  [202, 101, "Hotel", "PENDIENTE", "2026-10-05T12:00:00Z", 2, 2000],
  [203, 100, "Minera", "ANULADA", "2026-10-05T12:00:00Z", 99, 99000],
  [204, 100, "Minera", "FINALIZADA", "2026-10-01T02:59:59Z", 8, 8000],
  [205, 100, "Minera", "FINALIZADA", "2026-11-01T03:00:00Z", 9, 9000],
]) {
  await execute(`mutation Orden { comanda_upsert(data: {id:"${id(n)}", numeroComanda:"REP-${n}", clienteId:"${id(cliente)}",empresa:"${empresa}",estado:${estado},fechaRecepcion:"${fecha}",valorTotal:${total}})
    comandaDetalle_upsert(data: {id:"${id(n + 1000)}",comandaId:"${id(n)}",tipoPrendaId:"${id(11)}",tipoServicioId:"${id(12)}",cantidad:${cantidad},subtotal:${total}})
  }`, "Orden");
}

await check("agrega por identidad de cliente y empresa, excluye anuladas y respeta ambos límites", async () => {
  const data = await consultar("GetReporteCuentas");
  assert.equal(data.cuentas.length, 2);
  assert.equal(data.cuentas.reduce((s, c) => s + c._count, 0), 3);
  assert.equal(data.cuentas.reduce((s, c) => s + c.valorTotal_sum, 0), 9000);
  assert.equal(data.prendas.reduce((s, c) => s + c.cantidad_sum, 0), 9);
  const detalle = await consultar("GetDetalleReporteCuentas");
  assert.equal(detalle.comandas.length, 3);
  assert.equal(detalle.comandas.reduce((s, c) => s + c.prendas[0].cantidad_sum, 0), 9);
});
await check("filtra por cliente y por empresa en el servidor", async () => {
  assert.equal((await consultar("GetReporteCuentas", { ...vars, clienteId: id(100) })).cuentas[0]._count, 2);
  assert.equal((await consultar("GetReporteCuentas", { ...vars, empresa: "Hotel" })).prendas[0].cantidad_sum, 2);
  assert.equal((await consultar("GetReporteCuentas", { ...vars, clienteId: id(100), empresa: "Hotel" })).cuentas.length, 0);
});
await check("pagina agregaciones y detalle sin duplicar y devuelve empresas únicas", async () => {
  const primera = await consultar("GetReporteCuentas", { ...vars, limit: 1, offset: 0 });
  const segunda = await consultar("GetReporteCuentas", { ...vars, limit: 1, offset: 1 });
  assert.notEqual(primera.cuentas[0].cliente.id, segunda.cuentas[0].cliente.id);
  const a = await consultar("GetDetalleReporteCuentas", { ...vars, limit: 2, offset: 0 });
  const b = await consultar("GetDetalleReporteCuentas", { ...vars, limit: 2, offset: 2 });
  assert.equal(new Set([...a.comandas, ...b.comandas].map((c) => c.id)).size, 3);
  assert.deepEqual((await consultar("GetFiltrosReportes", {})).empresas.map((e) => e.empresa), ["Hotel", "Minera"]);
});
await check("rechaza acceso anónimo, otros roles, cuentas inactivas y perfiles ausentes", async () => {
  for (const user of [null, "test-recepcion", "test-operario", "test-cliente", "test-inactivo", "sin-perfil"]) {
    for (const op of ["GetReporteCuentas", "GetDetalleReporteCuentas", "GetFiltrosReportes"]) await assert.rejects(consultar(op, op === "GetFiltrosReportes" ? {} : vars, user), `${op}/${user}`);
  }
});
await execute(`mutation LineaMixta {
  comandaDetalle_upsert(data: {id:"${id(3000)}",comandaId:"${id(200)}",tipoPrendaId:"${id(11)}",tipoServicioId:"${id(102)}",cantidad:2,subtotal:500,pesoKg:1.5})
}`, "LineaMixta");
await check("agrupa servicios reales de comandas mixtas y cuenta cada comanda una vez por servicio", async () => {
  const data = await consultar("GetReporteServicios");
  assert.equal(data.servicios.length, 2);
  assert.equal(data.servicios.reduce((s, r) => s + r.cantidad_sum, 0), 11);
  assert.equal(data.servicios.find((s) => s.tipoServicio.nombre === "Lavado").comandaId_count, 3);
  assert.equal(data.servicios.find((s) => s.tipoServicio.nombre === "Planchado").subtotal_sum, 500);
  const filtro = { ...vars, servicioId: id(102), empresa: "Minera" };
  const detalle = await consultar("GetDetalleReporteServicios", filtro);
  assert.equal(detalle.detalles.length, 1);
  assert.equal(detalle.detalles[0].cantidad, 2);
  assert.equal(detalle.detalles[0].pesoKg, 1.5);
  assert.equal(detalle.detalles[0].comanda.numeroComanda, "REP-200");
  assert.equal((await consultar("GetReporteServicios", { ...vars, servicioId: id(102), empresa: "Hotel" })).servicios.length, 0);
});
await check("protege las consultas y detalles por servicio", async () => {
  for (const user of [null, "test-recepcion", "test-operario", "test-cliente", "test-inactivo", "sin-perfil"]) {
    for (const op of ["GetReporteServicios", "GetDetalleReporteServicios"]) await assert.rejects(consultar(op, vars, user));
  }
});
for (const [n, estadoNuevo, fecha] of [
  [200, "FINALIZADA", "2026-10-03T03:00:00Z"], [200, "ENTREGADA", "2026-11-05T03:00:00Z"],
  [201, "FINALIZADA", "2026-09-30T03:00:00Z"], [201, "ENTREGADA", "2026-10-02T03:00:00Z"],
  [204, "FINALIZADA", "2026-10-04T03:00:00Z"], [203, "FINALIZADA", "2026-10-05T03:00:00Z"],
  [205, "FINALIZADA", "2026-11-02T03:00:00Z"],
]) await execute(`mutation Cierre { comandaHistorialEstado_insert(data: {comandaId:"${id(n)}",estadoNuevo:${estadoNuevo},fecha:"${fecha}"}) }`, "Cierre");
await check("consulta volumen por cierre, incluye recepciones anteriores y no suma recepción ni entrega dos veces", async () => {
  const data = await consultar("GetReporteVolumen");
  assert.deepEqual(new Set(data.comandas.map((c) => c.numeroComanda)), new Set(["REP-200", "REP-201", "REP-204"]));
  assert.equal(data.comandas.find((c) => c.numeroComanda === "REP-200").prendas.reduce((s, p) => s + p.cantidad_sum, 0), 6);
  assert.equal(Date.parse(data.comandas.find((c) => c.numeroComanda === "REP-201").primerCierre[0].fecha), Date.parse("2026-09-30T03:00:00Z"));
  const procesadas = data.comandas.filter((c) => Date.parse(c.primerCierre[0].fecha) >= Date.parse(vars.desde) && Date.parse(c.primerCierre[0].fecha) < Date.parse(vars.hasta));
  assert.equal(procesadas.reduce((s, c) => s + c.prendas.reduce((total, p) => total + p.cantidad_sum, 0), 0), 14);
  assert.equal(data.comandas.find((c) => c.numeroComanda === "REP-200").prendas.find((p) => p.tipoServicioId.replaceAll("-", "") === id(102).replaceAll("-", "")).cantidad_sum, 2);
  assert.equal((await consultar("GetReporteVolumen", { ...vars, empresa: "Hotel" })).comandas.length, 0);
});
await check("solo administración activa puede consultar volumen", async () => {
  for (const user of [null, "test-recepcion", "test-operario", "test-cliente", "test-inactivo", "sin-perfil"]) await assert.rejects(consultar("GetReporteVolumen", vars, user));
});
console.log(`${count} verificaciones de reportes completadas.`);
