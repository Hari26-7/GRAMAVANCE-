import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface MarkdownRendererProps {
  text: string;
  className?: string;
}

interface CodeBlockProps {
  code: string;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-2 rounded-xl overflow-hidden border border-slate-700/60 bg-slate-900 shadow-md">
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800/80 border-b border-slate-700/60 text-xs text-slate-300">
        <span className="font-mono text-[11px] uppercase tracking-wider">{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white transition-colors cursor-pointer px-1.5 py-0.5 rounded hover:bg-slate-700"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3 text-xs font-mono text-slate-100 overflow-x-auto leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default function MarkdownRenderer({ text, className = '' }: MarkdownRendererProps) {
  const lines = text.split('\n');

  const renderInline = (line: string): React.ReactNode => {
    // 1. Process inline code `code`
    const codeParts = line.split(/(`[^`]+`)/g);

    return codeParts.map((part, pIdx) => {
      if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
        return (
          <code
            key={pIdx}
            className="px-1.5 py-0.5 mx-0.5 rounded text-xs font-mono bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700"
          >
            {part.slice(1, -1)}
          </code>
        );
      }

      // 2. Process bold **bold**
      const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
      return boldParts.map((bPart, bIdx) => {
        if (bPart.startsWith('**') && bPart.endsWith('**') && bPart.length > 4) {
          return (
            <strong key={`${pIdx}-${bIdx}`} className="font-bold text-slate-900 dark:text-white">
              {bPart.slice(2, -2)}
            </strong>
          );
        }

        // 3. Process italic *italic*
        const italicParts = bPart.split(/(\*[^*]+\*)/g);
        return italicParts.map((iPart, iIdx) => {
          if (iPart.startsWith('*') && iPart.endsWith('*') && iPart.length > 2) {
            return (
              <em key={`${pIdx}-${bIdx}-${iIdx}`} className="italic">
                {iPart.slice(1, -1)}
              </em>
            );
          }
          return <React.Fragment key={`${pIdx}-${bIdx}-${iIdx}`}>{iPart}</React.Fragment>;
        });
      });
    });
  };

  const elements: React.ReactNode[] = [];
  let bulletBuffer: string[] = [];
  let numberedBuffer: string[] = [];
  let inCodeBlock = false;
  let codeBlockBuffer: string[] = [];
  let codeBlockLang = '';

  const flushBullets = (key: string) => {
    if (bulletBuffer.length > 0) {
      elements.push(
        <ul key={key} className="list-disc list-outside space-y-1.5 my-2 ml-5">
          {bulletBuffer.map((item, i) => (
            <li key={i} className="text-slate-800 dark:text-slate-200 leading-relaxed text-sm">
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
      bulletBuffer = [];
    }
  };

  const flushNumbered = (key: string) => {
    if (numberedBuffer.length > 0) {
      elements.push(
        <ol key={key} className="list-decimal list-outside space-y-1.5 my-2 ml-5">
          {numberedBuffer.map((item, i) => (
            <li key={i} className="text-slate-800 dark:text-slate-200 leading-relaxed text-sm">
              {renderInline(item)}
            </li>
          ))}
        </ol>
      );
      numberedBuffer = [];
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trimEnd();

    // Check code blocks ```
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        // End of code block
        elements.push(
          <CodeBlock
            key={`code-${idx}`}
            code={codeBlockBuffer.join('\n')}
            language={codeBlockLang}
          />
        );
        codeBlockBuffer = [];
        codeBlockLang = '';
        inCodeBlock = false;
      } else {
        // Start of code block
        flushBullets(`ul-${idx}`);
        flushNumbered(`ol-${idx}`);
        inCodeBlock = true;
        codeBlockLang = trimmed.slice(3).trim();
      }
      return;
    }

    if (inCodeBlock) {
      codeBlockBuffer.push(line);
      return;
    }

    // Bullet list item: "* text" or "- text"
    if (/^[*-] /.test(trimmed)) {
      flushNumbered(`ol-${idx}`);
      bulletBuffer.push(trimmed.slice(2));
      return;
    }

    // Numbered list item: "1. text"
    if (/^\d+\. /.test(trimmed)) {
      flushBullets(`ul-${idx}`);
      const match = trimmed.match(/^\d+\. /);
      const content = match ? trimmed.slice(match[0].length) : trimmed;
      numberedBuffer.push(content);
      return;
    }

    // Flush pending lists before non-list line
    flushBullets(`ul-${idx}`);
    flushNumbered(`ol-${idx}`);

    // Headings
    if (/^# /.test(trimmed)) {
      elements.push(
        <h2
          key={idx}
          className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-3.5 mb-1.5 tracking-tight flex items-center gap-1.5 border-b border-slate-200/60 dark:border-slate-800 pb-1"
        >
          {renderInline(trimmed.slice(2))}
        </h2>
      );
      return;
    }

    if (/^## /.test(trimmed)) {
      elements.push(
        <h3
          key={idx}
          className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mt-2.5 mb-1 tracking-tight"
        >
          {renderInline(trimmed.slice(3))}
        </h3>
      );
      return;
    }

    if (/^### /.test(trimmed)) {
      elements.push(
        <h4
          key={idx}
          className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mt-2 mb-0.5 uppercase tracking-wide"
        >
          {renderInline(trimmed.slice(4))}
        </h4>
      );
      return;
    }

    // Blockquote: "> text"
    if (/^> /.test(trimmed)) {
      elements.push(
        <blockquote
          key={idx}
          className="border-l-3 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 px-3 py-1.5 my-2 rounded-r-lg text-sm text-slate-700 dark:text-slate-300 italic"
        >
          {renderInline(trimmed.slice(2))}
        </blockquote>
      );
      return;
    }

    // Empty line spacer
    if (trimmed === '') {
      elements.push(<div key={idx} className="h-1.5" />);
      return;
    }

    // Regular paragraph
    elements.push(
      <p key={idx} className="text-slate-800 dark:text-slate-200 leading-relaxed text-sm">
        {renderInline(trimmed)}
      </p>
    );
  });

  // Flush any remaining
  flushBullets('ul-end');
  flushNumbered('ol-end');
  if (inCodeBlock && codeBlockBuffer.length > 0) {
    elements.push(
      <CodeBlock key="code-end" code={codeBlockBuffer.join('\n')} language={codeBlockLang} />
    );
  }

  return <div className={`space-y-1.5 ${className}`}>{elements}</div>;
}
