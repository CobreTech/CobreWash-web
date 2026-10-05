const zona = "America/Santiago";
const formato = new Intl.DateTimeFormat("en-CA", {
  timeZone: zona,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function fechaChile(value: string | Date = new Date()) {
  const partes = formato.formatToParts(new Date(value));
  return ["year", "month", "day"]
    .map((tipo) => partes.find((p) => p.type === tipo)!.value)
    .join("-");
}

function validarFecha(fecha: string) {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(fecha) &&
    Number.isFinite(Date.parse(fecha)) &&
    new Date(fecha).toISOString().slice(0, 10) === fecha
  );
}

export function errorRango(desde: string, hasta: string) {
  if (!validarFecha(desde) || !validarFecha(hasta))
    return "Selecciona ambas fechas válidas.";
  if (desde > hasta)
    return "La fecha inicial debe ser anterior o igual a la final.";
  if (Date.parse(hasta) - Date.parse(desde) > 366 * 5 * 86400000)
    return "Selecciona un periodo de hasta cinco años.";
  return "";
}

export function sumarDias(fecha: string, dias: number) {
  return new Date(Date.parse(fecha) + dias * 86400000)
    .toISOString()
    .slice(0, 10);
}

// Primer instante del día chileno: incluye el salto de medianoche del horario
// de verano, sin asumir un offset fijo ni la zona del equipo del usuario.
function inicioDia(fecha: string) {
  let inferior = Date.parse(fecha) - 86400000;
  let superior = Date.parse(fecha) + 86400000;
  while (inferior < superior) {
    const medio = Math.floor((inferior + superior) / 2);
    if (fechaChile(new Date(medio)) < fecha) inferior = medio + 1;
    else superior = medio;
  }
  return new Date(inferior).toISOString();
}

export function rangoConsulta(desde: string, hasta: string) {
  const error = errorRango(desde, hasta);
  if (error) throw new Error(error);
  return { desde: inicioDia(desde), hasta: inicioDia(sumarDias(hasta, 1)) };
}

export function periodoInicial() {
  const hasta = fechaChile();
  return { desde: hasta.slice(0, 7) + "-01", hasta };
}
