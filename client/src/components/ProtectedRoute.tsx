import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { SignInPrompt } from "@/components/SignInPrompt";

export function ProtectedRoute({
  children,
  mode = 'redirect'
}: {
  children: React.ReactNode,
  mode?: 'redirect' | 'prompt'
}) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user && mode === 'redirect') {
      // Capture the actual current path from window location (not wouter location which may be '/')
      const currentPath = window.location.pathname + window.location.search;
      const redirectPath = encodeURIComponent(currentPath);
      setLocation(`/signin?redirect=${redirectPath}`);
    }
  }, [isLoading, user, setLocation, mode]);

  if (isLoading) {
    if (mode === 'prompt') {
      return (
        <div className="min-h-screen bg-[#050505]">
          <Header />
          <div className="container mx-auto px-6 py-20 flex items-center justify-center min-h-[calc(100vh-200px)]">
            <Loader2 className="w-8 h-8 animate-spin text-[#C7AE6A]" />
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    if (mode === 'prompt') {
      return (
        <div className="min-h-screen bg-[#050505]">
          <Header />
          <div className="container mx-auto px-6 py-20 flex items-center justify-center min-h-[calc(100vh-200px)]">
            <SignInPrompt variant="inline" />
          </div>
        </div>
      );
    }
    return null;
  }

  return <>{children}</>;
}
