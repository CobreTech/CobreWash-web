import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
const host = (process.env.FIREBASE_DATA_CONNECT_EMULATOR_HOST ?? "127.0.0.1:9499").replace(/^http:\/\//, "");
assert.match(host, /^(127\.0\.0\.1|localhost):9499$/);
const endpoint = `http://${host}/v1/projects/demo-production/locations/southamerica-west1/services/lavanderia-el-cobre:executeGraphql`;
const portal = await readFile("dataconnect/example/portal-cliente.gql", "utf8");
const publico = await readFile("dataconnect/example/seguimiento-queries.gql", "utf8");
let checks = 0;
async function execute(query, operationName, variables = {}, user) {
  const impersonate = user === null ? { unauthenticated: true } : user ? { authClaims: { sub: user.uid ?? user, email: user.email ?? "cliente@example.test", email_verified: user.verified ?? false, firebase: { sign_in_provider: "password" } } } : undefined;
  const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query, operationName, variables, extensions: { impersonate } }) });
  const body = await res.json();
  if (!res.ok || body.errors?.length || !body.data) throw new Error(JSON.stringify(body));
  return body.data;
}
async function check(name, fn) { await fn(); checks++; console.log("OK " + name); }
const uid = "test-cliente";
const verified = { uid, email: "cliente@example.test", verified: true };
const listar = (user = verified, variables = {}) => execute(portal, "GetMisComandas", variables, user);
const vincular = (numeroComanda, user = verified) => execute(portal, "VincularMiComanda", { numeroComanda }, user);
await execute(await readFile("dataconnect/seed_data.gql", "utf8"), "SeedProduccion");
const clienteId = randomUUID(), propioId = randomUUID(), ajenoId = randomUUID();
const pedidoId = randomUUID(), propioPedidoId = randomUUID(), ajenoPedidoId = randomUUID(), qr = randomUUID();
await execute(`mutation Fixture($cliente: UUID!, $propio: UUID!, $ajeno: UUID!, $pedido: UUID!, $pedidoPropio: UUID!, $pedidoAjeno: UUID!, $qr: UUID!) @transaction {
 usuario_upsert(data: { id:"otro-cliente", rolId:"00000000-0000-4000-8000-000000000004", nombre:"Otro",email:"otro@example.test" })
 cliente_insertMany(data:[
 {id:$cliente,nombre:"Anterior", email:"cliente@example.test",usuarioId:null}
 {id:$propio,nombre:"Propio",email:null,usuarioId:"test-cliente"}
 {id:$ajeno,nombre:"Ajeno",usuarioId:"otro-cliente",email:"cliente@example.test"}])
 comanda_insertMany(data:[
 {id:$pedido,clienteId:$cliente,numeroComanda:"ELCOBRE-aa01",codigoQr:$qr,estado:PENDIENTE,valorTotal:3000,fechaRecepcion:"2026-10-22T12:00:00Z"}
 {id:$pedidoPropio,clienteId:$propio,numeroComanda:"ELCOBRE-aa02",codigoQr_expr:"uuidV4()",valorTotal:0,estado:ENTREGADA,fechaRecepcion:"2026-10-23T12:00:00Z"}
 {id:$pedidoAjeno,clienteId:$ajeno,numeroComanda:"ELCOBRE-aa03",codigoQr_expr:"uuidV4()",valorTotal:0,estado:PENDIENTE,fechaRecepcion:"2026-10-23T13:00:00Z"}])
 comandaDetalle_insert(data:{comandaId:$pedido,tipoPrendaId:"00000000-0000-4000-8000-000000000011",tipoServicioId:"00000000-0000-4000-8000-000000000012",cantidad:3,precioUnitario:1000,subtotal:3000})
 comandaEtapa_insertMany(data:[
 {comandaId:$pedido,etapaId:"00000000-0000-4000-8000-000000000020",nombreEtapa:"Recepción",ordenEtapa:1,estado:COMPLETADA}
 {comandaId:$pedido,etapaId:"00000000-0000-4000-8000-000000000021",nombreEtapa:"Lavado",ordenEtapa:2,estado:EN_PROCESO}])
}`, "Fixture", { cliente:clienteId, propio:propioId, ajeno:ajenoId, pedido:pedidoId,pedidoPropio:propioPedidoId,pedidoAjeno:ajenoPedidoId,qr });

await check("historial inicial solo contiene comandas propias", async () => {
 const d = await listar(); assert.deepEqual(d.comandas.map(c=>c.numeroComanda),["ELCOBRE-aa02"]); assert.equal(d.total[0]._count,1);
});
await check("rechaza anónimos, roles internos, perfiles ausentes e inactivos", async () => {
 for (const user of [null,"test-admin","test-operario","test-recepcion","test-inactivo","sin-perfil"]) { await assert.rejects(listar(user)); await assert.rejects(vincular("ELCOBRE-aa01",user)); }
});
await check("un número público no permite vincular sin correo verificado coincidente", async () => {
 for (const user of [{uid,verified:false}, {uid,email:"otro@example.test",verified:true}]) await assert.rejects(vincular("ELCOBRE-aa01",user));
 await assert.rejects(vincular("ELCOBRE-aa03"));
 await assert.rejects(vincular("ELCOBRE-xxxx"));
 assert.equal((await listar()).total[0]._count,1);
});
await check("vinculación repetida no duplica y no altera al dueño de la ficha", async () => {
 await vincular("ELCOBRE-aa01"); await vincular("ELCOBRE-aa01");
 const d=await listar(); assert.equal(d.total[0]._count,2);
 assert.deepEqual(d.comandas.map(c=>c.numeroComanda),["ELCOBRE-aa02","ELCOBRE-aa01"]);
 const ficha=await execute("query Ficha($id: UUID!){cliente(id:$id){usuarioId}}","Ficha",{id:clienteId}); assert.equal(ficha.cliente.usuarioId,null);
});
await check("filtros, total, paginación y detalle real", async () => {
 const d=await listar(verified,{estado:"PENDIENTE",limit:1,offset:0}); assert.equal(d.total[0]._count,1);
 assert.equal(d.comandas[0].valorTotal,3000); assert.equal(d.comandas[0].comandaDetalles_on_comanda[0].subtotal,3000);
 assert.equal(d.comandas[0].comandaDetalles_on_comanda[0].tipoPrenda.nombre,"Camisa");
 assert.equal((await listar(verified,{limit:1,offset:1})).comandas[0].numeroComanda,"ELCOBRE-aa01");
 const otro=await listar({uid:"otro-cliente",email:"otro@example.test",verified:true}); assert.deepEqual(otro.comandas.map(c=>c.numeroComanda),["ELCOBRE-aa03"]);
});
await check("seguimiento anónimo por número y QR: timeline sin datos privados", async () => {
 const numero=await execute(publico,"GetSeguimientoPublicoPorNumero",{numeroComanda:"ELCOBRE-aa01"},null);
 const codigo=await execute(publico,"GetSeguimientoPublicoPorQr",{codigoQr:qr},null);
 assert.deepEqual(numero,codigo); assert.equal(numero.comanda.comandaEtapas_on_comanda[1].estado,"EN_PROCESO");
 for(const prohibido of ["email","usuarioId","cliente","valorTotal","precioUnitario","observaciones","operario"]) assert.equal(Object.hasOwn(numero.comanda,prohibido),false);
 assert.equal((await execute(publico,"GetSeguimientoPublicoPorNumero",{numeroComanda:"ELCOBRE-xxxx"},null)).comanda,null);
});
await check("registro crea perfil de cliente y distingue empresa de particular", async () => {
 const mutations=await readFile("dataconnect/example/mutations.gql","utf8");
 for (const tipoCliente of ["HOTEL","PARTICULAR"]) {
 const nuevo="registro-"+tipoCliente;
 await execute(mutations,"RegistrarseComoCliente",{rut:tipoCliente === "HOTEL" ? "12.345.678-5" : "11.111.111-1",nombre:"Registro",apellido:"Prueba",email:nuevo+"@example.test",tipoCliente},{uid:nuevo});
 const data=await execute(await readFile("dataconnect/example/queries.gql","utf8"),"GetMiPerfil",{}, {uid:nuevo});
 assert.equal(data.usuario.rol.nombre,"cliente"); assert.equal(data.usuario.clientes_on_usuario[0].tipoCliente,tipoCliente);
 }
});
await check("el servidor impone cliente aunque se envíe el ID de un rol interno", async () => {
 const mutations=await readFile("dataconnect/example/mutations.gql","utf8");
 const queries=await readFile("dataconnect/example/queries.gql","utf8");
 for(const [indice,dv] of [[1,"3"],[2,"1"],[3,"K"],[5,"6"],[6,"4"]]) {
  const nuevo=`registro-rol-${indice}`;
  await execute(mutations,"RegistrarseComoCliente",{
   rolId:`00000000-0000-4000-8000-00000000000${indice}`,
   rut:`20.000.00${indice}-${dv}`,nombre:"Registro",apellido:"Prueba",email:`${nuevo}@example.test`,tipoCliente:"PARTICULAR",
  },{uid:nuevo});
  const data=await execute(queries,"GetMiPerfil",{},{uid:nuevo});
  assert.equal(data.usuario.rol.nombre,"cliente");
 }
});
await check("el registro público no permite usar las altas administrativas ni el registro heredado", async () => {
 const mutations=await readFile("dataconnect/example/mutations.gql","utf8");
 const datos={rut:"20.000.007-2",nombre:"Prueba",apellido:"Prueba",email:"intrusion@example.test"};
 const id="intrusion-"+randomUUID(),rolId="00000000-0000-4000-8000-000000000001";
 const operaciones=[
  ["Registrarse",{...datos,rolId}],
  ["CrearUsuarioAdministrado",{...datos,id,rolId}],
  ["CrearClienteAdministrado",{...datos,id,tipoCliente:"PARTICULAR"}],
 ];
 for(const user of [null,"registro-sin-perfil","registro-PARTICULAR"]) {
  for(const [operacion,variables] of operaciones) {
   await assert.rejects(execute(mutations,operacion,variables,user), /PERMISSION_DENIED|UNAUTHENTICATED|Solo administradores|Administrador no encontrado/);
  }
 }
});
await check("una cuenta pública no puede cambiar su propio rol a administrador", async () => {
 const mutations=await readFile("dataconnect/example/mutations.gql","utf8");
 await assert.rejects(execute(mutations,"ActualizarUsuario",{
  id:"registro-PARTICULAR",rolId:"00000000-0000-4000-8000-000000000001",nombre:"Prueba",activo:true,
 },"registro-PARTICULAR"));
 const perfil=await execute(await readFile("dataconnect/example/queries.gql","utf8"),"GetMiPerfil",{},"registro-PARTICULAR");
 assert.equal(perfil.usuario.rol.nombre,"cliente");
});
console.log(`${checks} pruebas de integración del portal completadas.`);
