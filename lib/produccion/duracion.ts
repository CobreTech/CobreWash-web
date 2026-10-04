/** Presentación de tiempos; la detección y los límites siguen en minutos. */
export function formatearDuracion(minutos: number) {
  const total = Math.max(0, Math.ceil(minutos));
  const horas = Math.floor(total / 60);
  const resto = total % 60;
  const textoMinutos = `${resto} ${resto === 1 ? "minuto" : "minutos"}`;
  if (!horas) return textoMinutos;
  const textoHoras = `${horas} ${horas === 1 ? "hora" : "horas"}`;
  return resto ? `${textoHoras} y ${textoMinutos}` : textoHoras;
}
