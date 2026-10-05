import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";

// Solo se ejecuta contra el emulador aislado; nunca escribe en Cloud SQL.
const host = (process.env.FIREBASE_DATA_CONNECT_EMULATOR_HOST ?? "127.0.0.1:9499").replace(/^http:\/\//, "");
assert.match(host, /^(127\.0\.0\.1|localhost):9499$/);
const endpoint = `http://${host}/v1/projects/demo-production/locations/southamerica-west1/services/lavanderia-el-cobre:executeGraphql`;
const mutations = await readFile("dataconnect/example/avisos-mutations.gql", "utf8");
const queries = await readFile("dataconnect/example/avisos-queries.gql", "utf8");
const roles = {
  admin: "00000000-0000-4000-8000-000000000001",
  recepcionista: "00000000-0000-4000-8000-000000000002",
  operario: "00000000-0000-4000-8000-000000000003",
  cliente: "00000000-0000-4000-8000-000000000004",
};
let count = 0;

async function execute(query, operationName, variables = {}, user = undefined) {
  const impersonate = user === null ? { unauthenticated: true }
    : user ? { authClaims: { sub: user, firebase: { sign_in_provider: "password" } } } : undefined;
  const res = await fetch(endpoint, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, operationName, variables, extensions: { impersonate } }),
  });
  const body = await res.json();
  if (!res.ok || body.errors?.length || !body.data) throw new Error(JSON.stringify(body));
  return body.data;
}
async function check(name, fn) {
  await fn(); count++; console.log("OK " + name);
}
const crear = (variables, user = "test-admin") => execute(mutations, "CrearAviso", variables, user);
const listarAdmin = (variables = {}, user = "test-admin") => execute(queries, "GetAvisosAdministracion", variables, user);
const contar = async () => (await listarAdmin()).total[0]._count;

await execute(await readFile("dataconnect/seed_data.gql", "utf8"), "SeedProduccion");
await execute("mutation LimpiarAvisos { aviso_deleteMany(all: true) }", "LimpiarAvisos");

await check("administración publica para todos, operarios y recepción con autor y fecha del servidor", async () => {
  for (const rol of [null, "operario", "recepcionista"]) {
    await crear({ titulo: rol ?? "General", contenido: "Mensaje\npara el equipo", rolDestinatarioId: rol ? roles[rol] : null });
  }
  const data = await listarAdmin();
  assert.equal(data.total[0]._count, 3);
  assert.equal(data.avisos.length, 3);
  assert.deepEqual(new Set(data.avisos.map(a => a.rolDestinatario?.nombre ?? null)), new Set([null, "operario", "recepcionista"]));
  assert(data.avisos.every(a => a.autor.nombre === "Admin" && Number.isFinite(Date.parse(a.fechaPublicacion))));
  assert(data.avisos.every(a => a.contenido === "Mensaje\npara el equipo"));
  assert.deepEqual(data.avisos.map(a => a.fechaPublicacion), data.avisos.map(a => a.fechaPublicacion).sort().reverse());
});

await check("solo un administrador activo con perfil puede crear y consultar todos los avisos", async () => {
  const antes = await contar();
  for (const user of [null, "test-operario", "test-recepcion", "test-cliente", "test-inactivo", "sin-perfil"]) {
    await assert.rejects(crear({ titulo: "No permitido", contenido: "Mensaje" }, user), `Publicación indebida: ${user}`);
    await assert.rejects(listarAdmin({}, user), `Consulta administrativa indebida: ${user}`);
  }
  assert.equal(await contar(), antes);
});

await check("rechaza campos vacíos, extensos y roles ajenos sin guardar avisos", async () => {
  const antes = await contar();
  for (const variables of [
    { titulo: "", contenido: "Mensaje" },
    { titulo: " \n\t ", contenido: "Mensaje" },
    { titulo: "Aviso", contenido: " \n\t " },
    { titulo: "x".repeat(121), contenido: "Mensaje" },
    { titulo: "Aviso", contenido: "x".repeat(1001) },
    { titulo: "Aviso", contenido: "Mensaje", rolDestinatarioId: roles.admin },
    { titulo: "Aviso", contenido: "Mensaje", rolDestinatarioId: roles.cliente },
    { titulo: "Aviso", contenido: "Mensaje", rolDestinatarioId: randomUUID() },
  ]) await assert.rejects(crear(variables));
  assert.equal(await contar(), antes);
});

await check("acepta los límites y pagina sin duplicar avisos", async () => {
  await crear({ titulo: "x".repeat(120), contenido: "x".repeat(1000) });
  const primero = await listarAdmin({ limit: 2, offset: 0 });
  const segundo = await listarAdmin({ limit: 2, offset: 2 });
  assert.equal(primero.total[0]._count, 4);
  assert.equal(new Set([...primero.avisos, ...segundo.avisos].map(a => a.id)).size, 4);
});

console.log(`${count} verificaciones de avisos completadas.`);
