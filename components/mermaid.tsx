'use client';

import { useRef, useEffect, useState, useId } from 'react';
import mermaid from 'mermaid';

// Initialize mermaid once
let initialized = false;
function initMermaid() {
  if (initialized) return;
  initialized = true;
  mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    securityLevel: 'loose',
  });
}

export function Mermaid({ chart }: { chart: string }) {
  const id = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initMermaid();
    const mermaidId = `mermaid-${id.replace(/[^a-zA-Z0-9]/g, '')}`;
    mermaid
      .render(mermaidId, chart)
      .then(({ svg: renderedSvg }) => {
        setSvg(renderedSvg);
        setError(null);
      })
      .catch((err) => {
        // On re-render (e.g. hot reload), diagram might already exist; retry once
        if (err instanceof Error && err.message.includes('already exists')) {
          const existing = document.getElementById(mermaidId);
          if (existing) existing.remove();
          return mermaid.render(mermaidId, chart);
        }
        throw err;
      })
      .then((result) => {
        if (result) setSvg(result.svg);
      })
      .catch((err) => {
        console.error('Mermaid render error:', err);
        setError(err instanceof Error ? err.message : 'Failed to render diagram');
      });
  }, [chart, id]);

  if (error) {
    return (
      <pre className="border border-red-300 bg-red-50 dark:bg-red-950 p-4 rounded text-sm text-red-700 dark:text-red-300 overflow-auto">
        {error}
      </pre>
    );
  }

  return (
    <div
      ref={containerRef}
      className="my-6 overflow-x-auto"
      dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
    />
  );
}
