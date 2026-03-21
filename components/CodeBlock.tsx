"use client";

import { useState } from "react";

interface CodeBlockProps {
  command: string;
  label?: string;
  language?: string;
}

const LANG_CONFIG: Record<string, { dot: string; badgeClass: string; prompt?: string }> = {
  bash: { dot: "#7ee787", badgeClass: "lang-badge-bash", prompt: "$ " },
  sql: { dot: "#a78bfa", badgeClass: "lang-badge-sql", prompt: "mysql> " },
  lua: { dot: "#fbbf24", badgeClass: "lang-badge-lua" },
  ini: { dot: "#00e5ff", badgeClass: "lang-badge-default" },
  powershell: { dot: "#00e5ff", badgeClass: "lang-badge-default", prompt: "PS> " },
};

export default function CodeBlock({ command, label, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lang = language?.toLowerCase() || "default";
  const config = LANG_CONFIG[lang] || { dot: "#00e5ff", badgeClass: "lang-badge-default" };
  const langClass = `lang-${lang in LANG_CONFIG ? lang : "default"}`;

  return (
    <div className={`terminal-card ${langClass}`}>
      <div className="terminal-card-header">
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ backgroundColor: config.dot }}
          />
          <span className="text-text-secondary truncate">
            {label || "Command"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {language && (
            <span className={`lang-badge ${config.badgeClass}`}>
              {language}
            </span>
          )}
          <button
            onClick={handleCopy}
            className="text-secondary hover:text-primary transition-colors cursor-pointer text-xs whitespace-nowrap"
          >
            {copied ? "Copied ✓" : "Copy ⧉"}
          </button>
        </div>
      </div>
      <div className="terminal-card-body scrollbar-glass">
        <pre className="whitespace-pre-wrap break-all">
          {config.prompt && (
            <span style={{ color: config.dot }}>{config.prompt}</span>
          )}
          {command}
        </pre>
      </div>
    </div>
  );
}
