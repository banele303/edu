import React from "react";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Helper to parse bold, italic, code, etc. in a text string
  const parseInlineStyles = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let currentText = text;
    let index = 0;

    while (currentText.length > 0) {
      const boldMatch = currentText.match(/\*\*([^*]+)\*\*/);
      const italicMatch = currentText.match(/\*([^*]+)\*/);
      const codeMatch = currentText.match(/`([^`]+)`/);

      // Find the first match
      let firstMatch: { type: "bold" | "italic" | "code"; index: number; length: number; content: string } | null = null;

      if (boldMatch && boldMatch.index !== undefined) {
        firstMatch = { type: "bold", index: boldMatch.index, length: boldMatch[0].length, content: boldMatch[1] };
      }
      if (italicMatch && italicMatch.index !== undefined) {
        if (!firstMatch || italicMatch.index < firstMatch.index) {
          firstMatch = { type: "italic", index: italicMatch.index, length: italicMatch[0].length, content: italicMatch[1] };
        }
      }
      if (codeMatch && codeMatch.index !== undefined) {
        if (!firstMatch || codeMatch.index < firstMatch.index) {
          firstMatch = { type: "code", index: codeMatch.index, length: codeMatch[0].length, content: codeMatch[1] };
        }
      }

      if (!firstMatch) {
        parts.push(<span key={`text-${index}`}>{currentText}</span>);
        break;
      }

      if (firstMatch.index > 0) {
        parts.push(<span key={`text-${index}`}>{currentText.substring(0, firstMatch.index)}</span>);
        index++;
      }

      if (firstMatch.type === "bold") {
        parts.push(<strong key={`bold-${index}`} className="font-extrabold text-foreground">{firstMatch.content}</strong>);
      } else if (firstMatch.type === "italic") {
        parts.push(<em key={`italic-${index}`} className="italic text-muted-foreground">{firstMatch.content}</em>);
      } else if (firstMatch.type === "code") {
        parts.push(
          <code key={`code-${index}`} className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs text-[#3ecf8e]">
            {firstMatch.content}
          </code>
        );
      }
      index++;

      currentText = currentText.substring(firstMatch.index + firstMatch.length);
    }

    return parts.length > 0 ? parts : [text];
  };

  // Group lines into blocks (paragraphs, tables, lists, headers, HRs)
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  let currentList: { type: "ol" | "ul"; items: React.ReactNode[] } | null = null;
  let currentTable: { headers: string[]; rows: string[][] } | null = null;
  let blockIndex = 0;

  const pushList = () => {
    if (currentList) {
      const Tag = currentList.type;
      const listClass = Tag === "ol" ? "list-decimal pl-6 space-y-1.5 my-3" : "list-disc pl-6 space-y-1.5 my-3";
      blocks.push(
        <Tag key={`list-${blockIndex++}`} className={listClass}>
          {currentList.items.map((item, idx) => (
            <li key={idx} className="text-sm text-foreground/90 leading-relaxed">
              {item}
            </li>
          ))}
        </Tag>
      );
      currentList = null;
    }
  };

  const pushTable = () => {
    if (currentTable) {
      blocks.push(
        <div key={`table-${blockIndex++}`} className="my-4 overflow-x-auto rounded-lg border border-border bg-card shadow-sm max-w-full">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-muted/75">
              <tr>
                {currentTable.headers.map((h, idx) => (
                  <th key={idx} className="px-4 py-2 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider border-r last:border-r-0">
                    {parseInlineStyles(h.trim())}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {currentTable.rows.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-muted/30 transition-colors">
                  {row.map((cell, cellIdx) => (
                    <td key={cellIdx} className="px-4 py-2 text-foreground/90 border-r last:border-r-0">
                      {parseInlineStyles(cell.trim())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      currentTable = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. Handle Tables
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      pushList(); // Close open lists
      const cells = trimmed.split("|").slice(1, -1); // skip outer pipes
      
      // If it's a separator line (e.g., |:---|:---| or |---|), ignore it
      if (cells.every(c => c.trim().match(/^:?-+:?$/))) {
        continue;
      }

      if (!currentTable) {
        currentTable = { headers: cells, rows: [] };
      } else {
        currentTable.rows.push(cells);
      }
      continue;
    } else {
      pushTable(); // Close table if we exit table block
    }

    // 2. Handle Horizontal Rules
    if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
      pushList();
      blocks.push(<hr key={`hr-${blockIndex++}`} className="my-4 border-t border-muted-foreground/20" />);
      continue;
    }

    // 3. Handle Headers
    const headerMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headerMatch) {
      pushList();
      const level = headerMatch[1].length;
      const text = headerMatch[2];
      const headerStyles = [
        "text-2xl font-black text-foreground mb-3 mt-4", // h1
        "text-xl font-extrabold text-foreground mb-2 mt-3", // h2
        "text-lg font-bold text-foreground mb-2 mt-2", // h3
        "text-base font-bold text-foreground mb-1.5 mt-2", // h4
        "text-sm font-bold text-foreground mb-1.5", // h5
        "text-xs font-bold text-muted-foreground mb-1", // h6
      ];
      const headerClass = headerStyles[level - 1] || "font-bold";
      const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

      blocks.push(
        React.createElement(
          Tag,
          { key: `header-${blockIndex++}`, className: headerClass },
          parseInlineStyles(text)
        )
      );
      continue;
    }

    // 4. Handle Lists (Ordered & Unordered)
    const ulMatch = trimmed.match(/^[*+-]\s+(.+)$/);
    const olMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);

    if (ulMatch) {
      const itemContent = ulMatch[1];
      if (!currentList || currentList.type !== "ul") {
        pushList();
        currentList = { type: "ul", items: [] };
      }
      currentList.items.push(<>{parseInlineStyles(itemContent)}</>);
      continue;
    } else if (olMatch) {
      const itemContent = olMatch[2];
      if (!currentList || currentList.type !== "ol") {
        pushList();
        currentList = { type: "ol", items: [] };
      }
      currentList.items.push(<>{parseInlineStyles(itemContent)}</>);
      continue;
    } else {
      pushList(); // Close list if we exit list block
    }

    // 5. Paragraph / Blank Lines
    if (trimmed === "") {
      blocks.push(<div key={`blank-${blockIndex++}`} className="h-2" />);
    } else {
      blocks.push(
        <p key={`p-${blockIndex++}`} className="text-sm leading-relaxed text-foreground/95 my-1.5">
          {parseInlineStyles(line)}
        </p>
      );
    }
  }

  // Flush remaining blocks
  pushList();
  pushTable();

  return <div className="space-y-1 select-text">{blocks}</div>;
}
