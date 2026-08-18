import { defineConfig } from 'fumadocs-mdx/config';
import { remarkMdxMermaid } from 'fumadocs-core/mdx-plugins';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { remarkCallback } from './lib/remark-callback';

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkMath, remarkCallback, remarkMdxMermaid],
    rehypePlugins: [rehypeKatex],
  },
});
