import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";

// Esta suite solo acepta el emulador local de un proyecto demo.
const host = (process.env.FIREBASE_DATA_CONNECT_EMULATOR_HOST ?? "127.0.0.1:9499").replace(/^http:\/\//, "");
assert.match(host, /^(127\.0\.0\.1|localhost):9499$/);
const endpoint = "http://" + host + "/v1/projects/demo-production/locations/southamerica-west1/services/lavanderia-el-cobre:executeGraphql";
const mutation = await readFile("dataconnect/produccion/mutations.gql", "utf8");
const production = await readFile("dataconnect/example/produccion-mutations.gql", "utf8");
const queries = await readFile("dataconnect/example/produccion-queries.gql", "utf8");
const legacy = await readFile("dataconnect/example/mutations.gql", "utf8");
let count = 0;
async function execute(query, operationName, variables = {}, user = undefined) {
  const impersonate = user === null ? { unauthenticated: true } : user ? { authClaims: { sub: user, firebase: { sign_in_provider: "password" } } } : undefined;
  const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query, operationName, variables, extensions: { impersonate } }) });
  const body = await res.json();
  if (!res.ok || body.errors?.length || !body.data) throw new Error(JSON.stringify(body));
  return body.data;
}
async function check(name, fn) { await fn(); count++; console.log("OK " + name); }
const clienteId = "00000000-0000-4000-8000-000000000010";
const detail = { tipoPrendaId: "00000000-0000-4000-8000-000000000011", tipoServicioId: "00000000-0000-4000-8000-000000000012", cantidad: 2, precioUnitario: 1000, subtotal: 2000 };
function variables() { const id = randomUUID(); return { id, numeroComanda: "TEST-" + id.slice(0, 8), clienteId, detalles: [{ ...detail }] }; }
const read = (id) => execute(`query Inspect($id:UUID!) { comanda(id:$id) { id estado valorTotal recepcionistaId
  comandaDetalles_on_comanda { cantidad subtotal }
  comandaEtapas_on_comanda(orderBy:[{ordenEtapa:ASC}]) { etapaId estado nombreEtapa ordenEtapa descripcionEtapa tiempoEstimadoMin fechaInicio fechaCompletado operarioId }
  comandaHistorialEstados_on_comanda { estadoNuevo usuarioId }
} }`, "Inspect", { id }).then((r) => r.comanda);
await execute(await readFile("dataconnect/seed_data.gql", "utf8"), "SeedProduccion");
const good = variables();
await check("creación atómica con cinco etapas pendientes y total calculado", async () => {
  await execute(mutation, "CrearComandaConFlujo", good, "test-recepcion");
  const c = await read(good.id);
  assert.equal(c.estado, "PENDIENTE"); assert.equal(c.valorTotal, 2000);
  assert.equal(c.comandaDetalles_on_comanda.length, 1);
  assert.equal(c.comandaEtapas_on_comanda.length, 5);
  assert.deepEqual(c.comandaEtapas_on_comanda.map((e) => e.nombreEtapa), ["Recepción", "Lavado", "Secado", "Planchado", "Entrega"]);
  assert(c.comandaEtapas_on_comanda.every((e) => e.estado === "PENDIENTE" && !e.fechaInicio && !e.fechaCompletado && !e.operarioId));
  assert.equal(c.comandaHistorialEstados_on_comanda.length, 1);
  assert.equal(c.comandaHistorialEstados_on_comanda[0].usuarioId, "test-recepcion");
});
await check("un reintento no duplica cabecera, prendas ni flujo", async () => {
  await assert.rejects(execute(mutation, "CrearComandaConFlujo", good, "test-recepcion"));
  const c = await read(good.id); assert.equal(c.comandaEtapas_on_comanda.length, 5); assert.equal(c.comandaDetalles_on_comanda.length, 1);
});
for (const user of [null, "test-cliente", "test-operario", "test-inactivo", "sin-perfil"]) {
  await check("rechaza creación por " + user, async () => {
    const v = variables(); await assert.rejects(execute(mutation, "CrearComandaConFlujo", v, user)); assert.equal(await read(v.id), null);
  });
}
for (const [name, detalles] of [
  ["lista vacía", []], ["cantidad negativa", [{ ...detail, cantidad: -2 }]],
  ["subtotal adulterado", [{ ...detail, subtotal: 1 }]],
  ["campos ajenos en input", [{ ...detail, comandaId: good.id }]],
  ["prenda inexistente", [{ ...detail, tipoPrendaId: randomUUID() }]],
]) await check("rollback: " + name, async () => {
  const v = { ...variables(), detalles }; await assert.rejects(execute(mutation, "CrearComandaConFlujo", v, "test-admin")); assert.equal(await read(v.id), null);
});
await check("configuración solo admin y snapshot estable", async () => {
  const config = { id:"00000000-0000-4000-8000-000000000021", nombre:"Lavado industrial", descripcion:"Nueva descripción", tiempoEstimadoMin:45 };
  for (const user of ["test-recepcion", "test-operario", "test-cliente", "test-inactivo", "sin-perfil", null]) await assert.rejects(execute(production, "ConfigurarEtapaProduccion", config, user));
  await execute(production, "ConfigurarEtapaProduccion", config, "test-admin");
  assert.equal((await read(good.id)).comandaEtapas_on_comanda[1].nombreEtapa, "Lavado");
  const v = variables(); await execute(mutation, "CrearComandaConFlujo", v, "test-admin");
  const etapa = (await read(v.id)).comandaEtapas_on_comanda[1]; assert.equal(etapa.nombreEtapa, "Lavado industrial"); assert.equal(etapa.tiempoEstimadoMin, 45);
});
await check("consulta real paginada y permisos", async () => {
  for (const user of ["test-admin","test-recepcion","test-operario"]) {
    const result = await execute(queries, "GetSeguimientoProduccion", {buscar:good.numeroComanda,limit:20,offset:0}, user);
    assert.equal(result.total[0]._count,1); assert.equal(result.comandas[0].id.replaceAll("-", ""),good.id.replaceAll("-", "")); assert.equal(result.comandas[0].comandaEtapas_on_comanda.length,5);
  }
  for (const user of ["test-cliente","test-inactivo","sin-perfil",null]) await assert.rejects(execute(queries,"GetSeguimientoProduccion",{},user));
});
await check("confirmación de guardado acotada al creador", async () => {
  assert.equal((await execute(queries,"GetMiComandaGuardada",{id:good.id},"test-recepcion")).comanda.id.replaceAll("-", ""),good.id.replaceAll("-", ""));
  assert.equal((await execute(queries,"GetMiComandaGuardada",{id:good.id},"test-admin")).comanda,null);
});
await check("compatibilidad del contrato de creación anterior", async () => {
  const v = variables();
  const result = await execute(legacy,"CrearComanda",{numeroComanda:v.numeroComanda,clienteId,valorTotal:0},"test-recepcion");
  assert.equal((await read(result.comanda_insert.id)).comandaEtapas_on_comanda.length,5);
});
await check("asociación de pendientes anteriores sin reiniciar flujos", async () => {
  const v = variables();
  await execute(`mutation Old($id:UUID!,$numero:String!,$clienteId:UUID!) {comanda_insert(data:{id:$id,numeroComanda:$numero,clienteId:$clienteId})}`, "Old", {id:v.id,numero:v.numeroComanda,clienteId});
  await execute(production,"AsociarFlujoComandaPendiente",{id:v.id},"test-recepcion");
  assert.equal((await read(v.id)).comandaEtapas_on_comanda.length,5);
  await assert.rejects(execute(production,"AsociarFlujoComandaPendiente",{id:v.id},"test-admin"));
  assert.equal((await read(v.id)).comandaEtapas_on_comanda.length,5);
});
for (const estado of ["EN_PROCESO","FINALIZADA","ENTREGADA","ANULADA"]) await check("conserva comanda histórica " + estado, async () => {
  const v = variables();
  await execute(`mutation Old($id:UUID!,$numero:String!,$clienteId:UUID!,$estado:ComandaEstado!){comanda_insert(data:{id:$id,numeroComanda:$numero,clienteId:$clienteId,estado:$estado})}`,"Old",{id:v.id,numero:v.numeroComanda,clienteId,estado});
  await assert.rejects(execute(production,"AsociarFlujoComandaPendiente",{id:v.id},"test-admin"));
  const c=await read(v.id); assert.equal(c.estado,estado); assert.equal(c.comandaEtapas_on_comanda.length,0);
});
await check("catálogo incompleto impide creación sin dejar cabecera", async () => {
  await execute(`mutation { etapaProduccion_update(id:"00000000-0000-4000-8000-000000000024",data:{orden:6}) }`);
  const v=variables(); await assert.rejects(execute(mutation,"CrearComandaConFlujo",v,"test-admin")); assert.equal(await read(v.id),null);
});
console.log(count + " escenarios de integración aprobados.");
