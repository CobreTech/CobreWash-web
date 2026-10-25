const CODIGOS = new Set(["unavailable", "permission-denied", "unauthenticated", "invalid-argument", "not-found", "failed-precondition", "resource-exhausted", "deadline-exceeded", "network-request-failed"]);
/** No registrar objetos de error: pueden incluir variables GraphQL, correos o credenciales. */
export function registrarError(contexto: string, error: unknown) {
  const codigo = error && typeof error === "object" && "code" in error ? String(error.code).split("/").at(-1) : undefined;
  console.error(contexto, codigo && CODIGOS.has(codigo) ? codigo : "sin-codigo-publico");
}
