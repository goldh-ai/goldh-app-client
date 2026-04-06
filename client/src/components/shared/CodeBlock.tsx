import React from "react";
import { FileCode } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  children: React.ReactNode;
  language?: string;
  className?: string;
  fileName?: string;
}

/**
 * CodeBlock - A premium code viewer for technical documentation.
 * Uses high-contrast backgrounds and consistent font scaling.
 */
export function CodeBlock({
  children,
  language = "typescript",
  className,
  fileName,
}: CodeBlockProps) {
  return (
    <div className={cn("relative group my-4", className)}>
      <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
        {fileName && (
          <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest bg-black/50 px-2 py-0.5 rounded border border-white/5">
            {fileName}
          </span>
        )}
        <FileCode className="w-4 h-4 text-[#C7AE6A]/40" />
      </div>
      <pre className="bg-[#080808] border border-[#1a1a1a] rounded-xl px-5 py-4 overflow-x-auto custom-scrollbar shadow-2xl">
        <code className="text-[12px] font-mono text-gray-300 leading-relaxed block">
          {children}
        </code>
      </pre>
    </div>
  );
}

/**
 * FilePath - A clean indicator for file system paths.
 */
export function FilePath({ path, className }: { path: string; className?: string }) {
  return (
    <div className={cn(
      "bg-[#0a0a0a] border-l-2 border-[#C7AE6A]/50 text-[#C7AE6A] text-[11px] font-mono rounded-r-lg px-4 py-2.5 my-3 flex items-center gap-3 shadow-lg",
      className
    )}>
      <span className="opacity-40 select-none">📂</span>
      {path}
    </div>
  );
}
