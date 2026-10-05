# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetComandaDetalleOperario*](#getcomandadetalleoperario)
  - [*GetMisComandasAsignadas*](#getmiscomandasasignadas)
  - [*GetAvisosAdministracion*](#getavisosadministracion)
  - [*GetAvisosParaEquipo*](#getavisosparaequipo)
  - [*GetEtapasProduccion*](#getetapasproduccion)
  - [*GetSeguimientoProduccion*](#getseguimientoproduccion)
  - [*GetPanelProduccion*](#getpanelproduccion)
  - [*GetComandasParaAlertas*](#getcomandasparaalertas)
  - [*GetIncidencias*](#getincidencias)
  - [*GetMiComandaGuardada*](#getmicomandaguardada)
  - [*GetRoles*](#getroles)
  - [*GetMiPerfil*](#getmiperfil)
  - [*GetUsuarios*](#getusuarios)
  - [*GetComandaPorQr*](#getcomandaporqr)
  - [*GetInsumoPorQr*](#getinsumoporqr)
  - [*GetInventario*](#getinventario)
  - [*GetVehiculos*](#getvehiculos)
  - [*GetMisSalidasVehiculo*](#getmissalidasvehiculo)
  - [*GetComandasPaginadas*](#getcomandaspaginadas)
  - [*GetComandasActivasCount*](#getcomandasactivascount)
  - [*GetComandaDetalle*](#getcomandadetalle)
  - [*GetCatalogosComanda*](#getcatalogoscomanda)
  - [*DiagnosticoComandas*](#diagnosticocomandas)
  - [*GetFichasClientes*](#getfichasclientes)
  - [*GetReporteCuentas*](#getreportecuentas)
  - [*GetDetalleReporteCuentas*](#getdetallereportecuentas)
  - [*GetFiltrosReportes*](#getfiltrosreportes)
  - [*GetReporteServicios*](#getreporteservicios)
  - [*GetDetalleReporteServicios*](#getdetallereporteservicios)
  - [*GetSeguimientoPublicoPorQr*](#getseguimientopublicoporqr)
  - [*GetSeguimientoPublicoPorNumero*](#getseguimientopublicopornumero)
  - [*GetComandaOperativaPorQr*](#getcomandaoperativaporqr)
- [**Mutations**](#mutations)
  - [*AgregarComentarioComanda*](#agregarcomentariocomanda)
  - [*ResolverMiIncidencia*](#resolvermiincidencia)
  - [*AutoAsignarComandaOperario*](#autoasignarcomandaoperario)
  - [*CrearAviso*](#crearaviso)
  - [*Registrarse*](#registrarse)
  - [*CrearUsuarioAdministrado*](#crearusuarioadministrado)
  - [*RegistrarseComoCliente*](#registrarsecomocliente)
  - [*CrearClienteAdministrado*](#crearclienteadministrado)
  - [*ActualizarUsuario*](#actualizarusuario)
  - [*CrearVehiculo*](#crearvehiculo)
  - [*ActualizarVehiculo*](#actualizarvehiculo)
  - [*CrearSalidaVehiculo*](#crearsalidavehiculo)
  - [*RegistrarInspeccionAntes*](#registrarinspeccionantes)
  - [*IniciarSalidaVehiculo*](#iniciarsalidavehiculo)
  - [*RegistrarInspeccionDespues*](#registrarinspecciondespues)
  - [*AgregarFotoInspeccionVehiculo*](#agregarfotoinspeccionvehiculo)
  - [*CrearClienteComanda*](#crearclientecomanda)
  - [*EditarFichaCliente*](#editarfichacliente)
  - [*CrearComanda*](#crearcomanda)
  - [*AgregarComandaDetalle*](#agregarcomandadetalle)
  - [*AnularComanda*](#anularcomanda)
  - [*EntregarComanda*](#entregarcomanda)
  - [*EditarComanda*](#editarcomanda)
  - [*EliminarDetallesComanda*](#eliminardetallescomanda)
  - [*CrearTipoPrenda*](#creartipoprenda)
  - [*CrearTipoServicio*](#creartiposervicio)
  - [*CrearInsumo*](#crearinsumo)
  - [*ActualizarInsumo*](#actualizarinsumo)
  - [*RegistrarEntradaInventario*](#registrarentradainventario)
  - [*RegistrarSalidaInventario*](#registrarsalidainventario)
  - [*AsociarFlujoComandaPendiente*](#asociarflujocomandapendiente)
  - [*ConfigurarEtapaProduccion*](#configuraretapaproduccion)
  - [*ConfigurarLimitesEtapas*](#configurarlimitesetapas)
  - [*CompletarEtapaComanda*](#completaretapacomanda)
  - [*RegistrarIncidenciaComanda*](#registrarincidenciacomanda)
  - [*ActualizarEstadoIncidencia*](#actualizarestadoincidencia)
  - [*ReasignarOperarioEtapa*](#reasignaroperarioetapa)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetComandaDetalleOperario
You can execute the `GetComandaDetalleOperario` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getComandaDetalleOperario(vars: GetComandaDetalleOperarioVariables, options?: ExecuteQueryOptions): QueryPromise<GetComandaDetalleOperarioData, GetComandaDetalleOperarioVariables>;

interface GetComandaDetalleOperarioRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetComandaDetalleOperarioVariables): QueryRef<GetComandaDetalleOperarioData, GetComandaDetalleOperarioVariables>;
}
export const getComandaDetalleOperarioRef: GetComandaDetalleOperarioRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getComandaDetalleOperario(dc: DataConnect, vars: GetComandaDetalleOperarioVariables, options?: ExecuteQueryOptions): QueryPromise<GetComandaDetalleOperarioData, GetComandaDetalleOperarioVariables>;

interface GetComandaDetalleOperarioRef {
  ...
  (dc: DataConnect, vars: GetComandaDetalleOperarioVariables): QueryRef<GetComandaDetalleOperarioData, GetComandaDetalleOperarioVariables>;
}
export const getComandaDetalleOperarioRef: GetComandaDetalleOperarioRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getComandaDetalleOperarioRef:
```typescript
const name = getComandaDetalleOperarioRef.operationName;
console.log(name);
```

### Variables
The `GetComandaDetalleOperario` query requires an argument of type `GetComandaDetalleOperarioVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetComandaDetalleOperarioVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetComandaDetalleOperario` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetComandaDetalleOperarioData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetComandaDetalleOperarioData {
  comanda?: {
    id: UUIDString;
    numeroComanda: string;
    estado: ComandaEstado;
    fechaRecepcion: TimestampString;
    fechaEntregaEstimada?: TimestampString | null;
    fechaEntregaReal?: TimestampString | null;
    actualizadoEn: TimestampString;
    observaciones?: string | null;
    cliente: {
      nombre: string;
    };
    comandaDetalles_on_comanda: ({
      cantidad: number;
      detalle?: string | null;
      pesoKg?: number | null;
      tipoPrenda: {
        nombre: string;
      };
      tipoServicio: {
        nombre: string;
      };
    })[];
    comandaEtapas_on_comanda: ({
      etapaId: UUIDString;
      nombreEtapa?: string | null;
      ordenEtapa?: number | null;
      descripcionEtapa?: string | null;
      tiempoEstimadoMin?: number | null;
      estado: EtapaEstado;
      fechaInicio?: TimestampString | null;
      fechaCompletado?: TimestampString | null;
      operario?: {
        id: string;
        nombre: string;
        apellido?: string | null;
      } & Usuario_Key;
      asignadoA?: {
        id: string;
        nombre: string;
        apellido?: string | null;
      } & Usuario_Key;
      etapa: {
        nombre: string;
        orden: number;
        descripcion?: string | null;
        tiempoEstimadoMin?: number | null;
      };
    })[];
    comandaHistorialEstados_on_comanda: ({
      estadoNuevo: ComandaEstado;
      fecha: TimestampString;
      motivo?: string | null;
      usuario?: {
        nombre: string;
      };
    })[];
    incidenciaComandas_on_comanda: ({
      id: UUIDString;
      motivo: string;
      descripcion?: string | null;
      estado: IncidenciaEstado;
      fecha: TimestampString;
      reportadaPor: {
        id: string;
        nombre: string;
      } & Usuario_Key;
    } & IncidenciaComanda_Key)[];
  } & Comanda_Key;
}
```
### Using `GetComandaDetalleOperario`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getComandaDetalleOperario, GetComandaDetalleOperarioVariables } from '@dataconnect/generated';

// The `GetComandaDetalleOperario` query requires an argument of type `GetComandaDetalleOperarioVariables`:
const getComandaDetalleOperarioVars: GetComandaDetalleOperarioVariables = {
  id: ...,
};

// Call the `getComandaDetalleOperario()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getComandaDetalleOperario(getComandaDetalleOperarioVars);
// Variables can be defined inline as well.
const { data } = await getComandaDetalleOperario({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getComandaDetalleOperario(dataConnect, getComandaDetalleOperarioVars);

console.log(data.comanda);

// Or, you can use the `Promise` API.
getComandaDetalleOperario(getComandaDetalleOperarioVars).then((response) => {
  const data = response.data;
  console.log(data.comanda);
});
```

### Using `GetComandaDetalleOperario`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getComandaDetalleOperarioRef, GetComandaDetalleOperarioVariables } from '@dataconnect/generated';

// The `GetComandaDetalleOperario` query requires an argument of type `GetComandaDetalleOperarioVariables`:
const getComandaDetalleOperarioVars: GetComandaDetalleOperarioVariables = {
  id: ...,
};

// Call the `getComandaDetalleOperarioRef()` function to get a reference to the query.
const ref = getComandaDetalleOperarioRef(getComandaDetalleOperarioVars);
// Variables can be defined inline as well.
const ref = getComandaDetalleOperarioRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getComandaDetalleOperarioRef(dataConnect, getComandaDetalleOperarioVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.comanda);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.comanda);
});
```

## GetMisComandasAsignadas
You can execute the `GetMisComandasAsignadas` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMisComandasAsignadas(vars?: GetMisComandasAsignadasVariables, options?: ExecuteQueryOptions): QueryPromise<GetMisComandasAsignadasData, GetMisComandasAsignadasVariables>;

interface GetMisComandasAsignadasRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: GetMisComandasAsignadasVariables): QueryRef<GetMisComandasAsignadasData, GetMisComandasAsignadasVariables>;
}
export const getMisComandasAsignadasRef: GetMisComandasAsignadasRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMisComandasAsignadas(dc: DataConnect, vars?: GetMisComandasAsignadasVariables, options?: ExecuteQueryOptions): QueryPromise<GetMisComandasAsignadasData, GetMisComandasAsignadasVariables>;

interface GetMisComandasAsignadasRef {
  ...
  (dc: DataConnect, vars?: GetMisComandasAsignadasVariables): QueryRef<GetMisComandasAsignadasData, GetMisComandasAsignadasVariables>;
}
export const getMisComandasAsignadasRef: GetMisComandasAsignadasRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMisComandasAsignadasRef:
```typescript
const name = getMisComandasAsignadasRef.operationName;
console.log(name);
```

### Variables
The `GetMisComandasAsignadas` query has an optional argument of type `GetMisComandasAsignadasVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetMisComandasAsignadasVariables {
  limit?: number | null;
  offset?: number | null;
}
```
### Return Type
Recall that executing the `GetMisComandasAsignadas` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMisComandasAsignadasData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMisComandasAsignadasData {
  comandas: ({
    id: UUIDString;
    numeroComanda: string;
    estado: ComandaEstado;
    fechaRecepcion: TimestampString;
    cliente: {
      nombre: string;
    };
    comandaDetalles_on_comanda: ({
      cantidad: number;
      tipoPrenda: {
        nombre: string;
      };
      tipoServicio: {
        nombre: string;
      };
    })[];
    comandaEtapas_on_comanda: ({
      etapaId: UUIDString;
      nombreEtapa?: string | null;
      ordenEtapa?: number | null;
      descripcionEtapa?: string | null;
      tiempoEstimadoMin?: number | null;
      estado: EtapaEstado;
      fechaInicio?: TimestampString | null;
      asignadoA?: {
        nombre: string;
        apellido?: string | null;
      };
    })[];
  } & Comanda_Key)[];
}
```
### Using `GetMisComandasAsignadas`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMisComandasAsignadas, GetMisComandasAsignadasVariables } from '@dataconnect/generated';

// The `GetMisComandasAsignadas` query has an optional argument of type `GetMisComandasAsignadasVariables`:
const getMisComandasAsignadasVars: GetMisComandasAsignadasVariables = {
  limit: ..., // optional
  offset: ..., // optional
};

// Call the `getMisComandasAsignadas()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMisComandasAsignadas(getMisComandasAsignadasVars);
// Variables can be defined inline as well.
const { data } = await getMisComandasAsignadas({ limit: ..., offset: ..., });
// Since all variables are optional for this query, you can omit the `GetMisComandasAsignadasVariables` argument.
const { data } = await getMisComandasAsignadas();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMisComandasAsignadas(dataConnect, getMisComandasAsignadasVars);

console.log(data.comandas);

// Or, you can use the `Promise` API.
getMisComandasAsignadas(getMisComandasAsignadasVars).then((response) => {
  const data = response.data;
  console.log(data.comandas);
});
```

### Using `GetMisComandasAsignadas`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMisComandasAsignadasRef, GetMisComandasAsignadasVariables } from '@dataconnect/generated';

// The `GetMisComandasAsignadas` query has an optional argument of type `GetMisComandasAsignadasVariables`:
const getMisComandasAsignadasVars: GetMisComandasAsignadasVariables = {
  limit: ..., // optional
  offset: ..., // optional
};

// Call the `getMisComandasAsignadasRef()` function to get a reference to the query.
const ref = getMisComandasAsignadasRef(getMisComandasAsignadasVars);
// Variables can be defined inline as well.
const ref = getMisComandasAsignadasRef({ limit: ..., offset: ..., });
// Since all variables are optional for this query, you can omit the `GetMisComandasAsignadasVariables` argument.
const ref = getMisComandasAsignadasRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMisComandasAsignadasRef(dataConnect, getMisComandasAsignadasVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.comandas);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.comandas);
});
```

## GetAvisosAdministracion
You can execute the `GetAvisosAdministracion` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getAvisosAdministracion(vars?: GetAvisosAdministracionVariables, options?: ExecuteQueryOptions): QueryPromise<GetAvisosAdministracionData, GetAvisosAdministracionVariables>;

interface GetAvisosAdministracionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: GetAvisosAdministracionVariables): QueryRef<GetAvisosAdministracionData, GetAvisosAdministracionVariables>;
}
export const getAvisosAdministracionRef: GetAvisosAdministracionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getAvisosAdministracion(dc: DataConnect, vars?: GetAvisosAdministracionVariables, options?: ExecuteQueryOptions): QueryPromise<GetAvisosAdministracionData, GetAvisosAdministracionVariables>;

interface GetAvisosAdministracionRef {
  ...
  (dc: DataConnect, vars?: GetAvisosAdministracionVariables): QueryRef<GetAvisosAdministracionData, GetAvisosAdministracionVariables>;
}
export const getAvisosAdministracionRef: GetAvisosAdministracionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getAvisosAdministracionRef:
```typescript
const name = getAvisosAdministracionRef.operationName;
console.log(name);
```

### Variables
The `GetAvisosAdministracion` query has an optional argument of type `GetAvisosAdministracionVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetAvisosAdministracionVariables {
  limit?: number | null;
  offset?: number | null;
}
```
### Return Type
Recall that executing the `GetAvisosAdministracion` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetAvisosAdministracionData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetAvisosAdministracionData {
  avisos: ({
    id: UUIDString;
    titulo: string;
    contenido: string;
    fechaPublicacion: TimestampString;
    autor: {
      nombre: string;
      apellido?: string | null;
    };
    rolDestinatario?: {
      nombre: string;
    };
  } & Aviso_Key)[];
  total: ({
    _count: number;
  })[];
}
```
### Using `GetAvisosAdministracion`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getAvisosAdministracion, GetAvisosAdministracionVariables } from '@dataconnect/generated';

// The `GetAvisosAdministracion` query has an optional argument of type `GetAvisosAdministracionVariables`:
const getAvisosAdministracionVars: GetAvisosAdministracionVariables = {
  limit: ..., // optional
  offset: ..., // optional
};

// Call the `getAvisosAdministracion()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getAvisosAdministracion(getAvisosAdministracionVars);
// Variables can be defined inline as well.
const { data } = await getAvisosAdministracion({ limit: ..., offset: ..., });
// Since all variables are optional for this query, you can omit the `GetAvisosAdministracionVariables` argument.
const { data } = await getAvisosAdministracion();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getAvisosAdministracion(dataConnect, getAvisosAdministracionVars);

console.log(data.avisos);
console.log(data.total);

// Or, you can use the `Promise` API.
getAvisosAdministracion(getAvisosAdministracionVars).then((response) => {
  const data = response.data;
  console.log(data.avisos);
  console.log(data.total);
});
```

### Using `GetAvisosAdministracion`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getAvisosAdministracionRef, GetAvisosAdministracionVariables } from '@dataconnect/generated';

// The `GetAvisosAdministracion` query has an optional argument of type `GetAvisosAdministracionVariables`:
const getAvisosAdministracionVars: GetAvisosAdministracionVariables = {
  limit: ..., // optional
  offset: ..., // optional
};

// Call the `getAvisosAdministracionRef()` function to get a reference to the query.
const ref = getAvisosAdministracionRef(getAvisosAdministracionVars);
// Variables can be defined inline as well.
const ref = getAvisosAdministracionRef({ limit: ..., offset: ..., });
// Since all variables are optional for this query, you can omit the `GetAvisosAdministracionVariables` argument.
const ref = getAvisosAdministracionRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getAvisosAdministracionRef(dataConnect, getAvisosAdministracionVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.avisos);
console.log(data.total);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.avisos);
  console.log(data.total);
});
```

## GetAvisosParaEquipo
You can execute the `GetAvisosParaEquipo` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getAvisosParaEquipo(vars: GetAvisosParaEquipoVariables, options?: ExecuteQueryOptions): QueryPromise<GetAvisosParaEquipoData, GetAvisosParaEquipoVariables>;

interface GetAvisosParaEquipoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAvisosParaEquipoVariables): QueryRef<GetAvisosParaEquipoData, GetAvisosParaEquipoVariables>;
}
export const getAvisosParaEquipoRef: GetAvisosParaEquipoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getAvisosParaEquipo(dc: DataConnect, vars: GetAvisosParaEquipoVariables, options?: ExecuteQueryOptions): QueryPromise<GetAvisosParaEquipoData, GetAvisosParaEquipoVariables>;

interface GetAvisosParaEquipoRef {
  ...
  (dc: DataConnect, vars: GetAvisosParaEquipoVariables): QueryRef<GetAvisosParaEquipoData, GetAvisosParaEquipoVariables>;
}
export const getAvisosParaEquipoRef: GetAvisosParaEquipoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getAvisosParaEquipoRef:
```typescript
const name = getAvisosParaEquipoRef.operationName;
console.log(name);
```

### Variables
The `GetAvisosParaEquipo` query requires an argument of type `GetAvisosParaEquipoVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetAvisosParaEquipoVariables {
  rol: string;
  limit?: number | null;
  offset?: number | null;
}
```
### Return Type
Recall that executing the `GetAvisosParaEquipo` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetAvisosParaEquipoData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetAvisosParaEquipoData {
  avisos: ({
    id: UUIDString;
    titulo: string;
    contenido: string;
    fechaPublicacion: TimestampString;
    autor: {
      nombre: string;
      apellido?: string | null;
    };
    rolDestinatario?: {
      nombre: string;
    };
  } & Aviso_Key)[];
  total: ({
    _count: number;
  })[];
}
```
### Using `GetAvisosParaEquipo`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getAvisosParaEquipo, GetAvisosParaEquipoVariables } from '@dataconnect/generated';

// The `GetAvisosParaEquipo` query requires an argument of type `GetAvisosParaEquipoVariables`:
const getAvisosParaEquipoVars: GetAvisosParaEquipoVariables = {
  rol: ...,
  limit: ..., // optional
  offset: ..., // optional
};

// Call the `getAvisosParaEquipo()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getAvisosParaEquipo(getAvisosParaEquipoVars);
// Variables can be defined inline as well.
const { data } = await getAvisosParaEquipo({ rol: ..., limit: ..., offset: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getAvisosParaEquipo(dataConnect, getAvisosParaEquipoVars);

console.log(data.avisos);
console.log(data.total);

// Or, you can use the `Promise` API.
getAvisosParaEquipo(getAvisosParaEquipoVars).then((response) => {
  const data = response.data;
  console.log(data.avisos);
  console.log(data.total);
});
```

### Using `GetAvisosParaEquipo`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getAvisosParaEquipoRef, GetAvisosParaEquipoVariables } from '@dataconnect/generated';

// The `GetAvisosParaEquipo` query requires an argument of type `GetAvisosParaEquipoVariables`:
const getAvisosParaEquipoVars: GetAvisosParaEquipoVariables = {
  rol: ...,
  limit: ..., // optional
  offset: ..., // optional
};

// Call the `getAvisosParaEquipoRef()` function to get a reference to the query.
const ref = getAvisosParaEquipoRef(getAvisosParaEquipoVars);
// Variables can be defined inline as well.
const ref = getAvisosParaEquipoRef({ rol: ..., limit: ..., offset: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getAvisosParaEquipoRef(dataConnect, getAvisosParaEquipoVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.avisos);
console.log(data.total);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.avisos);
  console.log(data.total);
});
```

## GetEtapasProduccion
You can execute the `GetEtapasProduccion` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getEtapasProduccion(options?: ExecuteQueryOptions): QueryPromise<GetEtapasProduccionData, undefined>;

interface GetEtapasProduccionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetEtapasProduccionData, undefined>;
}
export const getEtapasProduccionRef: GetEtapasProduccionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getEtapasProduccion(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetEtapasProduccionData, undefined>;

interface GetEtapasProduccionRef {
  ...
  (dc: DataConnect): QueryRef<GetEtapasProduccionData, undefined>;
}
export const getEtapasProduccionRef: GetEtapasProduccionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getEtapasProduccionRef:
```typescript
const name = getEtapasProduccionRef.operationName;
console.log(name);
```

### Variables
The `GetEtapasProduccion` query has no variables.
### Return Type
Recall that executing the `GetEtapasProduccion` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetEtapasProduccionData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetEtapasProduccionData {
  etapaProduccions: ({
    id: UUIDString;
    nombre: string;
    orden: number;
    descripcion?: string | null;
    tiempoEstimadoMin?: number | null;
  } & EtapaProduccion_Key)[];
}
```
### Using `GetEtapasProduccion`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getEtapasProduccion } from '@dataconnect/generated';


// Call the `getEtapasProduccion()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getEtapasProduccion();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getEtapasProduccion(dataConnect);

console.log(data.etapaProduccions);

// Or, you can use the `Promise` API.
getEtapasProduccion().then((response) => {
  const data = response.data;
  console.log(data.etapaProduccions);
});
```

### Using `GetEtapasProduccion`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getEtapasProduccionRef } from '@dataconnect/generated';


// Call the `getEtapasProduccionRef()` function to get a reference to the query.
const ref = getEtapasProduccionRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getEtapasProduccionRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.etapaProduccions);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.etapaProduccions);
});
```

## GetSeguimientoProduccion
You can execute the `GetSeguimientoProduccion` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getSeguimientoProduccion(vars?: GetSeguimientoProduccionVariables, options?: ExecuteQueryOptions): QueryPromise<GetSeguimientoProduccionData, GetSeguimientoProduccionVariables>;

interface GetSeguimientoProduccionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: GetSeguimientoProduccionVariables): QueryRef<GetSeguimientoProduccionData, GetSeguimientoProduccionVariables>;
}
export const getSeguimientoProduccionRef: GetSeguimientoProduccionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getSeguimientoProduccion(dc: DataConnect, vars?: GetSeguimientoProduccionVariables, options?: ExecuteQueryOptions): QueryPromise<GetSeguimientoProduccionData, GetSeguimientoProduccionVariables>;

interface GetSeguimientoProduccionRef {
  ...
  (dc: DataConnect, vars?: GetSeguimientoProduccionVariables): QueryRef<GetSeguimientoProduccionData, GetSeguimientoProduccionVariables>;
}
export const getSeguimientoProduccionRef: GetSeguimientoProduccionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getSeguimientoProduccionRef:
```typescript
const name = getSeguimientoProduccionRef.operationName;
console.log(name);
```

### Variables
The `GetSeguimientoProduccion` query has an optional argument of type `GetSeguimientoProduccionVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetSeguimientoProduccionVariables {
  limit?: number | null;
  offset?: number | null;
  buscar?: string | null;
}
```
### Return Type
Recall that executing the `GetSeguimientoProduccion` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetSeguimientoProduccionData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetSeguimientoProduccionData {
  comandas: ({
    id: UUIDString;
    numeroComanda: string;
    estado: ComandaEstado;
    fechaRecepcion: TimestampString;
    cliente: {
      nombre: string;
    };
    comandaDetalles_on_comanda: ({
      cantidad: number;
      tipoPrenda: {
        nombre: string;
      };
      tipoServicio: {
        nombre: string;
      };
    })[];
    comandaEtapas_on_comanda: ({
      etapaId: UUIDString;
      nombreEtapa?: string | null;
      ordenEtapa?: number | null;
      descripcionEtapa?: string | null;
      tiempoEstimadoMin?: number | null;
      estado: EtapaEstado;
      fechaInicio?: TimestampString | null;
      fechaCompletado?: TimestampString | null;
      operario?: {
        id: string;
        nombre: string;
        apellido?: string | null;
      } & Usuario_Key;
      asignadoA?: {
        id: string;
        nombre: string;
        apellido?: string | null;
      } & Usuario_Key;
      etapa: {
        nombre: string;
        orden: number;
        descripcion?: string | null;
        tiempoEstimadoMin?: number | null;
      };
    })[];
    reasignacionOperarios_on_comanda: ({
      id: UUIDString;
      fecha: TimestampString;
      motivo?: string | null;
      etapa: {
        id: UUIDString;
        nombre: string;
        orden: number;
      } & EtapaProduccion_Key;
      operarioAnterior?: {
        id: string;
        nombre: string;
        apellido?: string | null;
      } & Usuario_Key;
      operarioNuevo: {
        id: string;
        nombre: string;
        apellido?: string | null;
      } & Usuario_Key;
      realizadoPor: {
        id: string;
        nombre: string;
        apellido?: string | null;
      } & Usuario_Key;
    } & ReasignacionOperario_Key)[];
  } & Comanda_Key)[];
  total: ({
    _count: number;
  })[];
  operarios: ({
    id: string;
    nombre: string;
    apellido?: string | null;
  } & Usuario_Key)[];
}
```
### Using `GetSeguimientoProduccion`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getSeguimientoProduccion, GetSeguimientoProduccionVariables } from '@dataconnect/generated';

// The `GetSeguimientoProduccion` query has an optional argument of type `GetSeguimientoProduccionVariables`:
const getSeguimientoProduccionVars: GetSeguimientoProduccionVariables = {
  limit: ..., // optional
  offset: ..., // optional
  buscar: ..., // optional
};

// Call the `getSeguimientoProduccion()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getSeguimientoProduccion(getSeguimientoProduccionVars);
// Variables can be defined inline as well.
const { data } = await getSeguimientoProduccion({ limit: ..., offset: ..., buscar: ..., });
// Since all variables are optional for this query, you can omit the `GetSeguimientoProduccionVariables` argument.
const { data } = await getSeguimientoProduccion();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getSeguimientoProduccion(dataConnect, getSeguimientoProduccionVars);

console.log(data.comandas);
console.log(data.total);
console.log(data.operarios);

// Or, you can use the `Promise` API.
getSeguimientoProduccion(getSeguimientoProduccionVars).then((response) => {
  const data = response.data;
  console.log(data.comandas);
  console.log(data.total);
  console.log(data.operarios);
});
```

### Using `GetSeguimientoProduccion`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getSeguimientoProduccionRef, GetSeguimientoProduccionVariables } from '@dataconnect/generated';

// The `GetSeguimientoProduccion` query has an optional argument of type `GetSeguimientoProduccionVariables`:
const getSeguimientoProduccionVars: GetSeguimientoProduccionVariables = {
  limit: ..., // optional
  offset: ..., // optional
  buscar: ..., // optional
};

// Call the `getSeguimientoProduccionRef()` function to get a reference to the query.
const ref = getSeguimientoProduccionRef(getSeguimientoProduccionVars);
// Variables can be defined inline as well.
const ref = getSeguimientoProduccionRef({ limit: ..., offset: ..., buscar: ..., });
// Since all variables are optional for this query, you can omit the `GetSeguimientoProduccionVariables` argument.
const ref = getSeguimientoProduccionRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getSeguimientoProduccionRef(dataConnect, getSeguimientoProduccionVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.comandas);
console.log(data.total);
console.log(data.operarios);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.comandas);
  console.log(data.total);
  console.log(data.operarios);
});
```

## GetPanelProduccion
You can execute the `GetPanelProduccion` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getPanelProduccion(vars?: GetPanelProduccionVariables, options?: ExecuteQueryOptions): QueryPromise<GetPanelProduccionData, GetPanelProduccionVariables>;

interface GetPanelProduccionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: GetPanelProduccionVariables): QueryRef<GetPanelProduccionData, GetPanelProduccionVariables>;
}
export const getPanelProduccionRef: GetPanelProduccionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPanelProduccion(dc: DataConnect, vars?: GetPanelProduccionVariables, options?: ExecuteQueryOptions): QueryPromise<GetPanelProduccionData, GetPanelProduccionVariables>;

interface GetPanelProduccionRef {
  ...
  (dc: DataConnect, vars?: GetPanelProduccionVariables): QueryRef<GetPanelProduccionData, GetPanelProduccionVariables>;
}
export const getPanelProduccionRef: GetPanelProduccionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPanelProduccionRef:
```typescript
const name = getPanelProduccionRef.operationName;
console.log(name);
```

### Variables
The `GetPanelProduccion` query has an optional argument of type `GetPanelProduccionVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetPanelProduccionVariables {
  limit?: number | null;
}
```
### Return Type
Recall that executing the `GetPanelProduccion` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPanelProduccionData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetPanelProduccionData {
  comandas: ({
    id: UUIDString;
    numeroComanda: string;
    estado: ComandaEstado;
    valorTotal: number;
    fechaRecepcion: TimestampString;
    actualizadoEn: TimestampString;
    cliente: {
      id: UUIDString;
      nombre: string;
      tipoCliente: TipoCliente;
    } & Cliente_Key;
    comandaDetalles_on_comanda: ({
      cantidad: number;
    })[];
    comandaEtapas_on_comanda: ({
      etapaId: UUIDString;
      nombreEtapa?: string | null;
      ordenEtapa?: number | null;
      tiempoEstimadoMin?: number | null;
      estado: EtapaEstado;
      fechaInicio?: TimestampString | null;
      fechaCompletado?: TimestampString | null;
      asignadoA?: {
        id: string;
        nombre: string;
        apellido?: string | null;
      } & Usuario_Key;
      operario?: {
        id: string;
        nombre: string;
        apellido?: string | null;
      } & Usuario_Key;
      etapa: {
        nombre: string;
        orden: number;
        tiempoEstimadoMin?: number | null;
      };
    })[];
    incidenciaComandas_on_comanda: ({
      id: UUIDString;
      estado: IncidenciaEstado;
    } & IncidenciaComanda_Key)[];
  } & Comanda_Key)[];
  pendientes: ({
    _count: number;
  })[];
  enProceso: ({
    _count: number;
  })[];
  listas: ({
    _count: number;
  })[];
}
```
### Using `GetPanelProduccion`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPanelProduccion, GetPanelProduccionVariables } from '@dataconnect/generated';

// The `GetPanelProduccion` query has an optional argument of type `GetPanelProduccionVariables`:
const getPanelProduccionVars: GetPanelProduccionVariables = {
  limit: ..., // optional
};

// Call the `getPanelProduccion()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPanelProduccion(getPanelProduccionVars);
// Variables can be defined inline as well.
const { data } = await getPanelProduccion({ limit: ..., });
// Since all variables are optional for this query, you can omit the `GetPanelProduccionVariables` argument.
const { data } = await getPanelProduccion();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPanelProduccion(dataConnect, getPanelProduccionVars);

console.log(data.comandas);
console.log(data.pendientes);
console.log(data.enProceso);
console.log(data.listas);

// Or, you can use the `Promise` API.
getPanelProduccion(getPanelProduccionVars).then((response) => {
  const data = response.data;
  console.log(data.comandas);
  console.log(data.pendientes);
  console.log(data.enProceso);
  console.log(data.listas);
});
```

### Using `GetPanelProduccion`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPanelProduccionRef, GetPanelProduccionVariables } from '@dataconnect/generated';

// The `GetPanelProduccion` query has an optional argument of type `GetPanelProduccionVariables`:
const getPanelProduccionVars: GetPanelProduccionVariables = {
  limit: ..., // optional
};

// Call the `getPanelProduccionRef()` function to get a reference to the query.
const ref = getPanelProduccionRef(getPanelProduccionVars);
// Variables can be defined inline as well.
const ref = getPanelProduccionRef({ limit: ..., });
// Since all variables are optional for this query, you can omit the `GetPanelProduccionVariables` argument.
const ref = getPanelProduccionRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPanelProduccionRef(dataConnect, getPanelProduccionVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.comandas);
console.log(data.pendientes);
console.log(data.enProceso);
console.log(data.listas);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.comandas);
  console.log(data.pendientes);
  console.log(data.enProceso);
  console.log(data.listas);
});
```

## GetComandasParaAlertas
You can execute the `GetComandasParaAlertas` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getComandasParaAlertas(vars?: GetComandasParaAlertasVariables, options?: ExecuteQueryOptions): QueryPromise<GetComandasParaAlertasData, GetComandasParaAlertasVariables>;

interface GetComandasParaAlertasRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: GetComandasParaAlertasVariables): QueryRef<GetComandasParaAlertasData, GetComandasParaAlertasVariables>;
}
export const getComandasParaAlertasRef: GetComandasParaAlertasRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getComandasParaAlertas(dc: DataConnect, vars?: GetComandasParaAlertasVariables, options?: ExecuteQueryOptions): QueryPromise<GetComandasParaAlertasData, GetComandasParaAlertasVariables>;

interface GetComandasParaAlertasRef {
  ...
  (dc: DataConnect, vars?: GetComandasParaAlertasVariables): QueryRef<GetComandasParaAlertasData, GetComandasParaAlertasVariables>;
}
export const getComandasParaAlertasRef: GetComandasParaAlertasRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getComandasParaAlertasRef:
```typescript
const name = getComandasParaAlertasRef.operationName;
console.log(name);
```

### Variables
The `GetComandasParaAlertas` query has an optional argument of type `GetComandasParaAlertasVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetComandasParaAlertasVariables {
  limit?: number | null;
  offset?: number | null;
}
```
### Return Type
Recall that executing the `GetComandasParaAlertas` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetComandasParaAlertasData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetComandasParaAlertasData {
  comandas: ({
    id: UUIDString;
    numeroComanda: string;
    estado: ComandaEstado;
    fechaRecepcion: TimestampString;
    comandaEtapas_on_comanda: ({
      etapaId: UUIDString;
      nombreEtapa?: string | null;
      ordenEtapa?: number | null;
      tiempoEstimadoMin?: number | null;
      estado: EtapaEstado;
      fechaInicio?: TimestampString | null;
      asignadoA?: {
        nombre: string;
        apellido?: string | null;
      };
      etapa: {
        nombre: string;
        orden: number;
        tiempoEstimadoMin?: number | null;
      };
    })[];
  } & Comanda_Key)[];
}
```
### Using `GetComandasParaAlertas`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getComandasParaAlertas, GetComandasParaAlertasVariables } from '@dataconnect/generated';

// The `GetComandasParaAlertas` query has an optional argument of type `GetComandasParaAlertasVariables`:
const getComandasParaAlertasVars: GetComandasParaAlertasVariables = {
  limit: ..., // optional
  offset: ..., // optional
};

// Call the `getComandasParaAlertas()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getComandasParaAlertas(getComandasParaAlertasVars);
// Variables can be defined inline as well.
const { data } = await getComandasParaAlertas({ limit: ..., offset: ..., });
// Since all variables are optional for this query, you can omit the `GetComandasParaAlertasVariables` argument.
const { data } = await getComandasParaAlertas();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getComandasParaAlertas(dataConnect, getComandasParaAlertasVars);

console.log(data.comandas);

// Or, you can use the `Promise` API.
getComandasParaAlertas(getComandasParaAlertasVars).then((response) => {
  const data = response.data;
  console.log(data.comandas);
});
```

### Using `GetComandasParaAlertas`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getComandasParaAlertasRef, GetComandasParaAlertasVariables } from '@dataconnect/generated';

// The `GetComandasParaAlertas` query has an optional argument of type `GetComandasParaAlertasVariables`:
const getComandasParaAlertasVars: GetComandasParaAlertasVariables = {
  limit: ..., // optional
  offset: ..., // optional
};

// Call the `getComandasParaAlertasRef()` function to get a reference to the query.
const ref = getComandasParaAlertasRef(getComandasParaAlertasVars);
// Variables can be defined inline as well.
const ref = getComandasParaAlertasRef({ limit: ..., offset: ..., });
// Since all variables are optional for this query, you can omit the `GetComandasParaAlertasVariables` argument.
const ref = getComandasParaAlertasRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getComandasParaAlertasRef(dataConnect, getComandasParaAlertasVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.comandas);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.comandas);
});
```

## GetIncidencias
You can execute the `GetIncidencias` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getIncidencias(options?: ExecuteQueryOptions): QueryPromise<GetIncidenciasData, undefined>;

interface GetIncidenciasRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetIncidenciasData, undefined>;
}
export const getIncidenciasRef: GetIncidenciasRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getIncidencias(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetIncidenciasData, undefined>;

interface GetIncidenciasRef {
  ...
  (dc: DataConnect): QueryRef<GetIncidenciasData, undefined>;
}
export const getIncidenciasRef: GetIncidenciasRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getIncidenciasRef:
```typescript
const name = getIncidenciasRef.operationName;
console.log(name);
```

### Variables
The `GetIncidencias` query has no variables.
### Return Type
Recall that executing the `GetIncidencias` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetIncidenciasData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetIncidenciasData {
  incidenciaComandas: ({
    id: UUIDString;
    motivo: string;
    descripcion?: string | null;
    estado: IncidenciaEstado;
    fecha: TimestampString;
    actualizadaEn: TimestampString;
    comanda: {
      id: UUIDString;
      numeroComanda: string;
      estado: ComandaEstado;
      cliente: {
        nombre: string;
      };
    } & Comanda_Key;
    reportadaPor: {
      id: string;
      nombre: string;
      apellido?: string | null;
    } & Usuario_Key;
  } & IncidenciaComanda_Key)[];
}
```
### Using `GetIncidencias`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getIncidencias } from '@dataconnect/generated';


// Call the `getIncidencias()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getIncidencias();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getIncidencias(dataConnect);

console.log(data.incidenciaComandas);

// Or, you can use the `Promise` API.
getIncidencias().then((response) => {
  const data = response.data;
  console.log(data.incidenciaComandas);
});
```

### Using `GetIncidencias`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getIncidenciasRef } from '@dataconnect/generated';


// Call the `getIncidenciasRef()` function to get a reference to the query.
const ref = getIncidenciasRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getIncidenciasRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.incidenciaComandas);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.incidenciaComandas);
});
```

## GetMiComandaGuardada
You can execute the `GetMiComandaGuardada` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMiComandaGuardada(vars: GetMiComandaGuardadaVariables, options?: ExecuteQueryOptions): QueryPromise<GetMiComandaGuardadaData, GetMiComandaGuardadaVariables>;

interface GetMiComandaGuardadaRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetMiComandaGuardadaVariables): QueryRef<GetMiComandaGuardadaData, GetMiComandaGuardadaVariables>;
}
export const getMiComandaGuardadaRef: GetMiComandaGuardadaRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMiComandaGuardada(dc: DataConnect, vars: GetMiComandaGuardadaVariables, options?: ExecuteQueryOptions): QueryPromise<GetMiComandaGuardadaData, GetMiComandaGuardadaVariables>;

interface GetMiComandaGuardadaRef {
  ...
  (dc: DataConnect, vars: GetMiComandaGuardadaVariables): QueryRef<GetMiComandaGuardadaData, GetMiComandaGuardadaVariables>;
}
export const getMiComandaGuardadaRef: GetMiComandaGuardadaRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMiComandaGuardadaRef:
```typescript
const name = getMiComandaGuardadaRef.operationName;
console.log(name);
```

### Variables
The `GetMiComandaGuardada` query requires an argument of type `GetMiComandaGuardadaVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetMiComandaGuardadaVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetMiComandaGuardada` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMiComandaGuardadaData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMiComandaGuardadaData {
  comanda?: {
    id: UUIDString;
    numeroComanda: string;
  } & Comanda_Key;
}
```
### Using `GetMiComandaGuardada`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMiComandaGuardada, GetMiComandaGuardadaVariables } from '@dataconnect/generated';

// The `GetMiComandaGuardada` query requires an argument of type `GetMiComandaGuardadaVariables`:
const getMiComandaGuardadaVars: GetMiComandaGuardadaVariables = {
  id: ...,
};

// Call the `getMiComandaGuardada()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMiComandaGuardada(getMiComandaGuardadaVars);
// Variables can be defined inline as well.
const { data } = await getMiComandaGuardada({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMiComandaGuardada(dataConnect, getMiComandaGuardadaVars);

console.log(data.comanda);

// Or, you can use the `Promise` API.
getMiComandaGuardada(getMiComandaGuardadaVars).then((response) => {
  const data = response.data;
  console.log(data.comanda);
});
```

### Using `GetMiComandaGuardada`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMiComandaGuardadaRef, GetMiComandaGuardadaVariables } from '@dataconnect/generated';

// The `GetMiComandaGuardada` query requires an argument of type `GetMiComandaGuardadaVariables`:
const getMiComandaGuardadaVars: GetMiComandaGuardadaVariables = {
  id: ...,
};

// Call the `getMiComandaGuardadaRef()` function to get a reference to the query.
const ref = getMiComandaGuardadaRef(getMiComandaGuardadaVars);
// Variables can be defined inline as well.
const ref = getMiComandaGuardadaRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMiComandaGuardadaRef(dataConnect, getMiComandaGuardadaVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.comanda);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.comanda);
});
```

## GetRoles
You can execute the `GetRoles` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getRoles(options?: ExecuteQueryOptions): QueryPromise<GetRolesData, undefined>;

interface GetRolesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetRolesData, undefined>;
}
export const getRolesRef: GetRolesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getRoles(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetRolesData, undefined>;

interface GetRolesRef {
  ...
  (dc: DataConnect): QueryRef<GetRolesData, undefined>;
}
export const getRolesRef: GetRolesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getRolesRef:
```typescript
const name = getRolesRef.operationName;
console.log(name);
```

### Variables
The `GetRoles` query has no variables.
### Return Type
Recall that executing the `GetRoles` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetRolesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetRolesData {
  rols: ({
    id: UUIDString;
    nombre: string;
    descripcion?: string | null;
  } & Rol_Key)[];
}
```
### Using `GetRoles`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getRoles } from '@dataconnect/generated';


// Call the `getRoles()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getRoles();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getRoles(dataConnect);

console.log(data.rols);

// Or, you can use the `Promise` API.
getRoles().then((response) => {
  const data = response.data;
  console.log(data.rols);
});
```

### Using `GetRoles`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getRolesRef } from '@dataconnect/generated';


// Call the `getRolesRef()` function to get a reference to the query.
const ref = getRolesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getRolesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.rols);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.rols);
});
```

## GetMiPerfil
You can execute the `GetMiPerfil` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMiPerfil(options?: ExecuteQueryOptions): QueryPromise<GetMiPerfilData, undefined>;

interface GetMiPerfilRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMiPerfilData, undefined>;
}
export const getMiPerfilRef: GetMiPerfilRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMiPerfil(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMiPerfilData, undefined>;

interface GetMiPerfilRef {
  ...
  (dc: DataConnect): QueryRef<GetMiPerfilData, undefined>;
}
export const getMiPerfilRef: GetMiPerfilRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMiPerfilRef:
```typescript
const name = getMiPerfilRef.operationName;
console.log(name);
```

### Variables
The `GetMiPerfil` query has no variables.
### Return Type
Recall that executing the `GetMiPerfil` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMiPerfilData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMiPerfilData {
  usuario?: {
    id: string;
    rut?: string | null;
    nombre: string;
    apellido?: string | null;
    email: string;
    telefono?: string | null;
    activo: boolean;
    creadoEn: TimestampString;
    rol: {
      id: UUIDString;
      nombre: string;
      descripcion?: string | null;
    } & Rol_Key;
    clientes_on_usuario: ({
      id: UUIDString;
      tipoCliente: TipoCliente;
      direccion?: string | null;
    } & Cliente_Key)[];
  } & Usuario_Key;
}
```
### Using `GetMiPerfil`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMiPerfil } from '@dataconnect/generated';


// Call the `getMiPerfil()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMiPerfil();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMiPerfil(dataConnect);

console.log(data.usuario);

// Or, you can use the `Promise` API.
getMiPerfil().then((response) => {
  const data = response.data;
  console.log(data.usuario);
});
```

### Using `GetMiPerfil`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMiPerfilRef } from '@dataconnect/generated';


// Call the `getMiPerfilRef()` function to get a reference to the query.
const ref = getMiPerfilRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMiPerfilRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.usuario);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.usuario);
});
```

## GetUsuarios
You can execute the `GetUsuarios` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getUsuarios(options?: ExecuteQueryOptions): QueryPromise<GetUsuariosData, undefined>;

interface GetUsuariosRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUsuariosData, undefined>;
}
export const getUsuariosRef: GetUsuariosRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUsuarios(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetUsuariosData, undefined>;

interface GetUsuariosRef {
  ...
  (dc: DataConnect): QueryRef<GetUsuariosData, undefined>;
}
export const getUsuariosRef: GetUsuariosRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUsuariosRef:
```typescript
const name = getUsuariosRef.operationName;
console.log(name);
```

### Variables
The `GetUsuarios` query has no variables.
### Return Type
Recall that executing the `GetUsuarios` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUsuariosData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUsuariosData {
  usuarios: ({
    id: string;
    rut?: string | null;
    nombre: string;
    apellido?: string | null;
    email: string;
    telefono?: string | null;
    activo: boolean;
    creadoEn: TimestampString;
    rol: {
      id: UUIDString;
      nombre: string;
    } & Rol_Key;
  } & Usuario_Key)[];
}
```
### Using `GetUsuarios`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUsuarios } from '@dataconnect/generated';


// Call the `getUsuarios()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUsuarios();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUsuarios(dataConnect);

console.log(data.usuarios);

// Or, you can use the `Promise` API.
getUsuarios().then((response) => {
  const data = response.data;
  console.log(data.usuarios);
});
```

### Using `GetUsuarios`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUsuariosRef } from '@dataconnect/generated';


// Call the `getUsuariosRef()` function to get a reference to the query.
const ref = getUsuariosRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUsuariosRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.usuarios);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.usuarios);
});
```

## GetComandaPorQr
You can execute the `GetComandaPorQr` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getComandaPorQr(vars: GetComandaPorQrVariables, options?: ExecuteQueryOptions): QueryPromise<GetComandaPorQrData, GetComandaPorQrVariables>;

interface GetComandaPorQrRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetComandaPorQrVariables): QueryRef<GetComandaPorQrData, GetComandaPorQrVariables>;
}
export const getComandaPorQrRef: GetComandaPorQrRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getComandaPorQr(dc: DataConnect, vars: GetComandaPorQrVariables, options?: ExecuteQueryOptions): QueryPromise<GetComandaPorQrData, GetComandaPorQrVariables>;

interface GetComandaPorQrRef {
  ...
  (dc: DataConnect, vars: GetComandaPorQrVariables): QueryRef<GetComandaPorQrData, GetComandaPorQrVariables>;
}
export const getComandaPorQrRef: GetComandaPorQrRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getComandaPorQrRef:
```typescript
const name = getComandaPorQrRef.operationName;
console.log(name);
```

### Variables
The `GetComandaPorQr` query requires an argument of type `GetComandaPorQrVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetComandaPorQrVariables {
  codigoQr: UUIDString;
}
```
### Return Type
Recall that executing the `GetComandaPorQr` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetComandaPorQrData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetComandaPorQrData {
  comanda?: {
    id: UUIDString;
    codigoQr: UUIDString;
    numeroComanda: string;
    estado: ComandaEstado;
    fechaRecepcion: TimestampString;
    fechaEntregaEstimada?: TimestampString | null;
    fechaEntregaReal?: TimestampString | null;
    actualizadoEn: TimestampString;
    comandaDetalles_on_comanda: ({
      cantidad: number;
      pesoKg?: number | null;
      tipoPrenda: {
        nombre: string;
      };
      tipoServicio: {
        nombre: string;
      };
    })[];
  } & Comanda_Key;
}
```
### Using `GetComandaPorQr`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getComandaPorQr, GetComandaPorQrVariables } from '@dataconnect/generated';

// The `GetComandaPorQr` query requires an argument of type `GetComandaPorQrVariables`:
const getComandaPorQrVars: GetComandaPorQrVariables = {
  codigoQr: ...,
};

// Call the `getComandaPorQr()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getComandaPorQr(getComandaPorQrVars);
// Variables can be defined inline as well.
const { data } = await getComandaPorQr({ codigoQr: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getComandaPorQr(dataConnect, getComandaPorQrVars);

console.log(data.comanda);

// Or, you can use the `Promise` API.
getComandaPorQr(getComandaPorQrVars).then((response) => {
  const data = response.data;
  console.log(data.comanda);
});
```

### Using `GetComandaPorQr`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getComandaPorQrRef, GetComandaPorQrVariables } from '@dataconnect/generated';

// The `GetComandaPorQr` query requires an argument of type `GetComandaPorQrVariables`:
const getComandaPorQrVars: GetComandaPorQrVariables = {
  codigoQr: ...,
};

// Call the `getComandaPorQrRef()` function to get a reference to the query.
const ref = getComandaPorQrRef(getComandaPorQrVars);
// Variables can be defined inline as well.
const ref = getComandaPorQrRef({ codigoQr: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getComandaPorQrRef(dataConnect, getComandaPorQrVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.comanda);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.comanda);
});
```

## GetInsumoPorQr
You can execute the `GetInsumoPorQr` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getInsumoPorQr(vars: GetInsumoPorQrVariables, options?: ExecuteQueryOptions): QueryPromise<GetInsumoPorQrData, GetInsumoPorQrVariables>;

interface GetInsumoPorQrRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetInsumoPorQrVariables): QueryRef<GetInsumoPorQrData, GetInsumoPorQrVariables>;
}
export const getInsumoPorQrRef: GetInsumoPorQrRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getInsumoPorQr(dc: DataConnect, vars: GetInsumoPorQrVariables, options?: ExecuteQueryOptions): QueryPromise<GetInsumoPorQrData, GetInsumoPorQrVariables>;

interface GetInsumoPorQrRef {
  ...
  (dc: DataConnect, vars: GetInsumoPorQrVariables): QueryRef<GetInsumoPorQrData, GetInsumoPorQrVariables>;
}
export const getInsumoPorQrRef: GetInsumoPorQrRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getInsumoPorQrRef:
```typescript
const name = getInsumoPorQrRef.operationName;
console.log(name);
```

### Variables
The `GetInsumoPorQr` query requires an argument of type `GetInsumoPorQrVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetInsumoPorQrVariables {
  codigoQr: UUIDString;
}
```
### Return Type
Recall that executing the `GetInsumoPorQr` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetInsumoPorQrData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetInsumoPorQrData {
  insumo?: {
    id: UUIDString;
    codigoQr: UUIDString;
    nombre: string;
    unidadMedida: string;
    stockActual: number;
    stockMinimo: number;
    activo: boolean;
  } & Insumo_Key;
}
```
### Using `GetInsumoPorQr`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getInsumoPorQr, GetInsumoPorQrVariables } from '@dataconnect/generated';

// The `GetInsumoPorQr` query requires an argument of type `GetInsumoPorQrVariables`:
const getInsumoPorQrVars: GetInsumoPorQrVariables = {
  codigoQr: ...,
};

// Call the `getInsumoPorQr()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getInsumoPorQr(getInsumoPorQrVars);
// Variables can be defined inline as well.
const { data } = await getInsumoPorQr({ codigoQr: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getInsumoPorQr(dataConnect, getInsumoPorQrVars);

console.log(data.insumo);

// Or, you can use the `Promise` API.
getInsumoPorQr(getInsumoPorQrVars).then((response) => {
  const data = response.data;
  console.log(data.insumo);
});
```

### Using `GetInsumoPorQr`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getInsumoPorQrRef, GetInsumoPorQrVariables } from '@dataconnect/generated';

// The `GetInsumoPorQr` query requires an argument of type `GetInsumoPorQrVariables`:
const getInsumoPorQrVars: GetInsumoPorQrVariables = {
  codigoQr: ...,
};

// Call the `getInsumoPorQrRef()` function to get a reference to the query.
const ref = getInsumoPorQrRef(getInsumoPorQrVars);
// Variables can be defined inline as well.
const ref = getInsumoPorQrRef({ codigoQr: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getInsumoPorQrRef(dataConnect, getInsumoPorQrVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.insumo);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.insumo);
});
```

## GetInventario
You can execute the `GetInventario` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getInventario(options?: ExecuteQueryOptions): QueryPromise<GetInventarioData, undefined>;

interface GetInventarioRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetInventarioData, undefined>;
}
export const getInventarioRef: GetInventarioRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getInventario(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetInventarioData, undefined>;

interface GetInventarioRef {
  ...
  (dc: DataConnect): QueryRef<GetInventarioData, undefined>;
}
export const getInventarioRef: GetInventarioRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getInventarioRef:
```typescript
const name = getInventarioRef.operationName;
console.log(name);
```

### Variables
The `GetInventario` query has no variables.
### Return Type
Recall that executing the `GetInventario` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetInventarioData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetInventarioData {
  insumos: ({
    id: UUIDString;
    codigoQr: UUIDString;
    nombre: string;
    unidadMedida: string;
    stockActual: number;
    stockMinimo: number;
    activo: boolean;
    creadoEn: TimestampString;
  } & Insumo_Key)[];
  movimientoInventarios: ({
    id: UUIDString;
    tipoMovimiento: TipoMovimiento;
    cantidad: number;
    motivo?: string | null;
    fecha: TimestampString;
    insumo: {
      id: UUIDString;
      nombre: string;
      unidadMedida: string;
    } & Insumo_Key;
    usuario?: {
      id: string;
      nombre: string;
      apellido?: string | null;
    } & Usuario_Key;
  } & MovimientoInventario_Key)[];
}
```
### Using `GetInventario`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getInventario } from '@dataconnect/generated';


// Call the `getInventario()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getInventario();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getInventario(dataConnect);

console.log(data.insumos);
console.log(data.movimientoInventarios);

// Or, you can use the `Promise` API.
getInventario().then((response) => {
  const data = response.data;
  console.log(data.insumos);
  console.log(data.movimientoInventarios);
});
```

### Using `GetInventario`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getInventarioRef } from '@dataconnect/generated';


// Call the `getInventarioRef()` function to get a reference to the query.
const ref = getInventarioRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getInventarioRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.insumos);
console.log(data.movimientoInventarios);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.insumos);
  console.log(data.movimientoInventarios);
});
```

## GetVehiculos
You can execute the `GetVehiculos` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getVehiculos(options?: ExecuteQueryOptions): QueryPromise<GetVehiculosData, undefined>;

interface GetVehiculosRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetVehiculosData, undefined>;
}
export const getVehiculosRef: GetVehiculosRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getVehiculos(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetVehiculosData, undefined>;

interface GetVehiculosRef {
  ...
  (dc: DataConnect): QueryRef<GetVehiculosData, undefined>;
}
export const getVehiculosRef: GetVehiculosRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getVehiculosRef:
```typescript
const name = getVehiculosRef.operationName;
console.log(name);
```

### Variables
The `GetVehiculos` query has no variables.
### Return Type
Recall that executing the `GetVehiculos` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetVehiculosData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetVehiculosData {
  vehiculos: ({
    id: UUIDString;
    patente: string;
    marca: string;
    modelo: string;
    anio?: number | null;
    descripcion?: string | null;
    activo: boolean;
    creadoEn: TimestampString;
  } & Vehiculo_Key)[];
}
```
### Using `GetVehiculos`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getVehiculos } from '@dataconnect/generated';


// Call the `getVehiculos()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getVehiculos();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getVehiculos(dataConnect);

console.log(data.vehiculos);

// Or, you can use the `Promise` API.
getVehiculos().then((response) => {
  const data = response.data;
  console.log(data.vehiculos);
});
```

### Using `GetVehiculos`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getVehiculosRef } from '@dataconnect/generated';


// Call the `getVehiculosRef()` function to get a reference to the query.
const ref = getVehiculosRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getVehiculosRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.vehiculos);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.vehiculos);
});
```

## GetMisSalidasVehiculo
You can execute the `GetMisSalidasVehiculo` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMisSalidasVehiculo(options?: ExecuteQueryOptions): QueryPromise<GetMisSalidasVehiculoData, undefined>;

interface GetMisSalidasVehiculoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMisSalidasVehiculoData, undefined>;
}
export const getMisSalidasVehiculoRef: GetMisSalidasVehiculoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMisSalidasVehiculo(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMisSalidasVehiculoData, undefined>;

interface GetMisSalidasVehiculoRef {
  ...
  (dc: DataConnect): QueryRef<GetMisSalidasVehiculoData, undefined>;
}
export const getMisSalidasVehiculoRef: GetMisSalidasVehiculoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMisSalidasVehiculoRef:
```typescript
const name = getMisSalidasVehiculoRef.operationName;
console.log(name);
```

### Variables
The `GetMisSalidasVehiculo` query has no variables.
### Return Type
Recall that executing the `GetMisSalidasVehiculo` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMisSalidasVehiculoData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMisSalidasVehiculoData {
  salidaVehiculos: ({
    id: UUIDString;
    estado: SalidaVehiculoEstado;
    fechaSalida?: TimestampString | null;
    fechaRetorno?: TimestampString | null;
    observaciones?: string | null;
    creadoEn: TimestampString;
    vehiculo: {
      id: UUIDString;
      patente: string;
      marca: string;
      modelo: string;
    } & Vehiculo_Key;
    inspeccionVehiculos_on_salida: ({
      id: UUIDString;
      momento: MomentoInspeccion;
      estadoVehiculo: EstadoVehiculo;
      kilometraje: number;
      observaciones?: string | null;
      registradoEn: TimestampString;
      fotoInspeccionVehiculos_on_inspeccion: ({
        id: UUIDString;
        rutaStorage: string;
        descripcion?: string | null;
        orden: number;
      } & FotoInspeccionVehiculo_Key)[];
    } & InspeccionVehiculo_Key)[];
  } & SalidaVehiculo_Key)[];
}
```
### Using `GetMisSalidasVehiculo`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMisSalidasVehiculo } from '@dataconnect/generated';


// Call the `getMisSalidasVehiculo()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMisSalidasVehiculo();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMisSalidasVehiculo(dataConnect);

console.log(data.salidaVehiculos);

// Or, you can use the `Promise` API.
getMisSalidasVehiculo().then((response) => {
  const data = response.data;
  console.log(data.salidaVehiculos);
});
```

### Using `GetMisSalidasVehiculo`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMisSalidasVehiculoRef } from '@dataconnect/generated';


// Call the `getMisSalidasVehiculoRef()` function to get a reference to the query.
const ref = getMisSalidasVehiculoRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMisSalidasVehiculoRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.salidaVehiculos);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.salidaVehiculos);
});
```

## GetComandasPaginadas
You can execute the `GetComandasPaginadas` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getComandasPaginadas(vars?: GetComandasPaginadasVariables, options?: ExecuteQueryOptions): QueryPromise<GetComandasPaginadasData, GetComandasPaginadasVariables>;

interface GetComandasPaginadasRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: GetComandasPaginadasVariables): QueryRef<GetComandasPaginadasData, GetComandasPaginadasVariables>;
}
export const getComandasPaginadasRef: GetComandasPaginadasRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getComandasPaginadas(dc: DataConnect, vars?: GetComandasPaginadasVariables, options?: ExecuteQueryOptions): QueryPromise<GetComandasPaginadasData, GetComandasPaginadasVariables>;

interface GetComandasPaginadasRef {
  ...
  (dc: DataConnect, vars?: GetComandasPaginadasVariables): QueryRef<GetComandasPaginadasData, GetComandasPaginadasVariables>;
}
export const getComandasPaginadasRef: GetComandasPaginadasRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getComandasPaginadasRef:
```typescript
const name = getComandasPaginadasRef.operationName;
console.log(name);
```

### Variables
The `GetComandasPaginadas` query has an optional argument of type `GetComandasPaginadasVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetComandasPaginadasVariables {
  limit?: number | null;
  offset?: number | null;
  estados?: ComandaEstado[] | null;
  cliente?: string | null;
  fechaDesde?: TimestampString | null;
  fechaHasta?: TimestampString | null;
}
```
### Return Type
Recall that executing the `GetComandasPaginadas` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetComandasPaginadasData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetComandasPaginadasData {
  comandas: ({
    id: UUIDString;
    numeroComanda: string;
    actualizadoEn: TimestampString;
    codigoQr: UUIDString;
    estado: ComandaEstado;
    valorTotal: number;
    empresa?: string | null;
    proyecto?: string | null;
    fechaRecepcion: TimestampString;
    fechaEntregaEstimada?: TimestampString | null;
    observaciones?: string | null;
    motivoAnulacion?: string | null;
    cliente: {
      id: UUIDString;
      nombre: string;
      telefono?: string | null;
      email?: string | null;
      tipoCliente: TipoCliente;
      direccion?: string | null;
    } & Cliente_Key;
    comandaEtapas_on_comanda: ({
      etapaId: UUIDString;
      nombreEtapa?: string | null;
      ordenEtapa?: number | null;
      descripcionEtapa?: string | null;
      tiempoEstimadoMin?: number | null;
      estado: EtapaEstado;
      fechaInicio?: TimestampString | null;
      fechaCompletado?: TimestampString | null;
      operario?: {
        id: string;
        nombre: string;
        apellido?: string | null;
      } & Usuario_Key;
      asignadoA?: {
        id: string;
        nombre: string;
        apellido?: string | null;
      } & Usuario_Key;
      etapa: {
        nombre: string;
        orden: number;
        descripcion?: string | null;
        tiempoEstimadoMin?: number | null;
      };
    })[];
    comandaDetalles_on_comanda: ({
      cantidad: number;
      detalle?: string | null;
      precioUnitario: number;
      tipoPrenda: {
        nombre: string;
      };
      tipoServicio: {
        nombre: string;
      };
    })[];
  } & Comanda_Key)[];
  total: ({
    _count: number;
  })[];
  pendientes: ({
    _count: number;
  })[];
  enProceso: ({
    _count: number;
  })[];
  finalizadas: ({
    _count: number;
  })[];
  entregadas: ({
    _count: number;
  })[];
  anuladas: ({
    _count: number;
  })[];
}
```
### Using `GetComandasPaginadas`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getComandasPaginadas, GetComandasPaginadasVariables } from '@dataconnect/generated';

// The `GetComandasPaginadas` query has an optional argument of type `GetComandasPaginadasVariables`:
const getComandasPaginadasVars: GetComandasPaginadasVariables = {
  limit: ..., // optional
  offset: ..., // optional
  estados: ..., // optional
  cliente: ..., // optional
  fechaDesde: ..., // optional
  fechaHasta: ..., // optional
};

// Call the `getComandasPaginadas()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getComandasPaginadas(getComandasPaginadasVars);
// Variables can be defined inline as well.
const { data } = await getComandasPaginadas({ limit: ..., offset: ..., estados: ..., cliente: ..., fechaDesde: ..., fechaHasta: ..., });
// Since all variables are optional for this query, you can omit the `GetComandasPaginadasVariables` argument.
const { data } = await getComandasPaginadas();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getComandasPaginadas(dataConnect, getComandasPaginadasVars);

console.log(data.comandas);
console.log(data.total);
console.log(data.pendientes);
console.log(data.enProceso);
console.log(data.finalizadas);
console.log(data.entregadas);
console.log(data.anuladas);

// Or, you can use the `Promise` API.
getComandasPaginadas(getComandasPaginadasVars).then((response) => {
  const data = response.data;
  console.log(data.comandas);
  console.log(data.total);
  console.log(data.pendientes);
  console.log(data.enProceso);
  console.log(data.finalizadas);
  console.log(data.entregadas);
  console.log(data.anuladas);
});
```

### Using `GetComandasPaginadas`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getComandasPaginadasRef, GetComandasPaginadasVariables } from '@dataconnect/generated';

// The `GetComandasPaginadas` query has an optional argument of type `GetComandasPaginadasVariables`:
const getComandasPaginadasVars: GetComandasPaginadasVariables = {
  limit: ..., // optional
  offset: ..., // optional
  estados: ..., // optional
  cliente: ..., // optional
  fechaDesde: ..., // optional
  fechaHasta: ..., // optional
};

// Call the `getComandasPaginadasRef()` function to get a reference to the query.
const ref = getComandasPaginadasRef(getComandasPaginadasVars);
// Variables can be defined inline as well.
const ref = getComandasPaginadasRef({ limit: ..., offset: ..., estados: ..., cliente: ..., fechaDesde: ..., fechaHasta: ..., });
// Since all variables are optional for this query, you can omit the `GetComandasPaginadasVariables` argument.
const ref = getComandasPaginadasRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getComandasPaginadasRef(dataConnect, getComandasPaginadasVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.comandas);
console.log(data.total);
console.log(data.pendientes);
console.log(data.enProceso);
console.log(data.finalizadas);
console.log(data.entregadas);
console.log(data.anuladas);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.comandas);
  console.log(data.total);
  console.log(data.pendientes);
  console.log(data.enProceso);
  console.log(data.finalizadas);
  console.log(data.entregadas);
  console.log(data.anuladas);
});
```

## GetComandasActivasCount
You can execute the `GetComandasActivasCount` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getComandasActivasCount(options?: ExecuteQueryOptions): QueryPromise<GetComandasActivasCountData, undefined>;

interface GetComandasActivasCountRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetComandasActivasCountData, undefined>;
}
export const getComandasActivasCountRef: GetComandasActivasCountRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getComandasActivasCount(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetComandasActivasCountData, undefined>;

interface GetComandasActivasCountRef {
  ...
  (dc: DataConnect): QueryRef<GetComandasActivasCountData, undefined>;
}
export const getComandasActivasCountRef: GetComandasActivasCountRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getComandasActivasCountRef:
```typescript
const name = getComandasActivasCountRef.operationName;
console.log(name);
```

### Variables
The `GetComandasActivasCount` query has no variables.
### Return Type
Recall that executing the `GetComandasActivasCount` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetComandasActivasCountData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetComandasActivasCountData {
  pendientes: ({
    _count: number;
  })[];
  enProceso: ({
    _count: number;
  })[];
}
```
### Using `GetComandasActivasCount`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getComandasActivasCount } from '@dataconnect/generated';


// Call the `getComandasActivasCount()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getComandasActivasCount();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getComandasActivasCount(dataConnect);

console.log(data.pendientes);
console.log(data.enProceso);

// Or, you can use the `Promise` API.
getComandasActivasCount().then((response) => {
  const data = response.data;
  console.log(data.pendientes);
  console.log(data.enProceso);
});
```

### Using `GetComandasActivasCount`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getComandasActivasCountRef } from '@dataconnect/generated';


// Call the `getComandasActivasCountRef()` function to get a reference to the query.
const ref = getComandasActivasCountRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getComandasActivasCountRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.pendientes);
console.log(data.enProceso);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.pendientes);
  console.log(data.enProceso);
});
```

## GetComandaDetalle
You can execute the `GetComandaDetalle` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getComandaDetalle(vars: GetComandaDetalleVariables, options?: ExecuteQueryOptions): QueryPromise<GetComandaDetalleData, GetComandaDetalleVariables>;

interface GetComandaDetalleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetComandaDetalleVariables): QueryRef<GetComandaDetalleData, GetComandaDetalleVariables>;
}
export const getComandaDetalleRef: GetComandaDetalleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getComandaDetalle(dc: DataConnect, vars: GetComandaDetalleVariables, options?: ExecuteQueryOptions): QueryPromise<GetComandaDetalleData, GetComandaDetalleVariables>;

interface GetComandaDetalleRef {
  ...
  (dc: DataConnect, vars: GetComandaDetalleVariables): QueryRef<GetComandaDetalleData, GetComandaDetalleVariables>;
}
export const getComandaDetalleRef: GetComandaDetalleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getComandaDetalleRef:
```typescript
const name = getComandaDetalleRef.operationName;
console.log(name);
```

### Variables
The `GetComandaDetalle` query requires an argument of type `GetComandaDetalleVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetComandaDetalleVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetComandaDetalle` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetComandaDetalleData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetComandaDetalleData {
  comanda?: {
    id: UUIDString;
    codigoQr: UUIDString;
    actualizadoEn: TimestampString;
    numeroComanda: string;
    estado: ComandaEstado;
    valorTotal: number;
    empresa?: string | null;
    proyecto?: string | null;
    observaciones?: string | null;
    motivoAnulacion?: string | null;
    fechaRecepcion: TimestampString;
    fechaEntregaEstimada?: TimestampString | null;
    fechaEntregaReal?: TimestampString | null;
    cliente: {
      id: UUIDString;
      nombre: string;
      rut?: string | null;
      telefono?: string | null;
      email?: string | null;
      tipoCliente: TipoCliente;
      direccion?: string | null;
    } & Cliente_Key;
    comandaEtapas_on_comanda: ({
      etapaId: UUIDString;
      nombreEtapa?: string | null;
      ordenEtapa?: number | null;
      descripcionEtapa?: string | null;
      tiempoEstimadoMin?: number | null;
      estado: EtapaEstado;
      fechaInicio?: TimestampString | null;
      fechaCompletado?: TimestampString | null;
      operario?: {
        id: string;
        nombre: string;
        apellido?: string | null;
      } & Usuario_Key;
      asignadoA?: {
        id: string;
        nombre: string;
        apellido?: string | null;
      } & Usuario_Key;
      etapa: {
        nombre: string;
        orden: number;
        descripcion?: string | null;
        tiempoEstimadoMin?: number | null;
      };
    })[];
    comandaDetalles_on_comanda: ({
      id: UUIDString;
      cantidad: number;
      detalle?: string | null;
      pesoKg?: number | null;
      precioUnitario: number;
      subtotal: number;
      tipoPrenda: {
        id: UUIDString;
        nombre: string;
      } & TipoPrenda_Key;
      tipoServicio: {
        id: UUIDString;
        nombre: string;
      } & TipoServicio_Key;
    } & ComandaDetalle_Key)[];
    comandaHistorialEstados_on_comanda: ({
      id: UUIDString;
      estadoAnterior?: ComandaEstado | null;
      estadoNuevo: ComandaEstado;
      fecha: TimestampString;
      motivo?: string | null;
      usuario?: {
        nombre: string;
      };
    } & ComandaHistorialEstado_Key)[];
    incidenciaComandas_on_comanda: ({
      id: UUIDString;
      motivo: string;
      descripcion?: string | null;
      estado: IncidenciaEstado;
      fecha: TimestampString;
      reportadaPor: {
        id: string;
        nombre: string;
      } & Usuario_Key;
    } & IncidenciaComanda_Key)[];
  } & Comanda_Key;
}
```
### Using `GetComandaDetalle`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getComandaDetalle, GetComandaDetalleVariables } from '@dataconnect/generated';

// The `GetComandaDetalle` query requires an argument of type `GetComandaDetalleVariables`:
const getComandaDetalleVars: GetComandaDetalleVariables = {
  id: ...,
};

// Call the `getComandaDetalle()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getComandaDetalle(getComandaDetalleVars);
// Variables can be defined inline as well.
const { data } = await getComandaDetalle({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getComandaDetalle(dataConnect, getComandaDetalleVars);

console.log(data.comanda);

// Or, you can use the `Promise` API.
getComandaDetalle(getComandaDetalleVars).then((response) => {
  const data = response.data;
  console.log(data.comanda);
});
```

### Using `GetComandaDetalle`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getComandaDetalleRef, GetComandaDetalleVariables } from '@dataconnect/generated';

// The `GetComandaDetalle` query requires an argument of type `GetComandaDetalleVariables`:
const getComandaDetalleVars: GetComandaDetalleVariables = {
  id: ...,
};

// Call the `getComandaDetalleRef()` function to get a reference to the query.
const ref = getComandaDetalleRef(getComandaDetalleVars);
// Variables can be defined inline as well.
const ref = getComandaDetalleRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getComandaDetalleRef(dataConnect, getComandaDetalleVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.comanda);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.comanda);
});
```

## GetCatalogosComanda
You can execute the `GetCatalogosComanda` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getCatalogosComanda(options?: ExecuteQueryOptions): QueryPromise<GetCatalogosComandaData, undefined>;

interface GetCatalogosComandaRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetCatalogosComandaData, undefined>;
}
export const getCatalogosComandaRef: GetCatalogosComandaRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getCatalogosComanda(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetCatalogosComandaData, undefined>;

interface GetCatalogosComandaRef {
  ...
  (dc: DataConnect): QueryRef<GetCatalogosComandaData, undefined>;
}
export const getCatalogosComandaRef: GetCatalogosComandaRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getCatalogosComandaRef:
```typescript
const name = getCatalogosComandaRef.operationName;
console.log(name);
```

### Variables
The `GetCatalogosComanda` query has no variables.
### Return Type
Recall that executing the `GetCatalogosComanda` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetCatalogosComandaData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetCatalogosComandaData {
  tipoServicios: ({
    id: UUIDString;
    nombre: string;
    precioBase: number;
    unidadCobro: UnidadCobro;
  } & TipoServicio_Key)[];
  tipoPrendas: ({
    id: UUIDString;
    nombre: string;
  } & TipoPrenda_Key)[];
  clientes: ({
    id: UUIDString;
    rut?: string | null;
    nombre: string;
    tipoCliente: TipoCliente;
    telefono?: string | null;
    email?: string | null;
    direccion?: string | null;
  } & Cliente_Key)[];
}
```
### Using `GetCatalogosComanda`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getCatalogosComanda } from '@dataconnect/generated';


// Call the `getCatalogosComanda()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getCatalogosComanda();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getCatalogosComanda(dataConnect);

console.log(data.tipoServicios);
console.log(data.tipoPrendas);
console.log(data.clientes);

// Or, you can use the `Promise` API.
getCatalogosComanda().then((response) => {
  const data = response.data;
  console.log(data.tipoServicios);
  console.log(data.tipoPrendas);
  console.log(data.clientes);
});
```

### Using `GetCatalogosComanda`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getCatalogosComandaRef } from '@dataconnect/generated';


// Call the `getCatalogosComandaRef()` function to get a reference to the query.
const ref = getCatalogosComandaRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getCatalogosComandaRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.tipoServicios);
console.log(data.tipoPrendas);
console.log(data.clientes);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.tipoServicios);
  console.log(data.tipoPrendas);
  console.log(data.clientes);
});
```

## DiagnosticoComandas
You can execute the `DiagnosticoComandas` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
diagnosticoComandas(options?: ExecuteQueryOptions): QueryPromise<DiagnosticoComandasData, undefined>;

interface DiagnosticoComandasRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<DiagnosticoComandasData, undefined>;
}
export const diagnosticoComandasRef: DiagnosticoComandasRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
diagnosticoComandas(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<DiagnosticoComandasData, undefined>;

interface DiagnosticoComandasRef {
  ...
  (dc: DataConnect): QueryRef<DiagnosticoComandasData, undefined>;
}
export const diagnosticoComandasRef: DiagnosticoComandasRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the diagnosticoComandasRef:
```typescript
const name = diagnosticoComandasRef.operationName;
console.log(name);
```

### Variables
The `DiagnosticoComandas` query has no variables.
### Return Type
Recall that executing the `DiagnosticoComandas` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DiagnosticoComandasData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DiagnosticoComandasData {
  tipoPrendas: ({
    id: UUIDString;
    nombre: string;
    activo: boolean;
  } & TipoPrenda_Key)[];
  tipoServicios: ({
    id: UUIDString;
    nombre: string;
    activo: boolean;
    precioBase: number;
  } & TipoServicio_Key)[];
  comandas: ({
    id: UUIDString;
    numeroComanda: string;
    valorTotal: number;
    comandaDetalles_on_comanda: ({
      id: UUIDString;
      cantidad: number;
      precioUnitario: number;
      subtotal: number;
      tipoPrenda: {
        id: UUIDString;
        nombre: string;
      } & TipoPrenda_Key;
      tipoServicio: {
        id: UUIDString;
        nombre: string;
      } & TipoServicio_Key;
    } & ComandaDetalle_Key)[];
  } & Comanda_Key)[];
}
```
### Using `DiagnosticoComandas`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, diagnosticoComandas } from '@dataconnect/generated';


// Call the `diagnosticoComandas()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await diagnosticoComandas();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await diagnosticoComandas(dataConnect);

console.log(data.tipoPrendas);
console.log(data.tipoServicios);
console.log(data.comandas);

// Or, you can use the `Promise` API.
diagnosticoComandas().then((response) => {
  const data = response.data;
  console.log(data.tipoPrendas);
  console.log(data.tipoServicios);
  console.log(data.comandas);
});
```

### Using `DiagnosticoComandas`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, diagnosticoComandasRef } from '@dataconnect/generated';


// Call the `diagnosticoComandasRef()` function to get a reference to the query.
const ref = diagnosticoComandasRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = diagnosticoComandasRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.tipoPrendas);
console.log(data.tipoServicios);
console.log(data.comandas);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.tipoPrendas);
  console.log(data.tipoServicios);
  console.log(data.comandas);
});
```

## GetFichasClientes
You can execute the `GetFichasClientes` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getFichasClientes(options?: ExecuteQueryOptions): QueryPromise<GetFichasClientesData, undefined>;

interface GetFichasClientesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetFichasClientesData, undefined>;
}
export const getFichasClientesRef: GetFichasClientesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getFichasClientes(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetFichasClientesData, undefined>;

interface GetFichasClientesRef {
  ...
  (dc: DataConnect): QueryRef<GetFichasClientesData, undefined>;
}
export const getFichasClientesRef: GetFichasClientesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getFichasClientesRef:
```typescript
const name = getFichasClientesRef.operationName;
console.log(name);
```

### Variables
The `GetFichasClientes` query has no variables.
### Return Type
Recall that executing the `GetFichasClientes` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetFichasClientesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetFichasClientesData {
  clientes: ({
    id: UUIDString;
    rut?: string | null;
    nombre: string;
    tipoCliente: TipoCliente;
    telefono?: string | null;
    email?: string | null;
    direccion?: string | null;
    creadoEn: TimestampString;
    comandas_on_cliente: ({
      id: UUIDString;
      estado: ComandaEstado;
      valorTotal: number;
      fechaRecepcion: TimestampString;
      comandaDetalles_on_comanda: ({
        cantidad: number;
      })[];
    } & Comanda_Key)[];
  } & Cliente_Key)[];
}
```
### Using `GetFichasClientes`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getFichasClientes } from '@dataconnect/generated';


// Call the `getFichasClientes()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getFichasClientes();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getFichasClientes(dataConnect);

console.log(data.clientes);

// Or, you can use the `Promise` API.
getFichasClientes().then((response) => {
  const data = response.data;
  console.log(data.clientes);
});
```

### Using `GetFichasClientes`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getFichasClientesRef } from '@dataconnect/generated';


// Call the `getFichasClientesRef()` function to get a reference to the query.
const ref = getFichasClientesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getFichasClientesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.clientes);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.clientes);
});
```

## GetReporteCuentas
You can execute the `GetReporteCuentas` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getReporteCuentas(vars: GetReporteCuentasVariables, options?: ExecuteQueryOptions): QueryPromise<GetReporteCuentasData, GetReporteCuentasVariables>;

interface GetReporteCuentasRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetReporteCuentasVariables): QueryRef<GetReporteCuentasData, GetReporteCuentasVariables>;
}
export const getReporteCuentasRef: GetReporteCuentasRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getReporteCuentas(dc: DataConnect, vars: GetReporteCuentasVariables, options?: ExecuteQueryOptions): QueryPromise<GetReporteCuentasData, GetReporteCuentasVariables>;

interface GetReporteCuentasRef {
  ...
  (dc: DataConnect, vars: GetReporteCuentasVariables): QueryRef<GetReporteCuentasData, GetReporteCuentasVariables>;
}
export const getReporteCuentasRef: GetReporteCuentasRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getReporteCuentasRef:
```typescript
const name = getReporteCuentasRef.operationName;
console.log(name);
```

### Variables
The `GetReporteCuentas` query requires an argument of type `GetReporteCuentasVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetReporteCuentasVariables {
  desde: TimestampString;
  hasta: TimestampString;
  clienteId?: UUIDString | null;
  empresa?: string | null;
  limit?: number | null;
  offset?: number | null;
}
```
### Return Type
Recall that executing the `GetReporteCuentas` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetReporteCuentasData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetReporteCuentasData {
  cuentas: ({
    cliente: {
      id: UUIDString;
      nombre: string;
    } & Cliente_Key;
    empresa?: string | null;
    _count: number;
    valorTotal_sum?: number | null;
  })[];
  prendas: ({
    comanda: {
      cliente: {
        id: UUIDString;
        nombre: string;
      } & Cliente_Key;
      empresa?: string | null;
    };
    cantidad_sum?: number | null;
  })[];
}
```
### Using `GetReporteCuentas`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getReporteCuentas, GetReporteCuentasVariables } from '@dataconnect/generated';

// The `GetReporteCuentas` query requires an argument of type `GetReporteCuentasVariables`:
const getReporteCuentasVars: GetReporteCuentasVariables = {
  desde: ...,
  hasta: ...,
  clienteId: ..., // optional
  empresa: ..., // optional
  limit: ..., // optional
  offset: ..., // optional
};

// Call the `getReporteCuentas()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getReporteCuentas(getReporteCuentasVars);
// Variables can be defined inline as well.
const { data } = await getReporteCuentas({ desde: ..., hasta: ..., clienteId: ..., empresa: ..., limit: ..., offset: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getReporteCuentas(dataConnect, getReporteCuentasVars);

console.log(data.cuentas);
console.log(data.prendas);

// Or, you can use the `Promise` API.
getReporteCuentas(getReporteCuentasVars).then((response) => {
  const data = response.data;
  console.log(data.cuentas);
  console.log(data.prendas);
});
```

### Using `GetReporteCuentas`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getReporteCuentasRef, GetReporteCuentasVariables } from '@dataconnect/generated';

// The `GetReporteCuentas` query requires an argument of type `GetReporteCuentasVariables`:
const getReporteCuentasVars: GetReporteCuentasVariables = {
  desde: ...,
  hasta: ...,
  clienteId: ..., // optional
  empresa: ..., // optional
  limit: ..., // optional
  offset: ..., // optional
};

// Call the `getReporteCuentasRef()` function to get a reference to the query.
const ref = getReporteCuentasRef(getReporteCuentasVars);
// Variables can be defined inline as well.
const ref = getReporteCuentasRef({ desde: ..., hasta: ..., clienteId: ..., empresa: ..., limit: ..., offset: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getReporteCuentasRef(dataConnect, getReporteCuentasVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.cuentas);
console.log(data.prendas);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.cuentas);
  console.log(data.prendas);
});
```

## GetDetalleReporteCuentas
You can execute the `GetDetalleReporteCuentas` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getDetalleReporteCuentas(vars: GetDetalleReporteCuentasVariables, options?: ExecuteQueryOptions): QueryPromise<GetDetalleReporteCuentasData, GetDetalleReporteCuentasVariables>;

interface GetDetalleReporteCuentasRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetDetalleReporteCuentasVariables): QueryRef<GetDetalleReporteCuentasData, GetDetalleReporteCuentasVariables>;
}
export const getDetalleReporteCuentasRef: GetDetalleReporteCuentasRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getDetalleReporteCuentas(dc: DataConnect, vars: GetDetalleReporteCuentasVariables, options?: ExecuteQueryOptions): QueryPromise<GetDetalleReporteCuentasData, GetDetalleReporteCuentasVariables>;

interface GetDetalleReporteCuentasRef {
  ...
  (dc: DataConnect, vars: GetDetalleReporteCuentasVariables): QueryRef<GetDetalleReporteCuentasData, GetDetalleReporteCuentasVariables>;
}
export const getDetalleReporteCuentasRef: GetDetalleReporteCuentasRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getDetalleReporteCuentasRef:
```typescript
const name = getDetalleReporteCuentasRef.operationName;
console.log(name);
```

### Variables
The `GetDetalleReporteCuentas` query requires an argument of type `GetDetalleReporteCuentasVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetDetalleReporteCuentasVariables {
  desde: TimestampString;
  hasta: TimestampString;
  clienteId?: UUIDString | null;
  empresa?: string | null;
  limit?: number | null;
  offset?: number | null;
}
```
### Return Type
Recall that executing the `GetDetalleReporteCuentas` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetDetalleReporteCuentasData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetDetalleReporteCuentasData {
  comandas: ({
    id: UUIDString;
    numeroComanda: string;
    estado: ComandaEstado;
    fechaRecepcion: TimestampString;
    valorTotal: number;
    empresa?: string | null;
    cliente: {
      id: UUIDString;
      nombre: string;
    } & Cliente_Key;
    prendas: ({
      cantidad_sum?: number | null;
    })[];
  } & Comanda_Key)[];
}
```
### Using `GetDetalleReporteCuentas`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getDetalleReporteCuentas, GetDetalleReporteCuentasVariables } from '@dataconnect/generated';

// The `GetDetalleReporteCuentas` query requires an argument of type `GetDetalleReporteCuentasVariables`:
const getDetalleReporteCuentasVars: GetDetalleReporteCuentasVariables = {
  desde: ...,
  hasta: ...,
  clienteId: ..., // optional
  empresa: ..., // optional
  limit: ..., // optional
  offset: ..., // optional
};

// Call the `getDetalleReporteCuentas()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getDetalleReporteCuentas(getDetalleReporteCuentasVars);
// Variables can be defined inline as well.
const { data } = await getDetalleReporteCuentas({ desde: ..., hasta: ..., clienteId: ..., empresa: ..., limit: ..., offset: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getDetalleReporteCuentas(dataConnect, getDetalleReporteCuentasVars);

console.log(data.comandas);

// Or, you can use the `Promise` API.
getDetalleReporteCuentas(getDetalleReporteCuentasVars).then((response) => {
  const data = response.data;
  console.log(data.comandas);
});
```

### Using `GetDetalleReporteCuentas`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getDetalleReporteCuentasRef, GetDetalleReporteCuentasVariables } from '@dataconnect/generated';

// The `GetDetalleReporteCuentas` query requires an argument of type `GetDetalleReporteCuentasVariables`:
const getDetalleReporteCuentasVars: GetDetalleReporteCuentasVariables = {
  desde: ...,
  hasta: ...,
  clienteId: ..., // optional
  empresa: ..., // optional
  limit: ..., // optional
  offset: ..., // optional
};

// Call the `getDetalleReporteCuentasRef()` function to get a reference to the query.
const ref = getDetalleReporteCuentasRef(getDetalleReporteCuentasVars);
// Variables can be defined inline as well.
const ref = getDetalleReporteCuentasRef({ desde: ..., hasta: ..., clienteId: ..., empresa: ..., limit: ..., offset: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getDetalleReporteCuentasRef(dataConnect, getDetalleReporteCuentasVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.comandas);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.comandas);
});
```

## GetFiltrosReportes
You can execute the `GetFiltrosReportes` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getFiltrosReportes(vars?: GetFiltrosReportesVariables, options?: ExecuteQueryOptions): QueryPromise<GetFiltrosReportesData, GetFiltrosReportesVariables>;

interface GetFiltrosReportesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: GetFiltrosReportesVariables): QueryRef<GetFiltrosReportesData, GetFiltrosReportesVariables>;
}
export const getFiltrosReportesRef: GetFiltrosReportesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getFiltrosReportes(dc: DataConnect, vars?: GetFiltrosReportesVariables, options?: ExecuteQueryOptions): QueryPromise<GetFiltrosReportesData, GetFiltrosReportesVariables>;

interface GetFiltrosReportesRef {
  ...
  (dc: DataConnect, vars?: GetFiltrosReportesVariables): QueryRef<GetFiltrosReportesData, GetFiltrosReportesVariables>;
}
export const getFiltrosReportesRef: GetFiltrosReportesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getFiltrosReportesRef:
```typescript
const name = getFiltrosReportesRef.operationName;
console.log(name);
```

### Variables
The `GetFiltrosReportes` query has an optional argument of type `GetFiltrosReportesVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetFiltrosReportesVariables {
  limit?: number | null;
  offset?: number | null;
}
```
### Return Type
Recall that executing the `GetFiltrosReportes` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetFiltrosReportesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetFiltrosReportesData {
  clientes: ({
    id: UUIDString;
    nombre: string;
  } & Cliente_Key)[];
  empresas: ({
    empresa?: string | null;
  })[];
  servicios: ({
    id: UUIDString;
    nombre: string;
  } & TipoServicio_Key)[];
}
```
### Using `GetFiltrosReportes`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getFiltrosReportes, GetFiltrosReportesVariables } from '@dataconnect/generated';

// The `GetFiltrosReportes` query has an optional argument of type `GetFiltrosReportesVariables`:
const getFiltrosReportesVars: GetFiltrosReportesVariables = {
  limit: ..., // optional
  offset: ..., // optional
};

// Call the `getFiltrosReportes()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getFiltrosReportes(getFiltrosReportesVars);
// Variables can be defined inline as well.
const { data } = await getFiltrosReportes({ limit: ..., offset: ..., });
// Since all variables are optional for this query, you can omit the `GetFiltrosReportesVariables` argument.
const { data } = await getFiltrosReportes();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getFiltrosReportes(dataConnect, getFiltrosReportesVars);

console.log(data.clientes);
console.log(data.empresas);
console.log(data.servicios);

// Or, you can use the `Promise` API.
getFiltrosReportes(getFiltrosReportesVars).then((response) => {
  const data = response.data;
  console.log(data.clientes);
  console.log(data.empresas);
  console.log(data.servicios);
});
```

### Using `GetFiltrosReportes`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getFiltrosReportesRef, GetFiltrosReportesVariables } from '@dataconnect/generated';

// The `GetFiltrosReportes` query has an optional argument of type `GetFiltrosReportesVariables`:
const getFiltrosReportesVars: GetFiltrosReportesVariables = {
  limit: ..., // optional
  offset: ..., // optional
};

// Call the `getFiltrosReportesRef()` function to get a reference to the query.
const ref = getFiltrosReportesRef(getFiltrosReportesVars);
// Variables can be defined inline as well.
const ref = getFiltrosReportesRef({ limit: ..., offset: ..., });
// Since all variables are optional for this query, you can omit the `GetFiltrosReportesVariables` argument.
const ref = getFiltrosReportesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getFiltrosReportesRef(dataConnect, getFiltrosReportesVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.clientes);
console.log(data.empresas);
console.log(data.servicios);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.clientes);
  console.log(data.empresas);
  console.log(data.servicios);
});
```

## GetReporteServicios
You can execute the `GetReporteServicios` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getReporteServicios(vars: GetReporteServiciosVariables, options?: ExecuteQueryOptions): QueryPromise<GetReporteServiciosData, GetReporteServiciosVariables>;

interface GetReporteServiciosRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetReporteServiciosVariables): QueryRef<GetReporteServiciosData, GetReporteServiciosVariables>;
}
export const getReporteServiciosRef: GetReporteServiciosRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getReporteServicios(dc: DataConnect, vars: GetReporteServiciosVariables, options?: ExecuteQueryOptions): QueryPromise<GetReporteServiciosData, GetReporteServiciosVariables>;

interface GetReporteServiciosRef {
  ...
  (dc: DataConnect, vars: GetReporteServiciosVariables): QueryRef<GetReporteServiciosData, GetReporteServiciosVariables>;
}
export const getReporteServiciosRef: GetReporteServiciosRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getReporteServiciosRef:
```typescript
const name = getReporteServiciosRef.operationName;
console.log(name);
```

### Variables
The `GetReporteServicios` query requires an argument of type `GetReporteServiciosVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetReporteServiciosVariables {
  desde: TimestampString;
  hasta: TimestampString;
  clienteId?: UUIDString | null;
  empresa?: string | null;
  servicioId?: UUIDString | null;
  limit?: number | null;
  offset?: number | null;
}
```
### Return Type
Recall that executing the `GetReporteServicios` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetReporteServiciosData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetReporteServiciosData {
  servicios: ({
    tipoServicio: {
      id: UUIDString;
      nombre: string;
    } & TipoServicio_Key;
    comandaId_count: number;
    cantidad_sum?: number | null;
    subtotal_sum?: number | null;
    pesoKg_sum?: number | null;
  })[];
}
```
### Using `GetReporteServicios`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getReporteServicios, GetReporteServiciosVariables } from '@dataconnect/generated';

// The `GetReporteServicios` query requires an argument of type `GetReporteServiciosVariables`:
const getReporteServiciosVars: GetReporteServiciosVariables = {
  desde: ...,
  hasta: ...,
  clienteId: ..., // optional
  empresa: ..., // optional
  servicioId: ..., // optional
  limit: ..., // optional
  offset: ..., // optional
};

// Call the `getReporteServicios()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getReporteServicios(getReporteServiciosVars);
// Variables can be defined inline as well.
const { data } = await getReporteServicios({ desde: ..., hasta: ..., clienteId: ..., empresa: ..., servicioId: ..., limit: ..., offset: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getReporteServicios(dataConnect, getReporteServiciosVars);

console.log(data.servicios);

// Or, you can use the `Promise` API.
getReporteServicios(getReporteServiciosVars).then((response) => {
  const data = response.data;
  console.log(data.servicios);
});
```

### Using `GetReporteServicios`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getReporteServiciosRef, GetReporteServiciosVariables } from '@dataconnect/generated';

// The `GetReporteServicios` query requires an argument of type `GetReporteServiciosVariables`:
const getReporteServiciosVars: GetReporteServiciosVariables = {
  desde: ...,
  hasta: ...,
  clienteId: ..., // optional
  empresa: ..., // optional
  servicioId: ..., // optional
  limit: ..., // optional
  offset: ..., // optional
};

// Call the `getReporteServiciosRef()` function to get a reference to the query.
const ref = getReporteServiciosRef(getReporteServiciosVars);
// Variables can be defined inline as well.
const ref = getReporteServiciosRef({ desde: ..., hasta: ..., clienteId: ..., empresa: ..., servicioId: ..., limit: ..., offset: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getReporteServiciosRef(dataConnect, getReporteServiciosVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.servicios);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.servicios);
});
```

## GetDetalleReporteServicios
You can execute the `GetDetalleReporteServicios` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getDetalleReporteServicios(vars: GetDetalleReporteServiciosVariables, options?: ExecuteQueryOptions): QueryPromise<GetDetalleReporteServiciosData, GetDetalleReporteServiciosVariables>;

interface GetDetalleReporteServiciosRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetDetalleReporteServiciosVariables): QueryRef<GetDetalleReporteServiciosData, GetDetalleReporteServiciosVariables>;
}
export const getDetalleReporteServiciosRef: GetDetalleReporteServiciosRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getDetalleReporteServicios(dc: DataConnect, vars: GetDetalleReporteServiciosVariables, options?: ExecuteQueryOptions): QueryPromise<GetDetalleReporteServiciosData, GetDetalleReporteServiciosVariables>;

interface GetDetalleReporteServiciosRef {
  ...
  (dc: DataConnect, vars: GetDetalleReporteServiciosVariables): QueryRef<GetDetalleReporteServiciosData, GetDetalleReporteServiciosVariables>;
}
export const getDetalleReporteServiciosRef: GetDetalleReporteServiciosRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getDetalleReporteServiciosRef:
```typescript
const name = getDetalleReporteServiciosRef.operationName;
console.log(name);
```

### Variables
The `GetDetalleReporteServicios` query requires an argument of type `GetDetalleReporteServiciosVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetDetalleReporteServiciosVariables {
  desde: TimestampString;
  hasta: TimestampString;
  clienteId?: UUIDString | null;
  empresa?: string | null;
  servicioId?: UUIDString | null;
  limit?: number | null;
  offset?: number | null;
}
```
### Return Type
Recall that executing the `GetDetalleReporteServicios` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetDetalleReporteServiciosData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetDetalleReporteServiciosData {
  detalles: ({
    id: UUIDString;
    cantidad: number;
    subtotal: number;
    pesoKg?: number | null;
    tipoServicio: {
      id: UUIDString;
      nombre: string;
    } & TipoServicio_Key;
    tipoPrenda: {
      nombre: string;
    };
    comanda: {
      id: UUIDString;
      numeroComanda: string;
      estado: ComandaEstado;
      fechaRecepcion: TimestampString;
      empresa?: string | null;
      cliente: {
        id: UUIDString;
        nombre: string;
      } & Cliente_Key;
    } & Comanda_Key;
  } & ComandaDetalle_Key)[];
}
```
### Using `GetDetalleReporteServicios`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getDetalleReporteServicios, GetDetalleReporteServiciosVariables } from '@dataconnect/generated';

// The `GetDetalleReporteServicios` query requires an argument of type `GetDetalleReporteServiciosVariables`:
const getDetalleReporteServiciosVars: GetDetalleReporteServiciosVariables = {
  desde: ...,
  hasta: ...,
  clienteId: ..., // optional
  empresa: ..., // optional
  servicioId: ..., // optional
  limit: ..., // optional
  offset: ..., // optional
};

// Call the `getDetalleReporteServicios()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getDetalleReporteServicios(getDetalleReporteServiciosVars);
// Variables can be defined inline as well.
const { data } = await getDetalleReporteServicios({ desde: ..., hasta: ..., clienteId: ..., empresa: ..., servicioId: ..., limit: ..., offset: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getDetalleReporteServicios(dataConnect, getDetalleReporteServiciosVars);

console.log(data.detalles);

// Or, you can use the `Promise` API.
getDetalleReporteServicios(getDetalleReporteServiciosVars).then((response) => {
  const data = response.data;
  console.log(data.detalles);
});
```

### Using `GetDetalleReporteServicios`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getDetalleReporteServiciosRef, GetDetalleReporteServiciosVariables } from '@dataconnect/generated';

// The `GetDetalleReporteServicios` query requires an argument of type `GetDetalleReporteServiciosVariables`:
const getDetalleReporteServiciosVars: GetDetalleReporteServiciosVariables = {
  desde: ...,
  hasta: ...,
  clienteId: ..., // optional
  empresa: ..., // optional
  servicioId: ..., // optional
  limit: ..., // optional
  offset: ..., // optional
};

// Call the `getDetalleReporteServiciosRef()` function to get a reference to the query.
const ref = getDetalleReporteServiciosRef(getDetalleReporteServiciosVars);
// Variables can be defined inline as well.
const ref = getDetalleReporteServiciosRef({ desde: ..., hasta: ..., clienteId: ..., empresa: ..., servicioId: ..., limit: ..., offset: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getDetalleReporteServiciosRef(dataConnect, getDetalleReporteServiciosVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.detalles);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.detalles);
});
```

## GetSeguimientoPublicoPorQr
You can execute the `GetSeguimientoPublicoPorQr` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getSeguimientoPublicoPorQr(vars: GetSeguimientoPublicoPorQrVariables, options?: ExecuteQueryOptions): QueryPromise<GetSeguimientoPublicoPorQrData, GetSeguimientoPublicoPorQrVariables>;

interface GetSeguimientoPublicoPorQrRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetSeguimientoPublicoPorQrVariables): QueryRef<GetSeguimientoPublicoPorQrData, GetSeguimientoPublicoPorQrVariables>;
}
export const getSeguimientoPublicoPorQrRef: GetSeguimientoPublicoPorQrRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getSeguimientoPublicoPorQr(dc: DataConnect, vars: GetSeguimientoPublicoPorQrVariables, options?: ExecuteQueryOptions): QueryPromise<GetSeguimientoPublicoPorQrData, GetSeguimientoPublicoPorQrVariables>;

interface GetSeguimientoPublicoPorQrRef {
  ...
  (dc: DataConnect, vars: GetSeguimientoPublicoPorQrVariables): QueryRef<GetSeguimientoPublicoPorQrData, GetSeguimientoPublicoPorQrVariables>;
}
export const getSeguimientoPublicoPorQrRef: GetSeguimientoPublicoPorQrRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getSeguimientoPublicoPorQrRef:
```typescript
const name = getSeguimientoPublicoPorQrRef.operationName;
console.log(name);
```

### Variables
The `GetSeguimientoPublicoPorQr` query requires an argument of type `GetSeguimientoPublicoPorQrVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetSeguimientoPublicoPorQrVariables {
  codigoQr: UUIDString;
}
```
### Return Type
Recall that executing the `GetSeguimientoPublicoPorQr` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetSeguimientoPublicoPorQrData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetSeguimientoPublicoPorQrData {
  comanda?: {
    numeroComanda: string;
    estado: ComandaEstado;
    fechaRecepcion: TimestampString;
    fechaEntregaEstimada?: TimestampString | null;
    fechaEntregaReal?: TimestampString | null;
    actualizadoEn: TimestampString;
    comandaDetalles_on_comanda: ({
      tipoServicio: {
        nombre: string;
      };
    })[];
    comandaEtapas_on_comanda: ({
      nombreEtapa?: string | null;
      ordenEtapa?: number | null;
      estado: EtapaEstado;
      fechaCompletado?: TimestampString | null;
      etapa: {
        nombre: string;
        orden: number;
      };
    })[];
  };
}
```
### Using `GetSeguimientoPublicoPorQr`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getSeguimientoPublicoPorQr, GetSeguimientoPublicoPorQrVariables } from '@dataconnect/generated';

// The `GetSeguimientoPublicoPorQr` query requires an argument of type `GetSeguimientoPublicoPorQrVariables`:
const getSeguimientoPublicoPorQrVars: GetSeguimientoPublicoPorQrVariables = {
  codigoQr: ...,
};

// Call the `getSeguimientoPublicoPorQr()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getSeguimientoPublicoPorQr(getSeguimientoPublicoPorQrVars);
// Variables can be defined inline as well.
const { data } = await getSeguimientoPublicoPorQr({ codigoQr: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getSeguimientoPublicoPorQr(dataConnect, getSeguimientoPublicoPorQrVars);

console.log(data.comanda);

// Or, you can use the `Promise` API.
getSeguimientoPublicoPorQr(getSeguimientoPublicoPorQrVars).then((response) => {
  const data = response.data;
  console.log(data.comanda);
});
```

### Using `GetSeguimientoPublicoPorQr`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getSeguimientoPublicoPorQrRef, GetSeguimientoPublicoPorQrVariables } from '@dataconnect/generated';

// The `GetSeguimientoPublicoPorQr` query requires an argument of type `GetSeguimientoPublicoPorQrVariables`:
const getSeguimientoPublicoPorQrVars: GetSeguimientoPublicoPorQrVariables = {
  codigoQr: ...,
};

// Call the `getSeguimientoPublicoPorQrRef()` function to get a reference to the query.
const ref = getSeguimientoPublicoPorQrRef(getSeguimientoPublicoPorQrVars);
// Variables can be defined inline as well.
const ref = getSeguimientoPublicoPorQrRef({ codigoQr: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getSeguimientoPublicoPorQrRef(dataConnect, getSeguimientoPublicoPorQrVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.comanda);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.comanda);
});
```

## GetSeguimientoPublicoPorNumero
You can execute the `GetSeguimientoPublicoPorNumero` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getSeguimientoPublicoPorNumero(vars: GetSeguimientoPublicoPorNumeroVariables, options?: ExecuteQueryOptions): QueryPromise<GetSeguimientoPublicoPorNumeroData, GetSeguimientoPublicoPorNumeroVariables>;

interface GetSeguimientoPublicoPorNumeroRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetSeguimientoPublicoPorNumeroVariables): QueryRef<GetSeguimientoPublicoPorNumeroData, GetSeguimientoPublicoPorNumeroVariables>;
}
export const getSeguimientoPublicoPorNumeroRef: GetSeguimientoPublicoPorNumeroRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getSeguimientoPublicoPorNumero(dc: DataConnect, vars: GetSeguimientoPublicoPorNumeroVariables, options?: ExecuteQueryOptions): QueryPromise<GetSeguimientoPublicoPorNumeroData, GetSeguimientoPublicoPorNumeroVariables>;

interface GetSeguimientoPublicoPorNumeroRef {
  ...
  (dc: DataConnect, vars: GetSeguimientoPublicoPorNumeroVariables): QueryRef<GetSeguimientoPublicoPorNumeroData, GetSeguimientoPublicoPorNumeroVariables>;
}
export const getSeguimientoPublicoPorNumeroRef: GetSeguimientoPublicoPorNumeroRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getSeguimientoPublicoPorNumeroRef:
```typescript
const name = getSeguimientoPublicoPorNumeroRef.operationName;
console.log(name);
```

### Variables
The `GetSeguimientoPublicoPorNumero` query requires an argument of type `GetSeguimientoPublicoPorNumeroVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetSeguimientoPublicoPorNumeroVariables {
  numeroComanda: string;
}
```
### Return Type
Recall that executing the `GetSeguimientoPublicoPorNumero` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetSeguimientoPublicoPorNumeroData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetSeguimientoPublicoPorNumeroData {
  comanda?: {
    numeroComanda: string;
    estado: ComandaEstado;
    fechaRecepcion: TimestampString;
    fechaEntregaEstimada?: TimestampString | null;
    fechaEntregaReal?: TimestampString | null;
    actualizadoEn: TimestampString;
    comandaDetalles_on_comanda: ({
      tipoServicio: {
        nombre: string;
      };
    })[];
    comandaEtapas_on_comanda: ({
      nombreEtapa?: string | null;
      ordenEtapa?: number | null;
      estado: EtapaEstado;
      fechaCompletado?: TimestampString | null;
      etapa: {
        nombre: string;
        orden: number;
      };
    })[];
  };
}
```
### Using `GetSeguimientoPublicoPorNumero`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getSeguimientoPublicoPorNumero, GetSeguimientoPublicoPorNumeroVariables } from '@dataconnect/generated';

// The `GetSeguimientoPublicoPorNumero` query requires an argument of type `GetSeguimientoPublicoPorNumeroVariables`:
const getSeguimientoPublicoPorNumeroVars: GetSeguimientoPublicoPorNumeroVariables = {
  numeroComanda: ...,
};

// Call the `getSeguimientoPublicoPorNumero()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getSeguimientoPublicoPorNumero(getSeguimientoPublicoPorNumeroVars);
// Variables can be defined inline as well.
const { data } = await getSeguimientoPublicoPorNumero({ numeroComanda: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getSeguimientoPublicoPorNumero(dataConnect, getSeguimientoPublicoPorNumeroVars);

console.log(data.comanda);

// Or, you can use the `Promise` API.
getSeguimientoPublicoPorNumero(getSeguimientoPublicoPorNumeroVars).then((response) => {
  const data = response.data;
  console.log(data.comanda);
});
```

### Using `GetSeguimientoPublicoPorNumero`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getSeguimientoPublicoPorNumeroRef, GetSeguimientoPublicoPorNumeroVariables } from '@dataconnect/generated';

// The `GetSeguimientoPublicoPorNumero` query requires an argument of type `GetSeguimientoPublicoPorNumeroVariables`:
const getSeguimientoPublicoPorNumeroVars: GetSeguimientoPublicoPorNumeroVariables = {
  numeroComanda: ...,
};

// Call the `getSeguimientoPublicoPorNumeroRef()` function to get a reference to the query.
const ref = getSeguimientoPublicoPorNumeroRef(getSeguimientoPublicoPorNumeroVars);
// Variables can be defined inline as well.
const ref = getSeguimientoPublicoPorNumeroRef({ numeroComanda: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getSeguimientoPublicoPorNumeroRef(dataConnect, getSeguimientoPublicoPorNumeroVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.comanda);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.comanda);
});
```

## GetComandaOperativaPorQr
You can execute the `GetComandaOperativaPorQr` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getComandaOperativaPorQr(vars: GetComandaOperativaPorQrVariables, options?: ExecuteQueryOptions): QueryPromise<GetComandaOperativaPorQrData, GetComandaOperativaPorQrVariables>;

interface GetComandaOperativaPorQrRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetComandaOperativaPorQrVariables): QueryRef<GetComandaOperativaPorQrData, GetComandaOperativaPorQrVariables>;
}
export const getComandaOperativaPorQrRef: GetComandaOperativaPorQrRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getComandaOperativaPorQr(dc: DataConnect, vars: GetComandaOperativaPorQrVariables, options?: ExecuteQueryOptions): QueryPromise<GetComandaOperativaPorQrData, GetComandaOperativaPorQrVariables>;

interface GetComandaOperativaPorQrRef {
  ...
  (dc: DataConnect, vars: GetComandaOperativaPorQrVariables): QueryRef<GetComandaOperativaPorQrData, GetComandaOperativaPorQrVariables>;
}
export const getComandaOperativaPorQrRef: GetComandaOperativaPorQrRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getComandaOperativaPorQrRef:
```typescript
const name = getComandaOperativaPorQrRef.operationName;
console.log(name);
```

### Variables
The `GetComandaOperativaPorQr` query requires an argument of type `GetComandaOperativaPorQrVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetComandaOperativaPorQrVariables {
  codigoQr: UUIDString;
}
```
### Return Type
Recall that executing the `GetComandaOperativaPorQr` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetComandaOperativaPorQrData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetComandaOperativaPorQrData {
  comanda?: {
    id: UUIDString;
    codigoQr: UUIDString;
    numeroComanda: string;
    estado: ComandaEstado;
    actualizadoEn: TimestampString;
    fechaRecepcion: TimestampString;
    fechaEntregaEstimada?: TimestampString | null;
    fechaEntregaReal?: TimestampString | null;
    cliente: {
      id: UUIDString;
      nombre: string;
      tipoCliente: TipoCliente;
    } & Cliente_Key;
    comandaDetalles_on_comanda: ({
      id: UUIDString;
      cantidad: number;
      pesoKg?: number | null;
      detalle?: string | null;
      tipoPrenda: {
        nombre: string;
      };
      tipoServicio: {
        nombre: string;
      };
    } & ComandaDetalle_Key)[];
    comandaEtapas_on_comanda: ({
      etapaId: UUIDString;
      nombreEtapa?: string | null;
      ordenEtapa?: number | null;
      descripcionEtapa?: string | null;
      tiempoEstimadoMin?: number | null;
      estado: EtapaEstado;
      fechaInicio?: TimestampString | null;
      fechaCompletado?: TimestampString | null;
      operario?: {
        id: string;
        nombre: string;
        apellido?: string | null;
      } & Usuario_Key;
      asignadoA?: {
        id: string;
        nombre: string;
        apellido?: string | null;
      } & Usuario_Key;
      etapa: {
        nombre: string;
        orden: number;
        descripcion?: string | null;
        tiempoEstimadoMin?: number | null;
      };
    })[];
  } & Comanda_Key;
}
```
### Using `GetComandaOperativaPorQr`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getComandaOperativaPorQr, GetComandaOperativaPorQrVariables } from '@dataconnect/generated';

// The `GetComandaOperativaPorQr` query requires an argument of type `GetComandaOperativaPorQrVariables`:
const getComandaOperativaPorQrVars: GetComandaOperativaPorQrVariables = {
  codigoQr: ...,
};

// Call the `getComandaOperativaPorQr()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getComandaOperativaPorQr(getComandaOperativaPorQrVars);
// Variables can be defined inline as well.
const { data } = await getComandaOperativaPorQr({ codigoQr: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getComandaOperativaPorQr(dataConnect, getComandaOperativaPorQrVars);

console.log(data.comanda);

// Or, you can use the `Promise` API.
getComandaOperativaPorQr(getComandaOperativaPorQrVars).then((response) => {
  const data = response.data;
  console.log(data.comanda);
});
```

### Using `GetComandaOperativaPorQr`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getComandaOperativaPorQrRef, GetComandaOperativaPorQrVariables } from '@dataconnect/generated';

// The `GetComandaOperativaPorQr` query requires an argument of type `GetComandaOperativaPorQrVariables`:
const getComandaOperativaPorQrVars: GetComandaOperativaPorQrVariables = {
  codigoQr: ...,
};

// Call the `getComandaOperativaPorQrRef()` function to get a reference to the query.
const ref = getComandaOperativaPorQrRef(getComandaOperativaPorQrVars);
// Variables can be defined inline as well.
const ref = getComandaOperativaPorQrRef({ codigoQr: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getComandaOperativaPorQrRef(dataConnect, getComandaOperativaPorQrVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.comanda);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.comanda);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## AgregarComentarioComanda
You can execute the `AgregarComentarioComanda` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
agregarComentarioComanda(vars: AgregarComentarioComandaVariables): MutationPromise<AgregarComentarioComandaData, AgregarComentarioComandaVariables>;

interface AgregarComentarioComandaRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AgregarComentarioComandaVariables): MutationRef<AgregarComentarioComandaData, AgregarComentarioComandaVariables>;
}
export const agregarComentarioComandaRef: AgregarComentarioComandaRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
agregarComentarioComanda(dc: DataConnect, vars: AgregarComentarioComandaVariables): MutationPromise<AgregarComentarioComandaData, AgregarComentarioComandaVariables>;

interface AgregarComentarioComandaRef {
  ...
  (dc: DataConnect, vars: AgregarComentarioComandaVariables): MutationRef<AgregarComentarioComandaData, AgregarComentarioComandaVariables>;
}
export const agregarComentarioComandaRef: AgregarComentarioComandaRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the agregarComentarioComandaRef:
```typescript
const name = agregarComentarioComandaRef.operationName;
console.log(name);
```

### Variables
The `AgregarComentarioComanda` mutation requires an argument of type `AgregarComentarioComandaVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AgregarComentarioComandaVariables {
  comandaId: UUIDString;
  texto: string;
}
```
### Return Type
Recall that executing the `AgregarComentarioComanda` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AgregarComentarioComandaData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AgregarComentarioComandaData {
  comandaHistorialEstado_insert: ComandaHistorialEstado_Key;
}
```
### Using `AgregarComentarioComanda`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, agregarComentarioComanda, AgregarComentarioComandaVariables } from '@dataconnect/generated';

// The `AgregarComentarioComanda` mutation requires an argument of type `AgregarComentarioComandaVariables`:
const agregarComentarioComandaVars: AgregarComentarioComandaVariables = {
  comandaId: ...,
  texto: ...,
};

// Call the `agregarComentarioComanda()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await agregarComentarioComanda(agregarComentarioComandaVars);
// Variables can be defined inline as well.
const { data } = await agregarComentarioComanda({ comandaId: ..., texto: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await agregarComentarioComanda(dataConnect, agregarComentarioComandaVars);

console.log(data.comandaHistorialEstado_insert);

// Or, you can use the `Promise` API.
agregarComentarioComanda(agregarComentarioComandaVars).then((response) => {
  const data = response.data;
  console.log(data.comandaHistorialEstado_insert);
});
```

### Using `AgregarComentarioComanda`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, agregarComentarioComandaRef, AgregarComentarioComandaVariables } from '@dataconnect/generated';

// The `AgregarComentarioComanda` mutation requires an argument of type `AgregarComentarioComandaVariables`:
const agregarComentarioComandaVars: AgregarComentarioComandaVariables = {
  comandaId: ...,
  texto: ...,
};

// Call the `agregarComentarioComandaRef()` function to get a reference to the mutation.
const ref = agregarComentarioComandaRef(agregarComentarioComandaVars);
// Variables can be defined inline as well.
const ref = agregarComentarioComandaRef({ comandaId: ..., texto: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = agregarComentarioComandaRef(dataConnect, agregarComentarioComandaVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.comandaHistorialEstado_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.comandaHistorialEstado_insert);
});
```

## ResolverMiIncidencia
You can execute the `ResolverMiIncidencia` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
resolverMiIncidencia(vars: ResolverMiIncidenciaVariables): MutationPromise<ResolverMiIncidenciaData, ResolverMiIncidenciaVariables>;

interface ResolverMiIncidenciaRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ResolverMiIncidenciaVariables): MutationRef<ResolverMiIncidenciaData, ResolverMiIncidenciaVariables>;
}
export const resolverMiIncidenciaRef: ResolverMiIncidenciaRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
resolverMiIncidencia(dc: DataConnect, vars: ResolverMiIncidenciaVariables): MutationPromise<ResolverMiIncidenciaData, ResolverMiIncidenciaVariables>;

interface ResolverMiIncidenciaRef {
  ...
  (dc: DataConnect, vars: ResolverMiIncidenciaVariables): MutationRef<ResolverMiIncidenciaData, ResolverMiIncidenciaVariables>;
}
export const resolverMiIncidenciaRef: ResolverMiIncidenciaRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the resolverMiIncidenciaRef:
```typescript
const name = resolverMiIncidenciaRef.operationName;
console.log(name);
```

### Variables
The `ResolverMiIncidencia` mutation requires an argument of type `ResolverMiIncidenciaVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ResolverMiIncidenciaVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `ResolverMiIncidencia` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ResolverMiIncidenciaData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ResolverMiIncidenciaData {
  incidenciaComanda_update?: IncidenciaComanda_Key | null;
}
```
### Using `ResolverMiIncidencia`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, resolverMiIncidencia, ResolverMiIncidenciaVariables } from '@dataconnect/generated';

// The `ResolverMiIncidencia` mutation requires an argument of type `ResolverMiIncidenciaVariables`:
const resolverMiIncidenciaVars: ResolverMiIncidenciaVariables = {
  id: ...,
};

// Call the `resolverMiIncidencia()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await resolverMiIncidencia(resolverMiIncidenciaVars);
// Variables can be defined inline as well.
const { data } = await resolverMiIncidencia({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await resolverMiIncidencia(dataConnect, resolverMiIncidenciaVars);

console.log(data.incidenciaComanda_update);

// Or, you can use the `Promise` API.
resolverMiIncidencia(resolverMiIncidenciaVars).then((response) => {
  const data = response.data;
  console.log(data.incidenciaComanda_update);
});
```

### Using `ResolverMiIncidencia`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, resolverMiIncidenciaRef, ResolverMiIncidenciaVariables } from '@dataconnect/generated';

// The `ResolverMiIncidencia` mutation requires an argument of type `ResolverMiIncidenciaVariables`:
const resolverMiIncidenciaVars: ResolverMiIncidenciaVariables = {
  id: ...,
};

// Call the `resolverMiIncidenciaRef()` function to get a reference to the mutation.
const ref = resolverMiIncidenciaRef(resolverMiIncidenciaVars);
// Variables can be defined inline as well.
const ref = resolverMiIncidenciaRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = resolverMiIncidenciaRef(dataConnect, resolverMiIncidenciaVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.incidenciaComanda_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.incidenciaComanda_update);
});
```

## AutoAsignarComandaOperario
You can execute the `AutoAsignarComandaOperario` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
autoAsignarComandaOperario(vars: AutoAsignarComandaOperarioVariables): MutationPromise<AutoAsignarComandaOperarioData, AutoAsignarComandaOperarioVariables>;

interface AutoAsignarComandaOperarioRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AutoAsignarComandaOperarioVariables): MutationRef<AutoAsignarComandaOperarioData, AutoAsignarComandaOperarioVariables>;
}
export const autoAsignarComandaOperarioRef: AutoAsignarComandaOperarioRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
autoAsignarComandaOperario(dc: DataConnect, vars: AutoAsignarComandaOperarioVariables): MutationPromise<AutoAsignarComandaOperarioData, AutoAsignarComandaOperarioVariables>;

interface AutoAsignarComandaOperarioRef {
  ...
  (dc: DataConnect, vars: AutoAsignarComandaOperarioVariables): MutationRef<AutoAsignarComandaOperarioData, AutoAsignarComandaOperarioVariables>;
}
export const autoAsignarComandaOperarioRef: AutoAsignarComandaOperarioRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the autoAsignarComandaOperarioRef:
```typescript
const name = autoAsignarComandaOperarioRef.operationName;
console.log(name);
```

### Variables
The `AutoAsignarComandaOperario` mutation requires an argument of type `AutoAsignarComandaOperarioVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AutoAsignarComandaOperarioVariables {
  comandaId: UUIDString;
}
```
### Return Type
Recall that executing the `AutoAsignarComandaOperario` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AutoAsignarComandaOperarioData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AutoAsignarComandaOperarioData {
  comandaEtapa_updateMany: number;
}
```
### Using `AutoAsignarComandaOperario`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, autoAsignarComandaOperario, AutoAsignarComandaOperarioVariables } from '@dataconnect/generated';

// The `AutoAsignarComandaOperario` mutation requires an argument of type `AutoAsignarComandaOperarioVariables`:
const autoAsignarComandaOperarioVars: AutoAsignarComandaOperarioVariables = {
  comandaId: ...,
};

// Call the `autoAsignarComandaOperario()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await autoAsignarComandaOperario(autoAsignarComandaOperarioVars);
// Variables can be defined inline as well.
const { data } = await autoAsignarComandaOperario({ comandaId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await autoAsignarComandaOperario(dataConnect, autoAsignarComandaOperarioVars);

console.log(data.comandaEtapa_updateMany);

// Or, you can use the `Promise` API.
autoAsignarComandaOperario(autoAsignarComandaOperarioVars).then((response) => {
  const data = response.data;
  console.log(data.comandaEtapa_updateMany);
});
```

### Using `AutoAsignarComandaOperario`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, autoAsignarComandaOperarioRef, AutoAsignarComandaOperarioVariables } from '@dataconnect/generated';

// The `AutoAsignarComandaOperario` mutation requires an argument of type `AutoAsignarComandaOperarioVariables`:
const autoAsignarComandaOperarioVars: AutoAsignarComandaOperarioVariables = {
  comandaId: ...,
};

// Call the `autoAsignarComandaOperarioRef()` function to get a reference to the mutation.
const ref = autoAsignarComandaOperarioRef(autoAsignarComandaOperarioVars);
// Variables can be defined inline as well.
const ref = autoAsignarComandaOperarioRef({ comandaId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = autoAsignarComandaOperarioRef(dataConnect, autoAsignarComandaOperarioVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.comandaEtapa_updateMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.comandaEtapa_updateMany);
});
```

## CrearAviso
You can execute the `CrearAviso` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
crearAviso(vars: CrearAvisoVariables): MutationPromise<CrearAvisoData, CrearAvisoVariables>;

interface CrearAvisoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CrearAvisoVariables): MutationRef<CrearAvisoData, CrearAvisoVariables>;
}
export const crearAvisoRef: CrearAvisoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
crearAviso(dc: DataConnect, vars: CrearAvisoVariables): MutationPromise<CrearAvisoData, CrearAvisoVariables>;

interface CrearAvisoRef {
  ...
  (dc: DataConnect, vars: CrearAvisoVariables): MutationRef<CrearAvisoData, CrearAvisoVariables>;
}
export const crearAvisoRef: CrearAvisoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the crearAvisoRef:
```typescript
const name = crearAvisoRef.operationName;
console.log(name);
```

### Variables
The `CrearAviso` mutation requires an argument of type `CrearAvisoVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CrearAvisoVariables {
  titulo: string;
  contenido: string;
  rolDestinatarioId?: UUIDString | null;
}
```
### Return Type
Recall that executing the `CrearAviso` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CrearAvisoData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CrearAvisoData {
  aviso_insert: Aviso_Key;
}
```
### Using `CrearAviso`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, crearAviso, CrearAvisoVariables } from '@dataconnect/generated';

// The `CrearAviso` mutation requires an argument of type `CrearAvisoVariables`:
const crearAvisoVars: CrearAvisoVariables = {
  titulo: ...,
  contenido: ...,
  rolDestinatarioId: ..., // optional
};

// Call the `crearAviso()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await crearAviso(crearAvisoVars);
// Variables can be defined inline as well.
const { data } = await crearAviso({ titulo: ..., contenido: ..., rolDestinatarioId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await crearAviso(dataConnect, crearAvisoVars);

console.log(data.aviso_insert);

// Or, you can use the `Promise` API.
crearAviso(crearAvisoVars).then((response) => {
  const data = response.data;
  console.log(data.aviso_insert);
});
```

### Using `CrearAviso`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, crearAvisoRef, CrearAvisoVariables } from '@dataconnect/generated';

// The `CrearAviso` mutation requires an argument of type `CrearAvisoVariables`:
const crearAvisoVars: CrearAvisoVariables = {
  titulo: ...,
  contenido: ...,
  rolDestinatarioId: ..., // optional
};

// Call the `crearAvisoRef()` function to get a reference to the mutation.
const ref = crearAvisoRef(crearAvisoVars);
// Variables can be defined inline as well.
const ref = crearAvisoRef({ titulo: ..., contenido: ..., rolDestinatarioId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = crearAvisoRef(dataConnect, crearAvisoVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.aviso_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.aviso_insert);
});
```

## Registrarse
You can execute the `Registrarse` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
registrarse(vars: RegistrarseVariables): MutationPromise<RegistrarseData, RegistrarseVariables>;

interface RegistrarseRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RegistrarseVariables): MutationRef<RegistrarseData, RegistrarseVariables>;
}
export const registrarseRef: RegistrarseRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
registrarse(dc: DataConnect, vars: RegistrarseVariables): MutationPromise<RegistrarseData, RegistrarseVariables>;

interface RegistrarseRef {
  ...
  (dc: DataConnect, vars: RegistrarseVariables): MutationRef<RegistrarseData, RegistrarseVariables>;
}
export const registrarseRef: RegistrarseRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the registrarseRef:
```typescript
const name = registrarseRef.operationName;
console.log(name);
```

### Variables
The `Registrarse` mutation requires an argument of type `RegistrarseVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RegistrarseVariables {
  rolId: UUIDString;
  rut: string;
  nombre: string;
  apellido: string;
  telefono?: string | null;
  email: string;
}
```
### Return Type
Recall that executing the `Registrarse` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RegistrarseData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RegistrarseData {
  usuario_insert: Usuario_Key;
}
```
### Using `Registrarse`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, registrarse, RegistrarseVariables } from '@dataconnect/generated';

// The `Registrarse` mutation requires an argument of type `RegistrarseVariables`:
const registrarseVars: RegistrarseVariables = {
  rolId: ...,
  rut: ...,
  nombre: ...,
  apellido: ...,
  telefono: ..., // optional
  email: ...,
};

// Call the `registrarse()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await registrarse(registrarseVars);
// Variables can be defined inline as well.
const { data } = await registrarse({ rolId: ..., rut: ..., nombre: ..., apellido: ..., telefono: ..., email: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await registrarse(dataConnect, registrarseVars);

console.log(data.usuario_insert);

// Or, you can use the `Promise` API.
registrarse(registrarseVars).then((response) => {
  const data = response.data;
  console.log(data.usuario_insert);
});
```

### Using `Registrarse`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, registrarseRef, RegistrarseVariables } from '@dataconnect/generated';

// The `Registrarse` mutation requires an argument of type `RegistrarseVariables`:
const registrarseVars: RegistrarseVariables = {
  rolId: ...,
  rut: ...,
  nombre: ...,
  apellido: ...,
  telefono: ..., // optional
  email: ...,
};

// Call the `registrarseRef()` function to get a reference to the mutation.
const ref = registrarseRef(registrarseVars);
// Variables can be defined inline as well.
const ref = registrarseRef({ rolId: ..., rut: ..., nombre: ..., apellido: ..., telefono: ..., email: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = registrarseRef(dataConnect, registrarseVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.usuario_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.usuario_insert);
});
```

## CrearUsuarioAdministrado
You can execute the `CrearUsuarioAdministrado` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
crearUsuarioAdministrado(vars: CrearUsuarioAdministradoVariables): MutationPromise<CrearUsuarioAdministradoData, CrearUsuarioAdministradoVariables>;

interface CrearUsuarioAdministradoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CrearUsuarioAdministradoVariables): MutationRef<CrearUsuarioAdministradoData, CrearUsuarioAdministradoVariables>;
}
export const crearUsuarioAdministradoRef: CrearUsuarioAdministradoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
crearUsuarioAdministrado(dc: DataConnect, vars: CrearUsuarioAdministradoVariables): MutationPromise<CrearUsuarioAdministradoData, CrearUsuarioAdministradoVariables>;

interface CrearUsuarioAdministradoRef {
  ...
  (dc: DataConnect, vars: CrearUsuarioAdministradoVariables): MutationRef<CrearUsuarioAdministradoData, CrearUsuarioAdministradoVariables>;
}
export const crearUsuarioAdministradoRef: CrearUsuarioAdministradoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the crearUsuarioAdministradoRef:
```typescript
const name = crearUsuarioAdministradoRef.operationName;
console.log(name);
```

### Variables
The `CrearUsuarioAdministrado` mutation requires an argument of type `CrearUsuarioAdministradoVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CrearUsuarioAdministradoVariables {
  id: string;
  rolId: UUIDString;
  rut: string;
  nombre: string;
  apellido: string;
  telefono?: string | null;
  email: string;
}
```
### Return Type
Recall that executing the `CrearUsuarioAdministrado` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CrearUsuarioAdministradoData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CrearUsuarioAdministradoData {
  usuario_insert: Usuario_Key;
}
```
### Using `CrearUsuarioAdministrado`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, crearUsuarioAdministrado, CrearUsuarioAdministradoVariables } from '@dataconnect/generated';

// The `CrearUsuarioAdministrado` mutation requires an argument of type `CrearUsuarioAdministradoVariables`:
const crearUsuarioAdministradoVars: CrearUsuarioAdministradoVariables = {
  id: ...,
  rolId: ...,
  rut: ...,
  nombre: ...,
  apellido: ...,
  telefono: ..., // optional
  email: ...,
};

// Call the `crearUsuarioAdministrado()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await crearUsuarioAdministrado(crearUsuarioAdministradoVars);
// Variables can be defined inline as well.
const { data } = await crearUsuarioAdministrado({ id: ..., rolId: ..., rut: ..., nombre: ..., apellido: ..., telefono: ..., email: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await crearUsuarioAdministrado(dataConnect, crearUsuarioAdministradoVars);

console.log(data.usuario_insert);

// Or, you can use the `Promise` API.
crearUsuarioAdministrado(crearUsuarioAdministradoVars).then((response) => {
  const data = response.data;
  console.log(data.usuario_insert);
});
```

### Using `CrearUsuarioAdministrado`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, crearUsuarioAdministradoRef, CrearUsuarioAdministradoVariables } from '@dataconnect/generated';

// The `CrearUsuarioAdministrado` mutation requires an argument of type `CrearUsuarioAdministradoVariables`:
const crearUsuarioAdministradoVars: CrearUsuarioAdministradoVariables = {
  id: ...,
  rolId: ...,
  rut: ...,
  nombre: ...,
  apellido: ...,
  telefono: ..., // optional
  email: ...,
};

// Call the `crearUsuarioAdministradoRef()` function to get a reference to the mutation.
const ref = crearUsuarioAdministradoRef(crearUsuarioAdministradoVars);
// Variables can be defined inline as well.
const ref = crearUsuarioAdministradoRef({ id: ..., rolId: ..., rut: ..., nombre: ..., apellido: ..., telefono: ..., email: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = crearUsuarioAdministradoRef(dataConnect, crearUsuarioAdministradoVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.usuario_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.usuario_insert);
});
```

## RegistrarseComoCliente
You can execute the `RegistrarseComoCliente` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
registrarseComoCliente(vars: RegistrarseComoClienteVariables): MutationPromise<RegistrarseComoClienteData, RegistrarseComoClienteVariables>;

interface RegistrarseComoClienteRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RegistrarseComoClienteVariables): MutationRef<RegistrarseComoClienteData, RegistrarseComoClienteVariables>;
}
export const registrarseComoClienteRef: RegistrarseComoClienteRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
registrarseComoCliente(dc: DataConnect, vars: RegistrarseComoClienteVariables): MutationPromise<RegistrarseComoClienteData, RegistrarseComoClienteVariables>;

interface RegistrarseComoClienteRef {
  ...
  (dc: DataConnect, vars: RegistrarseComoClienteVariables): MutationRef<RegistrarseComoClienteData, RegistrarseComoClienteVariables>;
}
export const registrarseComoClienteRef: RegistrarseComoClienteRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the registrarseComoClienteRef:
```typescript
const name = registrarseComoClienteRef.operationName;
console.log(name);
```

### Variables
The `RegistrarseComoCliente` mutation requires an argument of type `RegistrarseComoClienteVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RegistrarseComoClienteVariables {
  rut: string;
  nombre: string;
  apellido: string;
  telefono?: string | null;
  email: string;
  direccion?: string | null;
  tipoCliente: TipoCliente;
}
```
### Return Type
Recall that executing the `RegistrarseComoCliente` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RegistrarseComoClienteData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RegistrarseComoClienteData {
  usuario_insert: Usuario_Key;
  cliente_insert: Cliente_Key;
}
```
### Using `RegistrarseComoCliente`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, registrarseComoCliente, RegistrarseComoClienteVariables } from '@dataconnect/generated';

// The `RegistrarseComoCliente` mutation requires an argument of type `RegistrarseComoClienteVariables`:
const registrarseComoClienteVars: RegistrarseComoClienteVariables = {
  rut: ...,
  nombre: ...,
  apellido: ...,
  telefono: ..., // optional
  email: ...,
  direccion: ..., // optional
  tipoCliente: ...,
};

// Call the `registrarseComoCliente()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await registrarseComoCliente(registrarseComoClienteVars);
// Variables can be defined inline as well.
const { data } = await registrarseComoCliente({ rut: ..., nombre: ..., apellido: ..., telefono: ..., email: ..., direccion: ..., tipoCliente: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await registrarseComoCliente(dataConnect, registrarseComoClienteVars);

console.log(data.usuario_insert);
console.log(data.cliente_insert);

// Or, you can use the `Promise` API.
registrarseComoCliente(registrarseComoClienteVars).then((response) => {
  const data = response.data;
  console.log(data.usuario_insert);
  console.log(data.cliente_insert);
});
```

### Using `RegistrarseComoCliente`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, registrarseComoClienteRef, RegistrarseComoClienteVariables } from '@dataconnect/generated';

// The `RegistrarseComoCliente` mutation requires an argument of type `RegistrarseComoClienteVariables`:
const registrarseComoClienteVars: RegistrarseComoClienteVariables = {
  rut: ...,
  nombre: ...,
  apellido: ...,
  telefono: ..., // optional
  email: ...,
  direccion: ..., // optional
  tipoCliente: ...,
};

// Call the `registrarseComoClienteRef()` function to get a reference to the mutation.
const ref = registrarseComoClienteRef(registrarseComoClienteVars);
// Variables can be defined inline as well.
const ref = registrarseComoClienteRef({ rut: ..., nombre: ..., apellido: ..., telefono: ..., email: ..., direccion: ..., tipoCliente: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = registrarseComoClienteRef(dataConnect, registrarseComoClienteVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.usuario_insert);
console.log(data.cliente_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.usuario_insert);
  console.log(data.cliente_insert);
});
```

## CrearClienteAdministrado
You can execute the `CrearClienteAdministrado` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
crearClienteAdministrado(vars: CrearClienteAdministradoVariables): MutationPromise<CrearClienteAdministradoData, CrearClienteAdministradoVariables>;

interface CrearClienteAdministradoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CrearClienteAdministradoVariables): MutationRef<CrearClienteAdministradoData, CrearClienteAdministradoVariables>;
}
export const crearClienteAdministradoRef: CrearClienteAdministradoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
crearClienteAdministrado(dc: DataConnect, vars: CrearClienteAdministradoVariables): MutationPromise<CrearClienteAdministradoData, CrearClienteAdministradoVariables>;

interface CrearClienteAdministradoRef {
  ...
  (dc: DataConnect, vars: CrearClienteAdministradoVariables): MutationRef<CrearClienteAdministradoData, CrearClienteAdministradoVariables>;
}
export const crearClienteAdministradoRef: CrearClienteAdministradoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the crearClienteAdministradoRef:
```typescript
const name = crearClienteAdministradoRef.operationName;
console.log(name);
```

### Variables
The `CrearClienteAdministrado` mutation requires an argument of type `CrearClienteAdministradoVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CrearClienteAdministradoVariables {
  id: string;
  rut: string;
  nombre: string;
  apellido: string;
  telefono?: string | null;
  email: string;
  direccion?: string | null;
  tipoCliente: TipoCliente;
}
```
### Return Type
Recall that executing the `CrearClienteAdministrado` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CrearClienteAdministradoData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CrearClienteAdministradoData {
  usuario_insert: Usuario_Key;
  cliente_insert: Cliente_Key;
}
```
### Using `CrearClienteAdministrado`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, crearClienteAdministrado, CrearClienteAdministradoVariables } from '@dataconnect/generated';

// The `CrearClienteAdministrado` mutation requires an argument of type `CrearClienteAdministradoVariables`:
const crearClienteAdministradoVars: CrearClienteAdministradoVariables = {
  id: ...,
  rut: ...,
  nombre: ...,
  apellido: ...,
  telefono: ..., // optional
  email: ...,
  direccion: ..., // optional
  tipoCliente: ...,
};

// Call the `crearClienteAdministrado()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await crearClienteAdministrado(crearClienteAdministradoVars);
// Variables can be defined inline as well.
const { data } = await crearClienteAdministrado({ id: ..., rut: ..., nombre: ..., apellido: ..., telefono: ..., email: ..., direccion: ..., tipoCliente: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await crearClienteAdministrado(dataConnect, crearClienteAdministradoVars);

console.log(data.usuario_insert);
console.log(data.cliente_insert);

// Or, you can use the `Promise` API.
crearClienteAdministrado(crearClienteAdministradoVars).then((response) => {
  const data = response.data;
  console.log(data.usuario_insert);
  console.log(data.cliente_insert);
});
```

### Using `CrearClienteAdministrado`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, crearClienteAdministradoRef, CrearClienteAdministradoVariables } from '@dataconnect/generated';

// The `CrearClienteAdministrado` mutation requires an argument of type `CrearClienteAdministradoVariables`:
const crearClienteAdministradoVars: CrearClienteAdministradoVariables = {
  id: ...,
  rut: ...,
  nombre: ...,
  apellido: ...,
  telefono: ..., // optional
  email: ...,
  direccion: ..., // optional
  tipoCliente: ...,
};

// Call the `crearClienteAdministradoRef()` function to get a reference to the mutation.
const ref = crearClienteAdministradoRef(crearClienteAdministradoVars);
// Variables can be defined inline as well.
const ref = crearClienteAdministradoRef({ id: ..., rut: ..., nombre: ..., apellido: ..., telefono: ..., email: ..., direccion: ..., tipoCliente: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = crearClienteAdministradoRef(dataConnect, crearClienteAdministradoVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.usuario_insert);
console.log(data.cliente_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.usuario_insert);
  console.log(data.cliente_insert);
});
```

## ActualizarUsuario
You can execute the `ActualizarUsuario` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
actualizarUsuario(vars: ActualizarUsuarioVariables): MutationPromise<ActualizarUsuarioData, ActualizarUsuarioVariables>;

interface ActualizarUsuarioRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ActualizarUsuarioVariables): MutationRef<ActualizarUsuarioData, ActualizarUsuarioVariables>;
}
export const actualizarUsuarioRef: ActualizarUsuarioRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
actualizarUsuario(dc: DataConnect, vars: ActualizarUsuarioVariables): MutationPromise<ActualizarUsuarioData, ActualizarUsuarioVariables>;

interface ActualizarUsuarioRef {
  ...
  (dc: DataConnect, vars: ActualizarUsuarioVariables): MutationRef<ActualizarUsuarioData, ActualizarUsuarioVariables>;
}
export const actualizarUsuarioRef: ActualizarUsuarioRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the actualizarUsuarioRef:
```typescript
const name = actualizarUsuarioRef.operationName;
console.log(name);
```

### Variables
The `ActualizarUsuario` mutation requires an argument of type `ActualizarUsuarioVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ActualizarUsuarioVariables {
  id: string;
  rolId: UUIDString;
  nombre: string;
  apellido?: string | null;
  telefono?: string | null;
  activo: boolean;
}
```
### Return Type
Recall that executing the `ActualizarUsuario` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ActualizarUsuarioData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ActualizarUsuarioData {
  usuario_update?: Usuario_Key | null;
}
```
### Using `ActualizarUsuario`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, actualizarUsuario, ActualizarUsuarioVariables } from '@dataconnect/generated';

// The `ActualizarUsuario` mutation requires an argument of type `ActualizarUsuarioVariables`:
const actualizarUsuarioVars: ActualizarUsuarioVariables = {
  id: ...,
  rolId: ...,
  nombre: ...,
  apellido: ..., // optional
  telefono: ..., // optional
  activo: ...,
};

// Call the `actualizarUsuario()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await actualizarUsuario(actualizarUsuarioVars);
// Variables can be defined inline as well.
const { data } = await actualizarUsuario({ id: ..., rolId: ..., nombre: ..., apellido: ..., telefono: ..., activo: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await actualizarUsuario(dataConnect, actualizarUsuarioVars);

console.log(data.usuario_update);

// Or, you can use the `Promise` API.
actualizarUsuario(actualizarUsuarioVars).then((response) => {
  const data = response.data;
  console.log(data.usuario_update);
});
```

### Using `ActualizarUsuario`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, actualizarUsuarioRef, ActualizarUsuarioVariables } from '@dataconnect/generated';

// The `ActualizarUsuario` mutation requires an argument of type `ActualizarUsuarioVariables`:
const actualizarUsuarioVars: ActualizarUsuarioVariables = {
  id: ...,
  rolId: ...,
  nombre: ...,
  apellido: ..., // optional
  telefono: ..., // optional
  activo: ...,
};

// Call the `actualizarUsuarioRef()` function to get a reference to the mutation.
const ref = actualizarUsuarioRef(actualizarUsuarioVars);
// Variables can be defined inline as well.
const ref = actualizarUsuarioRef({ id: ..., rolId: ..., nombre: ..., apellido: ..., telefono: ..., activo: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = actualizarUsuarioRef(dataConnect, actualizarUsuarioVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.usuario_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.usuario_update);
});
```

## CrearVehiculo
You can execute the `CrearVehiculo` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
crearVehiculo(vars: CrearVehiculoVariables): MutationPromise<CrearVehiculoData, CrearVehiculoVariables>;

interface CrearVehiculoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CrearVehiculoVariables): MutationRef<CrearVehiculoData, CrearVehiculoVariables>;
}
export const crearVehiculoRef: CrearVehiculoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
crearVehiculo(dc: DataConnect, vars: CrearVehiculoVariables): MutationPromise<CrearVehiculoData, CrearVehiculoVariables>;

interface CrearVehiculoRef {
  ...
  (dc: DataConnect, vars: CrearVehiculoVariables): MutationRef<CrearVehiculoData, CrearVehiculoVariables>;
}
export const crearVehiculoRef: CrearVehiculoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the crearVehiculoRef:
```typescript
const name = crearVehiculoRef.operationName;
console.log(name);
```

### Variables
The `CrearVehiculo` mutation requires an argument of type `CrearVehiculoVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CrearVehiculoVariables {
  patente: string;
  marca: string;
  modelo: string;
  anio?: number | null;
  descripcion?: string | null;
}
```
### Return Type
Recall that executing the `CrearVehiculo` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CrearVehiculoData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CrearVehiculoData {
  vehiculo_insert: Vehiculo_Key;
}
```
### Using `CrearVehiculo`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, crearVehiculo, CrearVehiculoVariables } from '@dataconnect/generated';

// The `CrearVehiculo` mutation requires an argument of type `CrearVehiculoVariables`:
const crearVehiculoVars: CrearVehiculoVariables = {
  patente: ...,
  marca: ...,
  modelo: ...,
  anio: ..., // optional
  descripcion: ..., // optional
};

// Call the `crearVehiculo()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await crearVehiculo(crearVehiculoVars);
// Variables can be defined inline as well.
const { data } = await crearVehiculo({ patente: ..., marca: ..., modelo: ..., anio: ..., descripcion: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await crearVehiculo(dataConnect, crearVehiculoVars);

console.log(data.vehiculo_insert);

// Or, you can use the `Promise` API.
crearVehiculo(crearVehiculoVars).then((response) => {
  const data = response.data;
  console.log(data.vehiculo_insert);
});
```

### Using `CrearVehiculo`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, crearVehiculoRef, CrearVehiculoVariables } from '@dataconnect/generated';

// The `CrearVehiculo` mutation requires an argument of type `CrearVehiculoVariables`:
const crearVehiculoVars: CrearVehiculoVariables = {
  patente: ...,
  marca: ...,
  modelo: ...,
  anio: ..., // optional
  descripcion: ..., // optional
};

// Call the `crearVehiculoRef()` function to get a reference to the mutation.
const ref = crearVehiculoRef(crearVehiculoVars);
// Variables can be defined inline as well.
const ref = crearVehiculoRef({ patente: ..., marca: ..., modelo: ..., anio: ..., descripcion: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = crearVehiculoRef(dataConnect, crearVehiculoVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.vehiculo_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.vehiculo_insert);
});
```

## ActualizarVehiculo
You can execute the `ActualizarVehiculo` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
actualizarVehiculo(vars: ActualizarVehiculoVariables): MutationPromise<ActualizarVehiculoData, ActualizarVehiculoVariables>;

interface ActualizarVehiculoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ActualizarVehiculoVariables): MutationRef<ActualizarVehiculoData, ActualizarVehiculoVariables>;
}
export const actualizarVehiculoRef: ActualizarVehiculoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
actualizarVehiculo(dc: DataConnect, vars: ActualizarVehiculoVariables): MutationPromise<ActualizarVehiculoData, ActualizarVehiculoVariables>;

interface ActualizarVehiculoRef {
  ...
  (dc: DataConnect, vars: ActualizarVehiculoVariables): MutationRef<ActualizarVehiculoData, ActualizarVehiculoVariables>;
}
export const actualizarVehiculoRef: ActualizarVehiculoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the actualizarVehiculoRef:
```typescript
const name = actualizarVehiculoRef.operationName;
console.log(name);
```

### Variables
The `ActualizarVehiculo` mutation requires an argument of type `ActualizarVehiculoVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ActualizarVehiculoVariables {
  id: UUIDString;
  patente: string;
  marca: string;
  modelo: string;
  anio?: number | null;
  descripcion?: string | null;
  activo: boolean;
}
```
### Return Type
Recall that executing the `ActualizarVehiculo` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ActualizarVehiculoData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ActualizarVehiculoData {
  vehiculo_update?: Vehiculo_Key | null;
}
```
### Using `ActualizarVehiculo`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, actualizarVehiculo, ActualizarVehiculoVariables } from '@dataconnect/generated';

// The `ActualizarVehiculo` mutation requires an argument of type `ActualizarVehiculoVariables`:
const actualizarVehiculoVars: ActualizarVehiculoVariables = {
  id: ...,
  patente: ...,
  marca: ...,
  modelo: ...,
  anio: ..., // optional
  descripcion: ..., // optional
  activo: ...,
};

// Call the `actualizarVehiculo()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await actualizarVehiculo(actualizarVehiculoVars);
// Variables can be defined inline as well.
const { data } = await actualizarVehiculo({ id: ..., patente: ..., marca: ..., modelo: ..., anio: ..., descripcion: ..., activo: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await actualizarVehiculo(dataConnect, actualizarVehiculoVars);

console.log(data.vehiculo_update);

// Or, you can use the `Promise` API.
actualizarVehiculo(actualizarVehiculoVars).then((response) => {
  const data = response.data;
  console.log(data.vehiculo_update);
});
```

### Using `ActualizarVehiculo`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, actualizarVehiculoRef, ActualizarVehiculoVariables } from '@dataconnect/generated';

// The `ActualizarVehiculo` mutation requires an argument of type `ActualizarVehiculoVariables`:
const actualizarVehiculoVars: ActualizarVehiculoVariables = {
  id: ...,
  patente: ...,
  marca: ...,
  modelo: ...,
  anio: ..., // optional
  descripcion: ..., // optional
  activo: ...,
};

// Call the `actualizarVehiculoRef()` function to get a reference to the mutation.
const ref = actualizarVehiculoRef(actualizarVehiculoVars);
// Variables can be defined inline as well.
const ref = actualizarVehiculoRef({ id: ..., patente: ..., marca: ..., modelo: ..., anio: ..., descripcion: ..., activo: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = actualizarVehiculoRef(dataConnect, actualizarVehiculoVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.vehiculo_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.vehiculo_update);
});
```

## CrearSalidaVehiculo
You can execute the `CrearSalidaVehiculo` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
crearSalidaVehiculo(vars: CrearSalidaVehiculoVariables): MutationPromise<CrearSalidaVehiculoData, CrearSalidaVehiculoVariables>;

interface CrearSalidaVehiculoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CrearSalidaVehiculoVariables): MutationRef<CrearSalidaVehiculoData, CrearSalidaVehiculoVariables>;
}
export const crearSalidaVehiculoRef: CrearSalidaVehiculoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
crearSalidaVehiculo(dc: DataConnect, vars: CrearSalidaVehiculoVariables): MutationPromise<CrearSalidaVehiculoData, CrearSalidaVehiculoVariables>;

interface CrearSalidaVehiculoRef {
  ...
  (dc: DataConnect, vars: CrearSalidaVehiculoVariables): MutationRef<CrearSalidaVehiculoData, CrearSalidaVehiculoVariables>;
}
export const crearSalidaVehiculoRef: CrearSalidaVehiculoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the crearSalidaVehiculoRef:
```typescript
const name = crearSalidaVehiculoRef.operationName;
console.log(name);
```

### Variables
The `CrearSalidaVehiculo` mutation requires an argument of type `CrearSalidaVehiculoVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CrearSalidaVehiculoVariables {
  vehiculoId: UUIDString;
  repartidorId: string;
  observaciones?: string | null;
}
```
### Return Type
Recall that executing the `CrearSalidaVehiculo` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CrearSalidaVehiculoData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CrearSalidaVehiculoData {
  salidaVehiculo_insert: SalidaVehiculo_Key;
}
```
### Using `CrearSalidaVehiculo`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, crearSalidaVehiculo, CrearSalidaVehiculoVariables } from '@dataconnect/generated';

// The `CrearSalidaVehiculo` mutation requires an argument of type `CrearSalidaVehiculoVariables`:
const crearSalidaVehiculoVars: CrearSalidaVehiculoVariables = {
  vehiculoId: ...,
  repartidorId: ...,
  observaciones: ..., // optional
};

// Call the `crearSalidaVehiculo()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await crearSalidaVehiculo(crearSalidaVehiculoVars);
// Variables can be defined inline as well.
const { data } = await crearSalidaVehiculo({ vehiculoId: ..., repartidorId: ..., observaciones: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await crearSalidaVehiculo(dataConnect, crearSalidaVehiculoVars);

console.log(data.salidaVehiculo_insert);

// Or, you can use the `Promise` API.
crearSalidaVehiculo(crearSalidaVehiculoVars).then((response) => {
  const data = response.data;
  console.log(data.salidaVehiculo_insert);
});
```

### Using `CrearSalidaVehiculo`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, crearSalidaVehiculoRef, CrearSalidaVehiculoVariables } from '@dataconnect/generated';

// The `CrearSalidaVehiculo` mutation requires an argument of type `CrearSalidaVehiculoVariables`:
const crearSalidaVehiculoVars: CrearSalidaVehiculoVariables = {
  vehiculoId: ...,
  repartidorId: ...,
  observaciones: ..., // optional
};

// Call the `crearSalidaVehiculoRef()` function to get a reference to the mutation.
const ref = crearSalidaVehiculoRef(crearSalidaVehiculoVars);
// Variables can be defined inline as well.
const ref = crearSalidaVehiculoRef({ vehiculoId: ..., repartidorId: ..., observaciones: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = crearSalidaVehiculoRef(dataConnect, crearSalidaVehiculoVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.salidaVehiculo_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.salidaVehiculo_insert);
});
```

## RegistrarInspeccionAntes
You can execute the `RegistrarInspeccionAntes` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
registrarInspeccionAntes(vars: RegistrarInspeccionAntesVariables): MutationPromise<RegistrarInspeccionAntesData, RegistrarInspeccionAntesVariables>;

interface RegistrarInspeccionAntesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RegistrarInspeccionAntesVariables): MutationRef<RegistrarInspeccionAntesData, RegistrarInspeccionAntesVariables>;
}
export const registrarInspeccionAntesRef: RegistrarInspeccionAntesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
registrarInspeccionAntes(dc: DataConnect, vars: RegistrarInspeccionAntesVariables): MutationPromise<RegistrarInspeccionAntesData, RegistrarInspeccionAntesVariables>;

interface RegistrarInspeccionAntesRef {
  ...
  (dc: DataConnect, vars: RegistrarInspeccionAntesVariables): MutationRef<RegistrarInspeccionAntesData, RegistrarInspeccionAntesVariables>;
}
export const registrarInspeccionAntesRef: RegistrarInspeccionAntesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the registrarInspeccionAntesRef:
```typescript
const name = registrarInspeccionAntesRef.operationName;
console.log(name);
```

### Variables
The `RegistrarInspeccionAntes` mutation requires an argument of type `RegistrarInspeccionAntesVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RegistrarInspeccionAntesVariables {
  salidaId: UUIDString;
  estadoVehiculo: EstadoVehiculo;
  kilometraje: number;
  observaciones?: string | null;
}
```
### Return Type
Recall that executing the `RegistrarInspeccionAntes` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RegistrarInspeccionAntesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RegistrarInspeccionAntesData {
  inspeccionVehiculo_insert: InspeccionVehiculo_Key;
}
```
### Using `RegistrarInspeccionAntes`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, registrarInspeccionAntes, RegistrarInspeccionAntesVariables } from '@dataconnect/generated';

// The `RegistrarInspeccionAntes` mutation requires an argument of type `RegistrarInspeccionAntesVariables`:
const registrarInspeccionAntesVars: RegistrarInspeccionAntesVariables = {
  salidaId: ...,
  estadoVehiculo: ...,
  kilometraje: ...,
  observaciones: ..., // optional
};

// Call the `registrarInspeccionAntes()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await registrarInspeccionAntes(registrarInspeccionAntesVars);
// Variables can be defined inline as well.
const { data } = await registrarInspeccionAntes({ salidaId: ..., estadoVehiculo: ..., kilometraje: ..., observaciones: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await registrarInspeccionAntes(dataConnect, registrarInspeccionAntesVars);

console.log(data.inspeccionVehiculo_insert);

// Or, you can use the `Promise` API.
registrarInspeccionAntes(registrarInspeccionAntesVars).then((response) => {
  const data = response.data;
  console.log(data.inspeccionVehiculo_insert);
});
```

### Using `RegistrarInspeccionAntes`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, registrarInspeccionAntesRef, RegistrarInspeccionAntesVariables } from '@dataconnect/generated';

// The `RegistrarInspeccionAntes` mutation requires an argument of type `RegistrarInspeccionAntesVariables`:
const registrarInspeccionAntesVars: RegistrarInspeccionAntesVariables = {
  salidaId: ...,
  estadoVehiculo: ...,
  kilometraje: ...,
  observaciones: ..., // optional
};

// Call the `registrarInspeccionAntesRef()` function to get a reference to the mutation.
const ref = registrarInspeccionAntesRef(registrarInspeccionAntesVars);
// Variables can be defined inline as well.
const ref = registrarInspeccionAntesRef({ salidaId: ..., estadoVehiculo: ..., kilometraje: ..., observaciones: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = registrarInspeccionAntesRef(dataConnect, registrarInspeccionAntesVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.inspeccionVehiculo_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.inspeccionVehiculo_insert);
});
```

## IniciarSalidaVehiculo
You can execute the `IniciarSalidaVehiculo` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
iniciarSalidaVehiculo(vars: IniciarSalidaVehiculoVariables): MutationPromise<IniciarSalidaVehiculoData, IniciarSalidaVehiculoVariables>;

interface IniciarSalidaVehiculoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: IniciarSalidaVehiculoVariables): MutationRef<IniciarSalidaVehiculoData, IniciarSalidaVehiculoVariables>;
}
export const iniciarSalidaVehiculoRef: IniciarSalidaVehiculoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
iniciarSalidaVehiculo(dc: DataConnect, vars: IniciarSalidaVehiculoVariables): MutationPromise<IniciarSalidaVehiculoData, IniciarSalidaVehiculoVariables>;

interface IniciarSalidaVehiculoRef {
  ...
  (dc: DataConnect, vars: IniciarSalidaVehiculoVariables): MutationRef<IniciarSalidaVehiculoData, IniciarSalidaVehiculoVariables>;
}
export const iniciarSalidaVehiculoRef: IniciarSalidaVehiculoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the iniciarSalidaVehiculoRef:
```typescript
const name = iniciarSalidaVehiculoRef.operationName;
console.log(name);
```

### Variables
The `IniciarSalidaVehiculo` mutation requires an argument of type `IniciarSalidaVehiculoVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface IniciarSalidaVehiculoVariables {
  salidaId: UUIDString;
}
```
### Return Type
Recall that executing the `IniciarSalidaVehiculo` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `IniciarSalidaVehiculoData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface IniciarSalidaVehiculoData {
  salidaVehiculo_update?: SalidaVehiculo_Key | null;
}
```
### Using `IniciarSalidaVehiculo`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, iniciarSalidaVehiculo, IniciarSalidaVehiculoVariables } from '@dataconnect/generated';

// The `IniciarSalidaVehiculo` mutation requires an argument of type `IniciarSalidaVehiculoVariables`:
const iniciarSalidaVehiculoVars: IniciarSalidaVehiculoVariables = {
  salidaId: ...,
};

// Call the `iniciarSalidaVehiculo()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await iniciarSalidaVehiculo(iniciarSalidaVehiculoVars);
// Variables can be defined inline as well.
const { data } = await iniciarSalidaVehiculo({ salidaId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await iniciarSalidaVehiculo(dataConnect, iniciarSalidaVehiculoVars);

console.log(data.salidaVehiculo_update);

// Or, you can use the `Promise` API.
iniciarSalidaVehiculo(iniciarSalidaVehiculoVars).then((response) => {
  const data = response.data;
  console.log(data.salidaVehiculo_update);
});
```

### Using `IniciarSalidaVehiculo`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, iniciarSalidaVehiculoRef, IniciarSalidaVehiculoVariables } from '@dataconnect/generated';

// The `IniciarSalidaVehiculo` mutation requires an argument of type `IniciarSalidaVehiculoVariables`:
const iniciarSalidaVehiculoVars: IniciarSalidaVehiculoVariables = {
  salidaId: ...,
};

// Call the `iniciarSalidaVehiculoRef()` function to get a reference to the mutation.
const ref = iniciarSalidaVehiculoRef(iniciarSalidaVehiculoVars);
// Variables can be defined inline as well.
const ref = iniciarSalidaVehiculoRef({ salidaId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = iniciarSalidaVehiculoRef(dataConnect, iniciarSalidaVehiculoVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.salidaVehiculo_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.salidaVehiculo_update);
});
```

## RegistrarInspeccionDespues
You can execute the `RegistrarInspeccionDespues` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
registrarInspeccionDespues(vars: RegistrarInspeccionDespuesVariables): MutationPromise<RegistrarInspeccionDespuesData, RegistrarInspeccionDespuesVariables>;

interface RegistrarInspeccionDespuesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RegistrarInspeccionDespuesVariables): MutationRef<RegistrarInspeccionDespuesData, RegistrarInspeccionDespuesVariables>;
}
export const registrarInspeccionDespuesRef: RegistrarInspeccionDespuesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
registrarInspeccionDespues(dc: DataConnect, vars: RegistrarInspeccionDespuesVariables): MutationPromise<RegistrarInspeccionDespuesData, RegistrarInspeccionDespuesVariables>;

interface RegistrarInspeccionDespuesRef {
  ...
  (dc: DataConnect, vars: RegistrarInspeccionDespuesVariables): MutationRef<RegistrarInspeccionDespuesData, RegistrarInspeccionDespuesVariables>;
}
export const registrarInspeccionDespuesRef: RegistrarInspeccionDespuesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the registrarInspeccionDespuesRef:
```typescript
const name = registrarInspeccionDespuesRef.operationName;
console.log(name);
```

### Variables
The `RegistrarInspeccionDespues` mutation requires an argument of type `RegistrarInspeccionDespuesVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RegistrarInspeccionDespuesVariables {
  salidaId: UUIDString;
  estadoVehiculo: EstadoVehiculo;
  kilometraje: number;
  observaciones?: string | null;
}
```
### Return Type
Recall that executing the `RegistrarInspeccionDespues` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RegistrarInspeccionDespuesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RegistrarInspeccionDespuesData {
  inspeccionVehiculo_insert: InspeccionVehiculo_Key;
  salidaVehiculo_update?: SalidaVehiculo_Key | null;
}
```
### Using `RegistrarInspeccionDespues`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, registrarInspeccionDespues, RegistrarInspeccionDespuesVariables } from '@dataconnect/generated';

// The `RegistrarInspeccionDespues` mutation requires an argument of type `RegistrarInspeccionDespuesVariables`:
const registrarInspeccionDespuesVars: RegistrarInspeccionDespuesVariables = {
  salidaId: ...,
  estadoVehiculo: ...,
  kilometraje: ...,
  observaciones: ..., // optional
};

// Call the `registrarInspeccionDespues()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await registrarInspeccionDespues(registrarInspeccionDespuesVars);
// Variables can be defined inline as well.
const { data } = await registrarInspeccionDespues({ salidaId: ..., estadoVehiculo: ..., kilometraje: ..., observaciones: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await registrarInspeccionDespues(dataConnect, registrarInspeccionDespuesVars);

console.log(data.inspeccionVehiculo_insert);
console.log(data.salidaVehiculo_update);

// Or, you can use the `Promise` API.
registrarInspeccionDespues(registrarInspeccionDespuesVars).then((response) => {
  const data = response.data;
  console.log(data.inspeccionVehiculo_insert);
  console.log(data.salidaVehiculo_update);
});
```

### Using `RegistrarInspeccionDespues`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, registrarInspeccionDespuesRef, RegistrarInspeccionDespuesVariables } from '@dataconnect/generated';

// The `RegistrarInspeccionDespues` mutation requires an argument of type `RegistrarInspeccionDespuesVariables`:
const registrarInspeccionDespuesVars: RegistrarInspeccionDespuesVariables = {
  salidaId: ...,
  estadoVehiculo: ...,
  kilometraje: ...,
  observaciones: ..., // optional
};

// Call the `registrarInspeccionDespuesRef()` function to get a reference to the mutation.
const ref = registrarInspeccionDespuesRef(registrarInspeccionDespuesVars);
// Variables can be defined inline as well.
const ref = registrarInspeccionDespuesRef({ salidaId: ..., estadoVehiculo: ..., kilometraje: ..., observaciones: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = registrarInspeccionDespuesRef(dataConnect, registrarInspeccionDespuesVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.inspeccionVehiculo_insert);
console.log(data.salidaVehiculo_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.inspeccionVehiculo_insert);
  console.log(data.salidaVehiculo_update);
});
```

## AgregarFotoInspeccionVehiculo
You can execute the `AgregarFotoInspeccionVehiculo` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
agregarFotoInspeccionVehiculo(vars: AgregarFotoInspeccionVehiculoVariables): MutationPromise<AgregarFotoInspeccionVehiculoData, AgregarFotoInspeccionVehiculoVariables>;

interface AgregarFotoInspeccionVehiculoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AgregarFotoInspeccionVehiculoVariables): MutationRef<AgregarFotoInspeccionVehiculoData, AgregarFotoInspeccionVehiculoVariables>;
}
export const agregarFotoInspeccionVehiculoRef: AgregarFotoInspeccionVehiculoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
agregarFotoInspeccionVehiculo(dc: DataConnect, vars: AgregarFotoInspeccionVehiculoVariables): MutationPromise<AgregarFotoInspeccionVehiculoData, AgregarFotoInspeccionVehiculoVariables>;

interface AgregarFotoInspeccionVehiculoRef {
  ...
  (dc: DataConnect, vars: AgregarFotoInspeccionVehiculoVariables): MutationRef<AgregarFotoInspeccionVehiculoData, AgregarFotoInspeccionVehiculoVariables>;
}
export const agregarFotoInspeccionVehiculoRef: AgregarFotoInspeccionVehiculoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the agregarFotoInspeccionVehiculoRef:
```typescript
const name = agregarFotoInspeccionVehiculoRef.operationName;
console.log(name);
```

### Variables
The `AgregarFotoInspeccionVehiculo` mutation requires an argument of type `AgregarFotoInspeccionVehiculoVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AgregarFotoInspeccionVehiculoVariables {
  inspeccionId: UUIDString;
  rutaStorage: string;
  descripcion?: string | null;
  orden: number;
}
```
### Return Type
Recall that executing the `AgregarFotoInspeccionVehiculo` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AgregarFotoInspeccionVehiculoData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AgregarFotoInspeccionVehiculoData {
  fotoInspeccionVehiculo_insert: FotoInspeccionVehiculo_Key;
}
```
### Using `AgregarFotoInspeccionVehiculo`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, agregarFotoInspeccionVehiculo, AgregarFotoInspeccionVehiculoVariables } from '@dataconnect/generated';

// The `AgregarFotoInspeccionVehiculo` mutation requires an argument of type `AgregarFotoInspeccionVehiculoVariables`:
const agregarFotoInspeccionVehiculoVars: AgregarFotoInspeccionVehiculoVariables = {
  inspeccionId: ...,
  rutaStorage: ...,
  descripcion: ..., // optional
  orden: ...,
};

// Call the `agregarFotoInspeccionVehiculo()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await agregarFotoInspeccionVehiculo(agregarFotoInspeccionVehiculoVars);
// Variables can be defined inline as well.
const { data } = await agregarFotoInspeccionVehiculo({ inspeccionId: ..., rutaStorage: ..., descripcion: ..., orden: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await agregarFotoInspeccionVehiculo(dataConnect, agregarFotoInspeccionVehiculoVars);

console.log(data.fotoInspeccionVehiculo_insert);

// Or, you can use the `Promise` API.
agregarFotoInspeccionVehiculo(agregarFotoInspeccionVehiculoVars).then((response) => {
  const data = response.data;
  console.log(data.fotoInspeccionVehiculo_insert);
});
```

### Using `AgregarFotoInspeccionVehiculo`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, agregarFotoInspeccionVehiculoRef, AgregarFotoInspeccionVehiculoVariables } from '@dataconnect/generated';

// The `AgregarFotoInspeccionVehiculo` mutation requires an argument of type `AgregarFotoInspeccionVehiculoVariables`:
const agregarFotoInspeccionVehiculoVars: AgregarFotoInspeccionVehiculoVariables = {
  inspeccionId: ...,
  rutaStorage: ...,
  descripcion: ..., // optional
  orden: ...,
};

// Call the `agregarFotoInspeccionVehiculoRef()` function to get a reference to the mutation.
const ref = agregarFotoInspeccionVehiculoRef(agregarFotoInspeccionVehiculoVars);
// Variables can be defined inline as well.
const ref = agregarFotoInspeccionVehiculoRef({ inspeccionId: ..., rutaStorage: ..., descripcion: ..., orden: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = agregarFotoInspeccionVehiculoRef(dataConnect, agregarFotoInspeccionVehiculoVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.fotoInspeccionVehiculo_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.fotoInspeccionVehiculo_insert);
});
```

## CrearClienteComanda
You can execute the `CrearClienteComanda` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
crearClienteComanda(vars: CrearClienteComandaVariables): MutationPromise<CrearClienteComandaData, CrearClienteComandaVariables>;

interface CrearClienteComandaRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CrearClienteComandaVariables): MutationRef<CrearClienteComandaData, CrearClienteComandaVariables>;
}
export const crearClienteComandaRef: CrearClienteComandaRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
crearClienteComanda(dc: DataConnect, vars: CrearClienteComandaVariables): MutationPromise<CrearClienteComandaData, CrearClienteComandaVariables>;

interface CrearClienteComandaRef {
  ...
  (dc: DataConnect, vars: CrearClienteComandaVariables): MutationRef<CrearClienteComandaData, CrearClienteComandaVariables>;
}
export const crearClienteComandaRef: CrearClienteComandaRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the crearClienteComandaRef:
```typescript
const name = crearClienteComandaRef.operationName;
console.log(name);
```

### Variables
The `CrearClienteComanda` mutation requires an argument of type `CrearClienteComandaVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CrearClienteComandaVariables {
  nombre: string;
  tipoCliente: TipoCliente;
  rut?: string | null;
  telefono?: string | null;
  email?: string | null;
  direccion?: string | null;
}
```
### Return Type
Recall that executing the `CrearClienteComanda` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CrearClienteComandaData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CrearClienteComandaData {
  cliente_insert: Cliente_Key;
}
```
### Using `CrearClienteComanda`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, crearClienteComanda, CrearClienteComandaVariables } from '@dataconnect/generated';

// The `CrearClienteComanda` mutation requires an argument of type `CrearClienteComandaVariables`:
const crearClienteComandaVars: CrearClienteComandaVariables = {
  nombre: ...,
  tipoCliente: ...,
  rut: ..., // optional
  telefono: ..., // optional
  email: ..., // optional
  direccion: ..., // optional
};

// Call the `crearClienteComanda()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await crearClienteComanda(crearClienteComandaVars);
// Variables can be defined inline as well.
const { data } = await crearClienteComanda({ nombre: ..., tipoCliente: ..., rut: ..., telefono: ..., email: ..., direccion: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await crearClienteComanda(dataConnect, crearClienteComandaVars);

console.log(data.cliente_insert);

// Or, you can use the `Promise` API.
crearClienteComanda(crearClienteComandaVars).then((response) => {
  const data = response.data;
  console.log(data.cliente_insert);
});
```

### Using `CrearClienteComanda`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, crearClienteComandaRef, CrearClienteComandaVariables } from '@dataconnect/generated';

// The `CrearClienteComanda` mutation requires an argument of type `CrearClienteComandaVariables`:
const crearClienteComandaVars: CrearClienteComandaVariables = {
  nombre: ...,
  tipoCliente: ...,
  rut: ..., // optional
  telefono: ..., // optional
  email: ..., // optional
  direccion: ..., // optional
};

// Call the `crearClienteComandaRef()` function to get a reference to the mutation.
const ref = crearClienteComandaRef(crearClienteComandaVars);
// Variables can be defined inline as well.
const ref = crearClienteComandaRef({ nombre: ..., tipoCliente: ..., rut: ..., telefono: ..., email: ..., direccion: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = crearClienteComandaRef(dataConnect, crearClienteComandaVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.cliente_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.cliente_insert);
});
```

## EditarFichaCliente
You can execute the `EditarFichaCliente` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
editarFichaCliente(vars: EditarFichaClienteVariables): MutationPromise<EditarFichaClienteData, EditarFichaClienteVariables>;

interface EditarFichaClienteRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: EditarFichaClienteVariables): MutationRef<EditarFichaClienteData, EditarFichaClienteVariables>;
}
export const editarFichaClienteRef: EditarFichaClienteRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
editarFichaCliente(dc: DataConnect, vars: EditarFichaClienteVariables): MutationPromise<EditarFichaClienteData, EditarFichaClienteVariables>;

interface EditarFichaClienteRef {
  ...
  (dc: DataConnect, vars: EditarFichaClienteVariables): MutationRef<EditarFichaClienteData, EditarFichaClienteVariables>;
}
export const editarFichaClienteRef: EditarFichaClienteRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the editarFichaClienteRef:
```typescript
const name = editarFichaClienteRef.operationName;
console.log(name);
```

### Variables
The `EditarFichaCliente` mutation requires an argument of type `EditarFichaClienteVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface EditarFichaClienteVariables {
  id: UUIDString;
  nombre: string;
  tipoCliente: TipoCliente;
  rut?: string | null;
  telefono?: string | null;
  email?: string | null;
  direccion?: string | null;
}
```
### Return Type
Recall that executing the `EditarFichaCliente` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `EditarFichaClienteData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface EditarFichaClienteData {
  cliente_update?: Cliente_Key | null;
}
```
### Using `EditarFichaCliente`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, editarFichaCliente, EditarFichaClienteVariables } from '@dataconnect/generated';

// The `EditarFichaCliente` mutation requires an argument of type `EditarFichaClienteVariables`:
const editarFichaClienteVars: EditarFichaClienteVariables = {
  id: ...,
  nombre: ...,
  tipoCliente: ...,
  rut: ..., // optional
  telefono: ..., // optional
  email: ..., // optional
  direccion: ..., // optional
};

// Call the `editarFichaCliente()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await editarFichaCliente(editarFichaClienteVars);
// Variables can be defined inline as well.
const { data } = await editarFichaCliente({ id: ..., nombre: ..., tipoCliente: ..., rut: ..., telefono: ..., email: ..., direccion: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await editarFichaCliente(dataConnect, editarFichaClienteVars);

console.log(data.cliente_update);

// Or, you can use the `Promise` API.
editarFichaCliente(editarFichaClienteVars).then((response) => {
  const data = response.data;
  console.log(data.cliente_update);
});
```

### Using `EditarFichaCliente`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, editarFichaClienteRef, EditarFichaClienteVariables } from '@dataconnect/generated';

// The `EditarFichaCliente` mutation requires an argument of type `EditarFichaClienteVariables`:
const editarFichaClienteVars: EditarFichaClienteVariables = {
  id: ...,
  nombre: ...,
  tipoCliente: ...,
  rut: ..., // optional
  telefono: ..., // optional
  email: ..., // optional
  direccion: ..., // optional
};

// Call the `editarFichaClienteRef()` function to get a reference to the mutation.
const ref = editarFichaClienteRef(editarFichaClienteVars);
// Variables can be defined inline as well.
const ref = editarFichaClienteRef({ id: ..., nombre: ..., tipoCliente: ..., rut: ..., telefono: ..., email: ..., direccion: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = editarFichaClienteRef(dataConnect, editarFichaClienteVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.cliente_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.cliente_update);
});
```

## CrearComanda
You can execute the `CrearComanda` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
crearComanda(vars: CrearComandaVariables): MutationPromise<CrearComandaData, CrearComandaVariables>;

interface CrearComandaRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CrearComandaVariables): MutationRef<CrearComandaData, CrearComandaVariables>;
}
export const crearComandaRef: CrearComandaRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
crearComanda(dc: DataConnect, vars: CrearComandaVariables): MutationPromise<CrearComandaData, CrearComandaVariables>;

interface CrearComandaRef {
  ...
  (dc: DataConnect, vars: CrearComandaVariables): MutationRef<CrearComandaData, CrearComandaVariables>;
}
export const crearComandaRef: CrearComandaRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the crearComandaRef:
```typescript
const name = crearComandaRef.operationName;
console.log(name);
```

### Variables
The `CrearComanda` mutation requires an argument of type `CrearComandaVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CrearComandaVariables {
  numeroComanda: string;
  clienteId: UUIDString;
  empresa?: string | null;
  proyecto?: string | null;
  valorTotal: number;
  observaciones?: string | null;
}
```
### Return Type
Recall that executing the `CrearComanda` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CrearComandaData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CrearComandaData {
  comanda_insert: Comanda_Key;
  comandaEtapa_insertMany: ComandaEtapa_Key[];
  comandaHistorialEstado_insert: ComandaHistorialEstado_Key;
}
```
### Using `CrearComanda`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, crearComanda, CrearComandaVariables } from '@dataconnect/generated';

// The `CrearComanda` mutation requires an argument of type `CrearComandaVariables`:
const crearComandaVars: CrearComandaVariables = {
  numeroComanda: ...,
  clienteId: ...,
  empresa: ..., // optional
  proyecto: ..., // optional
  valorTotal: ...,
  observaciones: ..., // optional
};

// Call the `crearComanda()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await crearComanda(crearComandaVars);
// Variables can be defined inline as well.
const { data } = await crearComanda({ numeroComanda: ..., clienteId: ..., empresa: ..., proyecto: ..., valorTotal: ..., observaciones: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await crearComanda(dataConnect, crearComandaVars);

console.log(data.comanda_insert);
console.log(data.comandaEtapa_insertMany);
console.log(data.comandaHistorialEstado_insert);

// Or, you can use the `Promise` API.
crearComanda(crearComandaVars).then((response) => {
  const data = response.data;
  console.log(data.comanda_insert);
  console.log(data.comandaEtapa_insertMany);
  console.log(data.comandaHistorialEstado_insert);
});
```

### Using `CrearComanda`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, crearComandaRef, CrearComandaVariables } from '@dataconnect/generated';

// The `CrearComanda` mutation requires an argument of type `CrearComandaVariables`:
const crearComandaVars: CrearComandaVariables = {
  numeroComanda: ...,
  clienteId: ...,
  empresa: ..., // optional
  proyecto: ..., // optional
  valorTotal: ...,
  observaciones: ..., // optional
};

// Call the `crearComandaRef()` function to get a reference to the mutation.
const ref = crearComandaRef(crearComandaVars);
// Variables can be defined inline as well.
const ref = crearComandaRef({ numeroComanda: ..., clienteId: ..., empresa: ..., proyecto: ..., valorTotal: ..., observaciones: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = crearComandaRef(dataConnect, crearComandaVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.comanda_insert);
console.log(data.comandaEtapa_insertMany);
console.log(data.comandaHistorialEstado_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.comanda_insert);
  console.log(data.comandaEtapa_insertMany);
  console.log(data.comandaHistorialEstado_insert);
});
```

## AgregarComandaDetalle
You can execute the `AgregarComandaDetalle` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
agregarComandaDetalle(vars: AgregarComandaDetalleVariables): MutationPromise<AgregarComandaDetalleData, AgregarComandaDetalleVariables>;

interface AgregarComandaDetalleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AgregarComandaDetalleVariables): MutationRef<AgregarComandaDetalleData, AgregarComandaDetalleVariables>;
}
export const agregarComandaDetalleRef: AgregarComandaDetalleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
agregarComandaDetalle(dc: DataConnect, vars: AgregarComandaDetalleVariables): MutationPromise<AgregarComandaDetalleData, AgregarComandaDetalleVariables>;

interface AgregarComandaDetalleRef {
  ...
  (dc: DataConnect, vars: AgregarComandaDetalleVariables): MutationRef<AgregarComandaDetalleData, AgregarComandaDetalleVariables>;
}
export const agregarComandaDetalleRef: AgregarComandaDetalleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the agregarComandaDetalleRef:
```typescript
const name = agregarComandaDetalleRef.operationName;
console.log(name);
```

### Variables
The `AgregarComandaDetalle` mutation requires an argument of type `AgregarComandaDetalleVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AgregarComandaDetalleVariables {
  comandaId: UUIDString;
  tipoPrendaId: UUIDString;
  tipoServicioId: UUIDString;
  cantidad: number;
  detalle?: string | null;
  precioUnitario: number;
  subtotal: number;
}
```
### Return Type
Recall that executing the `AgregarComandaDetalle` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AgregarComandaDetalleData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AgregarComandaDetalleData {
  comandaDetalle_insert: ComandaDetalle_Key;
}
```
### Using `AgregarComandaDetalle`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, agregarComandaDetalle, AgregarComandaDetalleVariables } from '@dataconnect/generated';

// The `AgregarComandaDetalle` mutation requires an argument of type `AgregarComandaDetalleVariables`:
const agregarComandaDetalleVars: AgregarComandaDetalleVariables = {
  comandaId: ...,
  tipoPrendaId: ...,
  tipoServicioId: ...,
  cantidad: ...,
  detalle: ..., // optional
  precioUnitario: ...,
  subtotal: ...,
};

// Call the `agregarComandaDetalle()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await agregarComandaDetalle(agregarComandaDetalleVars);
// Variables can be defined inline as well.
const { data } = await agregarComandaDetalle({ comandaId: ..., tipoPrendaId: ..., tipoServicioId: ..., cantidad: ..., detalle: ..., precioUnitario: ..., subtotal: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await agregarComandaDetalle(dataConnect, agregarComandaDetalleVars);

console.log(data.comandaDetalle_insert);

// Or, you can use the `Promise` API.
agregarComandaDetalle(agregarComandaDetalleVars).then((response) => {
  const data = response.data;
  console.log(data.comandaDetalle_insert);
});
```

### Using `AgregarComandaDetalle`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, agregarComandaDetalleRef, AgregarComandaDetalleVariables } from '@dataconnect/generated';

// The `AgregarComandaDetalle` mutation requires an argument of type `AgregarComandaDetalleVariables`:
const agregarComandaDetalleVars: AgregarComandaDetalleVariables = {
  comandaId: ...,
  tipoPrendaId: ...,
  tipoServicioId: ...,
  cantidad: ...,
  detalle: ..., // optional
  precioUnitario: ...,
  subtotal: ...,
};

// Call the `agregarComandaDetalleRef()` function to get a reference to the mutation.
const ref = agregarComandaDetalleRef(agregarComandaDetalleVars);
// Variables can be defined inline as well.
const ref = agregarComandaDetalleRef({ comandaId: ..., tipoPrendaId: ..., tipoServicioId: ..., cantidad: ..., detalle: ..., precioUnitario: ..., subtotal: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = agregarComandaDetalleRef(dataConnect, agregarComandaDetalleVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.comandaDetalle_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.comandaDetalle_insert);
});
```

## AnularComanda
You can execute the `AnularComanda` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
anularComanda(vars: AnularComandaVariables): MutationPromise<AnularComandaData, AnularComandaVariables>;

interface AnularComandaRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AnularComandaVariables): MutationRef<AnularComandaData, AnularComandaVariables>;
}
export const anularComandaRef: AnularComandaRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
anularComanda(dc: DataConnect, vars: AnularComandaVariables): MutationPromise<AnularComandaData, AnularComandaVariables>;

interface AnularComandaRef {
  ...
  (dc: DataConnect, vars: AnularComandaVariables): MutationRef<AnularComandaData, AnularComandaVariables>;
}
export const anularComandaRef: AnularComandaRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the anularComandaRef:
```typescript
const name = anularComandaRef.operationName;
console.log(name);
```

### Variables
The `AnularComanda` mutation requires an argument of type `AnularComandaVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AnularComandaVariables {
  id: UUIDString;
  motivoAnulacion: string;
}
```
### Return Type
Recall that executing the `AnularComanda` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AnularComandaData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AnularComandaData {
  comanda_update?: Comanda_Key | null;
  comandaHistorialEstado_insert: ComandaHistorialEstado_Key;
}
```
### Using `AnularComanda`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, anularComanda, AnularComandaVariables } from '@dataconnect/generated';

// The `AnularComanda` mutation requires an argument of type `AnularComandaVariables`:
const anularComandaVars: AnularComandaVariables = {
  id: ...,
  motivoAnulacion: ...,
};

// Call the `anularComanda()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await anularComanda(anularComandaVars);
// Variables can be defined inline as well.
const { data } = await anularComanda({ id: ..., motivoAnulacion: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await anularComanda(dataConnect, anularComandaVars);

console.log(data.comanda_update);
console.log(data.comandaHistorialEstado_insert);

// Or, you can use the `Promise` API.
anularComanda(anularComandaVars).then((response) => {
  const data = response.data;
  console.log(data.comanda_update);
  console.log(data.comandaHistorialEstado_insert);
});
```

### Using `AnularComanda`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, anularComandaRef, AnularComandaVariables } from '@dataconnect/generated';

// The `AnularComanda` mutation requires an argument of type `AnularComandaVariables`:
const anularComandaVars: AnularComandaVariables = {
  id: ...,
  motivoAnulacion: ...,
};

// Call the `anularComandaRef()` function to get a reference to the mutation.
const ref = anularComandaRef(anularComandaVars);
// Variables can be defined inline as well.
const ref = anularComandaRef({ id: ..., motivoAnulacion: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = anularComandaRef(dataConnect, anularComandaVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.comanda_update);
console.log(data.comandaHistorialEstado_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.comanda_update);
  console.log(data.comandaHistorialEstado_insert);
});
```

## EntregarComanda
You can execute the `EntregarComanda` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
entregarComanda(vars: EntregarComandaVariables): MutationPromise<EntregarComandaData, EntregarComandaVariables>;

interface EntregarComandaRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: EntregarComandaVariables): MutationRef<EntregarComandaData, EntregarComandaVariables>;
}
export const entregarComandaRef: EntregarComandaRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
entregarComanda(dc: DataConnect, vars: EntregarComandaVariables): MutationPromise<EntregarComandaData, EntregarComandaVariables>;

interface EntregarComandaRef {
  ...
  (dc: DataConnect, vars: EntregarComandaVariables): MutationRef<EntregarComandaData, EntregarComandaVariables>;
}
export const entregarComandaRef: EntregarComandaRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the entregarComandaRef:
```typescript
const name = entregarComandaRef.operationName;
console.log(name);
```

### Variables
The `EntregarComanda` mutation requires an argument of type `EntregarComandaVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface EntregarComandaVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `EntregarComanda` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `EntregarComandaData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface EntregarComandaData {
  comanda_update?: Comanda_Key | null;
  entrega: number;
  comandaHistorialEstado_insert: ComandaHistorialEstado_Key;
  comandaNotificacion_insert: ComandaNotificacion_Key;
}
```
### Using `EntregarComanda`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, entregarComanda, EntregarComandaVariables } from '@dataconnect/generated';

// The `EntregarComanda` mutation requires an argument of type `EntregarComandaVariables`:
const entregarComandaVars: EntregarComandaVariables = {
  id: ...,
};

// Call the `entregarComanda()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await entregarComanda(entregarComandaVars);
// Variables can be defined inline as well.
const { data } = await entregarComanda({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await entregarComanda(dataConnect, entregarComandaVars);

console.log(data.comanda_update);
console.log(data.entrega);
console.log(data.comandaHistorialEstado_insert);
console.log(data.comandaNotificacion_insert);

// Or, you can use the `Promise` API.
entregarComanda(entregarComandaVars).then((response) => {
  const data = response.data;
  console.log(data.comanda_update);
  console.log(data.entrega);
  console.log(data.comandaHistorialEstado_insert);
  console.log(data.comandaNotificacion_insert);
});
```

### Using `EntregarComanda`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, entregarComandaRef, EntregarComandaVariables } from '@dataconnect/generated';

// The `EntregarComanda` mutation requires an argument of type `EntregarComandaVariables`:
const entregarComandaVars: EntregarComandaVariables = {
  id: ...,
};

// Call the `entregarComandaRef()` function to get a reference to the mutation.
const ref = entregarComandaRef(entregarComandaVars);
// Variables can be defined inline as well.
const ref = entregarComandaRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = entregarComandaRef(dataConnect, entregarComandaVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.comanda_update);
console.log(data.entrega);
console.log(data.comandaHistorialEstado_insert);
console.log(data.comandaNotificacion_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.comanda_update);
  console.log(data.entrega);
  console.log(data.comandaHistorialEstado_insert);
  console.log(data.comandaNotificacion_insert);
});
```

## EditarComanda
You can execute the `EditarComanda` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
editarComanda(vars: EditarComandaVariables): MutationPromise<EditarComandaData, EditarComandaVariables>;

interface EditarComandaRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: EditarComandaVariables): MutationRef<EditarComandaData, EditarComandaVariables>;
}
export const editarComandaRef: EditarComandaRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
editarComanda(dc: DataConnect, vars: EditarComandaVariables): MutationPromise<EditarComandaData, EditarComandaVariables>;

interface EditarComandaRef {
  ...
  (dc: DataConnect, vars: EditarComandaVariables): MutationRef<EditarComandaData, EditarComandaVariables>;
}
export const editarComandaRef: EditarComandaRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the editarComandaRef:
```typescript
const name = editarComandaRef.operationName;
console.log(name);
```

### Variables
The `EditarComanda` mutation requires an argument of type `EditarComandaVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface EditarComandaVariables {
  id: UUIDString;
  valorTotal: number;
  empresa?: string | null;
  proyecto?: string | null;
  observaciones?: string | null;
}
```
### Return Type
Recall that executing the `EditarComanda` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `EditarComandaData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface EditarComandaData {
  comanda_update?: Comanda_Key | null;
}
```
### Using `EditarComanda`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, editarComanda, EditarComandaVariables } from '@dataconnect/generated';

// The `EditarComanda` mutation requires an argument of type `EditarComandaVariables`:
const editarComandaVars: EditarComandaVariables = {
  id: ...,
  valorTotal: ...,
  empresa: ..., // optional
  proyecto: ..., // optional
  observaciones: ..., // optional
};

// Call the `editarComanda()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await editarComanda(editarComandaVars);
// Variables can be defined inline as well.
const { data } = await editarComanda({ id: ..., valorTotal: ..., empresa: ..., proyecto: ..., observaciones: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await editarComanda(dataConnect, editarComandaVars);

console.log(data.comanda_update);

// Or, you can use the `Promise` API.
editarComanda(editarComandaVars).then((response) => {
  const data = response.data;
  console.log(data.comanda_update);
});
```

### Using `EditarComanda`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, editarComandaRef, EditarComandaVariables } from '@dataconnect/generated';

// The `EditarComanda` mutation requires an argument of type `EditarComandaVariables`:
const editarComandaVars: EditarComandaVariables = {
  id: ...,
  valorTotal: ...,
  empresa: ..., // optional
  proyecto: ..., // optional
  observaciones: ..., // optional
};

// Call the `editarComandaRef()` function to get a reference to the mutation.
const ref = editarComandaRef(editarComandaVars);
// Variables can be defined inline as well.
const ref = editarComandaRef({ id: ..., valorTotal: ..., empresa: ..., proyecto: ..., observaciones: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = editarComandaRef(dataConnect, editarComandaVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.comanda_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.comanda_update);
});
```

## EliminarDetallesComanda
You can execute the `EliminarDetallesComanda` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
eliminarDetallesComanda(vars: EliminarDetallesComandaVariables): MutationPromise<EliminarDetallesComandaData, EliminarDetallesComandaVariables>;

interface EliminarDetallesComandaRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: EliminarDetallesComandaVariables): MutationRef<EliminarDetallesComandaData, EliminarDetallesComandaVariables>;
}
export const eliminarDetallesComandaRef: EliminarDetallesComandaRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
eliminarDetallesComanda(dc: DataConnect, vars: EliminarDetallesComandaVariables): MutationPromise<EliminarDetallesComandaData, EliminarDetallesComandaVariables>;

interface EliminarDetallesComandaRef {
  ...
  (dc: DataConnect, vars: EliminarDetallesComandaVariables): MutationRef<EliminarDetallesComandaData, EliminarDetallesComandaVariables>;
}
export const eliminarDetallesComandaRef: EliminarDetallesComandaRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the eliminarDetallesComandaRef:
```typescript
const name = eliminarDetallesComandaRef.operationName;
console.log(name);
```

### Variables
The `EliminarDetallesComanda` mutation requires an argument of type `EliminarDetallesComandaVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface EliminarDetallesComandaVariables {
  comandaId: UUIDString;
}
```
### Return Type
Recall that executing the `EliminarDetallesComanda` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `EliminarDetallesComandaData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface EliminarDetallesComandaData {
  comandaDetalle_deleteMany: number;
}
```
### Using `EliminarDetallesComanda`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, eliminarDetallesComanda, EliminarDetallesComandaVariables } from '@dataconnect/generated';

// The `EliminarDetallesComanda` mutation requires an argument of type `EliminarDetallesComandaVariables`:
const eliminarDetallesComandaVars: EliminarDetallesComandaVariables = {
  comandaId: ...,
};

// Call the `eliminarDetallesComanda()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await eliminarDetallesComanda(eliminarDetallesComandaVars);
// Variables can be defined inline as well.
const { data } = await eliminarDetallesComanda({ comandaId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await eliminarDetallesComanda(dataConnect, eliminarDetallesComandaVars);

console.log(data.comandaDetalle_deleteMany);

// Or, you can use the `Promise` API.
eliminarDetallesComanda(eliminarDetallesComandaVars).then((response) => {
  const data = response.data;
  console.log(data.comandaDetalle_deleteMany);
});
```

### Using `EliminarDetallesComanda`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, eliminarDetallesComandaRef, EliminarDetallesComandaVariables } from '@dataconnect/generated';

// The `EliminarDetallesComanda` mutation requires an argument of type `EliminarDetallesComandaVariables`:
const eliminarDetallesComandaVars: EliminarDetallesComandaVariables = {
  comandaId: ...,
};

// Call the `eliminarDetallesComandaRef()` function to get a reference to the mutation.
const ref = eliminarDetallesComandaRef(eliminarDetallesComandaVars);
// Variables can be defined inline as well.
const ref = eliminarDetallesComandaRef({ comandaId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = eliminarDetallesComandaRef(dataConnect, eliminarDetallesComandaVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.comandaDetalle_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.comandaDetalle_deleteMany);
});
```

## CrearTipoPrenda
You can execute the `CrearTipoPrenda` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
crearTipoPrenda(vars: CrearTipoPrendaVariables): MutationPromise<CrearTipoPrendaData, CrearTipoPrendaVariables>;

interface CrearTipoPrendaRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CrearTipoPrendaVariables): MutationRef<CrearTipoPrendaData, CrearTipoPrendaVariables>;
}
export const crearTipoPrendaRef: CrearTipoPrendaRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
crearTipoPrenda(dc: DataConnect, vars: CrearTipoPrendaVariables): MutationPromise<CrearTipoPrendaData, CrearTipoPrendaVariables>;

interface CrearTipoPrendaRef {
  ...
  (dc: DataConnect, vars: CrearTipoPrendaVariables): MutationRef<CrearTipoPrendaData, CrearTipoPrendaVariables>;
}
export const crearTipoPrendaRef: CrearTipoPrendaRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the crearTipoPrendaRef:
```typescript
const name = crearTipoPrendaRef.operationName;
console.log(name);
```

### Variables
The `CrearTipoPrenda` mutation requires an argument of type `CrearTipoPrendaVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CrearTipoPrendaVariables {
  nombre: string;
}
```
### Return Type
Recall that executing the `CrearTipoPrenda` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CrearTipoPrendaData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CrearTipoPrendaData {
  tipoPrenda_insert: TipoPrenda_Key;
}
```
### Using `CrearTipoPrenda`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, crearTipoPrenda, CrearTipoPrendaVariables } from '@dataconnect/generated';

// The `CrearTipoPrenda` mutation requires an argument of type `CrearTipoPrendaVariables`:
const crearTipoPrendaVars: CrearTipoPrendaVariables = {
  nombre: ...,
};

// Call the `crearTipoPrenda()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await crearTipoPrenda(crearTipoPrendaVars);
// Variables can be defined inline as well.
const { data } = await crearTipoPrenda({ nombre: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await crearTipoPrenda(dataConnect, crearTipoPrendaVars);

console.log(data.tipoPrenda_insert);

// Or, you can use the `Promise` API.
crearTipoPrenda(crearTipoPrendaVars).then((response) => {
  const data = response.data;
  console.log(data.tipoPrenda_insert);
});
```

### Using `CrearTipoPrenda`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, crearTipoPrendaRef, CrearTipoPrendaVariables } from '@dataconnect/generated';

// The `CrearTipoPrenda` mutation requires an argument of type `CrearTipoPrendaVariables`:
const crearTipoPrendaVars: CrearTipoPrendaVariables = {
  nombre: ...,
};

// Call the `crearTipoPrendaRef()` function to get a reference to the mutation.
const ref = crearTipoPrendaRef(crearTipoPrendaVars);
// Variables can be defined inline as well.
const ref = crearTipoPrendaRef({ nombre: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = crearTipoPrendaRef(dataConnect, crearTipoPrendaVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.tipoPrenda_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.tipoPrenda_insert);
});
```

## CrearTipoServicio
You can execute the `CrearTipoServicio` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
crearTipoServicio(vars: CrearTipoServicioVariables): MutationPromise<CrearTipoServicioData, CrearTipoServicioVariables>;

interface CrearTipoServicioRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CrearTipoServicioVariables): MutationRef<CrearTipoServicioData, CrearTipoServicioVariables>;
}
export const crearTipoServicioRef: CrearTipoServicioRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
crearTipoServicio(dc: DataConnect, vars: CrearTipoServicioVariables): MutationPromise<CrearTipoServicioData, CrearTipoServicioVariables>;

interface CrearTipoServicioRef {
  ...
  (dc: DataConnect, vars: CrearTipoServicioVariables): MutationRef<CrearTipoServicioData, CrearTipoServicioVariables>;
}
export const crearTipoServicioRef: CrearTipoServicioRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the crearTipoServicioRef:
```typescript
const name = crearTipoServicioRef.operationName;
console.log(name);
```

### Variables
The `CrearTipoServicio` mutation requires an argument of type `CrearTipoServicioVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CrearTipoServicioVariables {
  nombre: string;
  precioBase: number;
}
```
### Return Type
Recall that executing the `CrearTipoServicio` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CrearTipoServicioData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CrearTipoServicioData {
  tipoServicio_insert: TipoServicio_Key;
}
```
### Using `CrearTipoServicio`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, crearTipoServicio, CrearTipoServicioVariables } from '@dataconnect/generated';

// The `CrearTipoServicio` mutation requires an argument of type `CrearTipoServicioVariables`:
const crearTipoServicioVars: CrearTipoServicioVariables = {
  nombre: ...,
  precioBase: ...,
};

// Call the `crearTipoServicio()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await crearTipoServicio(crearTipoServicioVars);
// Variables can be defined inline as well.
const { data } = await crearTipoServicio({ nombre: ..., precioBase: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await crearTipoServicio(dataConnect, crearTipoServicioVars);

console.log(data.tipoServicio_insert);

// Or, you can use the `Promise` API.
crearTipoServicio(crearTipoServicioVars).then((response) => {
  const data = response.data;
  console.log(data.tipoServicio_insert);
});
```

### Using `CrearTipoServicio`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, crearTipoServicioRef, CrearTipoServicioVariables } from '@dataconnect/generated';

// The `CrearTipoServicio` mutation requires an argument of type `CrearTipoServicioVariables`:
const crearTipoServicioVars: CrearTipoServicioVariables = {
  nombre: ...,
  precioBase: ...,
};

// Call the `crearTipoServicioRef()` function to get a reference to the mutation.
const ref = crearTipoServicioRef(crearTipoServicioVars);
// Variables can be defined inline as well.
const ref = crearTipoServicioRef({ nombre: ..., precioBase: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = crearTipoServicioRef(dataConnect, crearTipoServicioVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.tipoServicio_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.tipoServicio_insert);
});
```

## CrearInsumo
You can execute the `CrearInsumo` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
crearInsumo(vars: CrearInsumoVariables): MutationPromise<CrearInsumoData, CrearInsumoVariables>;

interface CrearInsumoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CrearInsumoVariables): MutationRef<CrearInsumoData, CrearInsumoVariables>;
}
export const crearInsumoRef: CrearInsumoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
crearInsumo(dc: DataConnect, vars: CrearInsumoVariables): MutationPromise<CrearInsumoData, CrearInsumoVariables>;

interface CrearInsumoRef {
  ...
  (dc: DataConnect, vars: CrearInsumoVariables): MutationRef<CrearInsumoData, CrearInsumoVariables>;
}
export const crearInsumoRef: CrearInsumoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the crearInsumoRef:
```typescript
const name = crearInsumoRef.operationName;
console.log(name);
```

### Variables
The `CrearInsumo` mutation requires an argument of type `CrearInsumoVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CrearInsumoVariables {
  nombre: string;
  unidadMedida: string;
  stockInicial: number;
  stockMinimo: number;
}
```
### Return Type
Recall that executing the `CrearInsumo` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CrearInsumoData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CrearInsumoData {
  insumo_insert: Insumo_Key;
  movimientoInventario_insert: MovimientoInventario_Key;
}
```
### Using `CrearInsumo`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, crearInsumo, CrearInsumoVariables } from '@dataconnect/generated';

// The `CrearInsumo` mutation requires an argument of type `CrearInsumoVariables`:
const crearInsumoVars: CrearInsumoVariables = {
  nombre: ...,
  unidadMedida: ...,
  stockInicial: ...,
  stockMinimo: ...,
};

// Call the `crearInsumo()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await crearInsumo(crearInsumoVars);
// Variables can be defined inline as well.
const { data } = await crearInsumo({ nombre: ..., unidadMedida: ..., stockInicial: ..., stockMinimo: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await crearInsumo(dataConnect, crearInsumoVars);

console.log(data.insumo_insert);
console.log(data.movimientoInventario_insert);

// Or, you can use the `Promise` API.
crearInsumo(crearInsumoVars).then((response) => {
  const data = response.data;
  console.log(data.insumo_insert);
  console.log(data.movimientoInventario_insert);
});
```

### Using `CrearInsumo`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, crearInsumoRef, CrearInsumoVariables } from '@dataconnect/generated';

// The `CrearInsumo` mutation requires an argument of type `CrearInsumoVariables`:
const crearInsumoVars: CrearInsumoVariables = {
  nombre: ...,
  unidadMedida: ...,
  stockInicial: ...,
  stockMinimo: ...,
};

// Call the `crearInsumoRef()` function to get a reference to the mutation.
const ref = crearInsumoRef(crearInsumoVars);
// Variables can be defined inline as well.
const ref = crearInsumoRef({ nombre: ..., unidadMedida: ..., stockInicial: ..., stockMinimo: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = crearInsumoRef(dataConnect, crearInsumoVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.insumo_insert);
console.log(data.movimientoInventario_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.insumo_insert);
  console.log(data.movimientoInventario_insert);
});
```

## ActualizarInsumo
You can execute the `ActualizarInsumo` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
actualizarInsumo(vars: ActualizarInsumoVariables): MutationPromise<ActualizarInsumoData, ActualizarInsumoVariables>;

interface ActualizarInsumoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ActualizarInsumoVariables): MutationRef<ActualizarInsumoData, ActualizarInsumoVariables>;
}
export const actualizarInsumoRef: ActualizarInsumoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
actualizarInsumo(dc: DataConnect, vars: ActualizarInsumoVariables): MutationPromise<ActualizarInsumoData, ActualizarInsumoVariables>;

interface ActualizarInsumoRef {
  ...
  (dc: DataConnect, vars: ActualizarInsumoVariables): MutationRef<ActualizarInsumoData, ActualizarInsumoVariables>;
}
export const actualizarInsumoRef: ActualizarInsumoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the actualizarInsumoRef:
```typescript
const name = actualizarInsumoRef.operationName;
console.log(name);
```

### Variables
The `ActualizarInsumo` mutation requires an argument of type `ActualizarInsumoVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ActualizarInsumoVariables {
  id: UUIDString;
  nombre: string;
  unidadMedida: string;
  stockMinimo: number;
  activo: boolean;
}
```
### Return Type
Recall that executing the `ActualizarInsumo` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ActualizarInsumoData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ActualizarInsumoData {
  insumo_update?: Insumo_Key | null;
}
```
### Using `ActualizarInsumo`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, actualizarInsumo, ActualizarInsumoVariables } from '@dataconnect/generated';

// The `ActualizarInsumo` mutation requires an argument of type `ActualizarInsumoVariables`:
const actualizarInsumoVars: ActualizarInsumoVariables = {
  id: ...,
  nombre: ...,
  unidadMedida: ...,
  stockMinimo: ...,
  activo: ...,
};

// Call the `actualizarInsumo()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await actualizarInsumo(actualizarInsumoVars);
// Variables can be defined inline as well.
const { data } = await actualizarInsumo({ id: ..., nombre: ..., unidadMedida: ..., stockMinimo: ..., activo: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await actualizarInsumo(dataConnect, actualizarInsumoVars);

console.log(data.insumo_update);

// Or, you can use the `Promise` API.
actualizarInsumo(actualizarInsumoVars).then((response) => {
  const data = response.data;
  console.log(data.insumo_update);
});
```

### Using `ActualizarInsumo`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, actualizarInsumoRef, ActualizarInsumoVariables } from '@dataconnect/generated';

// The `ActualizarInsumo` mutation requires an argument of type `ActualizarInsumoVariables`:
const actualizarInsumoVars: ActualizarInsumoVariables = {
  id: ...,
  nombre: ...,
  unidadMedida: ...,
  stockMinimo: ...,
  activo: ...,
};

// Call the `actualizarInsumoRef()` function to get a reference to the mutation.
const ref = actualizarInsumoRef(actualizarInsumoVars);
// Variables can be defined inline as well.
const ref = actualizarInsumoRef({ id: ..., nombre: ..., unidadMedida: ..., stockMinimo: ..., activo: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = actualizarInsumoRef(dataConnect, actualizarInsumoVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.insumo_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.insumo_update);
});
```

## RegistrarEntradaInventario
You can execute the `RegistrarEntradaInventario` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
registrarEntradaInventario(vars: RegistrarEntradaInventarioVariables): MutationPromise<RegistrarEntradaInventarioData, RegistrarEntradaInventarioVariables>;

interface RegistrarEntradaInventarioRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RegistrarEntradaInventarioVariables): MutationRef<RegistrarEntradaInventarioData, RegistrarEntradaInventarioVariables>;
}
export const registrarEntradaInventarioRef: RegistrarEntradaInventarioRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
registrarEntradaInventario(dc: DataConnect, vars: RegistrarEntradaInventarioVariables): MutationPromise<RegistrarEntradaInventarioData, RegistrarEntradaInventarioVariables>;

interface RegistrarEntradaInventarioRef {
  ...
  (dc: DataConnect, vars: RegistrarEntradaInventarioVariables): MutationRef<RegistrarEntradaInventarioData, RegistrarEntradaInventarioVariables>;
}
export const registrarEntradaInventarioRef: RegistrarEntradaInventarioRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the registrarEntradaInventarioRef:
```typescript
const name = registrarEntradaInventarioRef.operationName;
console.log(name);
```

### Variables
The `RegistrarEntradaInventario` mutation requires an argument of type `RegistrarEntradaInventarioVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RegistrarEntradaInventarioVariables {
  insumoId: UUIDString;
  cantidad: number;
  motivo?: string | null;
}
```
### Return Type
Recall that executing the `RegistrarEntradaInventario` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RegistrarEntradaInventarioData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RegistrarEntradaInventarioData {
  insumo_update?: Insumo_Key | null;
  movimientoInventario_insert: MovimientoInventario_Key;
}
```
### Using `RegistrarEntradaInventario`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, registrarEntradaInventario, RegistrarEntradaInventarioVariables } from '@dataconnect/generated';

// The `RegistrarEntradaInventario` mutation requires an argument of type `RegistrarEntradaInventarioVariables`:
const registrarEntradaInventarioVars: RegistrarEntradaInventarioVariables = {
  insumoId: ...,
  cantidad: ...,
  motivo: ..., // optional
};

// Call the `registrarEntradaInventario()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await registrarEntradaInventario(registrarEntradaInventarioVars);
// Variables can be defined inline as well.
const { data } = await registrarEntradaInventario({ insumoId: ..., cantidad: ..., motivo: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await registrarEntradaInventario(dataConnect, registrarEntradaInventarioVars);

console.log(data.insumo_update);
console.log(data.movimientoInventario_insert);

// Or, you can use the `Promise` API.
registrarEntradaInventario(registrarEntradaInventarioVars).then((response) => {
  const data = response.data;
  console.log(data.insumo_update);
  console.log(data.movimientoInventario_insert);
});
```

### Using `RegistrarEntradaInventario`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, registrarEntradaInventarioRef, RegistrarEntradaInventarioVariables } from '@dataconnect/generated';

// The `RegistrarEntradaInventario` mutation requires an argument of type `RegistrarEntradaInventarioVariables`:
const registrarEntradaInventarioVars: RegistrarEntradaInventarioVariables = {
  insumoId: ...,
  cantidad: ...,
  motivo: ..., // optional
};

// Call the `registrarEntradaInventarioRef()` function to get a reference to the mutation.
const ref = registrarEntradaInventarioRef(registrarEntradaInventarioVars);
// Variables can be defined inline as well.
const ref = registrarEntradaInventarioRef({ insumoId: ..., cantidad: ..., motivo: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = registrarEntradaInventarioRef(dataConnect, registrarEntradaInventarioVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.insumo_update);
console.log(data.movimientoInventario_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.insumo_update);
  console.log(data.movimientoInventario_insert);
});
```

## RegistrarSalidaInventario
You can execute the `RegistrarSalidaInventario` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
registrarSalidaInventario(vars: RegistrarSalidaInventarioVariables): MutationPromise<RegistrarSalidaInventarioData, RegistrarSalidaInventarioVariables>;

interface RegistrarSalidaInventarioRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RegistrarSalidaInventarioVariables): MutationRef<RegistrarSalidaInventarioData, RegistrarSalidaInventarioVariables>;
}
export const registrarSalidaInventarioRef: RegistrarSalidaInventarioRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
registrarSalidaInventario(dc: DataConnect, vars: RegistrarSalidaInventarioVariables): MutationPromise<RegistrarSalidaInventarioData, RegistrarSalidaInventarioVariables>;

interface RegistrarSalidaInventarioRef {
  ...
  (dc: DataConnect, vars: RegistrarSalidaInventarioVariables): MutationRef<RegistrarSalidaInventarioData, RegistrarSalidaInventarioVariables>;
}
export const registrarSalidaInventarioRef: RegistrarSalidaInventarioRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the registrarSalidaInventarioRef:
```typescript
const name = registrarSalidaInventarioRef.operationName;
console.log(name);
```

### Variables
The `RegistrarSalidaInventario` mutation requires an argument of type `RegistrarSalidaInventarioVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RegistrarSalidaInventarioVariables {
  insumoId: UUIDString;
  cantidad: number;
  motivo?: string | null;
}
```
### Return Type
Recall that executing the `RegistrarSalidaInventario` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RegistrarSalidaInventarioData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RegistrarSalidaInventarioData {
  insumo_update?: Insumo_Key | null;
  movimientoInventario_insert: MovimientoInventario_Key;
}
```
### Using `RegistrarSalidaInventario`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, registrarSalidaInventario, RegistrarSalidaInventarioVariables } from '@dataconnect/generated';

// The `RegistrarSalidaInventario` mutation requires an argument of type `RegistrarSalidaInventarioVariables`:
const registrarSalidaInventarioVars: RegistrarSalidaInventarioVariables = {
  insumoId: ...,
  cantidad: ...,
  motivo: ..., // optional
};

// Call the `registrarSalidaInventario()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await registrarSalidaInventario(registrarSalidaInventarioVars);
// Variables can be defined inline as well.
const { data } = await registrarSalidaInventario({ insumoId: ..., cantidad: ..., motivo: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await registrarSalidaInventario(dataConnect, registrarSalidaInventarioVars);

console.log(data.insumo_update);
console.log(data.movimientoInventario_insert);

// Or, you can use the `Promise` API.
registrarSalidaInventario(registrarSalidaInventarioVars).then((response) => {
  const data = response.data;
  console.log(data.insumo_update);
  console.log(data.movimientoInventario_insert);
});
```

### Using `RegistrarSalidaInventario`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, registrarSalidaInventarioRef, RegistrarSalidaInventarioVariables } from '@dataconnect/generated';

// The `RegistrarSalidaInventario` mutation requires an argument of type `RegistrarSalidaInventarioVariables`:
const registrarSalidaInventarioVars: RegistrarSalidaInventarioVariables = {
  insumoId: ...,
  cantidad: ...,
  motivo: ..., // optional
};

// Call the `registrarSalidaInventarioRef()` function to get a reference to the mutation.
const ref = registrarSalidaInventarioRef(registrarSalidaInventarioVars);
// Variables can be defined inline as well.
const ref = registrarSalidaInventarioRef({ insumoId: ..., cantidad: ..., motivo: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = registrarSalidaInventarioRef(dataConnect, registrarSalidaInventarioVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.insumo_update);
console.log(data.movimientoInventario_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.insumo_update);
  console.log(data.movimientoInventario_insert);
});
```

## AsociarFlujoComandaPendiente
You can execute the `AsociarFlujoComandaPendiente` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
asociarFlujoComandaPendiente(vars: AsociarFlujoComandaPendienteVariables): MutationPromise<AsociarFlujoComandaPendienteData, AsociarFlujoComandaPendienteVariables>;

interface AsociarFlujoComandaPendienteRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AsociarFlujoComandaPendienteVariables): MutationRef<AsociarFlujoComandaPendienteData, AsociarFlujoComandaPendienteVariables>;
}
export const asociarFlujoComandaPendienteRef: AsociarFlujoComandaPendienteRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
asociarFlujoComandaPendiente(dc: DataConnect, vars: AsociarFlujoComandaPendienteVariables): MutationPromise<AsociarFlujoComandaPendienteData, AsociarFlujoComandaPendienteVariables>;

interface AsociarFlujoComandaPendienteRef {
  ...
  (dc: DataConnect, vars: AsociarFlujoComandaPendienteVariables): MutationRef<AsociarFlujoComandaPendienteData, AsociarFlujoComandaPendienteVariables>;
}
export const asociarFlujoComandaPendienteRef: AsociarFlujoComandaPendienteRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the asociarFlujoComandaPendienteRef:
```typescript
const name = asociarFlujoComandaPendienteRef.operationName;
console.log(name);
```

### Variables
The `AsociarFlujoComandaPendiente` mutation requires an argument of type `AsociarFlujoComandaPendienteVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AsociarFlujoComandaPendienteVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `AsociarFlujoComandaPendiente` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AsociarFlujoComandaPendienteData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AsociarFlujoComandaPendienteData {
  comandaEtapa_insertMany: ComandaEtapa_Key[];
}
```
### Using `AsociarFlujoComandaPendiente`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, asociarFlujoComandaPendiente, AsociarFlujoComandaPendienteVariables } from '@dataconnect/generated';

// The `AsociarFlujoComandaPendiente` mutation requires an argument of type `AsociarFlujoComandaPendienteVariables`:
const asociarFlujoComandaPendienteVars: AsociarFlujoComandaPendienteVariables = {
  id: ...,
};

// Call the `asociarFlujoComandaPendiente()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await asociarFlujoComandaPendiente(asociarFlujoComandaPendienteVars);
// Variables can be defined inline as well.
const { data } = await asociarFlujoComandaPendiente({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await asociarFlujoComandaPendiente(dataConnect, asociarFlujoComandaPendienteVars);

console.log(data.comandaEtapa_insertMany);

// Or, you can use the `Promise` API.
asociarFlujoComandaPendiente(asociarFlujoComandaPendienteVars).then((response) => {
  const data = response.data;
  console.log(data.comandaEtapa_insertMany);
});
```

### Using `AsociarFlujoComandaPendiente`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, asociarFlujoComandaPendienteRef, AsociarFlujoComandaPendienteVariables } from '@dataconnect/generated';

// The `AsociarFlujoComandaPendiente` mutation requires an argument of type `AsociarFlujoComandaPendienteVariables`:
const asociarFlujoComandaPendienteVars: AsociarFlujoComandaPendienteVariables = {
  id: ...,
};

// Call the `asociarFlujoComandaPendienteRef()` function to get a reference to the mutation.
const ref = asociarFlujoComandaPendienteRef(asociarFlujoComandaPendienteVars);
// Variables can be defined inline as well.
const ref = asociarFlujoComandaPendienteRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = asociarFlujoComandaPendienteRef(dataConnect, asociarFlujoComandaPendienteVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.comandaEtapa_insertMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.comandaEtapa_insertMany);
});
```

## ConfigurarEtapaProduccion
You can execute the `ConfigurarEtapaProduccion` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
configurarEtapaProduccion(vars: ConfigurarEtapaProduccionVariables): MutationPromise<ConfigurarEtapaProduccionData, ConfigurarEtapaProduccionVariables>;

interface ConfigurarEtapaProduccionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ConfigurarEtapaProduccionVariables): MutationRef<ConfigurarEtapaProduccionData, ConfigurarEtapaProduccionVariables>;
}
export const configurarEtapaProduccionRef: ConfigurarEtapaProduccionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
configurarEtapaProduccion(dc: DataConnect, vars: ConfigurarEtapaProduccionVariables): MutationPromise<ConfigurarEtapaProduccionData, ConfigurarEtapaProduccionVariables>;

interface ConfigurarEtapaProduccionRef {
  ...
  (dc: DataConnect, vars: ConfigurarEtapaProduccionVariables): MutationRef<ConfigurarEtapaProduccionData, ConfigurarEtapaProduccionVariables>;
}
export const configurarEtapaProduccionRef: ConfigurarEtapaProduccionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the configurarEtapaProduccionRef:
```typescript
const name = configurarEtapaProduccionRef.operationName;
console.log(name);
```

### Variables
The `ConfigurarEtapaProduccion` mutation requires an argument of type `ConfigurarEtapaProduccionVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ConfigurarEtapaProduccionVariables {
  id: UUIDString;
  nombre: string;
  descripcion?: string | null;
  tiempoEstimadoMin?: number | null;
}
```
### Return Type
Recall that executing the `ConfigurarEtapaProduccion` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ConfigurarEtapaProduccionData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ConfigurarEtapaProduccionData {
  etapaProduccion_update?: EtapaProduccion_Key | null;
}
```
### Using `ConfigurarEtapaProduccion`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, configurarEtapaProduccion, ConfigurarEtapaProduccionVariables } from '@dataconnect/generated';

// The `ConfigurarEtapaProduccion` mutation requires an argument of type `ConfigurarEtapaProduccionVariables`:
const configurarEtapaProduccionVars: ConfigurarEtapaProduccionVariables = {
  id: ...,
  nombre: ...,
  descripcion: ..., // optional
  tiempoEstimadoMin: ..., // optional
};

// Call the `configurarEtapaProduccion()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await configurarEtapaProduccion(configurarEtapaProduccionVars);
// Variables can be defined inline as well.
const { data } = await configurarEtapaProduccion({ id: ..., nombre: ..., descripcion: ..., tiempoEstimadoMin: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await configurarEtapaProduccion(dataConnect, configurarEtapaProduccionVars);

console.log(data.etapaProduccion_update);

// Or, you can use the `Promise` API.
configurarEtapaProduccion(configurarEtapaProduccionVars).then((response) => {
  const data = response.data;
  console.log(data.etapaProduccion_update);
});
```

### Using `ConfigurarEtapaProduccion`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, configurarEtapaProduccionRef, ConfigurarEtapaProduccionVariables } from '@dataconnect/generated';

// The `ConfigurarEtapaProduccion` mutation requires an argument of type `ConfigurarEtapaProduccionVariables`:
const configurarEtapaProduccionVars: ConfigurarEtapaProduccionVariables = {
  id: ...,
  nombre: ...,
  descripcion: ..., // optional
  tiempoEstimadoMin: ..., // optional
};

// Call the `configurarEtapaProduccionRef()` function to get a reference to the mutation.
const ref = configurarEtapaProduccionRef(configurarEtapaProduccionVars);
// Variables can be defined inline as well.
const ref = configurarEtapaProduccionRef({ id: ..., nombre: ..., descripcion: ..., tiempoEstimadoMin: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = configurarEtapaProduccionRef(dataConnect, configurarEtapaProduccionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.etapaProduccion_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.etapaProduccion_update);
});
```

## ConfigurarLimitesEtapas
You can execute the `ConfigurarLimitesEtapas` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
configurarLimitesEtapas(vars: ConfigurarLimitesEtapasVariables): MutationPromise<ConfigurarLimitesEtapasData, ConfigurarLimitesEtapasVariables>;

interface ConfigurarLimitesEtapasRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ConfigurarLimitesEtapasVariables): MutationRef<ConfigurarLimitesEtapasData, ConfigurarLimitesEtapasVariables>;
}
export const configurarLimitesEtapasRef: ConfigurarLimitesEtapasRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
configurarLimitesEtapas(dc: DataConnect, vars: ConfigurarLimitesEtapasVariables): MutationPromise<ConfigurarLimitesEtapasData, ConfigurarLimitesEtapasVariables>;

interface ConfigurarLimitesEtapasRef {
  ...
  (dc: DataConnect, vars: ConfigurarLimitesEtapasVariables): MutationRef<ConfigurarLimitesEtapasData, ConfigurarLimitesEtapasVariables>;
}
export const configurarLimitesEtapasRef: ConfigurarLimitesEtapasRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the configurarLimitesEtapasRef:
```typescript
const name = configurarLimitesEtapasRef.operationName;
console.log(name);
```

### Variables
The `ConfigurarLimitesEtapas` mutation requires an argument of type `ConfigurarLimitesEtapasVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ConfigurarLimitesEtapasVariables {
  recepcion: number;
  lavado: number;
  secado: number;
  planchado: number;
  entrega: number;
}
```
### Return Type
Recall that executing the `ConfigurarLimitesEtapas` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ConfigurarLimitesEtapasData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ConfigurarLimitesEtapasData {
  recepcion?: EtapaProduccion_Key | null;
  lavado?: EtapaProduccion_Key | null;
  secado?: EtapaProduccion_Key | null;
  planchado?: EtapaProduccion_Key | null;
  entrega?: EtapaProduccion_Key | null;
}
```
### Using `ConfigurarLimitesEtapas`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, configurarLimitesEtapas, ConfigurarLimitesEtapasVariables } from '@dataconnect/generated';

// The `ConfigurarLimitesEtapas` mutation requires an argument of type `ConfigurarLimitesEtapasVariables`:
const configurarLimitesEtapasVars: ConfigurarLimitesEtapasVariables = {
  recepcion: ...,
  lavado: ...,
  secado: ...,
  planchado: ...,
  entrega: ...,
};

// Call the `configurarLimitesEtapas()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await configurarLimitesEtapas(configurarLimitesEtapasVars);
// Variables can be defined inline as well.
const { data } = await configurarLimitesEtapas({ recepcion: ..., lavado: ..., secado: ..., planchado: ..., entrega: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await configurarLimitesEtapas(dataConnect, configurarLimitesEtapasVars);

console.log(data.recepcion);
console.log(data.lavado);
console.log(data.secado);
console.log(data.planchado);
console.log(data.entrega);

// Or, you can use the `Promise` API.
configurarLimitesEtapas(configurarLimitesEtapasVars).then((response) => {
  const data = response.data;
  console.log(data.recepcion);
  console.log(data.lavado);
  console.log(data.secado);
  console.log(data.planchado);
  console.log(data.entrega);
});
```

### Using `ConfigurarLimitesEtapas`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, configurarLimitesEtapasRef, ConfigurarLimitesEtapasVariables } from '@dataconnect/generated';

// The `ConfigurarLimitesEtapas` mutation requires an argument of type `ConfigurarLimitesEtapasVariables`:
const configurarLimitesEtapasVars: ConfigurarLimitesEtapasVariables = {
  recepcion: ...,
  lavado: ...,
  secado: ...,
  planchado: ...,
  entrega: ...,
};

// Call the `configurarLimitesEtapasRef()` function to get a reference to the mutation.
const ref = configurarLimitesEtapasRef(configurarLimitesEtapasVars);
// Variables can be defined inline as well.
const ref = configurarLimitesEtapasRef({ recepcion: ..., lavado: ..., secado: ..., planchado: ..., entrega: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = configurarLimitesEtapasRef(dataConnect, configurarLimitesEtapasVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.recepcion);
console.log(data.lavado);
console.log(data.secado);
console.log(data.planchado);
console.log(data.entrega);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.recepcion);
  console.log(data.lavado);
  console.log(data.secado);
  console.log(data.planchado);
  console.log(data.entrega);
});
```

## CompletarEtapaComanda
You can execute the `CompletarEtapaComanda` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
completarEtapaComanda(vars: CompletarEtapaComandaVariables): MutationPromise<CompletarEtapaComandaData, CompletarEtapaComandaVariables>;

interface CompletarEtapaComandaRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CompletarEtapaComandaVariables): MutationRef<CompletarEtapaComandaData, CompletarEtapaComandaVariables>;
}
export const completarEtapaComandaRef: CompletarEtapaComandaRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
completarEtapaComanda(dc: DataConnect, vars: CompletarEtapaComandaVariables): MutationPromise<CompletarEtapaComandaData, CompletarEtapaComandaVariables>;

interface CompletarEtapaComandaRef {
  ...
  (dc: DataConnect, vars: CompletarEtapaComandaVariables): MutationRef<CompletarEtapaComandaData, CompletarEtapaComandaVariables>;
}
export const completarEtapaComandaRef: CompletarEtapaComandaRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the completarEtapaComandaRef:
```typescript
const name = completarEtapaComandaRef.operationName;
console.log(name);
```

### Variables
The `CompletarEtapaComanda` mutation requires an argument of type `CompletarEtapaComandaVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CompletarEtapaComandaVariables {
  comandaId: UUIDString;
  etapaId: UUIDString;
  orden: number;
  estadoComanda: ComandaEstado;
}
```
### Return Type
Recall that executing the `CompletarEtapaComanda` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CompletarEtapaComandaData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CompletarEtapaComandaData {
  comandaEtapa_update?: ComandaEtapa_Key | null;
  siguiente: number;
  comanda_update?: Comanda_Key | null;
  comandaHistorialEstado_insert: ComandaHistorialEstado_Key;
  notificacion?: number | null;
}
```
### Using `CompletarEtapaComanda`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, completarEtapaComanda, CompletarEtapaComandaVariables } from '@dataconnect/generated';

// The `CompletarEtapaComanda` mutation requires an argument of type `CompletarEtapaComandaVariables`:
const completarEtapaComandaVars: CompletarEtapaComandaVariables = {
  comandaId: ...,
  etapaId: ...,
  orden: ...,
  estadoComanda: ...,
};

// Call the `completarEtapaComanda()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await completarEtapaComanda(completarEtapaComandaVars);
// Variables can be defined inline as well.
const { data } = await completarEtapaComanda({ comandaId: ..., etapaId: ..., orden: ..., estadoComanda: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await completarEtapaComanda(dataConnect, completarEtapaComandaVars);

console.log(data.comandaEtapa_update);
console.log(data.siguiente);
console.log(data.comanda_update);
console.log(data.comandaHistorialEstado_insert);
console.log(data.notificacion);

// Or, you can use the `Promise` API.
completarEtapaComanda(completarEtapaComandaVars).then((response) => {
  const data = response.data;
  console.log(data.comandaEtapa_update);
  console.log(data.siguiente);
  console.log(data.comanda_update);
  console.log(data.comandaHistorialEstado_insert);
  console.log(data.notificacion);
});
```

### Using `CompletarEtapaComanda`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, completarEtapaComandaRef, CompletarEtapaComandaVariables } from '@dataconnect/generated';

// The `CompletarEtapaComanda` mutation requires an argument of type `CompletarEtapaComandaVariables`:
const completarEtapaComandaVars: CompletarEtapaComandaVariables = {
  comandaId: ...,
  etapaId: ...,
  orden: ...,
  estadoComanda: ...,
};

// Call the `completarEtapaComandaRef()` function to get a reference to the mutation.
const ref = completarEtapaComandaRef(completarEtapaComandaVars);
// Variables can be defined inline as well.
const ref = completarEtapaComandaRef({ comandaId: ..., etapaId: ..., orden: ..., estadoComanda: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = completarEtapaComandaRef(dataConnect, completarEtapaComandaVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.comandaEtapa_update);
console.log(data.siguiente);
console.log(data.comanda_update);
console.log(data.comandaHistorialEstado_insert);
console.log(data.notificacion);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.comandaEtapa_update);
  console.log(data.siguiente);
  console.log(data.comanda_update);
  console.log(data.comandaHistorialEstado_insert);
  console.log(data.notificacion);
});
```

## RegistrarIncidenciaComanda
You can execute the `RegistrarIncidenciaComanda` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
registrarIncidenciaComanda(vars: RegistrarIncidenciaComandaVariables): MutationPromise<RegistrarIncidenciaComandaData, RegistrarIncidenciaComandaVariables>;

interface RegistrarIncidenciaComandaRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RegistrarIncidenciaComandaVariables): MutationRef<RegistrarIncidenciaComandaData, RegistrarIncidenciaComandaVariables>;
}
export const registrarIncidenciaComandaRef: RegistrarIncidenciaComandaRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
registrarIncidenciaComanda(dc: DataConnect, vars: RegistrarIncidenciaComandaVariables): MutationPromise<RegistrarIncidenciaComandaData, RegistrarIncidenciaComandaVariables>;

interface RegistrarIncidenciaComandaRef {
  ...
  (dc: DataConnect, vars: RegistrarIncidenciaComandaVariables): MutationRef<RegistrarIncidenciaComandaData, RegistrarIncidenciaComandaVariables>;
}
export const registrarIncidenciaComandaRef: RegistrarIncidenciaComandaRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the registrarIncidenciaComandaRef:
```typescript
const name = registrarIncidenciaComandaRef.operationName;
console.log(name);
```

### Variables
The `RegistrarIncidenciaComanda` mutation requires an argument of type `RegistrarIncidenciaComandaVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RegistrarIncidenciaComandaVariables {
  comandaId: UUIDString;
  motivo: string;
  descripcion?: string | null;
}
```
### Return Type
Recall that executing the `RegistrarIncidenciaComanda` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RegistrarIncidenciaComandaData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RegistrarIncidenciaComandaData {
  incidenciaComanda_insert: IncidenciaComanda_Key;
}
```
### Using `RegistrarIncidenciaComanda`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, registrarIncidenciaComanda, RegistrarIncidenciaComandaVariables } from '@dataconnect/generated';

// The `RegistrarIncidenciaComanda` mutation requires an argument of type `RegistrarIncidenciaComandaVariables`:
const registrarIncidenciaComandaVars: RegistrarIncidenciaComandaVariables = {
  comandaId: ...,
  motivo: ...,
  descripcion: ..., // optional
};

// Call the `registrarIncidenciaComanda()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await registrarIncidenciaComanda(registrarIncidenciaComandaVars);
// Variables can be defined inline as well.
const { data } = await registrarIncidenciaComanda({ comandaId: ..., motivo: ..., descripcion: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await registrarIncidenciaComanda(dataConnect, registrarIncidenciaComandaVars);

console.log(data.incidenciaComanda_insert);

// Or, you can use the `Promise` API.
registrarIncidenciaComanda(registrarIncidenciaComandaVars).then((response) => {
  const data = response.data;
  console.log(data.incidenciaComanda_insert);
});
```

### Using `RegistrarIncidenciaComanda`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, registrarIncidenciaComandaRef, RegistrarIncidenciaComandaVariables } from '@dataconnect/generated';

// The `RegistrarIncidenciaComanda` mutation requires an argument of type `RegistrarIncidenciaComandaVariables`:
const registrarIncidenciaComandaVars: RegistrarIncidenciaComandaVariables = {
  comandaId: ...,
  motivo: ...,
  descripcion: ..., // optional
};

// Call the `registrarIncidenciaComandaRef()` function to get a reference to the mutation.
const ref = registrarIncidenciaComandaRef(registrarIncidenciaComandaVars);
// Variables can be defined inline as well.
const ref = registrarIncidenciaComandaRef({ comandaId: ..., motivo: ..., descripcion: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = registrarIncidenciaComandaRef(dataConnect, registrarIncidenciaComandaVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.incidenciaComanda_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.incidenciaComanda_insert);
});
```

## ActualizarEstadoIncidencia
You can execute the `ActualizarEstadoIncidencia` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
actualizarEstadoIncidencia(vars: ActualizarEstadoIncidenciaVariables): MutationPromise<ActualizarEstadoIncidenciaData, ActualizarEstadoIncidenciaVariables>;

interface ActualizarEstadoIncidenciaRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ActualizarEstadoIncidenciaVariables): MutationRef<ActualizarEstadoIncidenciaData, ActualizarEstadoIncidenciaVariables>;
}
export const actualizarEstadoIncidenciaRef: ActualizarEstadoIncidenciaRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
actualizarEstadoIncidencia(dc: DataConnect, vars: ActualizarEstadoIncidenciaVariables): MutationPromise<ActualizarEstadoIncidenciaData, ActualizarEstadoIncidenciaVariables>;

interface ActualizarEstadoIncidenciaRef {
  ...
  (dc: DataConnect, vars: ActualizarEstadoIncidenciaVariables): MutationRef<ActualizarEstadoIncidenciaData, ActualizarEstadoIncidenciaVariables>;
}
export const actualizarEstadoIncidenciaRef: ActualizarEstadoIncidenciaRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the actualizarEstadoIncidenciaRef:
```typescript
const name = actualizarEstadoIncidenciaRef.operationName;
console.log(name);
```

### Variables
The `ActualizarEstadoIncidencia` mutation requires an argument of type `ActualizarEstadoIncidenciaVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ActualizarEstadoIncidenciaVariables {
  id: UUIDString;
  estado: IncidenciaEstado;
}
```
### Return Type
Recall that executing the `ActualizarEstadoIncidencia` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ActualizarEstadoIncidenciaData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ActualizarEstadoIncidenciaData {
  incidenciaComanda_update?: IncidenciaComanda_Key | null;
}
```
### Using `ActualizarEstadoIncidencia`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, actualizarEstadoIncidencia, ActualizarEstadoIncidenciaVariables } from '@dataconnect/generated';

// The `ActualizarEstadoIncidencia` mutation requires an argument of type `ActualizarEstadoIncidenciaVariables`:
const actualizarEstadoIncidenciaVars: ActualizarEstadoIncidenciaVariables = {
  id: ...,
  estado: ...,
};

// Call the `actualizarEstadoIncidencia()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await actualizarEstadoIncidencia(actualizarEstadoIncidenciaVars);
// Variables can be defined inline as well.
const { data } = await actualizarEstadoIncidencia({ id: ..., estado: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await actualizarEstadoIncidencia(dataConnect, actualizarEstadoIncidenciaVars);

console.log(data.incidenciaComanda_update);

// Or, you can use the `Promise` API.
actualizarEstadoIncidencia(actualizarEstadoIncidenciaVars).then((response) => {
  const data = response.data;
  console.log(data.incidenciaComanda_update);
});
```

### Using `ActualizarEstadoIncidencia`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, actualizarEstadoIncidenciaRef, ActualizarEstadoIncidenciaVariables } from '@dataconnect/generated';

// The `ActualizarEstadoIncidencia` mutation requires an argument of type `ActualizarEstadoIncidenciaVariables`:
const actualizarEstadoIncidenciaVars: ActualizarEstadoIncidenciaVariables = {
  id: ...,
  estado: ...,
};

// Call the `actualizarEstadoIncidenciaRef()` function to get a reference to the mutation.
const ref = actualizarEstadoIncidenciaRef(actualizarEstadoIncidenciaVars);
// Variables can be defined inline as well.
const ref = actualizarEstadoIncidenciaRef({ id: ..., estado: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = actualizarEstadoIncidenciaRef(dataConnect, actualizarEstadoIncidenciaVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.incidenciaComanda_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.incidenciaComanda_update);
});
```

## ReasignarOperarioEtapa
You can execute the `ReasignarOperarioEtapa` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
reasignarOperarioEtapa(vars: ReasignarOperarioEtapaVariables): MutationPromise<ReasignarOperarioEtapaData, ReasignarOperarioEtapaVariables>;

interface ReasignarOperarioEtapaRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ReasignarOperarioEtapaVariables): MutationRef<ReasignarOperarioEtapaData, ReasignarOperarioEtapaVariables>;
}
export const reasignarOperarioEtapaRef: ReasignarOperarioEtapaRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
reasignarOperarioEtapa(dc: DataConnect, vars: ReasignarOperarioEtapaVariables): MutationPromise<ReasignarOperarioEtapaData, ReasignarOperarioEtapaVariables>;

interface ReasignarOperarioEtapaRef {
  ...
  (dc: DataConnect, vars: ReasignarOperarioEtapaVariables): MutationRef<ReasignarOperarioEtapaData, ReasignarOperarioEtapaVariables>;
}
export const reasignarOperarioEtapaRef: ReasignarOperarioEtapaRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the reasignarOperarioEtapaRef:
```typescript
const name = reasignarOperarioEtapaRef.operationName;
console.log(name);
```

### Variables
The `ReasignarOperarioEtapa` mutation requires an argument of type `ReasignarOperarioEtapaVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ReasignarOperarioEtapaVariables {
  comandaId: UUIDString;
  etapaId: UUIDString;
  operarioId: string;
  motivo?: string | null;
}
```
### Return Type
Recall that executing the `ReasignarOperarioEtapa` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ReasignarOperarioEtapaData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ReasignarOperarioEtapaData {
  comandaEtapa_update?: ComandaEtapa_Key | null;
  reasignacionOperario_insert: ReasignacionOperario_Key;
}
```
### Using `ReasignarOperarioEtapa`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, reasignarOperarioEtapa, ReasignarOperarioEtapaVariables } from '@dataconnect/generated';

// The `ReasignarOperarioEtapa` mutation requires an argument of type `ReasignarOperarioEtapaVariables`:
const reasignarOperarioEtapaVars: ReasignarOperarioEtapaVariables = {
  comandaId: ...,
  etapaId: ...,
  operarioId: ...,
  motivo: ..., // optional
};

// Call the `reasignarOperarioEtapa()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await reasignarOperarioEtapa(reasignarOperarioEtapaVars);
// Variables can be defined inline as well.
const { data } = await reasignarOperarioEtapa({ comandaId: ..., etapaId: ..., operarioId: ..., motivo: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await reasignarOperarioEtapa(dataConnect, reasignarOperarioEtapaVars);

console.log(data.comandaEtapa_update);
console.log(data.reasignacionOperario_insert);

// Or, you can use the `Promise` API.
reasignarOperarioEtapa(reasignarOperarioEtapaVars).then((response) => {
  const data = response.data;
  console.log(data.comandaEtapa_update);
  console.log(data.reasignacionOperario_insert);
});
```

### Using `ReasignarOperarioEtapa`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, reasignarOperarioEtapaRef, ReasignarOperarioEtapaVariables } from '@dataconnect/generated';

// The `ReasignarOperarioEtapa` mutation requires an argument of type `ReasignarOperarioEtapaVariables`:
const reasignarOperarioEtapaVars: ReasignarOperarioEtapaVariables = {
  comandaId: ...,
  etapaId: ...,
  operarioId: ...,
  motivo: ..., // optional
};

// Call the `reasignarOperarioEtapaRef()` function to get a reference to the mutation.
const ref = reasignarOperarioEtapaRef(reasignarOperarioEtapaVars);
// Variables can be defined inline as well.
const ref = reasignarOperarioEtapaRef({ comandaId: ..., etapaId: ..., operarioId: ..., motivo: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = reasignarOperarioEtapaRef(dataConnect, reasignarOperarioEtapaVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.comandaEtapa_update);
console.log(data.reasignacionOperario_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.comandaEtapa_update);
  console.log(data.reasignacionOperario_insert);
});
```
