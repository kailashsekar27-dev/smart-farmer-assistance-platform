import React from 'react';

interface MarkdownRendererProps {
  content: string;
  isUser?: boolean;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, isUser }) => {
  if (isUser) {
    return <span>{content}</span>;
  }

  const lines = content.split('\n');

  return (
    <div className="space-y-1.5 leading-relaxed text-slate-800">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="font-bold text-slate-900 text-sm mt-2 mb-1 flex items-center gap-1.5">
              {formatInline(trimmed.replace('### ', ''))}
            </h4>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={idx} className="font-bold text-emerald-950 text-base mt-2.5 mb-1 flex items-center gap-1.5">
              {formatInline(trimmed.replace('## ', ''))}
            </h3>
          );
        }

        if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const bulletText = trimmed.replace(/^[•\-\*]\s+/, '');
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 py-0.5">
              <span className="text-emerald-600 font-bold text-sm leading-tight">•</span>
              <span className="flex-1 text-slate-800 text-xs sm:text-sm">
                {formatInline(bulletText)}
              </span>
            </div>
          );
        }

        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 py-0.5">
              <span className="bg-emerald-100 text-emerald-800 rounded px-1 text-[11px] font-bold shrink-0">
                {numMatch[1]}
              </span>
              <span className="flex-1 text-slate-800 text-xs sm:text-sm">
                {formatInline(numMatch[2])}
              </span>
            </div>
          );
        }

        if (trimmed.startsWith('*') && trimmed.endsWith('*') && !trimmed.slice(1, -1).includes('*')) {
          return (
            <p key={idx} className="text-xs text-slate-600 italic bg-amber-50/80 border-l-2 border-amber-400 px-2 py-1 rounded-r my-1.5">
              {formatInline(trimmed.slice(1, -1))}
            </p>
          );
        }

        return (
          <p key={idx} className="text-xs sm:text-sm">
            {formatInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

function formatInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const tokenRegex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  const splitTokens = text.split(tokenRegex);

  splitTokens.forEach((token, index) => {
    if (token.startsWith('**') && token.endsWith('**') && token.length > 4) {
      parts.push(
        <strong key={index} className="font-bold text-slate-900">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*') && token.length > 2) {
      parts.push(
        <em key={index} className="italic text-slate-700">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith('`') && token.endsWith('`') && token.length > 2) {
      parts.push(
        <code key={index} className="bg-slate-100 text-emerald-800 font-mono text-[11px] px-1.5 py-0.5 rounded border border-slate-200">
          {token.slice(1, -1)}
        </code>
      );
    } else if (token) {
      parts.push(token);
    }
  });

  return parts;
}
