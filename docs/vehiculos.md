# Control de Flota y Vehículos (Sprint 08)

La ruta `/intranet/vehiculos` centraliza la gestión administrativa de la flota de reparto de Lavandería El Cobre y el seguimiento de salidas e inspecciones (`RF-VE01` a `RF-VE04`).

## Reglas de negocio y seguridad

- **Autorización en profundidad (`admin`):** Tanto el guardián de navegación (`lib/roles.ts`) como las consultas y mutaciones de Firebase Data Connect (`dataconnect/example/vehiculos-queries.gql` y `vehiculos-mutations.gql`) verifican que la sesión pertenezca a un usuario activo con rol `admin`.
- **Catálogo de Flota (`RF-VE01`):**
  - Normaliza las patentes chilenas al formato estándar en mayúsculas (`ABCD-12` o `AB-1234`) y valida unicidad tanto en cliente como en base de datos.
  - Los vehículos no se eliminan físicamente para preservar la trazabilidad histórica; se habilitan o deshabilitan (`activo`).
  - No se permite desactivar un vehículo mientras mantiene una salida en curso (`PROGRAMADA` o `EN_SERVICIO`).
- **Registro de Salida (`RF-VE02`):**
  - Crea en una sola transacción la salida (`EN_SERVICIO`, `fechaSalida = request.time`) y su inspección previa (`momento: ANTES`).
  - Bloquea la salida si el vehículo está inactivo, si ya tiene otra salida abierta o si el estado técnico inicial es `NO_APTO`.
  - Verifica que el odómetro de salida no sea inferior al último kilometraje registrado de la unidad.
- **Registro de Regreso (`RF-VE03`):**
  - Registra la inspección posterior (`momento: DESPUES`), exige que el odómetro final sea mayor o igual al odómetro de salida (`inspeccionAntes.kilometraje <= vars.kilometraje`) y cierra el viaje (`FINALIZADA`, `fechaRetorno = request.time`).
- **Historial y Auditoría (`RF-VE04`):**
  - Permite filtrar salidas por vehículo, conductor, estado del viaje y rango de fechas, calculando la distancia recorrida por viaje y acumulada.
  - Incluye visor comparativo lado a lado de las inspecciones `ANTES` y `DESPUES` con sus fotografías en Firebase Storage (`FotoInspeccionVehiculo`) y exportación a CSV protegida contra inyección de fórmulas.

## Validación y pruebas

```sh
npm run dataconnect:compile:web
npm run test:vehiculos
npm test
npm run lint
npm run build
```
