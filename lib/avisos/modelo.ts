export const TITULO_MAXIMO = 120;
export const CONTENIDO_MAXIMO = 1000;

export type Destinatario = "todos" | "operario" | "recepcionista";
export interface FormularioAviso {
  titulo: string;
  contenido: string;
  destinatario: string;
}

export const FORMULARIO_VACIO: FormularioAviso = {
  titulo: "", contenido: "", destinatario: "todos",
};

export function validarAviso(form: FormularioAviso) {
  const titulo = form.titulo.trim();
  const contenido = form.contenido.trim();
  if (!titulo || titulo.length > TITULO_MAXIMO) {
    throw new Error(`Escribe un título de hasta ${TITULO_MAXIMO} caracteres.`);
  }
  if (!contenido || contenido.length > CONTENIDO_MAXIMO) {
    throw new Error(`Escribe un contenido de hasta ${CONTENIDO_MAXIMO} caracteres.`);
  }
  if (!["todos", "operario", "recepcionista"].includes(form.destinatario)) {
    throw new Error("Selecciona un destinatario válido.");
  }
  return { titulo, contenido, destinatario: form.destinatario as Destinatario };
}

export function etiquetaDestinatario(rol: string | null | undefined) {
  if (!rol) return "Todos";
  if (rol === "operario") return "Operarios";
  if (rol === "recepcionista") return "Recepción";
  return rol;
}

export function fechaAviso(fecha: string) {
  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "short", timeStyle: "short", timeZone: "America/Santiago",
  }).format(new Date(fecha));
}
