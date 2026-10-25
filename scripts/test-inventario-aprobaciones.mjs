import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
const host = (process.env.FIREBASE_DATA_CONNECT_EMULATOR_HOST ?? '').replace(/^http:\/\//, '');
assert.match(host, /^(127\.0\.0\.1|localhost):9499$/);
const endpoint = `http://${host}/v1/projects/demo-production/locations/southamerica-west1/services/lavanderia-el-cobre:executeGraphql`;
async function ejecutar(query, operationName, variables = {}, usuario) {
  const impersonate = usuario === null ? { unauthenticated: true } : usuario ? { authClaims: { sub: usuario, firebase: { sign_in_provider: 'password' } } } : undefined;
  const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query, operationName, variables, extensions: { impersonate } }) });
  const json = await res.json(); if (!res.ok || json.errors?.length) throw new Error(JSON.stringify(json)); return json.data;
}
let comprobaciones = 0;
async function prueba(nombre, funcion) { await funcion(); console.log('OK ' + nombre); comprobaciones++; }
const conteos = await readFile('dataconnect/example/inventario-conteos.gql', 'utf8');
const inventario = await readFile('dataconnect/example/inventario-historial.gql', 'utf8');
const manual = await readFile('dataconnect/example/mutations.gql', 'utf8');
const app = await readFile('dataconnect/example/app-comandas-mutations.gql', 'utf8');
await ejecutar(await readFile('dataconnect/seed_data.gql', 'utf8'), 'SeedProduccion');
const insumoId = randomUUID();
await ejecutar('mutation Fixture($id:UUID!){insumo_insert(data:{id:$id,nombre:"Insumo de prueba",unidadMedida:"L",stockActual:20})}', 'Fixture', { id: insumoId });
const stock = async () => (await ejecutar('query Stock($id:UUID!){insumo(id:$id){stockActual revisionStock} movimientoInventarios(where:{insumoId:{eq:$id}}){id cantidad tipoMovimiento}}', 'Stock', { id: insumoId }));
const registrar = (id, cantidad, revisionStock = 0, usuario = 'test-operario') => ejecutar(conteos, 'RegistrarConteoInventario', { id, insumoId, cantidad, revisionStock }, usuario);
const aprobar = id => ejecutar(conteos, 'AprobarConteoInventario', { id, motivo: 'Verificado físicamente' }, 'test-admin');
let id = randomUUID();
await prueba('el operario envía un conteo persistente pendiente sin alterar el stock', async () => {
  await registrar(id, 17.5);
  const d = await ejecutar(conteos, 'GetMiConteoInventario', { id }, 'test-operario');
  assert.equal(d.conteoInventario.estado, 'PENDIENTE'); assert.equal(d.conteoInventario.stockSistema, 20);
  assert.equal((await stock()).insumo.stockActual, 20);
});
await prueba('el conteo es privado y solo administración puede resolverlo', async () => {
  for (const uid of [null, 'sin-perfil', 'test-inactivo', 'test-cliente', 'test-recepcion']) {
    await assert.rejects(registrar(randomUUID(), 5, 0, uid));
    await assert.rejects(ejecutar(conteos, 'GetMisConteosInventario', {}, uid));
  }
  for (const uid of [null, 'test-operario', 'test-cliente', 'test-recepcion']) {
    await assert.rejects(ejecutar(conteos, 'GetConteosInventario', {}, uid));
    await assert.rejects(ejecutar(conteos, 'AprobarConteoInventario', { id, motivo: 'No autorizado' }, uid));
    await assert.rejects(ejecutar(conteos, 'RechazarConteoInventario', { id, motivo: 'No autorizado' }, uid));
  }
  assert.equal((await ejecutar(conteos, 'GetMiConteoInventario', { id }, 'test-admin')).conteoInventario, null);
});
await prueba('la aprobación genera ajuste e historial una sola vez, incluso concurrentemente', async () => {
  const resultado = await Promise.allSettled([aprobar(id), aprobar(id)]);
  assert.equal(resultado.filter(r => r.status === 'fulfilled').length, 1);
  const d = await stock(); assert.equal(d.insumo.stockActual, 17.5); assert.equal(d.insumo.revisionStock, 1);
  assert.equal(d.movimientoInventarios.length, 1); assert.equal(d.movimientoInventarios[0].tipoMovimiento, 'SALIDA'); assert.equal(d.movimientoInventarios[0].cantidad, 2.5);
});
await prueba('un movimiento posterior impide aprobar un conteo obsoleto y conserva el pendiente', async () => {
  id = randomUUID(); await registrar(id, 15, 1);
  await ejecutar(manual, 'RegistrarEntradaInventario', { insumoId, cantidad: 2, motivo: 'Compra posterior' }, 'test-admin');
  await assert.rejects(aprobar(id), /stock cambió/);
  assert.equal((await stock()).insumo.stockActual, 19.5);
  assert.equal((await ejecutar(conteos, 'GetMiConteoInventario', { id }, 'test-operario')).conteoInventario.estado, 'PENDIENTE');
});
await prueba('rechazar explica el motivo y no modifica el saldo', async () => {
  await ejecutar(conteos, 'RechazarConteoInventario', { id, motivo: 'Volver a contar tras la compra' }, 'test-admin');
  assert.equal((await stock()).insumo.stockActual, 19.5);
  assert.equal((await ejecutar(conteos, 'GetMiConteoInventario', { id }, 'test-operario')).conteoInventario.estado, 'RECHAZADO');
});
await prueba('rechaza cantidades negativas y lecturas anteriores a una actualización de stock', async () => {
  await assert.rejects(registrar(randomUUID(), -1, 2));
  await assert.rejects(registrar(randomUUID(), 15, 1));
  await assert.rejects(ejecutar(conteos, 'RechazarConteoInventario', { id: randomUUID(), motivo: '' }, 'test-admin'));
});
await prueba('también permite sobrantes y conteos iguales sin descontar dos veces', async () => {
  id = randomUUID(); await registrar(id, 25, 2); await aprobar(id);
  assert.equal((await stock()).insumo.stockActual, 25);
  id = randomUUID(); await registrar(id, 25, 3); await aprobar(id);
  assert.equal((await stock()).insumo.stockActual, 25);
});
await prueba('historial filtra en el servidor y pagina más de 500 movimientos con orden estable', async () => {
  const otros = Array.from({ length: 525 }, (_, i) => ({ id: randomUUID(), insumoId, cantidad: 1, tipoMovimiento: 'ENTRADA', fecha: i < 520 ? '2026-10-26T02:59:59.999999Z' : '2026-10-26T03:00:00Z' }));
  for (let offset = 0; offset < otros.length; offset += 100)
    await ejecutar('mutation Filas($datos:[MovimientoInventario_Data!]!){movimientoInventario_insertMany(data:$datos)}', 'Filas', { datos: otros.slice(offset, offset + 100) });
  const filtros = { insumoId, tipo: 'ENTRADA', fechaDesde: '2026-10-25T03:00:00Z', fechaHastaExclusiva: '2026-10-26T03:00:00Z' };
  const a = await ejecutar(inventario, 'GetHistorialInventario', { ...filtros, limit: 500, offset: 0 }, 'test-admin');
  const b = await ejecutar(inventario, 'GetHistorialInventario', { ...filtros, limit: 500, offset: 500 }, 'test-admin');
  // Incluye movimientos recientes del mismo día si se ejecuta en esa fecha; la cuenta siempre coincide con las filas.
  assert(a.total[0]._count >= 520); assert.equal(a.movimientoInventarios.length + b.movimientoInventarios.length, a.total[0]._count);
  assert.equal(new Set([...a.movimientoInventarios, ...b.movimientoInventarios].map(m => m.id)).size, a.total[0]._count);
  for (const uid of [null, 'sin-perfil', 'test-operario', 'test-cliente']) await assert.rejects(ejecutar(inventario, 'GetHistorialInventario', filtros, uid));
});
await prueba('comandas incluye el último microsegundo del día chileno y excluye el día siguiente', async () => {
  const prefijo = 'FEC-' + randomUUID().slice(0, 7);
  const clienteId = randomUUID();
  await ejecutar('mutation ClienteFecha($id:UUID!,$nombre:String!){cliente_insert(data:{id:$id,nombre:$nombre})}', 'ClienteFecha', { id: clienteId, nombre: prefijo });
  const fechas = ['2026-10-25T02:59:59.999999Z', '2026-10-25T03:00:00Z', '2026-10-26T02:59:59.999999Z', '2026-10-26T03:00:00Z'];
  const filas = fechas.map((fechaRecepcion, i) => ({ id: randomUUID(), numeroComanda: prefijo + i, clienteId, fechaRecepcion }));
  await ejecutar('mutation Fechas($filas:[Comanda_Data!]!){comanda_insertMany(data:$filas)}', 'Fechas', { filas });
  const d = await ejecutar(await readFile('dataconnect/example/queries.gql', 'utf8'), 'GetComandasPaginadas', { cliente: prefijo, fechaDesde: '2026-10-25T03:00:00Z', fechaHastaExclusiva: '2026-10-26T03:00:00Z' }, 'test-admin');
  assert.deepEqual(d.comandas.map(c => c.numeroComanda).sort(), [prefijo + 1, prefijo + 2]);
  assert.equal(d.total[0]._count, 2);
});
await prueba('escanear conserva los responsables y toma solo etapas libres; repetir es inocuo', async () => {
  const comanda = randomUUID();
  await ejecutar(await readFile('dataconnect/produccion/mutations.gql', 'utf8'), 'CrearComandaConFlujo', { id: comanda, numeroComanda: 'QR-' + comanda.slice(0, 8), clienteId: '00000000-0000-4000-8000-000000000010', detalles: [{ tipoPrendaId: '00000000-0000-4000-8000-000000000011', tipoServicioId: '00000000-0000-4000-8000-000000000012', cantidad: 1, precioUnitario: 1000, subtotal: 1000 }] }, 'test-recepcion');
  await ejecutar('mutation Otro($id:UUID!){usuario_insert(data:{id:"segundo-operario",rolId:"00000000-0000-4000-8000-000000000003",nombre:"Segundo",email:"segundo@example.test"}) comandaEtapa_updateMany(where:{comandaId:{eq:$id},ordenEtapa:{eq:2}},data:{asignadoAId:"segundo-operario"})}', 'Otro', { id: comanda });
  for (let i = 0; i < 2; i++) await ejecutar(app, 'AutoAsignarComandaOperario', { comandaId: comanda }, 'test-operario');
  const d = await ejecutar('query Etapas($id:UUID!){comandaEtapas(where:{comandaId:{eq:$id}},orderBy:[{ordenEtapa:ASC}]){ordenEtapa asignadoAId}}', 'Etapas', { id: comanda });
  assert.equal(d.comandaEtapas[1].asignadoAId, 'segundo-operario'); assert(d.comandaEtapas.filter(e => e.ordenEtapa !== 2).every(e => e.asignadoAId === 'test-operario'));
  for (const uid of [null, 'test-cliente', 'sin-perfil']) await assert.rejects(ejecutar(app, 'AutoAsignarComandaOperario', { comandaId: comanda }, uid));
});
console.log(`${comprobaciones} escenarios de inventario y asignaciones aprobados.`);
