import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null;

  // Split by double newline or block sections
  const blocks = content.split(/\r?\n\r?\n/);

  return (
    <div className="space-y-6 text-on-surface font-body-md leading-relaxed">
      {blocks.map((block, idx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Code block check
        if (trimmed.startsWith('```')) {
          const lines = trimmed.split(/\r?\n/);
          const lang = lines[0].replace('```', '').trim();
          const codeText = lines.slice(1, -1).join('\n');
          return (
            <div key={idx} className="my-6 rounded-2xl bg-surface-container-lowest border border-glass-border p-5 overflow-x-auto">
              {lang && <div className="text-[11px] font-terminal-sm text-primary uppercase mb-2 tracking-widest">{lang}</div>}
              <pre className="font-terminal-sm text-sm text-on-surface-variant leading-relaxed font-mono">
                <code>{codeText}</code>
              </pre>
            </div>
          );
        }

        // Horizontal rule
        if (trimmed === '---') {
          return <hr key={idx} className="my-8 border-glass-border" />;
        }

        // H1 Heading
        if (trimmed.startsWith('# ')) {
          return (
            <h1 key={idx} className="font-headline-lg text-3xl md:text-4xl text-on-surface mt-8 mb-4">
              {trimmed.replace('# ', '')}
            </h1>
          );
        }

        // H2 Heading
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={idx} className="font-headline-md text-2xl text-primary mt-8 mb-4 border-b border-glass-border/40 pb-2">
              {trimmed.replace('## ', '')}
            </h2>
          );
        }

        // H3 Heading
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={idx} className="font-headline-md text-xl text-on-surface mt-6 mb-3">
              {trimmed.replace('### ', '')}
            </h3>
          );
        }

        // Blockquote
        if (trimmed.startsWith('> ')) {
          return (
            <blockquote key={idx} className="my-6 p-4 rounded-xl bg-surface-container-high border-l-4 border-primary text-on-surface-variant italic font-body-md">
              {trimmed.replace(/^>\s*/, '')}
            </blockquote>
          );
        }

        // Bullet list
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const items = trimmed.split(/\r?\n/).map((line) => line.replace(/^[-*]\s*/, ''));
          return (
            <ul key={idx} className="list-disc list-inside space-y-2 my-4 pl-2 text-on-surface-variant">
              {items.map((item, itemIdx) => (
                <li key={itemIdx} className="leading-relaxed">
                  {renderInlineFormatting(item)}
                </li>
              ))}
            </ul>
          );
        }

        // Numbered list
        if (/^\d+\.\s/.test(trimmed)) {
          const items = trimmed.split(/\r?\n/).map((line) => line.replace(/^\d+\.\s*/, ''));
          return (
            <ol key={idx} className="list-decimal list-inside space-y-2 my-4 pl-2 text-on-surface-variant">
              {items.map((item, itemIdx) => (
                <li key={itemIdx} className="leading-relaxed">
                  {renderInlineFormatting(item)}
                </li>
              ))}
            </ol>
          );
        }

        // Standard Paragraph
        return (
          <p key={idx} className="text-on-surface-variant text-base md:text-lg leading-relaxed">
            {renderInlineFormatting(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

function renderInlineFormatting(text: string): React.ReactNode {
  // Simple inline parser for **bold**, *italic*, `code`
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="text-on-surface font-semibold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={index} className="italic text-on-surface-variant">{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={index} className="px-1.5 py-0.5 rounded bg-surface-container-high border border-glass-border font-terminal-sm text-xs text-primary font-mono">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
