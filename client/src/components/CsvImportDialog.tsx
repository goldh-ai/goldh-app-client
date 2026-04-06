
import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Upload, CheckCircle2, AlertCircle, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CsvImportDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    expectedFields: { key: string; label: string; required?: boolean; hideInPreview?: boolean; aliases?: string[] }[];
    onImport: (data: any[]) => Promise<{ total: number; success: number; failed: number; failures: { name: string; error: string }[] }>;
    sampleData?: any[];
}

const formatErrorMessage = (errorStr: string): string[] => {
    try {
        // Find JSON part in strings like "400: {...}"
        const jsonMatch = errorStr.indexOf("{");
        if (jsonMatch === -1) return [errorStr];

        const jsonStr = errorStr.substring(jsonMatch);
        const errorObj = JSON.parse(jsonStr);

        // Zod errors are often returned as a JSON string inside the "error" property
        if (errorObj.error) {
            try {
                const zodIssues = JSON.parse(errorObj.error);
                if (Array.isArray(zodIssues)) {
                    return zodIssues.map(issue => {
                        const field = issue.path?.join('.') || 'General';
                        return `${field}: ${issue.message}`;
                    });
                }
            } catch {
                return [errorObj.error];
            }
        }
        return [errorStr];
    } catch (e) {
        return [errorStr];
    }
};

export function CsvImportDialog({
    open,
    onOpenChange,
    title,
    description,
    expectedFields,
    onImport,
    sampleData
}: CsvImportDialogProps) {
    const { toast } = useToast();
    const [file, setFile] = useState<File | null>(null);
    const [csvData, setCsvData] = useState<any[]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [mapping, setMapping] = useState<Record<string, string>>({});
    const [step, setStep] = useState<"upload" | "map" | "preview" | "importing" | "results">("upload");
    const [importResults, setImportResults] = useState<{ total: number; success: number; failed: number; failures: { name: string; error: string }[] } | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (!open) {
            setFile(null);
            setCsvData([]);
            setHeaders([]);
            setMapping({});
            setStep("upload");
            setImportResults(null);
        }
    }, [open]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            parseFile(selectedFile);
        }
    };

    const parseFile = (file: File) => {
        setIsProcessing(true);
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                setCsvData(results.data);
                if (results.meta.fields) {
                    setHeaders(results.meta.fields);
                    autoMap(results.meta.fields);
                }
                setStep("map");
                setIsProcessing(false);
            },
            error: (err) => {
                toast({ title: "Parse Error", description: err.message, variant: "destructive" });
                setIsProcessing(false);
            }
        });
    };

    const autoMap = (csvHeaders: string[]) => {
        const newMapping: Record<string, string> = {};
        expectedFields.forEach(field => {
            const match = csvHeaders.find(h =>
                h.toLowerCase() === field.key.toLowerCase() ||
                h.toLowerCase() === field.label.toLowerCase() ||
                h.toLowerCase().replace(/\s+/g, '_') === field.key.toLowerCase() ||
                (field.aliases || []).some(a => h.toLowerCase() === a.toLowerCase())
            );
            if (match) newMapping[field.key] = match;
        });
        setMapping(newMapping);
    };

    const handleImport = async () => {
        setStep("importing");
        try {
            const mappedData = csvData.map(row => {
                const item: any = {};
                Object.entries(mapping).forEach(([key, csvHeader]) => {
                    item[key] = row[csvHeader];
                });
                return item;
            });

            const results = await onImport(mappedData);
            setImportResults(results);
            setStep("results");
            toast({ title: "Import Complete", description: `Processed ${results.total} records.` });
        } catch (error: any) {
            toast({ title: "Import Failed", description: error.message, variant: "destructive" });
            setStep("preview");
        }
    };

    const isMappingComplete = expectedFields
        .filter(f => f.required)
        .every(f => !!mapping[f.key]);

    const handleDownloadTemplate = () => {
        const headers = expectedFields.map(f => f.key).join(",");
        const sampleRow = expectedFields.map(f => {
            // Provide sensible placeholder values per field key
            if (f.aliases?.length) return f.aliases[0].split("/")[0];
            if (f.key.toLowerCase().includes("amount")) return "0";
            if (f.key.toLowerCase().includes("score")) return "90";
            if (f.key.toLowerCase().includes("timestamp")) return new Date().toISOString();
            return "";
        }).join(",");
        const csv = `${headers}\n${sampleRow}`;
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `template_${title.toLowerCase().replace(/\s+/g, "_")}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#141414] border-[#222] sm:max-w-4xl text-white max-h-[90vh] flex flex-col p-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="flex items-center gap-2">
                        <FileSpreadsheet className="w-5 h-5 text-[#C7AE6A]" />
                        {title}
                    </DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {step === "upload" && (
                        <div className="space-y-3">
                            <div className="border-2 border-dashed border-[#333] rounded-2xl h-56 flex flex-col items-center justify-center gap-4 hover:border-[#C7AE6A]/50 transition-all cursor-pointer relative group">
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <div className="p-4 bg-[#C7AE6A]/10 rounded-full group-hover:scale-110 transition-transform">
                                    <Upload className="w-8 h-8 text-[#C7AE6A]" />
                                </div>
                                <div className="text-center">
                                    <p className="font-bold">Click or drag CSV file to upload</p>
                                    <p className="text-xs text-muted-foreground mt-1">Maximum 5,000 rows supported</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={handleDownloadTemplate}
                                    className="flex items-center gap-1.5 text-[10px] text-[#C7AE6A]/70 hover:text-[#C7AE6A] font-bold uppercase tracking-widest transition-colors group/dl"
                                >
                                    <FileSpreadsheet className="w-3 h-3 group-hover/dl:scale-110 transition-transform" />
                                    Download CSV Template
                                </button>
                            </div>
                        </div>
                    )}

                    {step === "map" && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4 text-sm">
                                    <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Expected Field</h4>
                                    {expectedFields.map(field => (
                                        <div key={field.key} className="flex items-center justify-between h-10 px-3 bg-black/40 rounded-lg border border-[#222]">
                                            <span className="flex items-center gap-2">
                                                {field.label}
                                                {field.required && <span className="text-red-500">*</span>}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-widest">CSV Column</h4>
                                    {expectedFields.map(field => (
                                        <div key={field.key} className="h-10">
                                            <Select
                                                value={mapping[field.key] || ""}
                                                onValueChange={(val) => setMapping(prev => ({ ...prev, [field.key]: val }))}
                                            >
                                                <SelectTrigger className="bg-[#0a0a0a] border-[#333] h-10">
                                                    <SelectValue placeholder="Select column..." />
                                                </SelectTrigger>
                                                <SelectContent className="bg-[#141414] border-[#333] text-white">
                                                    <SelectItem value="none">-- Skip --</SelectItem>
                                                    {headers.map(h => (
                                                        <SelectItem key={h} value={h}>{h}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === "preview" && (
                        <div className="space-y-4">
                            <div className="bg-[#C7AE6A]/10 border border-[#C7AE6A]/20 p-4 rounded-xl flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-[#C7AE6A]" />
                                <div>
                                    <p className="text-sm font-bold text-[#C7AE6A]">Mapping Validated</p>
                                    <p className="text-xs text-[#C7AE6A]/70">{csvData.length} rows ready for batch processing.</p>
                                </div>
                            </div>
                            <div className="border border-[#222] rounded-xl overflow-hidden max-h-[400px] overflow-y-auto bg-black/20">
                                <Table>
                                    <TableHeader className="bg-[#111] sticky top-0 z-10 shadow-[0_1px_0_rgba(255,255,255,0.05)]">
                                        <TableRow className="border-[#222] hover:bg-transparent">
                                            {expectedFields.filter(f => !f.hideInPreview && !!mapping[f.key] && mapping[f.key] !== 'none' && headers.includes(mapping[f.key])).map(f => (
                                                <TableHead key={f.key} className="text-[10px] font-black uppercase tracking-widest py-3 text-[#C7AE6A]">{f.label}</TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {csvData.map((row, i) => (
                                            <TableRow key={i} className="border-[#1a1a1a] hover:bg-white/[0.02]">
                                                {expectedFields.filter(f => !f.hideInPreview && !!mapping[f.key] && mapping[f.key] !== 'none' && headers.includes(mapping[f.key])).map(f => (
                                                    <TableCell key={f.key} className="text-xs text-gray-300 py-3">
                                                        {row[mapping[f.key]] || <span className="text-gray-600">N/A</span>}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            <div className="flex justify-between items-center px-1">
                                <p className="text-[10px] text-gray-500 italic">Showing all {csvData.length} rows</p>
                                <p className="text-[10px] text-gray-400">Please review carefully before confirming</p>
                            </div>
                        </div>
                    )}

                    {step === "importing" && (
                        <div className="flex flex-col items-center justify-center h-64 gap-4">
                            <Loader2 className="w-10 h-10 text-[#C7AE6A] animate-spin" />
                            <div className="text-center">
                                <p className="font-bold">Importing Data...</p>
                                <p className="text-xs text-muted-foreground mt-1">Writing documents in batches of 500. This may take a moment.</p>
                            </div>
                        </div>
                    )}

                    {step === "results" && importResults && (
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center justify-center text-center pt-4">
                                <div className="p-4 bg-[#C7AE6A]/10 rounded-full mb-4">
                                    <CheckCircle2 className="w-12 h-12 text-[#C7AE6A]" />
                                </div>
                                <h3 className="text-xl font-bold mb-1">Import Complete</h3>
                                <p className="text-muted-foreground text-sm">The batch process has finished.</p>
                            </div>

                            <div className="grid grid-cols-3 gap-4 w-full">
                                <div className="p-4 bg-black/40 rounded-2xl border border-[#222]">
                                    <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">Total</p>
                                    <p className="text-2xl font-black text-white">{importResults.total}</p>
                                </div>
                                <div className="p-4 bg-[#C7AE6A]/5 rounded-2xl border border-[#C7AE6A]/20">
                                    <p className="text-[10px] font-black uppercase text-[#C7AE6A]/60 tracking-widest mb-1">Success</p>
                                    <p className="text-2xl font-black text-[#C7AE6A]">{importResults.success}</p>
                                </div>
                                <div className={`p-4 rounded-2xl border ${importResults.failed > 0 ? 'bg-red-500/5 border-red-500/20' : 'bg-black/40 border-[#222]'}`}>
                                    <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${importResults.failed > 0 ? 'text-red-500/60' : 'text-gray-500'}`}>Failed</p>
                                    <p className={`text-2xl font-black ${importResults.failed > 0 ? 'text-red-500' : 'text-white'}`}>{importResults.failed}</p>
                                </div>
                            </div>

                            {importResults.failures.length > 0 && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-red-500">
                                        <AlertCircle className="w-4 h-4" />
                                        <h4 className="text-xs font-black uppercase tracking-widest">Failed Records</h4>
                                    </div>
                                    <div className="border border-red-500/20 rounded-xl overflow-hidden max-h-48 overflow-y-auto bg-red-500/5">
                                        <Table>
                                            <TableBody>
                                                {importResults.failures.map((f, i) => (
                                                    <TableRow key={i} className="border-red-500/10 hover:bg-red-500/10">
                                                        <TableCell className="py-2 text-xs font-bold text-red-200">{f.name}</TableCell>
                                                        <TableCell className="py-2 text-[10px] text-red-400 font-mono">
                                                            <div className="flex flex-col gap-1">
                                                                {(formatErrorMessage(f.error) as string[]).map((msg: string, idx: number) => (
                                                                    <div key={idx} className="leading-tight">{msg}</div>
                                                                ))}
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    <p className="text-[11px] text-gray-500 text-center italic">
                                        Please correct the issues above in your CSV file and re-upload the failed records.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter className="p-6 border-t border-[#222] bg-[#0a0a0a]">
                    {step === "map" && (
                        <Button
                            disabled={!isMappingComplete}
                            onClick={() => setStep("preview")}
                            className="bg-[#C7AE6A] hover:bg-[#D4BD7A] text-black font-bold h-11 px-8 rounded-xl transition-all"
                        >
                            Review Data
                        </Button>
                    )}
                    {step === "preview" && (
                        <div className="flex gap-3 w-full">
                            <Button variant="ghost" onClick={() => setStep("map")} className="flex-1 h-11 border border-[#222]">
                                Back to Mapping
                            </Button>
                            <Button
                                onClick={handleImport}
                                className="flex-[2] bg-[#C7AE6A] hover:bg-[#D4BD7A] text-black font-bold h-11 px-8 rounded-xl transition-all"
                            >
                                Confirm Batch Write
                            </Button>
                        </div>
                    )}
                    {step === "results" && (
                        <Button
                            onClick={() => onOpenChange(false)}
                            className="w-full bg-[#C7AE6A] hover:bg-[#D4BD7A] text-black font-bold h-11 rounded-xl transition-all"
                        >
                            Close
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
