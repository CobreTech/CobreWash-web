import { createRequire } from "node:module";
import { Readable } from "node:stream";
import { expect, it } from "vitest";

const local = createRequire(import.meta.url);
const cli = createRequire(local.resolve("firebase-tools/package.json"));

it("Firebase CLI procesa usuarios JSON por fragmentos con los parsers actualizados", async () => {
  const { loadStreamJson } = cli("./lib/streamJson.js");
  const { chain, pick, streamArray } = await loadStreamJson();
  const input = Readable.from(['{"users":[{"local', 'Id":"cliente-1"},{"localId":"cliente-2"}]}']);
  const pipeline = chain([input, pick.withParser({ filter: /^users$/ }), streamArray()]);
  const ids: string[] = [];
  for await (const { value } of pipeline) ids.push(value.localId);
  expect(ids).toEqual(["cliente-1", "cliente-2"]);
});

it("Firebase CLI mantiene la lectura CSV con comillas y separadores dentro de los campos", async () => {
  const { parse } = cli("csv-parse");
  const parser = Readable.from(['uid,nombre,email\ncliente-1,"Cliente, prueba",cliente@example.test\n'])
    .pipe(parse({ columns: true }));
  const rows: unknown[] = [];
  for await (const row of parser) rows.push(row);
  expect(rows).toEqual([{ uid: "cliente-1", nombre: "Cliente, prueba", email: "cliente@example.test" }]);
});

it("Pub/Sub conserva la propagación W3C con OpenTelemetry Core corregido", () => {
  const pubsub = createRequire(cli.resolve("@google-cloud/pubsub"));
  const telemetry = pubsub("./telemetry-tracing.js");
  const { W3CTraceContextPropagator } = pubsub("@opentelemetry/core");
  const api = pubsub("@opentelemetry/api");
  const context = { traceId: "a".repeat(32), spanId: "b".repeat(16), traceFlags: 1 };
  const message: { attributes?: Record<string, string> } = {};
  telemetry.setGloballyEnabled(true);
  try {
    telemetry.injectSpan(api.trace.wrapSpanContext(context), message);
    expect(message.attributes?.googclient_traceparent).toBe(`00-${context.traceId}-${context.spanId}-01`);
    const extracted = new W3CTraceContextPropagator().extract(api.ROOT_CONTEXT, message, telemetry.pubsubGetter);
    expect(api.trace.getSpanContext(extracted)).toMatchObject(context);
  } finally {
    telemetry.setGloballyEnabled(false);
  }
});
