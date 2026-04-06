import { useState, useMemo } from "react";

interface UsePaginationResult<T> {
    page: number;
    totalPages: number;
    paginatedItems: T[];
    setPage: (page: number) => void;
    nextPage: () => void;
    prevPage: () => void;
    startIndex: number;
    endIndex: number;
}

export function usePagination<T>(items: T[], pageSize: number): UsePaginationResult<T> {
    const [page, setPage] = useState(1);

    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

    // Ensure current page is within bounds (e.g. if items array shrinks after filtering)
    const safePage = Math.min(Math.max(1, page), totalPages);

    const paginatedItems = useMemo(() => {
        const start = (safePage - 1) * pageSize;
        return items.slice(start, start + pageSize);
    }, [items, safePage, pageSize]);

    const nextPage = () => setPage(p => Math.min(p + 1, totalPages));
    const prevPage = () => setPage(p => Math.max(p - 1, 1));

    const startIndex = (safePage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, items.length);

    return {
        page: safePage,
        totalPages,
        paginatedItems,
        setPage,
        nextPage,
        prevPage,
        startIndex,
        endIndex
    };
}
