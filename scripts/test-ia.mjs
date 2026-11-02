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
const uuid = (id) => id.replaceAll("-", "");
let comprobaciones = 0;
async function prueba(nombre, funcion) { await funcion(); console.log('OK ' + nombre); comprobaciones++; }

const ia = await readFile('dataconnect/example/ia.gql', 'utf8');
const conteos = await readFile('dataconnect/example/inventario-conteos.gql', 'utf8');
const historial = await readFile('dataconnect/example/inventario-historial.gql', 'utf8');
const manual = await readFile('dataconnect/example/mutations.gql', 'utf8');
await ejecutar(await readFile('dataconnect/seed_data.gql', 'utf8'), 'SeedProduccion');

const servicioId = '00000000-0000-4000-8000-000000000012';
const detergente = randomUUID(), bolsas = randomUUID();
await ejecutar('mutation Fixture($a:UUID!,$b:UUID!){insumo_insertMany(data:[{id:$a,nombre:"Detergente IA",unidadMedida:"L",stockActual:100},{id:$b,nombre:"Bolsas IA",unidadMedida:"unidad",stockActual:50}])}', 'Fixture', { a: detergente, b: bolsas });
const movimientos = async (insumoId) => (await ejecutar('query Movs($id:UUID!){movimientoInventarios(where:{insumoId:{eq:$id}},orderBy:[{fecha:ASC}]){clase origen tipoMovimiento cantidad}}', 'Movs', { id: insumoId })).movimientoInventarios;
const tasa = (extra = {}) => ({ tipoServicioId: servicioId, insumoId: detergente, tasaInicial: 12, tasaActual: 12, unidad: 'ml', fuente: 'Ficha técnica del fabricante', ...extra });

await prueba('solo un administrador activo puede usar el módulo IA', async () => {
  for (const uid of [null, 'sin-perfil', 'test-inactivo', 'test-operario', 'test-recepcion', 'test-cliente']) {
    await assert.rejects(ejecutar(ia, 'AutorizarModuloIa', {}, uid));
    await assert.rejects(ejecutar(ia, 'GetPanelIa', {}, uid));
    await assert.rejects(ejecutar(ia, 'GetHistorialAjustesIa', {}, uid));
    await assert.rejects(ejecutar(ia, 'GuardarTasaConsumo', tasa(), uid));
    await assert.rejects(ejecutar(ia, 'EliminarTasaConsumo', { tipoServicioId: servicioId, insumoId: detergente }, uid));
    await assert.rejects(ejecutar(ia, 'GuardarConfiguracionIa', { margenSeguridad: 0.15, lambda: 1, incluirSimulado: false }, uid));
    await assert.rejects(ejecutar(ia, 'RegistrarConteoFisicoIa', { id: randomUUID(), insumoId: detergente, cantidad: 1, revisionStock: 0 }, uid));
  }
  assert.equal((await ejecutar(ia, 'AutorizarModuloIa', {}, 'test-admin')).yo.id, 'test-admin');
});

await prueba('la tasa se guarda una vez por servicio e insumo y se puede editar', async () => {
  await ejecutar(ia, 'GuardarTasaConsumo', tasa(), 'test-admin');
  await ejecutar(ia, 'GuardarTasaConsumo', tasa({ tasaActual: 10.5, fuente: 'Dosificador de la lavadora' }), 'test-admin');
  const panel = await ejecutar(ia, 'GetPanelIa', {}, 'test-admin');
  const filas = panel.tasaConsumos.filter(t => uuid(t.insumoId) === uuid(detergente));
  assert.equal(filas.length, 1);
  assert.equal(filas[0].tasaInicial, 12); assert.equal(filas[0].tasaActual, 10.5);
  assert.equal(filas[0].fuente, 'Dosificador de la lavadora'); assert.equal(filas[0].tipoServicio.nombre, 'Lavado');
});

await prueba('rechaza tasas negativas y unidades incompatibles con el insumo', async () => {
  await assert.rejects(ejecutar(ia, 'GuardarTasaConsumo', tasa({ tasaInicial: -1 }), 'test-admin'), /inválidas/);
  await assert.rejects(ejecutar(ia, 'GuardarTasaConsumo', tasa({ unidad: 'g' }), 'test-admin'), /no es compatible/);
  await assert.rejects(ejecutar(ia, 'GuardarTasaConsumo', tasa({ unidad: 'litros' }), 'test-admin'), /inválidas/);
  await assert.rejects(ejecutar(ia, 'GuardarTasaConsumo', tasa({ insumoId: bolsas }), 'test-admin'), /no es compatible/);
  await assert.rejects(ejecutar(ia, 'GuardarTasaConsumo', tasa({ fuente: 'x'.repeat(301) }), 'test-admin'), /inválidas/);
});

await prueba('eliminar una tasa la quita del panel y no se puede repetir', async () => {
  const otro = randomUUID();
  await ejecutar('mutation Servicio($id:UUID!){tipoServicio_insert(data:{id:$id,nombre:"Lavado IA temporal"})}', 'Servicio', { id: otro });
  await ejecutar(ia, 'GuardarTasaConsumo', tasa({ tipoServicioId: otro }), 'test-admin');
  await ejecutar(ia, 'EliminarTasaConsumo', { tipoServicioId: otro, insumoId: detergente }, 'test-admin');
  assert(!(await ejecutar(ia, 'GetPanelIa', {}, 'test-admin')).tasaConsumos.some(t => uuid(t.tipoServicioId) === uuid(otro)));
  await assert.rejects(ejecutar(ia, 'EliminarTasaConsumo', { tipoServicioId: otro, insumoId: detergente }, 'test-admin'), /ya no existe/);
});

await prueba('la configuración es una sola fila y valida margen y λ', async () => {
  await ejecutar(ia, 'GuardarConfiguracionIa', { margenSeguridad: 0.15, lambda: 2, incluirSimulado: false }, 'test-admin');
  await ejecutar(ia, 'GuardarConfiguracionIa', { margenSeguridad: 0.2, lambda: 3, incluirSimulado: true }, 'test-admin');
  const { configuracionIa } = await ejecutar(ia, 'GetPanelIa', {}, 'test-admin');
  assert.deepEqual([configuracionIa.margenSeguridad, configuracionIa.lambda, configuracionIa.incluirSimulado], [0.2, 3, true]);
  await assert.rejects(ejecutar(ia, 'GuardarConfiguracionIa', { margenSeguridad: 1.5, lambda: 1, incluirSimulado: false }, 'test-admin'), /margen/);
  await assert.rejects(ejecutar(ia, 'GuardarConfiguracionIa', { margenSeguridad: 0.1, lambda: -1, incluirSimulado: false }, 'test-admin'), /margen/);
});

await prueba('el conteo del admin queda aprobado, reemplaza el stock y registra un ajuste', async () => {
  const antes = (await ejecutar(ia, 'GetPanelIa', {}, 'test-admin')).conteosReales[0]._count;
  await ejecutar(ia, 'RegistrarConteoFisicoIa', { id: randomUUID(), insumoId: detergente, cantidad: 82.5, revisionStock: 0 }, 'test-admin');
  const panel = await ejecutar(ia, 'GetPanelIa', {}, 'test-admin');
  const insumo = panel.insumos.find(i => i.nombre === 'Detergente IA');
  assert.equal(insumo.stockActual, 82.5); assert.equal(insumo.revisionStock, 1);
  assert.equal(panel.conteosReales[0]._count, antes + 1);
  assert.deepEqual(await movimientos(detergente), [{ clase: 'AJUSTE_CONTEO', origen: 'REAL', tipoMovimiento: 'SALIDA', cantidad: 17.5 }]);
  await assert.rejects(ejecutar(ia, 'RegistrarConteoFisicoIa', { id: randomUUID(), insumoId: detergente, cantidad: 80, revisionStock: 0 }, 'test-admin'), /stock cambió/);
  await assert.rejects(ejecutar(ia, 'RegistrarConteoFisicoIa', { id: randomUUID(), insumoId: detergente, cantidad: -1, revisionStock: 1 }, 'test-admin'), /inválida/);
});

await prueba('los movimientos de inventario quedan clasificados para el modelo', async () => {
  const creado = await ejecutar(manual, 'CrearInsumo', { nombre: 'Suavizante IA', unidadMedida: 'L', stockInicial: 40, stockMinimo: 5 }, 'test-admin');
  const id = creado.insumo_insert.id;
  await ejecutar(manual, 'RegistrarEntradaInventario', { insumoId: id, cantidad: 10, motivo: 'Factura 123' }, 'test-admin');
  await ejecutar(manual, 'RegistrarSalidaInventario', { insumoId: id, cantidad: 3, motivo: 'Derrame' }, 'test-admin');
  const conteo = randomUUID();
  await ejecutar(conteos, 'RegistrarConteoInventario', { id: conteo, insumoId: id, cantidad: 45, revisionStock: 2 }, 'test-operario');
  await ejecutar(conteos, 'AprobarConteoInventario', { id: conteo, motivo: 'Verificado' }, 'test-admin');
  assert.deepEqual((await movimientos(id)).map(m => m.clase), ['STOCK_INICIAL', 'COMPRA', 'CONSUMO', 'AJUSTE_CONTEO']);
});

await prueba('los datos simulados no aparecen en las vistas de inventario ni tocan el stock', async () => {
  const simulacion = randomUUID(), conteoSim = randomUUID(), movSim = randomUUID();
  await ejecutar('mutation Sim($s:UUID!,$c:UUID!,$m:UUID!,$i:UUID!){simulacionIa_insert(data:{id:$s,semanas:1,parametrosJson:"{}",tasasVerdaderasJson:"{}",creadoPorId:"test-admin"}) conteoInventario_insert(data:{id:$c,insumoId:$i,cantidadContada:1,stockSistema:1,revisionStock:0,registradoPorId:"test-operario",estado:APROBADO,origen:SIMULADO,simulacionId:$s,fechaConteo:"2026-01-05T12:00:00Z"}) movimientoInventario_insert(data:{id:$m,insumoId:$i,tipoMovimiento:ENTRADA,cantidad:999,clase:COMPRA,origen:SIMULADO,simulacionId:$s,fecha:"2026-01-04T12:00:00Z"})}', 'Sim', { s: simulacion, c: conteoSim, m: movSim, i: detergente });
  const ids = (lista) => lista.map(x => uuid(x.id));
  const aprobados = await ejecutar(conteos, 'GetConteosInventario', { estado: 'APROBADO', limit: 100 }, 'test-admin');
  assert(!ids(aprobados.conteoInventarios).includes(uuid(conteoSim)));
  assert(!ids((await ejecutar(conteos, 'GetMisConteosInventario', { limit: 100 }, 'test-operario')).conteoInventarios).includes(uuid(conteoSim)));
  assert.equal((await ejecutar(conteos, 'GetMiConteoInventario', { id: conteoSim }, 'test-operario')).conteoInventario, null);
  const h = await ejecutar(historial, 'GetHistorialInventario', { insumoId: detergente, limit: 100 }, 'test-admin');
  assert(!ids(h.movimientoInventarios).includes(uuid(movSim)));
  assert.equal(h.total[0]._count, 1);
  const panel = await ejecutar(ia, 'GetPanelIa', {}, 'test-admin');
  assert.equal(panel.conteosSimulados[0]._count, 1);
  assert.equal(panel.simulaciones.length, 1);
  assert.equal(panel.insumos.find(i => i.nombre === 'Detergente IA').stockActual, 82.5);
});

await prueba('el historial de ajustes pagina los modelos registrados', async () => {
  await ejecutar('mutation Modelos{modeloIa_insertMany(data:[{nombre:"Regresión",version:"v1",activo:false,mae:3,mape:12,observaciones:2,fechaEntrenamiento:"2026-01-01T00:00:00Z"},{nombre:"Regresión",version:"v2",activo:true,mae:2,mape:8,observaciones:3,fechaEntrenamiento:"2026-02-01T00:00:00Z"}])}', 'Modelos');
  const d = await ejecutar(ia, 'GetHistorialAjustesIa', { limit: 1 }, 'test-admin');
  assert.equal(d.total[0]._count, 2); assert.equal(d.modeloIas.length, 1);
  assert.equal((await ejecutar(ia, 'GetPanelIa', {}, 'test-admin')).modeloVigente[0].version, 'v2');
});

console.log(`${comprobaciones} escenarios del módulo IA aprobados.`);
