# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useRegistrarse, useRegistrarseComoCliente, useActualizarUsuario, useCrearVehiculo, useActualizarVehiculo, useCrearSalidaVehiculo, useRegistrarInspeccionAntes, useIniciarSalidaVehiculo, useRegistrarInspeccionDespues, useAgregarFotoInspeccionVehiculo } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useRegistrarse(registrarseVars);

const { data, isPending, isSuccess, isError, error } = useRegistrarseComoCliente(registrarseComoClienteVars);

const { data, isPending, isSuccess, isError, error } = useActualizarUsuario(actualizarUsuarioVars);

const { data, isPending, isSuccess, isError, error } = useCrearVehiculo(crearVehiculoVars);

const { data, isPending, isSuccess, isError, error } = useActualizarVehiculo(actualizarVehiculoVars);

const { data, isPending, isSuccess, isError, error } = useCrearSalidaVehiculo(crearSalidaVehiculoVars);

const { data, isPending, isSuccess, isError, error } = useRegistrarInspeccionAntes(registrarInspeccionAntesVars);

const { data, isPending, isSuccess, isError, error } = useIniciarSalidaVehiculo(iniciarSalidaVehiculoVars);

const { data, isPending, isSuccess, isError, error } = useRegistrarInspeccionDespues(registrarInspeccionDespuesVars);

const { data, isPending, isSuccess, isError, error } = useAgregarFotoInspeccionVehiculo(agregarFotoInspeccionVehiculoVars);

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
import { registrarse, registrarseComoCliente, actualizarUsuario, crearVehiculo, actualizarVehiculo, crearSalidaVehiculo, registrarInspeccionAntes, iniciarSalidaVehiculo, registrarInspeccionDespues, agregarFotoInspeccionVehiculo } from '@dataconnect/generated';


// Operation Registrarse:  For variables, look at type RegistrarseVars in ../index.d.ts
const { data } = await Registrarse(dataConnect, registrarseVars);

// Operation RegistrarseComoCliente:  For variables, look at type RegistrarseComoClienteVars in ../index.d.ts
const { data } = await RegistrarseComoCliente(dataConnect, registrarseComoClienteVars);

// Operation ActualizarUsuario:  For variables, look at type ActualizarUsuarioVars in ../index.d.ts
const { data } = await ActualizarUsuario(dataConnect, actualizarUsuarioVars);

// Operation CrearVehiculo:  For variables, look at type CrearVehiculoVars in ../index.d.ts
const { data } = await CrearVehiculo(dataConnect, crearVehiculoVars);

// Operation ActualizarVehiculo:  For variables, look at type ActualizarVehiculoVars in ../index.d.ts
const { data } = await ActualizarVehiculo(dataConnect, actualizarVehiculoVars);

// Operation CrearSalidaVehiculo:  For variables, look at type CrearSalidaVehiculoVars in ../index.d.ts
const { data } = await CrearSalidaVehiculo(dataConnect, crearSalidaVehiculoVars);

// Operation RegistrarInspeccionAntes:  For variables, look at type RegistrarInspeccionAntesVars in ../index.d.ts
const { data } = await RegistrarInspeccionAntes(dataConnect, registrarInspeccionAntesVars);

// Operation IniciarSalidaVehiculo:  For variables, look at type IniciarSalidaVehiculoVars in ../index.d.ts
const { data } = await IniciarSalidaVehiculo(dataConnect, iniciarSalidaVehiculoVars);

// Operation RegistrarInspeccionDespues:  For variables, look at type RegistrarInspeccionDespuesVars in ../index.d.ts
const { data } = await RegistrarInspeccionDespues(dataConnect, registrarInspeccionDespuesVars);

// Operation AgregarFotoInspeccionVehiculo:  For variables, look at type AgregarFotoInspeccionVehiculoVars in ../index.d.ts
const { data } = await AgregarFotoInspeccionVehiculo(dataConnect, agregarFotoInspeccionVehiculoVars);


```