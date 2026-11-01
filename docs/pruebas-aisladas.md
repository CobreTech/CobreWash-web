# Entorno local de pruebas de seguridad

Configurado el 1 de noviembre de 2026 en este equipo Windows. No configura ni
modifica servicios desplegados.

## Componentes instalados

- WSL 3.0.3 y Virtual Machine Platform; reinicio completado.
- Distribución WSL2 exclusiva `CobreWash-Security`, Ubuntu 24.04.
- Node Linux 26.13.0, pnpm 11.3.0, Bubblewrap y herramientas de Linux.
- Dependencias del lockfile, instaladas con `--frozen-lockfile --ignore-scripts`.
- Firebase CLI 15.34.1 y emulador Data Connect Linux 3.4.24 precargado.

También quedaron instaladas las dependencias Windows del proyecto. Las pruebas
descritas aquí utilizan las dependencias Linux de la distribución dedicada.

## Aislamiento aplicado

El lanzador `/opt/cobrewash/run-isolated.sh` crea una copia descartable del código
en un tmpfs de 1 GiB. Los módulos instalados, el runtime y las herramientas se
montan como solo lectura. Solo `/scratch` y los dispositivos mínimos del sandbox
son escribibles. HOME, temporales y cachés están dentro de ese scratch.

Bubblewrap separa los espacios de nombres de usuarios, procesos, red, IPC y UTS,
elimina capacidades y usa una lista explícita de variables de entorno seguras.
La red contiene únicamente loopback: cada trabajo tiene su propio emulador y
Postgres, inaccesibles desde los otros trabajos. No se exponen carpetas Windows,
el home del anfitrión, credenciales ni sockets de servicios externos.

Systemd aplica CPUQuota=200%, MemoryMax=3 GiB, MemorySwapMax=0, TasksMax=128 y
RuntimeMaxSec=180. El lanzador verifica los límites efectivos de cgroup antes de
ejecutar código. También establece 120 segundos de CPU por proceso, tamaño máximo
de archivo de 128 MiB, 1024 descriptores y volcados desactivados. El lanzador
PowerShell usa un espacio de montajes privado y mata los procesos restantes al
terminar el trabajo. Los resultados temporales se descartan.

Se verificaron la ausencia de rutas externas, el rechazo de conexión con
ENETUNREACH, el funcionamiento de loopback y el rechazo de escritura en las
herramientas y dependencias. Los montajes automáticos e interoperabilidad Windows
están desactivados en `/etc/wsl.conf` de esta distribución.

## Repetir pruebas en este equipo

Desde la raíz del repositorio:

```powershell
powershell -NoProfile -File scratch/security-tooling/test-isolated.ps1 -Suite unit
powershell -NoProfile -File scratch/security-tooling/test-isolated.ps1 -Suite estabilizacion
```

Suites disponibles: `unit`, `types`, `lint`, `sdk`, `portal`, `production`,
`vehiculos`, `privacidad` y `estabilizacion`. El lanzador y su copia de referencia
están en `scratch/security-tooling/`; son configuración local ignorada por Git.

**El lanzador prueba la copia preparada en `/opt/cobrewash/source`, no sincroniza
automáticamente cambios posteriores del repositorio Windows.** Para nuevas
revisiones hay que transferir una lista explícita de archivos de código, excluyendo
archivos de entorno, credenciales, `.git`, directorios de asistentes y cachés.
La transferencia se hizo por entrada estándar de WSL sin montar la unidad Windows.
Las instalaciones con red ocurren solo durante la preparación, nunca dentro del
trabajo de pruebas.

## Resultados de validación

- Vitest: 57 archivos y 302 pruebas aprobadas.
- TypeScript: sin errores, también después de regenerar el SDK en scratch.
- ESLint: sin errores.
- Compilación de conectores y generación del SDK: correctas en el entorno local.
- Integración portal: 13 escenarios aprobados.
- Integración producción: 46 escenarios aprobados.
- Integración vehículos: 5 escenarios aprobados.
- Integración privacidad: 9 escenarios aprobados.
- Estabilización: 12 escenarios aprobados, incluidas reservas concurrentes de fotos
  y bloqueo de inicio de vehículos inactivos.

El SDK regenerado se verificó en la copia descartable; no se copiaron sus archivos
de salida al repositorio Windows. Estas pruebas usan datos ficticios del proyecto
`demo-production`. No prueban la configuración del proxy de producción ni ejecutan
un despliegue.
