import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";

interface NewsArticle {
  id: string;
  title: string;
  publishedAt: string;
  source: string;
}

export function NewsScroller() {
  const { data: articles = [], isLoading } = useQuery<NewsArticle[]>({
    queryKey: ['/api/news/guru-digest'],
  });

  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-[#1a1a1a] border-b border-border py-3 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-4 h-4 text-primary flex-shrink-0" />
            <div className="h-4 w-48 bg-muted/30 rounded animate-pulse" />
            <div className="h-4 w-64 bg-muted/20 rounded animate-pulse" />
            <div className="h-4 w-40 bg-muted/20 rounded animate-pulse hidden sm:block" />
          </div>
        </div>
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return null;
  }

  const topArticles = articles.slice(0, 10);

  if (reducedMotion) {
    return (
      <div className="bg-[#1a1a1a] border-b border-border py-3 overflow-hidden" data-testid="news-scroller">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 flex-wrap">
            <TrendingUp className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-sm font-semibold text-primary flex-shrink-0">Latest news:</span>
            {topArticles.slice(0, 3).map((article, index) => (
              <span key={`${article.id}-static-${index}`} className="text-sm text-foreground font-medium">
                {article.source}: {article.title}
                {index < 2 && <span className="text-primary mx-2">•</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a1a] border-b border-border py-3 overflow-hidden" data-testid="news-scroller">
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#1a1a1a] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#1a1a1a] to-transparent z-10 pointer-events-none" />

        <div className="flex items-center gap-8 animate-scroll whitespace-nowrap px-4 sm:px-6">
          <div className="flex items-center gap-3 flex-shrink-0">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Latest news:</span>
          </div>

          {topArticles.map((article, index) => (
            <div key={`${article.id}-${index}`} className="flex items-center gap-3 flex-shrink-0">
              <span className="text-sm text-muted-foreground">{article.source}</span>
              <span className="text-sm text-foreground font-medium">{article.title}</span>
              <span className="text-primary">•</span>
            </div>
          ))}

          {topArticles.map((article, index) => (
            <div key={`${article.id}-repeat-${index}`} className="flex items-center gap-3 flex-shrink-0">
              <span className="text-sm text-muted-foreground">{article.source}</span>
              <span className="text-sm text-foreground font-medium">{article.title}</span>
              <span className="text-primary">•</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
