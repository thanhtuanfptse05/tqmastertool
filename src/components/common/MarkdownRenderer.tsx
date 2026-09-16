"use client";

import React, { useMemo } from "react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Lightweight inline Markdown → HTML renderer (no external deps)
 * Handles: ## headings, **bold**, `code`, ```code blocks```, bullet lists, horizontal rules
 */
export function renderMarkdown(md: string): string {
  const lines = md.split("\n");
  const htmlLines: string[] = [];
  let inCodeBlock = false;
  let codeLang = "";
  let codeBuffer: string[] = [];
  let inList = false;

  const flushList = () => {
    if (inList) {
      htmlLines.push("</ul>");
      inList = false;
    }
  };

  const escapedHtml = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const inlineFormat = (s: string) =>
    s
      // **bold**
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      // `code`
      .replace(/`([^`]+)`/g, "<code class=\"inline-code\">$1</code>")
      // _italic_ or *italic*
      .replace(/[_*](.+?)[_*]/g, "<em>$1</em>");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // ── Code blocks ──────────────────────────────────────────
    if (line.startsWith("```")) {
      if (!inCodeBlock) {
        flushList();
        inCodeBlock = true;
        codeLang = line.slice(3).trim() || "java";
        codeBuffer = [];
      } else {
        inCodeBlock = false;
        const code = escapedHtml(codeBuffer.join("\n"));
        htmlLines.push(
          `<div class="code-block-wrapper"><div class="code-lang-badge">${codeLang}</div><pre class="code-block"><code>${code}</code></pre></div>`
        );
        codeBuffer = [];
      }
      continue;
    }
    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // ── Headings ─────────────────────────────────────────────
    const h2 = line.match(/^## (.+)/);
    if (h2) {
      flushList();
      htmlLines.push(`<h2 class="md-h2">${inlineFormat(h2[1])}</h2>`);
      continue;
    }
    const h1 = line.match(/^# (.+)/);
    if (h1) {
      flushList();
      htmlLines.push(`<h1 class="md-h1">${inlineFormat(h1[1])}</h1>`);
      continue;
    }
    const h3 = line.match(/^### (.+)/);
    if (h3) {
      flushList();
      htmlLines.push(`<h3 class="md-h3">${inlineFormat(h3[1])}</h3>`);
      continue;
    }

    // ── Horizontal rule ───────────────────────────────────────
    if (/^---+$/.test(line.trim())) {
      flushList();
      htmlLines.push('<hr class="md-hr" />');
      continue;
    }

    // ── List items ────────────────────────────────────────────
    const listMatch = line.match(/^(\s*)[-*] (.+)/);
    if (listMatch) {
      const indent = listMatch[1].length;
      const text = inlineFormat(listMatch[2]);
      if (!inList) {
        htmlLines.push('<ul class="md-list">');
        inList = true;
      }
      const indentCls = indent >= 2 ? " md-list-sub" : "";
      htmlLines.push(`<li class="md-list-item${indentCls}">${text}</li>`);
      continue;
    }

    // ── Blank line ────────────────────────────────────────────
    if (line.trim() === "") {
      flushList();
      htmlLines.push('<div class="md-spacer"></div>');
      continue;
    }

    // ── Paragraph ─────────────────────────────────────────────
    flushList();
    htmlLines.push(`<p class="md-p">${inlineFormat(line)}</p>`);
  }

  flushList();
  return htmlLines.join("\n");
}

export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  const html = useMemo(() => renderMarkdown(content), [content]);
  return (
    <div
      className={`markdown-body ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
