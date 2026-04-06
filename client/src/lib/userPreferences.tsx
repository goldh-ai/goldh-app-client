import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useAuth } from "./auth";

export interface UserPreferencesData {
  sectionOrder: string[];
  hiddenSections: string[];
  sidebarCollapsed: boolean;
}

const DEFAULT_PREFS: UserPreferencesData = {
  sectionOrder: ['crypto', 'equity', 'index', 'commodity', 'bond', 'etf', 'fx'],
  hiddenSections: [],
  sidebarCollapsed: false,
};

interface UserPreferencesContextType {
  preferences: UserPreferencesData;
  isLoading: boolean;
  updatePreferences: (patch: Partial<UserPreferencesData>) => Promise<void>;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const { user, sessionId } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferencesData>(DEFAULT_PREFS);
  const [isLoading, setIsLoading] = useState(false);

  // Load preferences whenever user session becomes available
  useEffect(() => {
    if (!user || !sessionId) {
      setPreferences(DEFAULT_PREFS);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    fetch("/api/user/preferences", {
      headers: { Authorization: `Bearer ${sessionId}` },
    })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (!cancelled && data) {
          setPreferences({
            sectionOrder: data.sectionOrder ?? DEFAULT_PREFS.sectionOrder,
            hiddenSections: data.hiddenSections ?? DEFAULT_PREFS.hiddenSections,
            sidebarCollapsed: data.sidebarCollapsed ?? DEFAULT_PREFS.sidebarCollapsed,
          });
        }
      })
      .catch((err) => console.error("[UserPreferences] load failed:", err))
      .finally(() => { if (!cancelled) setIsLoading(false); });

    return () => { cancelled = true; };
  }, [user?.id, sessionId]);

  const updatePreferences = useCallback(async (patch: Partial<UserPreferencesData>) => {
    if (!sessionId) return;

    // Optimistic update
    setPreferences((prev) => ({ ...prev, ...patch }));

    try {
      await fetch("/api/user/preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionId}`,
        },
        body: JSON.stringify(patch),
      });
    } catch (err) {
      console.error("[UserPreferences] update failed:", err);
    }
  }, [sessionId]);

  return (
    <UserPreferencesContext.Provider value={{ preferences, isLoading, updatePreferences }}>
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  const ctx = useContext(UserPreferencesContext);
  if (!ctx) throw new Error("useUserPreferences must be used inside UserPreferencesProvider");
  return ctx;
}
