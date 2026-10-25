# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useAgregarComentarioComanda, useResolverMiIncidencia, useAutoAsignarComandaOperario, useGetComandaDetalleOperario, useGetMisComandasAsignadas, useCrearAviso, useGetAvisosAdministracion, useGetAvisosParaEquipo, useRegistrarse, useCrearUsuarioAdministrado } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useAgregarComentarioComanda(agregarComentarioComandaVars);

const { data, isPending, isSuccess, isError, error } = useResolverMiIncidencia(resolverMiIncidenciaVars);

const { data, isPending, isSuccess, isError, error } = useAutoAsignarComandaOperario(autoAsignarComandaOperarioVars);

const { data, isPending, isSuccess, isError, error } = useGetComandaDetalleOperario(getComandaDetalleOperarioVars);

const { data, isPending, isSuccess, isError, error } = useGetMisComandasAsignadas(getMisComandasAsignadasVars);

const { data, isPending, isSuccess, isError, error } = useCrearAviso(crearAvisoVars);

const { data, isPending, isSuccess, isError, error } = useGetAvisosAdministracion(getAvisosAdministracionVars);

const { data, isPending, isSuccess, isError, error } = useGetAvisosParaEquipo(getAvisosParaEquipoVars);

const { data, isPending, isSuccess, isError, error } = useRegistrarse(registrarseVars);

const { data, isPending, isSuccess, isError, error } = useCrearUsuarioAdministrado(crearUsuarioAdministradoVars);

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { agregarComentarioComanda, resolverMiIncidencia, autoAsignarComandaOperario, getComandaDetalleOperario, getMisComandasAsignadas, crearAviso, getAvisosAdministracion, getAvisosParaEquipo, registrarse, crearUsuarioAdministrado } from '@dataconnect/generated';


// Operation AgregarComentarioComanda:  For variables, look at type AgregarComentarioComandaVars in ../index.d.ts
const { data } = await AgregarComentarioComanda(dataConnect, agregarComentarioComandaVars);

// Operation ResolverMiIncidencia:  For variables, look at type ResolverMiIncidenciaVars in ../index.d.ts
const { data } = await ResolverMiIncidencia(dataConnect, resolverMiIncidenciaVars);

// Operation AutoAsignarComandaOperario:  For variables, look at type AutoAsignarComandaOperarioVars in ../index.d.ts
const { data } = await AutoAsignarComandaOperario(dataConnect, autoAsignarComandaOperarioVars);

// Operation GetComandaDetalleOperario:  For variables, look at type GetComandaDetalleOperarioVars in ../index.d.ts
const { data } = await GetComandaDetalleOperario(dataConnect, getComandaDetalleOperarioVars);

// Operation GetMisComandasAsignadas:  For variables, look at type GetMisComandasAsignadasVars in ../index.d.ts
const { data } = await GetMisComandasAsignadas(dataConnect, getMisComandasAsignadasVars);

// Operation CrearAviso:  For variables, look at type CrearAvisoVars in ../index.d.ts
const { data } = await CrearAviso(dataConnect, crearAvisoVars);

// Operation GetAvisosAdministracion:  For variables, look at type GetAvisosAdministracionVars in ../index.d.ts
const { data } = await GetAvisosAdministracion(dataConnect, getAvisosAdministracionVars);

// Operation GetAvisosParaEquipo:  For variables, look at type GetAvisosParaEquipoVars in ../index.d.ts
const { data } = await GetAvisosParaEquipo(dataConnect, getAvisosParaEquipoVars);

// Operation Registrarse:  For variables, look at type RegistrarseVars in ../index.d.ts
const { data } = await Registrarse(dataConnect, registrarseVars);

// Operation CrearUsuarioAdministrado:  For variables, look at type CrearUsuarioAdministradoVars in ../index.d.ts
const { data } = await CrearUsuarioAdministrado(dataConnect, crearUsuarioAdministradoVars);


```
