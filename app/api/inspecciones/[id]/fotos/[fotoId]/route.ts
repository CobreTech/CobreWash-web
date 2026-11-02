import { autorizarInspeccion, ErrorEvidencia, hashFoto, leerFoto, respuestaErrorEvidencia, rutaFoto, UUID_FOTO } from "@/lib/vehiculos/evidencias-servidor";

export const runtime = "nodejs";
type Context = { params: Promise<{ id: string; fotoId: string }> };

export async function PUT(request: Request, context: Context) {
  try {
    const { id, fotoId } = await context.params;
    if (!UUID_FOTO.test(fotoId)) throw new ErrorEvidencia(400, "Identificador de fotografía inválido.");
    const url = new URL(request.url);
    const orden = Number(url.searchParams.get("orden"));
    const descripcion = url.searchParams.get("descripcion")?.trim() || null;
    if (!Number.isInteger(orden) || orden < 1 || orden > 20 || (descripcion?.length ?? 0) > 200)
      throw new ErrorEvidencia(400, "Datos de fotografía inválidos.");
    const admin = await autorizarInspeccion(request, id);
    const bytes = await leerFoto(request);
    // Decodificar y re-encodear elimina metadatos y rechaza JPEG corruptos.
    const sharp = (await import("sharp")).default;
    const imagen = await sharp(bytes, { limitInputPixels: 40_000_000 }).rotate().resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true }).jpeg({ quality: 85 }).toBuffer()
      .catch(() => { throw new ErrorEvidencia(400, "No se pudo leer la imagen JPEG."); });
    const path = rutaFoto(id, fotoId);
    const file = admin.bucket.file(path);
    const hash = hashFoto(imagen);
    const registro = { id: fotoId, inspeccionId: id, rutaStorage: path, descripcion, orden };
    // El contador se serializa por inspección e incluye reservas pendientes.
    // Una solicitud sin cupo nunca llega a escribir en el bucket.
    try { await admin.db.executeMutation("RegistrarEvidenciaGuardada", { ...registro, confirmar: false }); }
    catch (error) {
      if (String(error).includes("LIMITE_FOTOS")) throw new ErrorEvidencia(409, "La inspección ya tiene 20 fotografías o cargas pendientes. Reintenta con el mismo archivo si una carga no terminó.");
      if (String(error).includes("El identificador de evidencia ya está en uso")) throw new ErrorEvidencia(409, "Ese identificador ya corresponde a otra fotografía.");
      throw error;
    }
    // El ID es estable al reintentar. No se sobrescribe una foto distinta.
    try { await file.save(imagen, { resumable: false, contentType: "image/jpeg", preconditionOpts: { ifGenerationMatch: 0 }, metadata: { metadata: { sha256: hash } } }); }
    catch (error) {
      if ((error as { code?: number }).code !== 412) throw error;
      const [metadata] = await file.getMetadata();
      if (metadata.metadata?.sha256 !== hash) throw new ErrorEvidencia(409, "Ese identificador ya corresponde a otra fotografía.");
    }
    // La reserva solo se publica en las consultas de flota después de guardar el archivo.
    await admin.db.executeMutation("RegistrarEvidenciaGuardada", { ...registro, confirmar: true });
    return Response.json({ rutaStorage: path }, { status: 200 });
  } catch (error) { return respuestaErrorEvidencia(error); }
}

export async function GET(request: Request, context: Context) {
  try {
    const { id, fotoId } = await context.params;
    if (!UUID_FOTO.test(fotoId)) throw new ErrorEvidencia(400, "Fotografía inválida.");
    const admin = await autorizarInspeccion(request, id);
    const file = admin.bucket.file(rutaFoto(id, fotoId));
    const [exists] = await file.exists();
    if (!exists) throw new ErrorEvidencia(404, "No se encontró el archivo de evidencia.");
    const [bytes] = await file.download();
    return new Response(new Uint8Array(bytes), { headers: { "Content-Type": "image/jpeg", "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
  } catch (error) { return respuestaErrorEvidencia(error); }
}
