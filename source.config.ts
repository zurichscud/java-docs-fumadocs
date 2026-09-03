import { defineConfig } from 'fumadocs-mdx/config';
import { remarkMdxMermaid } from 'fumadocs-core/mdx-plugins';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { remarkAccordions } from './lib/remark-accordions';

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkAccordions, remarkMath, remarkMdxMermaid],
    rehypePlugins: [rehypeKatex],
  },
});
