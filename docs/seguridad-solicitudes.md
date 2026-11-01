# Origen verificable para los formularios públicos

Los endpoints de contacto y recepción de derechos conservan el límite de cinco
solicitudes nuevas por origen y hora. Las IP se seudonimizan con
`CONTACT_RATE_LIMIT_SALT` (secreto del servidor de al menos 32 caracteres).
Cambiar `X-Forwarded-For` no cambia el contador: ese encabezado no se usa como
prueba de identidad del origen.

## Vercel

Con la variable de plataforma `VERCEL=1`, el servidor usa únicamente
`x-vercel-forwarded-for`, generado por la entrada de Vercel. No hay fallback a
`X-Forwarded-For`, `X-Real-IP`, `X-Vercel-Id` ni una IP enviada en el cuerpo.
Una IP ausente, inválida o presentada como lista bloquea la creación de una
solicitud nueva.

No configurar `VERCEL=1` manualmente en servidores que reciben tráfico directo.
La procedencia del encabezado depende de pasar por la plataforma, no de que el
cliente lo incluya. Vercel documenta la diferencia entre los encabezados en
[Request headers](https://vercel.com/docs/headers/request-headers).

## Otro hosting con proxy propio

Configurar `CONTACT_PROXY_SECRET` con un secreto independiente de al menos
32 caracteres, compartido solamente por el proxy y el servidor. El proxy debe
eliminar los siguientes encabezados recibidos del cliente y generar sus propios
valores a partir de la conexión de transporte:

- `x-cobre-client-ip`: una IP individual, sin puerto, lista ni identificador de zona.
- `x-cobre-client-timestamp`: segundos Unix decimales.
- `x-cobre-client-signature`: HMAC-SHA256 hexadecimal del mensaje UTF-8
  `cobre-solicitudes\n<timestamp>\n<ip>`, con saltos de línea reales y sin salto final.

El HMAC usa exactamente la representación de IP enviada en el encabezado. El
servidor verifica la firma en tiempo constante, admite como máximo 60 segundos
de diferencia temporal y después normaliza IPv6 para construir la clave del
contador. Mantener los relojes sincronizados y el secreto fuera del navegador,
logs, repositorio y variables `NEXT_PUBLIC_*`.

No se acepta una firma enviada por un cliente como sustituto de esa entrada
controlada: el proxy conserva la clave y firma la IP de la conexión, nunca una IP
elegida en encabezados o parámetros de la solicitud. Sin plataforma o firma
verificable, la recepción de solicitudes nuevas falla de forma cerrada; los
canales alternativos del sitio siguen disponibles.

## Validación previa a publicación

En un entorno local aislado con datos ficticios, ejecutar `pnpm test` para
comprobar las cabeceras falsificadas, las firmas inválidas o vencidas y la
normalización de IPv6. Revisar la configuración de entrada del hosting sin
enviar tráfico de auditoría al despliegue.
