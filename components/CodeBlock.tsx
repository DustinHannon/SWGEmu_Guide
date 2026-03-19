"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  command: string;
  label?: string;
  language?: string;
}

export default function CodeBlock({ command, label, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-1">
      {label && (
        <p className="text-sm text-text-secondary font-jetbrains">{label}</p>
      )}
      <div className="relative bg-code-bg rounded-lg code-glow-border scanline-overlay overflow-hidden">
        {language && (
          <span className="absolute top-2 left-4 text-[10px] font-orbitron text-text-muted uppercase tracking-widest">
            {language}
          </span>
        )}
        <button
          onClick={handleCopy}
          className={cn(
            "glass-button absolute top-2 right-2 p-1.5 rounded text-xs transition-colors",
            copied ? "text-success" : "text-text-muted hover:text-primary"
          )}
          aria-label="Copy to clipboard"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
        <div className={cn("overflow-x-auto scrollbar-glass", language ? "pt-8" : "pt-4")}>
          <pre className="p-4 pt-0">
            <code className="font-jetbrains text-sm text-text-primary whitespace-pre">
              {command}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}
