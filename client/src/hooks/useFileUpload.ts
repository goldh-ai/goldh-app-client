import { useState, useCallback, useRef } from "react";

export interface UseFileUploadOptions {
    /** Allowed file extensions, e.g. [".csv"], [".doc", ".docx"] */
    allowedTypes: string[];
    /** Maximum file size in bytes. Default: 2MB */
    maxSizeBytes?: number;
    /** Called when a valid file is accepted */
    onFileAccepted?: (file: File) => void;
    /** Called when validation fails */
    onError?: (message: string) => void;
}

export interface UseFileUploadReturn {
    file: File | null;
    isDragging: boolean;
    isProcessing: boolean;
    error: string | null;
    /** Bind to drop zone's onDragOver */
    handleDragOver: (e: React.DragEvent) => void;
    /** Bind to drop zone's onDragLeave */
    handleDragLeave: (e: React.DragEvent) => void;
    /** Bind to drop zone's onDrop */
    handleDrop: (e: React.DragEvent) => void;
    /** Called from <input type="file"> onChange */
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    /** Manually set the processing state */
    setIsProcessing: (v: boolean) => void;
    /** Reset all state */
    reset: () => void;
    /** Abort any in-flight operation */
    abort: () => void;
    /** Ref to the AbortController, useful for passing to fetch calls */
    abortControllerRef: React.MutableRefObject<AbortController | null>;
}

const DEFAULT_MAX_SIZE = 2 * 1024 * 1024; // 2 MB

/** Format bytes into human-readable string */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

/** Sanitize a filename: strip path separators and non-safe characters */
export function sanitizeFileName(name: string): string {
    return name
        .replace(/[/\\]/g, "_")                  // path separators
        .replace(/[^a-zA-Z0-9._\-\s]/g, "")      // non-alphanumeric (keep dots, dashes, underscores, spaces)
        .replace(/\s+/g, "_")                     // whitespace → underscore
        .replace(/_{2,}/g, "_")                   // collapse multiple underscores
        .trim();
}

export function useFileUpload(options: UseFileUploadOptions): UseFileUploadReturn {
    const { allowedTypes, maxSizeBytes = DEFAULT_MAX_SIZE, onFileAccepted, onError } = options;

    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const dragCounterRef = useRef(0);

    const validateFile = useCallback((f: File): string | null => {
        // Check extension
        const ext = "." + f.name.split(".").pop()?.toLowerCase();
        if (!allowedTypes.some(t => t.toLowerCase() === ext)) {
            return `Invalid file type. Accepted: ${allowedTypes.join(", ")}`;
        }
        // Check size
        if (f.size > maxSizeBytes) {
            return `File is too large (${formatFileSize(f.size)}). Maximum: ${formatFileSize(maxSizeBytes)}`;
        }
        return null;
    }, [allowedTypes, maxSizeBytes]);

    const acceptFile = useCallback((f: File) => {
        const validationError = validateFile(f);
        if (validationError) {
            setError(validationError);
            onError?.(validationError);
            return;
        }
        setError(null);
        setFile(f);
        // Create a fresh AbortController for the new file's processing
        abortControllerRef.current = new AbortController();
        onFileAccepted?.(f);
    }, [validateFile, onFileAccepted, onError]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounterRef.current -= 1;
        if (dragCounterRef.current <= 0) {
            dragCounterRef.current = 0;
            setIsDragging(false);
        }
    }, []);

    // We need a separate dragenter to track nested elements
    const handleDragOverWithEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // Only count dragenter, not every dragover
        if (e.type === "dragover" && !isDragging) {
            // First dragover sets dragging
        }
        dragCounterRef.current += 1;
        setIsDragging(true);
    }, [isDragging]);

    // Combine: the actual handler will be called for both dragenter and dragover
    const combinedDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounterRef.current = 0;
        setIsDragging(false);
        const droppedFile = e.dataTransfer?.files?.[0];
        if (droppedFile) {
            acceptFile(droppedFile);
        }
    }, [acceptFile]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            acceptFile(selected);
        }
        // Reset so re-selecting the same file fires onChange again
        e.target.value = "";
    }, [acceptFile]);

    const reset = useCallback(() => {
        setFile(null);
        setIsDragging(false);
        setIsProcessing(false);
        setError(null);
        dragCounterRef.current = 0;
        abortControllerRef.current?.abort();
        abortControllerRef.current = null;
    }, []);

    const abort = useCallback(() => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = null;
        setIsProcessing(false);
    }, []);

    return {
        file,
        isDragging,
        isProcessing,
        error,
        handleDragOver: combinedDragOver,
        handleDragLeave,
        handleDrop,
        handleInputChange,
        setIsProcessing,
        reset,
        abort,
        abortControllerRef,
    };
}
