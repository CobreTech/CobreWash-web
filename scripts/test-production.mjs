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
const commandQueries = await readFile("dataconnect/example/queries.gql", "utf8");
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
const etapaIds = [
  "00000000-0000-4000-8000-000000000020",
  "00000000-0000-4000-8000-000000000021",
  "00000000-0000-4000-8000-000000000022",
  "00000000-0000-4000-8000-000000000023",
  "00000000-0000-4000-8000-000000000024",
];
const detail = { tipoPrendaId: "00000000-0000-4000-8000-000000000011", tipoServicioId: "00000000-0000-4000-8000-000000000012", cantidad: 2, precioUnitario: 1000, subtotal: 2000 };
function variables() { const id = randomUUID(); return { id, numeroComanda: "TEST-" + id.slice(0, 8), clienteId, detalles: [{ ...detail }] }; }
const read = (id) => execute(`query Inspect($id:UUID!) { comanda(id:$id) { id estado valorTotal recepcionistaId fechaEntregaReal actualizadoEn empresa proyecto observaciones
  comandaDetalles_on_comanda { cantidad subtotal }
  comandaEtapas_on_comanda(orderBy:[{ordenEtapa:ASC}]) { etapaId estado nombreEtapa ordenEtapa descripcionEtapa tiempoEstimadoMin fechaInicio fechaCompletado operarioId }
  comandaHistorialEstados_on_comanda { estadoNuevo usuarioId }
  comandaNotificacions_on_comanda { mensaje }
} }`, "Inspect", { id }).then((r) => r.comanda);
await execute(await readFile("dataconnect/seed_data.gql", "utf8"), "SeedProduccion");
await check("el catálogo con datos de clientes solo está disponible para personal autorizado", async () => {
  for (const user of ["test-admin", "test-recepcion"]) await execute(commandQueries, "GetCatalogosComanda", {}, user);
  for (const user of [null, "test-cliente", "test-operario", "test-inactivo", "sin-perfil"]) {
    await assert.rejects(execute(commandQueries, "GetCatalogosComanda", {}, user), `Acceso indebido: ${user}`);
  }
});
await check("un usuario autenticado sin perfil no puede crear ni editar datos administrativos", async () => {
  await assert.rejects(execute(legacy, "CrearClienteComanda", { nombre: "No autorizado", tipoCliente: "PARTICULAR" }, "sin-perfil"));
  await assert.rejects(execute(legacy, "CrearTipoPrenda", { nombre: "No autorizada" }, "sin-perfil"));
  await assert.rejects(execute(legacy, "CrearTipoServicio", { nombre: "No autorizado", precioBase: 0 }, "sin-perfil"));
  await assert.rejects(execute(legacy, "ActualizarUsuario", { id: "test-cliente", rolId: "00000000-0000-4000-8000-000000000001", nombre: "Cliente", activo: true }, "sin-perfil"));
});
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
await check("filtro múltiple y contador de comandas activas", async () => {
  const multi = await execute(commandQueries, "GetComandasPaginadas", { limit: 100, offset: 0, estados: ["PENDIENTE", "EN_PROCESO"] }, "test-admin");
  assert(multi.comandas.every((comanda) => ["PENDIENTE", "EN_PROCESO"].includes(comanda.estado)));
  assert.equal(multi.total[0]._count, multi.comandas.length);
  const single = await execute(commandQueries, "GetComandasPaginadas", { limit: 100, offset: 0, estado: "PENDIENTE" }, "test-recepcion");
  assert(single.comandas.every((comanda) => comanda.estado === "PENDIENTE"));
  const contador = await execute(commandQueries, "GetComandasActivasCount", {}, "test-admin");
  assert.equal(contador.pendientes[0]._count + contador.enProceso[0]._count, multi.total[0]._count);
  for (const user of ["test-operario", "test-cliente", "test-inactivo", "sin-perfil", null]) {
    await assert.rejects(execute(commandQueries, "GetComandasActivasCount", {}, user));
    await assert.rejects(execute(commandQueries, "GetComandasPaginadas", {}, user));
    await assert.rejects(execute(commandQueries, "GetComandaDetalle", { id: good.id }, user));
  }
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
await check("avance secuencial autorizado para operario y administración", async () => {
  const v = variables();
  await execute(mutation, "CrearComandaConFlujo", v, "test-recepcion");
  const completar = (orden, user, estadoComanda = orden === 5 ? "ENTREGADA" : orden === 4 ? "FINALIZADA" : "EN_PROCESO") => execute(
    production,
    "CompletarEtapaComanda",
    { comandaId: v.id, etapaId: etapaIds[orden - 1], orden, estadoComanda },
    user,
  );

  await assert.rejects(completar(2, "test-operario"));
  for (const user of ["test-recepcion", "test-cliente", "test-inactivo", "sin-perfil", null]) await assert.rejects(completar(1, user));
  await assert.rejects(completar(1, "test-admin", "ENTREGADA"));

  const inicio = Date.now();
  await completar(1, "test-operario");
  let c = await read(v.id);
  assert.equal(c.estado, "EN_PROCESO");
  assert.deepEqual(c.comandaEtapas_on_comanda.map((e) => e.estado), ["COMPLETADA", "EN_PROCESO", "PENDIENTE", "PENDIENTE", "PENDIENTE"]);
  const primera = c.comandaEtapas_on_comanda[0];
  assert.equal(primera.operarioId, "test-operario");
  assert(Date.parse(primera.fechaCompletado) >= inicio - 1000);
  assert(Date.parse(primera.fechaCompletado) <= Date.now() + 1000);
  assert.equal(c.comandaEtapas_on_comanda[1].fechaInicio, primera.fechaCompletado);
  assert.equal(c.comandaEtapas_on_comanda[1].operarioId, null);
  assert.equal(c.comandaEtapas_on_comanda[1].fechaCompletado, null);
  // El cliente solo envía la transición: autor y hora no son variables aceptadas.
  await assert.rejects(execute(production, "CompletarEtapaComanda", {
    comandaId: v.id, etapaId: etapaIds[1], orden: 2, estadoComanda: "EN_PROCESO",
    operarioId: "test-admin", fechaCompletado: "2000-01-01T00:00:00Z",
  }, "test-operario"));
  await assert.rejects(completar(1, "test-operario"));
  await assert.rejects(completar(3, "test-admin"));

  await completar(2, "test-admin");
  await completar(3, "test-operario");
  await completar(4, "test-admin");
  c = await read(v.id);
  assert.equal(c.estado, "FINALIZADA");
  assert.equal(c.comandaEtapas_on_comanda[4].estado, "EN_PROCESO");
  await completar(5, "test-operario");
  c = await read(v.id);
  assert.equal(c.estado, "ENTREGADA");
  assert(c.comandaEtapas_on_comanda.every((e) => e.estado === "COMPLETADA"));
  assert.deepEqual(c.comandaEtapas_on_comanda.map((e) => e.operarioId), ["test-operario", "test-admin", "test-operario", "test-admin", "test-operario"]);
  assert(c.comandaEtapas_on_comanda.every((e) => Number.isFinite(Date.parse(e.fechaCompletado))));
  assert.equal(c.fechaEntregaReal, c.comandaEtapas_on_comanda[4].fechaCompletado);
  assert.equal(c.comandaHistorialEstados_on_comanda.length, 6);
  assert.equal(c.comandaNotificacions_on_comanda.length, 1);
  assert.deepEqual(c.comandaEtapas_on_comanda[0], primera);
  const detalle = await execute(commandQueries, "GetComandaDetalle", { id: v.id }, "test-recepcion");
  assert.equal(detalle.comanda.comandaEtapas_on_comanda[0].operario.nombre, "Operario");
  assert.equal(detalle.comanda.comandaEtapas_on_comanda[0].fechaCompletado, primera.fechaCompletado);
});
await check("edición atómica preserva prendas y monto si falla una clave foránea", async () => {
  const v = variables();
  await execute(mutation, "CrearComandaConFlujo", v, "test-recepcion");
  const anterior = await read(v.id);
  const cambios = { id: v.id, version: anterior.actualizadoEn, empresa: "Cambio", detalles: [{ ...detail, comandaId: v.id, cantidad: 3, subtotal: 3000 }] };
  await assert.rejects(execute(mutation, "EditarComandaConDetalles", { ...cambios, detalles: [...cambios.detalles, { ...detail, tipoPrendaId: randomUUID() }] }, "test-recepcion"));
  assert.deepEqual(await read(v.id), anterior);
  for (const user of [null, "sin-perfil", "test-inactivo", "test-cliente", "test-operario"]) await assert.rejects(execute(mutation, "EditarComandaConDetalles", cambios, user));
  await execute(mutation, "EditarComandaConDetalles", cambios, "test-recepcion");
  const c = await read(v.id);
  assert.equal(c.valorTotal, 3000);
  assert.equal(c.empresa, "Cambio");
  assert.equal(c.comandaDetalles_on_comanda.length, 1);
  assert.equal(c.comandaDetalles_on_comanda[0].cantidad, 3);
  assert.deepEqual(c.comandaEtapas_on_comanda, anterior.comandaEtapas_on_comanda);
  // Un formulario antiguo no puede sobrescribir la edición confirmada.
  await assert.rejects(execute(mutation, "EditarComandaConDetalles", cambios, "test-admin"));
  assert.deepEqual(await read(v.id), c);
  await execute(production, "CompletarEtapaComanda", { comandaId: v.id, etapaId: etapaIds[0], orden: 1, estadoComanda: "EN_PROCESO" }, "test-operario");
  const iniciada = await read(v.id);
  await assert.rejects(execute(mutation, "EditarComandaConDetalles", { ...cambios, version: iniciada.actualizadoEn }, "test-recepcion"));
  assert.deepEqual(await read(v.id), iniciada);
});
await check("dos editores simultáneos no mezclan las prendas ni pierden cambios confirmados", async () => {
  const v = variables();
  await execute(mutation, "CrearComandaConFlujo", v, "test-recepcion");
  const original = await read(v.id);
  const resultados = await Promise.allSettled([3, 4].map(cantidad => execute(mutation, "EditarComandaConDetalles", {
    id: v.id, version: original.actualizadoEn, detalles: [{ ...detail, comandaId: v.id, cantidad, subtotal: cantidad * 1000 }],
  }, "test-recepcion")));
  assert.equal(resultados.filter(r => r.status === "fulfilled").length, 1);
  const c = await read(v.id);
  const cantidad = resultados[0].status === "fulfilled" ? 3 : 4;
  assert.equal(c.valorTotal, cantidad * 1000);
  assert.equal(c.comandaDetalles_on_comanda.length, 1);
  assert.equal(c.comandaDetalles_on_comanda[0].cantidad, cantidad);
});
await check("entrega desde recepción conserva avances y registra autor, hora e historial", async () => {
  const v = variables();
  await execute(mutation, "CrearComandaConFlujo", v, "test-recepcion");
  for (let orden = 1; orden <= 4; orden++) await execute(production, "CompletarEtapaComanda", {
    comandaId: v.id, etapaId: etapaIds[orden - 1], orden,
    estadoComanda: orden === 4 ? "FINALIZADA" : "EN_PROCESO",
  }, "test-operario");
  const anterior = await read(v.id);
  const seguimiento = await execute(queries, "GetSeguimientoProduccion", { buscar: v.numeroComanda }, "test-operario");
  assert.equal(seguimiento.comandas[0].comandaEtapas_on_comanda[0].operario.id, "test-operario");
  for (const user of [null, "test-operario", "test-cliente", "test-inactivo", "sin-perfil"]) {
    await assert.rejects(execute(legacy, "EntregarComanda", { id: v.id }, user));
  }
  await execute(legacy, "EntregarComanda", { id: v.id }, "test-recepcion");
  const c = await read(v.id);
  assert.deepEqual(c.comandaEtapas_on_comanda.slice(0, 4), anterior.comandaEtapas_on_comanda.slice(0, 4));
  assert.equal(c.comandaEtapas_on_comanda[4].estado, "COMPLETADA");
  assert.equal(c.comandaEtapas_on_comanda[4].operarioId, "test-recepcion");
  assert.equal(c.comandaEtapas_on_comanda[4].fechaCompletado, c.fechaEntregaReal);
  assert.equal(c.comandaHistorialEstados_on_comanda.length, 6);
  assert.equal(c.comandaNotificacions_on_comanda.length, 1);
  await assert.rejects(execute(legacy, "EntregarComanda", { id: v.id }, "test-admin"));
  assert.deepEqual(await read(v.id), c);
});
await check("reportes concurrentes no sobrescriben al autor confirmado", async () => {
  const v = variables();
  await execute(mutation, "CrearComandaConFlujo", v, "test-recepcion");
  const users = ["test-operario", "test-admin"];
  const resultados = await Promise.allSettled(users.map(user => execute(production, "CompletarEtapaComanda", {
    comandaId: v.id, etapaId: etapaIds[0], orden: 1, estadoComanda: "EN_PROCESO",
  }, user)));
  assert.equal(resultados.filter(r => r.status === "fulfilled").length, 1);
  const c = await read(v.id);
  assert.equal(c.comandaEtapas_on_comanda[0].operarioId, users[resultados.findIndex(r => r.status === "fulfilled")]);
  assert.equal(c.comandaHistorialEstados_on_comanda.length, 2);
});
await check("entrega histórica sin flujo no inventa etapas ni responsables anteriores", async () => {
  const v = variables();
  await execute(`mutation Old($id:UUID!,$numero:String!,$clienteId:UUID!) { comanda_insert(data:{id:$id,numeroComanda:$numero,clienteId:$clienteId,estado:FINALIZADA}) }`, "Old", {id:v.id,numero:v.numeroComanda,clienteId});
  await execute(legacy, "EntregarComanda", { id: v.id }, "test-recepcion");
  const c = await read(v.id);
  assert.equal(c.estado, "ENTREGADA");
  assert.equal(c.comandaEtapas_on_comanda.length, 0);
  assert(c.fechaEntregaReal);
});
await check("entregar desde seguimiento y recepción a la vez registra una sola entrega", async () => {
  const v = variables();
  await execute(mutation, "CrearComandaConFlujo", v, "test-recepcion");
  for (let orden = 1; orden <= 4; orden++) await execute(production, "CompletarEtapaComanda", {
    comandaId: v.id, etapaId: etapaIds[orden - 1], orden, estadoComanda: orden === 4 ? "FINALIZADA" : "EN_PROCESO",
  }, "test-operario");
  const resultados = await Promise.allSettled([
    execute(production, "CompletarEtapaComanda", { comandaId: v.id, etapaId: etapaIds[4], orden: 5, estadoComanda: "ENTREGADA" }, "test-operario"),
    execute(legacy, "EntregarComanda", { id: v.id }, "test-recepcion"),
  ]);
  assert.equal(resultados.filter(r => r.status === "fulfilled").length, 1);
  const c = await read(v.id);
  assert.equal(c.estado, "ENTREGADA");
  assert.equal(c.comandaEtapas_on_comanda[4].fechaCompletado, c.fechaEntregaReal);
  assert.equal(c.comandaEtapas_on_comanda[4].operarioId, resultados[0].status === "fulfilled" ? "test-operario" : "test-recepcion");
  assert.equal(c.comandaNotificacions_on_comanda.length, 1);
  assert.equal(c.comandaHistorialEstados_on_comanda.length, 6);
});
for (const estado of ["EN_PROCESO","FINALIZADA","ENTREGADA","ANULADA"]) await check("conserva comanda histórica " + estado, async () => {
  const v = variables();
  await execute(`mutation Old($id:UUID!,$numero:String!,$clienteId:UUID!,$estado:ComandaEstado!){comanda_insert(data:{id:$id,numeroComanda:$numero,clienteId:$clienteId,estado:$estado})}`,"Old",{id:v.id,numero:v.numeroComanda,clienteId,estado});
  await assert.rejects(execute(production,"AsociarFlujoComandaPendiente",{id:v.id},"test-admin"));
  const c=await read(v.id); assert.equal(c.estado,estado); assert.equal(c.comandaEtapas_on_comanda.length,0);
});
await check("incidencias se persisten y solo los roles autorizados las gestionan", async () => {
  const v = variables();
  await execute(mutation, "CrearComandaConFlujo", v, "test-recepcion");
  const creada = await execute(production, "RegistrarIncidenciaComanda", {
    comandaId: v.id, motivo: "Falla de maquinaria", descripcion: "Prueba de integración",
  }, "test-operario");
  const incidenciaId = creada.incidenciaComanda_insert.id;
  for (const user of ["test-admin", "test-recepcion"]) {
    const listado = await execute(queries, "GetIncidencias", {}, user);
    const incidencia = listado.incidenciaComandas.find((item) => item.id.replaceAll("-", "") === incidenciaId.replaceAll("-", ""));
    assert.equal(incidencia.comanda.numeroComanda, v.numeroComanda);
    assert.equal(incidencia.reportadaPor.id, "test-operario");
    assert.equal(incidencia.estado, "ABIERTA");
  }
  for (const user of [null, "test-operario", "test-cliente", "test-inactivo", "sin-perfil"]) {
    await assert.rejects(execute(queries, "GetIncidencias", {}, user));
  }
  for (const user of [null, "test-admin", "test-recepcion", "test-cliente", "test-inactivo", "sin-perfil"]) {
    await assert.rejects(execute(production, "RegistrarIncidenciaComanda", { comandaId: v.id, motivo: "Ilegal" }, user));
  }
  await execute(production, "ActualizarEstadoIncidencia", { id: incidenciaId, estado: "RESUELTA" }, "test-recepcion");
  const resuelta = (await execute(queries, "GetIncidencias", {}, "test-admin")).incidenciaComandas.find((item) => item.id.replaceAll("-", "") === incidenciaId.replaceAll("-", ""));
  assert.equal(resuelta.estado, "RESUELTA");
  for (const user of [null, "test-operario", "test-cliente", "test-inactivo", "sin-perfil"]) {
    await assert.rejects(execute(production, "ActualizarEstadoIncidencia", { id: incidenciaId, estado: "ABIERTA" }, user));
  }
});
await check("reasignación conserva responsable vigente e historial de auditoría", async () => {
  const v = variables();
  await execute(mutation, "CrearComandaConFlujo", v, "test-recepcion");
  await execute(production, "ReasignarOperarioEtapa", {
    comandaId: v.id, etapaId: etapaIds[0], operarioId: "test-operario", motivo: "Inicio de turno",
  }, "test-admin");
  const inspect = await execute(`query Assignment($id:UUID!){comanda(id:$id){
    comandaEtapas_on_comanda(orderBy:[{ordenEtapa:ASC}]){etapaId asignadoA{id nombre}}
    reasignacionOperarios_on_comanda{etapa{id} operarioAnterior{id} operarioNuevo{id} realizadoPor{id} motivo}
  }}`, "Assignment", { id: v.id });
  assert.equal(inspect.comanda.comandaEtapas_on_comanda[0].asignadoA.id, "test-operario");
  assert.equal(inspect.comanda.reasignacionOperarios_on_comanda.length, 1);
  assert.equal(inspect.comanda.reasignacionOperarios_on_comanda[0].operarioAnterior, null);
  assert.equal(inspect.comanda.reasignacionOperarios_on_comanda[0].operarioNuevo.id, "test-operario");
  assert.equal(inspect.comanda.reasignacionOperarios_on_comanda[0].realizadoPor.id, "test-admin");
  for (const user of [null, "test-recepcion", "test-operario", "test-cliente", "test-inactivo", "sin-perfil"]) {
    await assert.rejects(execute(production, "ReasignarOperarioEtapa", {
      comandaId: v.id, etapaId: etapaIds[0], operarioId: "test-operario",
    }, user));
  }
  await execute(production, "CompletarEtapaComanda", { comandaId: v.id, etapaId: etapaIds[0], orden: 1, estadoComanda: "EN_PROCESO" }, "test-operario");
  await assert.rejects(execute(production, "ReasignarOperarioEtapa", {
    comandaId: v.id, etapaId: etapaIds[0], operarioId: "test-operario",
  }, "test-admin"));
});
await check("panel productivo usa datos reales y es exclusivo de administración", async () => {
  const panel = await execute(queries, "GetPanelProduccion", { limit: 100 }, "test-admin");
  assert(panel.comandas.length > 0);
  assert.equal(panel.pendientes[0]._count + panel.enProceso[0]._count + panel.listas[0]._count, panel.comandas.length);
  for (const user of [null, "test-recepcion", "test-operario", "test-cliente", "test-inactivo", "sin-perfil"]) {
    await assert.rejects(execute(queries, "GetPanelProduccion", {}, user));
  }
});
await check("catálogo incompleto impide creación sin dejar cabecera", async () => {
  await execute(`mutation { etapaProduccion_update(id:"00000000-0000-4000-8000-000000000024",data:{orden:6}) }`);
  const v=variables(); await assert.rejects(execute(mutation,"CrearComandaConFlujo",v,"test-admin")); assert.equal(await read(v.id),null);
});
await check("inventario real permite alta y conserva el movimiento inicial", async () => {
  const nombre = "Detergente integración " + randomUUID().slice(0, 8);
  const creado = await execute(legacy, "CrearInsumo", {
    nombre, unidadMedida: "L", stockInicial: 10, stockMinimo: 4,
  }, "test-admin");
  const id = creado.insumo_insert.id;
  const inventario = await execute(commandQueries, "GetInventario", {}, "test-admin");
  const insumo = inventario.insumos.find((item) => item.id.replaceAll("-", "") === id.replaceAll("-", ""));
  assert.equal(insumo.nombre, nombre);
  assert.equal(insumo.stockActual, 10);
  const inicial = inventario.movimientoInventarios.find((item) => item.insumo.id.replaceAll("-", "") === id.replaceAll("-", ""));
  assert.equal(inicial.tipoMovimiento, "ENTRADA");
  assert.equal(inicial.cantidad, 10);
  assert.equal(inicial.usuario.id, "test-admin");
});
await check("inventario rechaza accesos y valores inválidos", async () => {
  for (const user of [null, "test-recepcion", "test-operario", "test-cliente", "test-inactivo", "sin-perfil"]) {
    await assert.rejects(execute(commandQueries, "GetInventario", {}, user));
    await assert.rejects(execute(legacy, "CrearInsumo", {
      nombre: "Ilegal " + randomUUID(), unidadMedida: "kg", stockInicial: 1, stockMinimo: 1,
    }, user));
  }
  await assert.rejects(execute(legacy, "CrearInsumo", {
    nombre: "Stock negativo " + randomUUID(), unidadMedida: "kg", stockInicial: -1, stockMinimo: 1,
  }, "test-admin"));
});
await check("entradas actualizan stock y registran trazabilidad atómicamente", async () => {
  const creado = await execute(legacy, "CrearInsumo", {
    nombre: "Suavizante integración " + randomUUID().slice(0, 8), unidadMedida: "L", stockInicial: 5, stockMinimo: 2,
  }, "test-admin");
  const id = creado.insumo_insert.id;
  await execute(legacy, "RegistrarEntradaInventario", { insumoId: id, cantidad: 3.5, motivo: "Factura 123" }, "test-admin");
  const inventario = await execute(commandQueries, "GetInventario", {}, "test-admin");
  const insumo = inventario.insumos.find((item) => item.id.replaceAll("-", "") === id.replaceAll("-", ""));
  assert.equal(insumo.stockActual, 8.5);
  const movimientos = inventario.movimientoInventarios.filter((item) => item.insumo.id.replaceAll("-", "") === id.replaceAll("-", ""));
  assert.equal(movimientos.length, 2);
  assert.equal(movimientos[0].motivo, "Factura 123");
  await Promise.all([
    execute(legacy, "RegistrarEntradaInventario", { insumoId: id, cantidad: 1, motivo: "Concurrente A" }, "test-admin"),
    execute(legacy, "RegistrarEntradaInventario", { insumoId: id, cantidad: 2, motivo: "Concurrente B" }, "test-admin"),
  ]);
  await assert.rejects(execute(legacy, "RegistrarEntradaInventario", { insumoId: id, cantidad: 0 }, "test-admin"));
  await execute(legacy, "ActualizarInsumo", {
    id, nombre: insumo.nombre, unidadMedida: "L", stockMinimo: 2, activo: false,
  }, "test-admin");
  await assert.rejects(execute(legacy, "RegistrarEntradaInventario", { insumoId: id, cantidad: 1 }, "test-admin"));
  const final = await execute(commandQueries, "GetInventario", {}, "test-admin");
  assert.equal(final.insumos.find((item) => item.id.replaceAll("-", "") === id.replaceAll("-", "")).stockActual, 11.5);
});
console.log(count + " escenarios de integración aprobados.");
