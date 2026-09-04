import { source } from "@/lib/source";
import { llms } from "fumadocs-core/source";

export const revalidate = false;
//直接返回文档索引，不经过 proxy.ts
export function GET() {
  return new Response(llms(source).index());
}
