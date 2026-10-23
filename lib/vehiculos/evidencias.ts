import { auth } from "@/lib/firebase/client";

export async function cabeceraEvidencia() {
  const user = auth.currentUser;
  if (!user) throw new Error("Inicia sesión para acceder a la evidencia.");
  return { Authorization: `Bearer ${await user.getIdToken()}` };
}

export function endpointEvidencia(ruta: string) {
  const match = ruta.match(/^vehiculos\/inspecciones\/([\da-f-]{36})\/([\da-f-]{36})\.jpg$/i);
  return match ? `/api/inspecciones/${match[1]}/fotos/${match[2]}` : null;
}

export async function prepararJpeg(file: File) {
  if (file.size > 10 * 1024 * 1024) throw new Error("La fotografía supera los 10 MB. Selecciona una imagen más pequeña.");
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale)); canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("No se pudo preparar la fotografía.")), "image/jpeg", 0.85));
    if (blob.size > 3 * 1024 * 1024) throw new Error("La fotografía procesada supera los 3 MB.");
    return blob;
  } finally { bitmap.close(); }
}

export async function subirEvidencia(inspeccionId: string, foto: { id: string; archivo?: File; descripcion?: string }, orden: number) {
  if (!foto.archivo) throw new Error("Falta el archivo original. Vuelve a seleccionar la fotografía.");
  const body = await prepararJpeg(foto.archivo);
  const params = new URLSearchParams({ orden: String(orden), descripcion: foto.descripcion ?? "" });
  const response = await fetch(`/api/inspecciones/${inspeccionId}/fotos/${foto.id}?${params}`, {
    method: "PUT", headers: { ...await cabeceraEvidencia(), "Content-Type": "image/jpeg" }, body,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? "No se pudo guardar la fotografía.");
  return data.rutaStorage as string;
}
