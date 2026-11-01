# Correcciones derivadas de la revisión de fuentes

Estos cambios refuerzan cinco controles que el informe anterior dejó pendientes
de validación. No convierten aquellas hipótesis en explotaciones demostradas.

## Registro

`RegistrarseComoCliente` exige que el correo coincida con `auth.token.email` y
persiste ese valor del token tanto en `Usuario` como en la ficha nueva. La web
envía el correo canónico devuelto por Firebase Auth. Las altas administrativas
mantienen su autorización independiente y su contrato existente.

## Flota y producción

Las actualizaciones antiguas y actuales de vehículos adquieren el mismo bloqueo
de revisión que la programación y el inicio de salidas. Después del bloqueo se
comprueba que una desactivación no afecte a una salida activa. El inicio antiguo
vuelve a verificar el vehículo activo y actualiza únicamente una salida propia
que siga PROGRAMADA. Esto protege también registros históricos incoherentes.

El avance de producción compara el estado actual del pedido en el UPDATE final
con el estado autorizado en su lectura. Si otro flujo canceló o entregó el pedido,
el UPDATE no afecta filas y la transacción revierte también los cambios de etapas.
La cancelación repite su condición de estado abierto en su propia escritura.

## Fotografías

Antes de escribir en Storage, la API reserva una fila con el ID estable del
archivo mediante `RegistrarEvidenciaGuardada(confirmar: false)`. La mutación
serializa las reservas con `InspeccionVehiculo.revisionFotos` y limita a 20 filas
por inspección, contando también las pendientes. Un reintento con el mismo ID,
inspección, ruta y orden no consume otro cupo.

El ID se inserta sin sobrescribir una fila existente y la actualización posterior
comprueba su inspección, ruta y orden. Así, dos reservas concurrentes en
inspecciones distintas tampoco pueden mover una fila y dejar un archivo sin cupo.

Después de guardar o comprobar el mismo objeto existente, la API confirma esa
reserva con `confirmar: true`. Confirmar un ID sin reserva está prohibido. Solo
las fotos con `guardada=true` aparecen en las consultas de flota. Una reserva de
una foto ya confirmada no la vuelve pendiente.

Ante un error de Storage o una respuesta perdida se conserva la reserva: liberar
el cupo sin saber si el objeto existe permitiría acumular archivos fuera del
límite. El usuario puede reintentar con el mismo archivo e ID. No hay borrado
automático de reservas o archivos existentes. Si una reserva abandonada requiere
limpieza, un administrador debe conciliar primero la fila y el objeto; no basta
con eliminarla por antigüedad.

El esquema agrega `revisionFotos` con valor inicial 0 y `guardada` con valor
inicial true para conservar las fotografías anteriores. Las reservas nuevas
establecen false explícitamente.

## Recepción pública

Los formularios verifican el origen mediante la entrada de Vercel o la firma de
un proxy propio. Configuración y contrato:
[seguridad-solicitudes.md](seguridad-solicitudes.md).

## Comprobaciones y despliegue

Las pruebas agregadas cubren el registro con correo ajeno, la ausencia de origen
verificado, la rotación de encabezados falsificados, firmas inválidas o vencidas,
el cupo concurrente de fotos, los reintentos de cargas y la interacción entre
cancelación y avance. Las suites existentes se adaptan al correo autenticado y a
la reserva/confirmación de archivos.

Antes de publicar, en un entorno aislado y con dependencias disponibles:

1. Ejecutar `pnpm test` y `pnpm lint`.
2. Regenerar el SDK con `pnpm dataconnect:compile:web` y comprobar que los tipos
   generados coincidan. `confirmar` es una variable opcional nueva de la operación
   de servidor; el SDK conserva las firmas de las operaciones públicas.
3. Ejecutar `pnpm test:portal`, `pnpm test:production`, `pnpm test:vehiculos`,
   `pnpm test:privacidad` y `pnpm test:estabilizacion` en el emulador demo.
4. Revisar/aplicar la evolución del esquema y publicar conjuntamente el conector
   actualizado y la API. No mantener servidores antiguos creando objetos sin
   reserva durante el cambio. Configurar la entrada verificable del hosting.

Posteriormente se instalaron las dependencias y se configuró un entorno WSL2 con
Bubblewrap y límites de cgroup. Pasaron 302 pruebas unitarias, TypeScript, lint,
la compilación y generación temporal del SDK y las cinco suites de integración
anteriores. La integración detectó y permitió corregir una doble actualización
de vehículo: ahora una sola escritura adquiere el bloqueo y actualiza los datos,
y una comprobación posterior revierte la transacción si existe una salida activa.
Configuración, límites y resultados: [pruebas-aisladas.md](pruebas-aisladas.md).
`git diff --check` no detectó errores de espacios.

Los cambios locales no publican conectores ni alteran una base de datos
desplegada ni suben archivos.
