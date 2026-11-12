import React from 'react';

interface MarkdownRendererProps {
  text: string;
  className?: string;
}

/**
 * Simple markdown renderer for Gemini AI responses.
 * Handles: bold (**text**), headings (#, ##), bullet lists (* or -), paragraphs.
 * No external dependencies — pure React with string processing.
 */
export default function MarkdownRenderer({ text, className = '' }: MarkdownRendererProps) {
  const lines = text.split('\n');

  const renderInline = (line: string): React.ReactNode => {
    // Replace **bold** spans within a line
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx}>{part.slice(2, -2)}</strong>;
      }
      return <React.Fragment key={idx}>{part}</React.Fragment>;
    });
  };

  const elements: React.ReactNode[] = [];
  let bulletBuffer: string[] = [];

  const flushBullets = (key: string) => {
    if (bulletBuffer.length > 0) {
      elements.push(
        <ul key={key} className="list-disc list-inside space-y-1 my-1 pl-2">
          {bulletBuffer.map((item, i) => (
            <li key={i} className="text-slate-800">
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
      bulletBuffer = [];
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trimEnd();

    // Bullet list item: "* text" or "- text"
    if (/^[*-] /.test(trimmed)) {
      bulletBuffer.push(trimmed.slice(2));
      return;
    }

    // Flush pending bullets before any non-bullet line
    flushBullets(`ul-${idx}`);

    // h2 heading: "# text"
    if (/^# /.test(trimmed)) {
      elements.push(
        <h2 key={idx} className="text-base font-bold text-slate-900 mt-3 mb-1">
          {renderInline(trimmed.slice(2))}
        </h2>
      );
      return;
    }

    // h3 heading: "## text"
    if (/^## /.test(trimmed)) {
      elements.push(
        <h3 key={idx} className="text-sm font-semibold text-slate-800 mt-2 mb-0.5">
          {renderInline(trimmed.slice(3))}
        </h3>
      );
      return;
    }

    // Empty line — small spacer
    if (trimmed === '') {
      elements.push(<div key={idx} className="h-1" />);
      return;
    }

    // Regular paragraph
    elements.push(
      <p key={idx} className="text-slate-800 leading-relaxed">
        {renderInline(trimmed)}
      </p>
    );
  });

  // Flush any remaining bullets
  flushBullets('ul-end');

  return <div className={`space-y-1 ${className}`}>{elements}</div>;
}
