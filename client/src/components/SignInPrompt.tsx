import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useState, useEffect } from "react";

interface SignInPromptProps {
  onClose?: () => void;
  variant?: 'modal' | 'inline';
}

const DISMISS_COOLDOWN_MS = 60 * 60 * 1000; // 1 hour in milliseconds
const DISMISS_KEY = 'goldh-signin-prompt-dismissed';

export function SignInPrompt({ onClose, variant = 'modal' }: SignInPromptProps) {
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // In inline mode, we always want to show if there's no user
    if (variant === 'inline') {
      if (!user) setShow(true);
      return;
    }

    // Don't show if user is authenticated
    if (user) {
      return;
    }

    // Check if the user just logged out
    const justLoggedOut = sessionStorage.getItem("goldh-just-logged-out");
    if (justLoggedOut) {
      sessionStorage.removeItem("goldh-just-logged-out");
      return;
    }

    // Check if prompt was recently dismissed (within cooldown period)
    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt) {
      const timeSinceDismissal = Date.now() - parseInt(dismissedAt, 10);
      if (timeSinceDismissal < DISMISS_COOLDOWN_MS) {
        // Still within cooldown period - don't show
        return;
      }
    }

    // Show the modal automatically after a delay on page load
    const timer = setTimeout(() => {
      setShow(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [user, variant]);

  const handleDismiss = () => {
    if (variant === 'inline') return; // Cannot dismiss in inline mode
    setShow(false);
    setDismissed(true);
    // Store dismissal timestamp in localStorage
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
    onClose?.();
  };

  if (user || (variant === 'modal' && dismissed) || !show) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={variant === 'modal' ? "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" : "relative z-10"}
        onClick={handleDismiss}
        data-testid="signin-prompt-overlay"
      >
        <div className={variant === 'modal' ? "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-md" : "w-full max-w-md mx-auto"}>
          <motion.div
            initial={variant === 'modal' ? { scale: 0.9, opacity: 0, y: 20 } : { opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={variant === 'modal' ? { scale: 0.9, opacity: 0, y: 20 } : { opacity: 0, y: 10 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`bg-zinc-900/60 backdrop-blur-md border border-primary/30 rounded-3xl p-8 relative ${variant === 'inline' ? 'mt-32' : ''}`}
              style={{
                boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5), 0 0 20px rgba(199, 174, 106, 0.1)"
              }}
            >
              {variant === 'modal' && (
                <button
                  onClick={handleDismiss}
                  className="absolute top-4 right-4 text-gray-400 hover:text-[#C7AE6A] transition-colors"
                  data-testid="button-close-prompt"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              <div className="text-center mb-10">
                <h3 className="text-2xl sm:text-3xl font-bold mb-3 bg-gradient-to-r from-[#e3d6b4] via-[#C7AE6A] to-[#b99a45] bg-clip-text text-transparent">
                  GOLDH Terminal
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed px-2 font-medium">
                  {variant === 'inline'
                    ? "Sign in or create an account to access our institutional-grade intelligence tools."
                    : "Sign in to get the most out of the GOLDH network."
                  }
                </p>
              </div>

              <div className="flex flex-col gap-8">
                <div className="w-full">
                  <Link href="/signin">
                    <Button
                      className="w-full h-14 bg-[#C7AE6A] hover:bg-[#b99a45] text-black font-extrabold text-sm rounded-2xl shadow-xl shadow-[#C7AE6A]/20 transition-all hover:scale-105 active:scale-95"
                      data-testid="button-signin-from-prompt"
                    >
                      Sign In
                    </Button>
                  </Link>
                </div>

                <div className="w-full">
                  <Link href="/signup">
                    <Button
                      variant="outline"
                      className="w-full h-14 border-[#C7AE6A]/30 text-[#C7AE6A] hover:bg-[#C7AE6A]/10 font-extrabold text-sm rounded-2xl transition-all"
                      data-testid="button-signup-from-prompt"
                    >
                      Create Account
                    </Button>
                  </Link>
                </div>

                {variant === 'modal' && (
                  <button
                    onClick={handleDismiss}
                    className="w-full text-sm text-gray-500 hover:text-gray-400 transition-colors pt-2"
                    data-testid="button-continue-browsing"
                  >
                    Continue browsing
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
