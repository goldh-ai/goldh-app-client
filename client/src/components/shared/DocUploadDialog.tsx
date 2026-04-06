import React, { useState, useEffect, useRef } from "react";
import mammoth from "mammoth";
import DOMPurify from "dompurify";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, CheckCircle2, Type, Hash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BaseFileUpload } from "./BaseFileUpload";
import { formatFileSize } from "@/hooks/useFileUpload";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DocProcessedResult {
    /** Sanitized HTML content */
    html: string;
    /** Raw text content (for word count etc.) */
    text: string;
    /** Title derived from the filename */
    title: string;
    /** Word count */
    wordCount: number;
    /** Original file name */
    fileName: string;
    /** Original file size in bytes */
    fileSize: number;
}

export interface DocUploadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
    /** Called after a document is successfully processed and user confirms */
    onDocumentProcessed: (result: DocProcessedResult) => void;
    /** Optional: shows preview of processed HTML */
    showPreview?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DocUploadDialog({
    open,
    onOpenChange,
    title = "Upload Document",
    description = "Upload a Word document (.doc, .docx) to extract content.",
    onDocumentProcessed,
    showPreview = true,
}: DocUploadDialogProps) {
    const { toast } = useToast();

    const [step, setStep] = useState<"upload" | "preview" | "processing">("upload");
    const [isProcessing, setIsProcessing] = useState(false);
    const [processedResult, setProcessedResult] = useState<DocProcessedResult | null>(null);

    // Reset on close
    useEffect(() => {
        if (!open) {
            setStep("upload");
            setIsProcessing(false);
            setProcessedResult(null);
        }
    }, [open]);

    // ── Process document ───────────────────────────────────────────────────

    const handleFileAccepted = async (file: File) => {
        setIsProcessing(true);
        try {
            const arrayBuffer = await file.arrayBuffer();

            // Extract HTML and raw text via mammoth
            const htmlResult = await mammoth.convertToHtml({ arrayBuffer });
            const textResult = await mammoth.extractRawText({ arrayBuffer });

            // Sanitize HTML to prevent XSS
            const sanitizedHtml = DOMPurify.sanitize(htmlResult.value, {
                USE_PROFILES: { html: true },
                ADD_TAGS: ["table", "thead", "tbody", "tr", "th", "td"],
                ADD_ATTR: ["colspan", "rowspan"],
            });

            // Extract metadata
            const titleFromFile = file.name.replace(/\.[^/.]+$/, "");
            const rawText = textResult.value;
            const wordCount = rawText
                .split(/\s+/)
                .filter((w) => w.length > 0).length;

            const result: DocProcessedResult = {
                html: sanitizedHtml,
                text: rawText,
                title: titleFromFile,
                wordCount,
                fileName: file.name,
                fileSize: file.size,
            };

            setProcessedResult(result);

            // Report any mammoth warnings
            if (htmlResult.messages.length > 0) {
                const warnings = htmlResult.messages
                    .filter((m) => m.type === "warning")
                    .map((m) => m.message);
                if (warnings.length > 0) {
                    toast({
                        title: "Document Warnings",
                        description: `${warnings.length} warning(s) during conversion. Content may need review.`,
                    });
                }
            }

            if (showPreview) {
                setStep("preview");
            } else {
                // Skip preview, immediately return the result
                onDocumentProcessed(result);
                onOpenChange(false);
            }
        } catch (error: any) {
            toast({
                title: "Processing Failed",
                description: error.message || "Failed to process the document. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleConfirm = () => {
        if (processedResult) {
            onDocumentProcessed(processedResult);
            onOpenChange(false);
        }
    };

    // ── Estimated reading time ─────────────────────────────────────────────

    const readingTimeMin = processedResult
        ? Math.max(1, Math.ceil(processedResult.wordCount / 200))
        : 0;

    // ── Render ─────────────────────────────────────────────────────────────

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#141414] border-[#222] sm:max-w-4xl text-white max-h-[90vh] flex flex-col p-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#C7AE6A]" />
                        {title}
                    </DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
                    {/* ── Step 1: Upload ────────────────────────────── */}
                    {step === "upload" && (
                        <BaseFileUpload
                            allowedTypes={[".doc", ".docx"]}
                            maxSizeBytes={2 * 1024 * 1024}
                            onFileAccepted={handleFileAccepted}
                            onError={(msg) =>
                                toast({ title: "File Error", description: msg, variant: "destructive" })
                            }
                            icon={<FileText className="w-7 h-7 text-[#C7AE6A]" />}
                            title="Click or drag Word document to upload"
                            subtitle="DOC, DOCX · Max 2 MB"
                            isProcessing={isProcessing}
                        />
                    )}

                    {/* ── Step 2: Preview ───────────────────────────── */}
                    {step === "preview" && processedResult && (
                        <div className="space-y-6">
                            {/* Metadata bar */}
                            <div className="bg-[#C7AE6A]/10 border border-[#C7AE6A]/20 p-4 rounded-xl flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-[#C7AE6A] shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-[#C7AE6A]">Document Processed</p>
                                    <p className="text-xs text-[#C7AE6A]/70 truncate">
                                        {processedResult.fileName}
                                    </p>
                                </div>
                            </div>

                            {/* Stats row */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="p-3 bg-black/40 rounded-xl border border-[#222] text-center">
                                    <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">
                                        File Size
                                    </p>
                                    <p className="text-sm font-bold text-white">
                                        {formatFileSize(processedResult.fileSize)}
                                    </p>
                                </div>
                                <div className="p-3 bg-black/40 rounded-xl border border-[#222] text-center">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <Hash className="w-3 h-3 text-gray-500" />
                                        <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">
                                            Words
                                        </p>
                                    </div>
                                    <p className="text-sm font-bold text-white">
                                        {processedResult.wordCount.toLocaleString()}
                                    </p>
                                </div>
                                <div className="p-3 bg-black/40 rounded-xl border border-[#222] text-center">
                                    <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">
                                        Read Time
                                    </p>
                                    <p className="text-sm font-bold text-white">
                                        ~{readingTimeMin} min
                                    </p>
                                </div>
                            </div>

                            {/* Title extraction */}
                            <div className="p-4 bg-black/30 rounded-xl border border-[#222]">
                                <div className="flex items-center gap-2 mb-2">
                                    <Type className="w-4 h-4 text-[#C7AE6A]" />
                                    <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">
                                        Extracted Title
                                    </p>
                                </div>
                                <p className="text-sm font-semibold text-white">{processedResult.title}</p>
                            </div>

                            {/* HTML preview */}
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">
                                    Content Preview
                                </p>
                                <div className="border border-[#222] rounded-xl bg-[#050505] max-h-[350px] overflow-y-auto p-6 custom-scrollbar">
                                    <div
                                        className="cio-content max-w-none break-words overflow-x-hidden text-sm"
                                        dangerouslySetInnerHTML={{ __html: processedResult.html }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Footer Buttons ────────────────────────────────── */}
                <DialogFooter className="p-6 border-t border-[#222] bg-[#0a0a0a]">
                    {step === "upload" && isProcessing && (
                        <div className="flex items-center gap-3 text-sm text-gray-400 w-full justify-center">
                            <Loader2 className="w-4 h-4 animate-spin text-[#C7AE6A]" />
                            Processing document...
                        </div>
                    )}
                    {step === "preview" && (
                        <div className="flex gap-3 w-full">
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setStep("upload");
                                    setProcessedResult(null);
                                }}
                                className="flex-1 h-11 border border-[#222]"
                            >
                                Upload Different File
                            </Button>
                            <Button
                                onClick={handleConfirm}
                                className="flex-[2] bg-[#C7AE6A] hover:bg-[#D4BD7A] text-black font-bold h-11 px-8 rounded-xl transition-all"
                            >
                                Use This Document
                            </Button>
                        </div>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
