import { configuracionLegal } from "@/lib/privacidad/configuracion";
export const dynamic = "force-dynamic";
export function GET() {
  const { publicada, version } = configuracionLegal();
  return Response.json({ publicada, version }, { headers: { "Cache-Control": "no-store" } });
}
