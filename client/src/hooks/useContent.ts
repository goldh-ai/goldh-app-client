import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { type ContentItem } from "@shared/types";
import { useToast } from "./use-toast";

export function useAdminContent() {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const query = useQuery<ContentItem[]>({
        queryKey: ["/api/admin/content"],
    });

    const saveMutation = useMutation({
        mutationFn: async (data: Partial<ContentItem>) => {
            const res = await apiRequest("POST", "/api/admin/content", data);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/content"] });
            queryClient.invalidateQueries({ queryKey: ["/api/content"] });
            toast({
                title: "Success",
                description: "Content saved successfully",
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Error",
                description: error.message || "Failed to save content",
                variant: "destructive",
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await apiRequest("DELETE", `/api/admin/content/${id}`);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/content"] });
            queryClient.invalidateQueries({ queryKey: ["/api/content"] });
            toast({
                title: "Success",
                description: "Content deleted successfully",
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Error",
                description: error.message || "Failed to delete content",
                variant: "destructive",
            });
        },
    });

    return {
        items: query.data || [],
        isLoading: query.isLoading,
        save: saveMutation.mutateAsync,
        isSaving: saveMutation.isPending,
        remove: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,
    };
}

export function useContent() {
    return useQuery<ContentItem[]>({
        queryKey: ["/api/content"],
    });
}
