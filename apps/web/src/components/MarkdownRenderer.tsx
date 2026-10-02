import React, { useMemo } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content, 
  className = '' 
}) => {
  const html = useMemo(() => {
    if (!content) return '';

    // Lightweight TeX/Math inline symbol beautifier for AI concepts
    // Replaces formulas like \cos(\theta) or \|v\| with clean Unicode math symbols
    const formattedContent = content
      .replace(/\\cos\(\\theta\)/g, 'cos(θ)')
      .replace(/\\theta/g, 'θ')
      .replace(/\\approx/g, '≈')
      .replace(/\\cdot/g, '·')
      .replace(/\\times/g, '×')
      .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1 / $2)');

    // Parse with marked (synchronous)
    const rawHtml = marked.parse(formattedContent, {
      gfm: true,
      breaks: true
    }) as string;

    // Hardened XSS Protection: Cleanse parsed HTML through DOMPurify
    return DOMPurify.sanitize(rawHtml, {
      USE_PROFILES: { html: true },
      ADD_ATTR: ['target', 'rel']
    });
  }, [content]);

  return (
    <div 
      className={`markdown-theory prose prose-sm max-w-none text-[var(--color-text-secondary)] font-sans leading-relaxed
        [&>p]:mb-2.5 [&>p:last-child]:mb-0
        [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-2.5 [&>ul>li]:mb-1
        [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-2.5 [&>ol>li]:mb-1
        [&_strong]:text-[var(--color-text-primary)] [&_strong]:font-semibold
        [&_code]:text-[var(--color-accent)] [&_code]:bg-[var(--color-primary)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:border [&_code]:border-[var(--color-border)] [&_code]:font-mono [&_code]:text-[11px]
        [&_pre]:bg-[var(--color-primary)] [&_pre]:p-3 [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-[var(--color-border)] [&_pre]:overflow-x-auto
        [&_pre>code]:bg-transparent [&_pre>code]:p-0 [&_pre>code]:border-0
        [&_blockquote]:border-l-2 [&_blockquote]:border-[var(--color-accent)] [&_blockquote]:pl-3 [&_blockquote]:italic
        ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
