import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";

// Pruebas de integración en el emulador aislado de Data Connect (Sprint 08 - Vehículos).
const host = (process.env.FIREBASE_DATA_CONNECT_EMULATOR_HOST ?? "127.0.0.1:9499").replace(/^http:\/\//, "");
assert.match(host, /^(127\.0\.0\.1|localhost):9499$/);
const endpoint = `http://${host}/v1/projects/demo-production/locations/southamerica-west1/services/lavanderia-el-cobre:executeGraphql`;

const queries = await readFile("dataconnect/example/vehiculos-queries.gql", "utf8");
const mutations = await readFile("dataconnect/example/vehiculos-mutations.gql", "utf8");

async function execute(query, operationName, variables = {}, user = undefined) {
  const impersonate =
    user === null
      ? { unauthenticated: true }
      : user
        ? { authClaims: { sub: user, firebase: { sign_in_provider: "password" } } }
        : undefined;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, operationName, variables, extensions: { impersonate } }),
  });
  const body = await res.json();
  if (!res.ok || body.errors?.length || !body.data) {
    throw new Error(JSON.stringify(body));
  }
  return body.data;
}

let count = 0;
async function check(name, fn) {
  await fn();
  count++;
  console.log("OK " + name);
}

await execute(await readFile("dataconnect/seed_data.gql", "utf8"), "SeedProduccion");

const patente = "HLRT-" + String(Math.floor(10 + Math.random() * 89));
let vehiculoId = "";
let salidaId = "";
let inspeccionAntesId = "";
let inspeccionDespuesId = "";

await check("RF-VE01: registra vehículo en la flota y rechaza patentes duplicadas o inválidas", async () => {
  const creado = await execute(
    mutations,
    "RegistrarVehiculoFlota",
    {
      patente,
      marca: "Peugeot",
      modelo: "Partner Maxi",
      anio: 2023,
      descripcion: "Furgón reparto hotelero",
    },
    "test-admin",
  );
  vehiculoId = creado.vehiculo_insert.id;
  assert.ok(vehiculoId);

  // Rechaza patente duplicada
  await assert.rejects(
    execute(
      mutations,
      "RegistrarVehiculoFlota",
      {
        patente,
        marca: "Hyundai",
        modelo: "H-100",
        anio: 2022,
        descripcion: "Duplicado",
      },
      "test-admin",
    ),
  );

  // Rechaza patente inválida (minúscula o corta)
  await assert.rejects(
    execute(
      mutations,
      "RegistrarVehiculoFlota",
      {
        patente: "abc",
        marca: "Hyundai",
        modelo: "H-100",
        anio: 2022,
        descripcion: "Inválido",
      },
      "test-admin",
    ),
  );
});

await check("RF-VE02: registra salida con inspección inicial, adjunta fotos y bloquea NO_APTO, rol no conductor o doble salida", async () => {
  // Rechaza salida si estadoVehiculo es NO_APTO
  await assert.rejects(
    execute(
      mutations,
      "RegistrarSalidaFlota",
      {
        vehiculoId,
        repartidorId: "test-repartidor",
        kilometraje: 15200,
        estadoVehiculo: "NO_APTO",
        observaciones: "Falla de frenos",
        observacionesInspeccion: "No apto para circular",
      },
      "test-admin",
    ),
  );

  // Rechaza asignar un usuario cuyo rol no sea conductor o repartidor
  await assert.rejects(
    execute(
      mutations,
      "RegistrarSalidaFlota",
      {
        vehiculoId,
        repartidorId: "test-operario",
        kilometraje: 15200,
        estadoVehiculo: "APTO",
      },
      "test-admin",
    ),
  );

  const salida = await execute(
    mutations,
    "RegistrarSalidaFlota",
    {
      vehiculoId,
      repartidorId: "test-repartidor",
      kilometraje: 15200,
      estadoVehiculo: "APTO",
      observaciones: "Ruta Hotelera Calama",
      observacionesInspeccion: "Neumáticos y luces OK",
    },
    "test-admin",
  );
  salidaId = salida.salida.id;
  inspeccionAntesId = salida.inspeccion.id;
  assert.ok(salidaId);
  assert.ok(inspeccionAntesId);

  // Adjunta fotografía a la inspección de salida
  await execute(
    mutations,
    "AdjuntarFotoInspeccionFlota",
    {
      inspeccionId: inspeccionAntesId,
      rutaStorage: `vehiculos/${patente}/antes-${randomUUID()}.jpg`,
      descripcion: "Vista frontal antes de salir",
      orden: 1,
    },
    "test-admin",
  );

  // Impide registrar una segunda salida simultánea para el mismo vehículo
  await assert.rejects(
    execute(
      mutations,
      "RegistrarSalidaFlota",
      {
        vehiculoId,
        repartidorId: "test-conductor",
        kilometraje: 15210,
        estadoVehiculo: "APTO",
      },
      "test-admin",
    ),
  );

  // Impide desactivar un vehículo mientras está en ruta
  await assert.rejects(
    execute(
      mutations,
      "EditarVehiculoFlota",
      {
        id: vehiculoId,
        patente,
        marca: "Peugeot",
        modelo: "Partner Maxi",
        anio: 2023,
        descripcion: "En ruta",
        activo: false,
      },
      "test-admin",
    ),
  );
});

await check("RF-VE03: valida odómetro no decreciente al regresar y cierra la salida con evidencia", async () => {
  // Rechaza kilometraje menor al de salida (15200)
  await assert.rejects(
    execute(
      mutations,
      "RegistrarRetornoFlota",
      {
        salidaId,
        kilometraje: 15199.5,
        estadoVehiculo: "APTO",
        observacionesRetorno: "Retorno inválido",
      },
      "test-admin",
    ),
  );

  const retorno = await execute(
    mutations,
    "RegistrarRetornoFlota",
    {
      salidaId,
      kilometraje: 15268.5,
      estadoVehiculo: "CON_OBSERVACIONES",
      observacionesRetorno: "Entrega completada en 4 hoteles",
      observacionesInspeccion: "Leve barro en tapabarros trasero",
    },
    "test-admin",
  );
  inspeccionDespuesId = retorno.inspeccion.id;
  assert.ok(inspeccionDespuesId);

  await execute(
    mutations,
    "AdjuntarFotoInspeccionFlota",
    {
      inspeccionId: inspeccionDespuesId,
      rutaStorage: `vehiculos/${patente}/despues-${randomUUID()}.jpg`,
      descripcion: "Vista trasera al retornar",
      orden: 1,
    },
    "test-admin",
  );

  // Rechaza cerrar una salida que ya está FINALIZADA
  await assert.rejects(
    execute(
      mutations,
      "RegistrarRetornoFlota",
      {
        salidaId,
        kilometraje: 15300,
        estadoVehiculo: "APTO",
      },
      "test-admin",
    ),
  );
});

await check("RF-VE04: consulta historial completo con inspecciones ANTES/DESPUES, fotos y odómetro", async () => {
  const flota = await execute(queries, "GetFlotaVehiculos", {}, "test-admin");
  const encontrado = flota.vehiculos.find((v) => v.id === vehiculoId);
  assert.ok(encontrado);
  assert.equal(encontrado.patente, patente);
  assert.ok(
    flota.conductores.length >= 2 &&
      flota.conductores.every((c) => ["conductor", "repartidor"].includes(c.rol.nombre)),
  );

  const hist = await execute(
    queries,
    "GetHistorialVehiculos",
    { vehiculoId, estado: "FINALIZADA" },
    "test-admin",
  );
  assert.equal(hist.salidas.length, 1);
  const registro = hist.salidas[0];
  assert.equal(registro.estado, "FINALIZADA");
  assert.equal(registro.repartidor.id, "test-repartidor");
  assert.equal(registro.inspecciones.length, 2);

  const antes = registro.inspecciones.find((i) => i.momento === "ANTES");
  const despues = registro.inspecciones.find((i) => i.momento === "DESPUES");
  assert.equal(antes.kilometraje, 15200);
  assert.equal(antes.fotos.length, 1);
  assert.equal(despues.kilometraje, 15268.5);
  assert.equal(despues.estadoVehiculo, "CON_OBSERVACIONES");
  assert.equal(despues.fotos.length, 1);
});

await check("restringe todas las consultas y mutaciones de flota exclusivamente a administradores activos", async () => {
  for (const user of [null, "test-recepcion", "test-operario", "test-cliente", "test-inactivo", "sin-perfil"]) {
    await assert.rejects(execute(queries, "GetFlotaVehiculos", {}, user));
    await assert.rejects(execute(queries, "GetHistorialVehiculos", {}, user));
    await assert.rejects(
      execute(
        mutations,
        "RegistrarVehiculoFlota",
        { patente: "ZZZZ-99", marca: "Ford", modelo: "Transit" },
        user,
      ),
    );
  }
});

console.log(`${count} verificaciones de flota y vehículos completadas.`);
