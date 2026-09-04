import { getLLMText, source } from "@/lib/source";

export const revalidate = false;
//直接返回全部文档，不经过 proxy.ts

export async function GET() {
  const scan = source.getPages().map(getLLMText);
  const scanned = await Promise.all(scan);

  return new Response(scanned.join("\n\n"));
}
