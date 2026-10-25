import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
const host = (process.env.FIREBASE_DATA_CONNECT_EMULATOR_HOST || "127.0.0.1:9499").replace(/^http:\/\//, "");
assert.match(host, /^(127\.0\.0\.1|localhost):9499$/);
const endpoint = `http://${host}/v1/projects/demo-production/locations/southamerica-west1/services/lavanderia-el-cobre:executeGraphql`;
async function execute(query, operationName, variables = {}, user) {
  const impersonate = user === null ? { unauthenticated: true } : user ? { authClaims: { sub: user, email: `${user}@example.test`, email_verified: true } } : undefined;
  const r = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query, operationName, variables, extensions: { impersonate } }) });
  const b = await r.json(); if (!r.ok || b.errors?.length) throw new Error(JSON.stringify(b)); return b.data;
}
let count = 0; async function check(name, fn) { await fn(); count++; console.log("OK " + name); }
await execute(await readFile("dataconnect/seed_data.gql", "utf8"), "SeedProduccion");
const ops = await readFile("dataconnect/example/privacidad.gql", "utf8");
const contactos = await readFile("dataconnect/example/contacto.gql", "utf8");
const registro = await readFile("dataconnect/example/mutations.gql", "utf8");
const id = randomUUID(), limiteId = `derechos-prueba-${randomUUID()}`;
await execute(contactos, "PrepararLimiteContacto", { id: limiteId });
const entrada = { id, limiteId, secretoHash: "a".repeat(64), contenidoHash: "b".repeat(64), nombre: "Titular de prueba", email: "titular@example.test", derecho: "BLOQUEO", detalle: "Suspender el tratamiento indicado", versionAviso: "2026-10-25", objetivoAtencion: "2026-10-26T12:00:00Z" };
await check("solo el servidor recibe derechos y conserva el comprobante", async () => {
  for (const user of [null, "test-admin", "test-cliente", "test-operario"]) await assert.rejects(execute(ops, "RecibirSolicitudDerecho", entrada, user));
  await execute(ops, "RecibirSolicitudDerecho", entrada);
  const d = await execute(ops, "GetComprobanteDerecho", { id }); assert.equal(d.solicitudDerecho.estado, "RECIBIDA");
  for (const user of [null, "test-admin", "test-cliente"]) await assert.rejects(execute(ops, "GetComprobanteDerecho", { id }, user));
});
await check("solo un administrador activo supera la autorización de gestión", async () => {
  await execute(ops, "AutorizarGestionPrivacidad", {}, "test-admin");
  for (const user of [null, "test-inactivo", "test-operario", "test-recepcion", "test-cliente", "sin-perfil"]) await assert.rejects(execute(ops, "AutorizarGestionPrivacidad", {}, user));
});
await check("la bandeja y sus actuaciones nunca se exponen directamente a clientes ni personal", async () => {
  for (const user of [null, "test-admin", "test-recepcion", "test-cliente"]) await assert.rejects(execute(ops, "ListarSolicitudesDerecho", {}, user));
  const d = await execute(ops, "ListarSolicitudesDerecho"); assert.equal(d.solicitudDerechos.length, 1);
});
const gestion = { id, revision: 0, actorId: "test-admin", estado: "RESPONDIDA", nota: "Respuesta fundada", evidenciaIdentidad: "", evidenciaEnvio: "" };
await check("no se cierra sin evidencia y no se suplanta a un actor sin privilegios", async () => {
  await assert.rejects(execute(ops, "GestionarSolicitudDerecho", gestion));
  await assert.rejects(execute(ops, "GestionarSolicitudDerecho", { ...gestion, estado: "EN_GESTION", actorId: "test-recepcion" }));
  await execute(ops, "GestionarSolicitudDerecho", { ...gestion, estado: "VERIFICACION", nota: "Se coordinó verificación proporcional" });
});
await check("la revisión evita sobrescribir una actuación concurrente", async () => {
  await assert.rejects(execute(ops, "GestionarSolicitudDerecho", { ...gestion, estado: "EN_GESTION" }));
  const args = { ...gestion, revision: 1, estado: "EN_GESTION" };
  const r = await Promise.allSettled([execute(ops, "GestionarSolicitudDerecho", args), execute(ops, "GestionarSolicitudDerecho", args)]);
  assert.equal(r.filter(x => x.status === "fulfilled").length, 1);
});
await check("se preserva la trazabilidad y el cierre es definitivo", async () => {
  const args = { ...gestion, revision: 2, evidenciaIdentidad: "Identidad verificada por canal acordado", evidenciaEnvio: "Respuesta enviada, referencia de prueba" };
  await execute(ops, "GestionarSolicitudDerecho", args);
  await assert.rejects(execute(ops, "GestionarSolicitudDerecho", { ...args, revision: 3 }));
  const d = await execute(ops, "ListarSolicitudesDerecho", { estados: ["RESPONDIDA"] });
  assert.equal(d.solicitudDerechos[0].actuacionDerechos_on_solicitud.length, 3);
  assert.equal(d.solicitudDerechos[0].estado, "RESPONDIDA");
});
await check("el alta pública exige y guarda versión y fecha de autorización", async () => {
  const vars = { versionPrivacidad: "obsoleta", rut: "12.345.678-5", nombre: "Nuevo", apellido: "Cliente", email: "nuevo@example.test", tipoCliente: "PARTICULAR" };
  await assert.rejects(execute(registro, "RegistrarseComoCliente", vars, "nuevo-privacidad"));
  await execute(registro, "RegistrarseComoCliente", { ...vars, versionPrivacidad: "2026-10-25" }, "nuevo-privacidad");
  const d = await execute('query Verificar { usuario(id:"nuevo-privacidad") { versionPrivacidad autorizadaEn } }', "Verificar");
  assert.equal(d.usuario.versionPrivacidad, "2026-10-25"); assert(d.usuario.autorizadaEn);
});
await check("la limpieza técnica no elimina solicitudes y no está disponible a clientes", async () => {
  const antesDe = "2001-01-01T00:00:00Z", viejo = `vencido-${randomUUID()}`;
  await execute('mutation Contador($id:String!){limiteContacto_insert(data:{id:$id,creadoEn:"2000-01-01T00:00:00Z"})}', "Contador", { id: viejo });
  const previo = await execute(ops, "ContarLimitesContactoVencidos", { antesDe }); assert.equal(previo.limiteContactos[0]._count, 1);
  await assert.rejects(execute(ops, "PurgarLimitesContacto", { antesDe }, "test-admin"));
  await execute(ops, "PurgarLimitesContacto", { antesDe });
  const posterior = await execute(ops, "ContarLimitesContactoVencidos", { antesDe }); assert.equal(posterior.limiteContactos[0]?._count || 0, 0);
  const vigente = await execute(contactos, "GetLimiteContacto", { id: limiteId }); assert(vigente.limiteContacto);
  const d = await execute(ops, "GetComprobanteDerecho", { id }); assert(d.solicitudDerecho);
});
await check("cotización sin teléfono registra autorización sin atribuirla a datos antiguos", async () => {
  const cotizacion = randomUUID();
  await execute(contactos, "RegistrarSolicitudContacto", { id: cotizacion, nombre: "Cotización", email: "cotizacion@example.test", telefono: "", servicio: "otro", mensaje: "Consulta", hashContenido: "f".repeat(64), limiteId, versionPrivacidad: "2026-10-25" });
  const d = await execute('query Revisar($id:UUID!){solicitudContacto(id:$id){telefono versionPrivacidad autorizadaEn} usuario(id:"test-cliente"){versionPrivacidad autorizadaEn}}', "Revisar", { id: cotizacion });
  assert.equal(d.solicitudContacto.telefono, ""); assert.equal(d.solicitudContacto.versionPrivacidad, "2026-10-25"); assert(d.solicitudContacto.autorizadaEn);
  assert.equal(d.usuario.versionPrivacidad, null); assert.equal(d.usuario.autorizadaEn, null);
});
console.log(`Privacidad: ${count} escenarios aprobados.`);
