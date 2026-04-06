import React, { useRef } from "react";
import { Upload, X, FileCheck, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFileUpload, formatFileSize, type UseFileUploadOptions } from "@/hooks/useFileUpload";

export interface BaseFileUploadProps {
    /** Allowed file extensions, e.g. [".csv"], [".doc", ".docx"] */
    allowedTypes: string[];
    /** Maximum file size in bytes. Default: 2 MB */
    maxSizeBytes?: number;
    /** Called when a valid file is accepted */
    onFileAccepted: (file: File) => void;
    /** Called when validation fails */
    onError?: (message: string) => void;
    /** Custom icon for the idle state */
    icon?: React.ReactNode;
    /** Prompt title text */
    title?: string;
    /** Subtitle / hint text */
    subtitle?: string;
    /** Additional content below the file info */
    children?: React.ReactNode;
    /** External processing state (e.g. parent is parsing the file) */
    isProcessing?: boolean;
    /** Whether a file has already been loaded (for externally-controlled state) */
    hasFile?: boolean;
    /** External file name override */
    fileName?: string;
    /** External file size override */
    fileSize?: number;
    /** Label shown when file is processed */
    processedLabel?: string;
    /** Called when user clicks the clear/reset button */
    onClear?: () => void;
    /** Additional class name for the drop zone */
    className?: string;
}

const DEFAULT_MAX_SIZE = 2 * 1024 * 1024; // 2 MB

export function BaseFileUpload({
    allowedTypes,
    maxSizeBytes = DEFAULT_MAX_SIZE,
    onFileAccepted,
    onError,
    icon,
    title,
    subtitle,
    children,
    isProcessing: externalProcessing,
    hasFile: externalHasFile,
    fileName: externalFileName,
    fileSize: externalFileSize,
    processedLabel = "File Ready",
    onClear,
    className,
}: BaseFileUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const {
        file,
        isDragging,
        error,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        handleInputChange,
        reset,
    } = useFileUpload({
        allowedTypes,
        maxSizeBytes,
        onFileAccepted,
        onError,
    });

    const isProcessing = externalProcessing ?? false;
    const hasFile = externalHasFile ?? !!file;
    const displayName = externalFileName ?? file?.name;
    const displaySize = externalFileSize ?? file?.size;

    const acceptStr = allowedTypes.join(",");
    const typesLabel = allowedTypes.map(t => t.toUpperCase().replace(".", "")).join(", ");

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        reset();
        onClear?.();
    };

    const handleClick = () => {
        if (!isProcessing) {
            inputRef.current?.click();
        }
    };

    return (
        <div className={cn("space-y-2", className)}>
            <div
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    "relative border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 transition-all cursor-pointer group",
                    isProcessing && "pointer-events-none",
                    isDragging
                        ? "border-[#C7AE6A]/60 bg-[#C7AE6A]/5 scale-[1.01]"
                        : hasFile
                            ? "border-emerald-500/40 bg-emerald-500/5"
                            : "border-[#333] hover:border-[#C7AE6A]/30 bg-transparent",
                    hasFile ? "h-auto min-h-[120px] py-6" : "h-56"
                )}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={acceptStr}
                    onChange={handleInputChange}
                    className="hidden"
                />

                {/* Processing state */}
                {isProcessing && (
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 text-[#C7AE6A] animate-spin" />
                        <span className="text-sm text-gray-400">Processing file...</span>
                    </div>
                )}

                {/* Drag-over state */}
                {!isProcessing && isDragging && (
                    <div className="flex flex-col items-center gap-3">
                        <div className="p-4 bg-[#C7AE6A]/10 rounded-full animate-pulse">
                            <Upload className="w-8 h-8 text-[#C7AE6A]" />
                        </div>
                        <p className="text-sm font-bold text-[#C7AE6A]">Drop to upload</p>
                    </div>
                )}

                {/* File selected state */}
                {!isProcessing && !isDragging && hasFile && (
                    <div className="flex items-center gap-4 px-4 w-full">
                        <div className="p-3 bg-emerald-500/10 rounded-xl shrink-0">
                            <FileCheck className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-emerald-400 mb-0.5">{processedLabel}</p>
                            {displayName && (
                                <p className="text-xs text-gray-400 truncate">{displayName}</p>
                            )}
                            {displaySize !== undefined && (
                                <p className="text-[10px] text-gray-500 mt-0.5">
                                    {formatFileSize(displaySize)} · {typesLabel}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={handleClear}
                            className="p-2 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-colors shrink-0"
                            title="Remove file"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Idle state */}
                {!isProcessing && !isDragging && !hasFile && (
                    <div className="flex flex-col items-center gap-3 text-center px-4">
                        <div className="p-4 bg-[#C7AE6A]/10 rounded-full group-hover:scale-110 transition-transform">
                            {icon ?? <Upload className="w-7 h-7 text-[#C7AE6A]" />}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-200">
                                {title ?? "Click or drag file to upload"}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                {subtitle ?? `${typesLabel} · Max ${formatFileSize(maxSizeBytes)}`}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Error display */}
            {error && (
                <div className="flex items-start gap-2 px-3 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-400">{error}</p>
                </div>
            )}

            {children}
        </div>
    );
}
