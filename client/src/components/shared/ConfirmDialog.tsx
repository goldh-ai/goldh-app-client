import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    /** Detail text explaining consequences (optional) */
    consequence?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: "destructive" | "default";
    isLoading?: boolean;
    onConfirm: () => void;
}

export function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    consequence,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    variant = "destructive",
    isLoading = false,
    onConfirm,
}: ConfirmDialogProps) {
    const isDestructive = variant === "destructive";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#141414] border-[#222] sm:max-w-md text-white">
                <DialogHeader>
                    <div className="flex items-start gap-4">
                        {isDestructive && (
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mt-0.5">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <DialogTitle className="text-base font-bold text-white leading-tight">
                                {title}
                            </DialogTitle>
                            <DialogDescription className="text-sm text-gray-400 mt-2 leading-relaxed">
                                {description}
                            </DialogDescription>
                            {consequence && (
                                <p className="text-xs text-gray-500 mt-2 leading-relaxed border-t border-[#222] pt-2">
                                    {consequence}
                                </p>
                            )}
                        </div>
                    </div>
                </DialogHeader>

                <DialogFooter className="gap-2 sm:gap-3 mt-2">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                        className="flex-1 sm:flex-none border border-[#333] text-gray-400 hover:text-white hover:bg-white/5"
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={cn(
                            "flex-1 sm:flex-none font-bold transition-all",
                            isDestructive
                                ? "bg-red-500/90 hover:bg-red-500 text-white border border-red-500/50"
                                : "bg-[#C7AE6A] hover:bg-[#D4BD7A] text-black"
                        )}
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                Processing...
                            </span>
                        ) : (
                            confirmLabel
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
