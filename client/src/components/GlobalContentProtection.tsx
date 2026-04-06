
import { useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export function GlobalContentProtection() {
    const [location] = useLocation();
    const { toast } = useToast();

    useEffect(() => {
        // Check if current route is an admin route
        const isAdmin = location.startsWith("/admin");

        if (isAdmin) {
            // Allow copying in admin (remove restrictions if present)
            document.body.classList.remove("select-none");
            return;
        }

        // Apply global protection for non-admin routes
        document.body.classList.add("select-none");

        const handleCopy = (e: ClipboardEvent) => {
            e.preventDefault();
            toast({
                title: "Content Protected",
                description: "This content is proprietary and cannot be copied.",
                variant: "destructive",
            });
        };

        // Add event listener to document
        document.addEventListener("copy", handleCopy);

        // Disable context menu (optional, but good for "non copiable")
        // implementation_plan.md didn't specify context menu, but user said "non copiable"
        // Usually right click -> copy is blocked by copy event, but "inspect" might allow copy.
        // I'll stick to copy event and select-none for now as per previous implementation.

        return () => {
            document.body.classList.remove("select-none");
            document.removeEventListener("copy", handleCopy);
        };
    }, [location, toast]);

    return null;
}
