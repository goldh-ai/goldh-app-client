import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  User as FirebaseUser,
  getIdToken,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth } from "./firebase";
import { apiRequest, apiUrl } from "./queryClient";

interface User {
  id: string;
  name: string | null;
  email: string;
  isPremium: boolean;
  isAdmin: boolean;
  planTier: string;
  alertCount: number;
}

interface AuthContextType {
  user: User | null;
  sessionId: string | null;
  isLoading: boolean;
  signin: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, registrationData: any) => Promise<void>;
  resendVerification: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  setSession: (user: User, sessionId: string) => void;
  signout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Synchronize with Firebase and Backend Session
  useEffect(() => {
    let isMounted = true;

    // Safety timeout to prevent infinite loading if Firebase hangs
    const safetyTimer = setTimeout(() => {
      if (isMounted) {
        setIsLoading(current => {
          if (current) {
            console.warn("[Auth] Safety timeout reached, forcing isLoading to false");
            return false;
          }
          return false;
        });
      }
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (!isMounted) return;

      console.log("[Auth State] Firebase User:", firebaseUser?.email, "Verified:", firebaseUser?.emailVerified);
      clearTimeout(safetyTimer);

      const storedSessionId = localStorage.getItem("sessionId");
      const isMockAuth = localStorage.getItem("MOCK_AUTH") === "true";

      try {
        if (firebaseUser) {
          if (storedSessionId) {
            // If we have a local session, verify it's still alive on the server
            await fetchUser(storedSessionId);
          } else if (firebaseUser.emailVerified) {
            // Verified in Firebase but no local session -> attempt synchronization/signin
            const idToken = await getIdToken(firebaseUser);
            await synchronizeSession(idToken);
          } else {
            // Logged in but unverified
            setUser(null);
            setIsLoading(false);
          }
        } else if (isMockAuth && storedSessionId) {
          // E2E Mock Bypass: Allow session if MOCK_AUTH is set even without Firebase user
          console.log("[Auth] E2E Mock Auth detected, using stored session...");
          await fetchUser(storedSessionId);
        } else {
          // Fully logged out
          handleSignoutState();
          setIsLoading(false);
        }
      } catch (err) {
        console.error("[Auth State Error]", err);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
      clearTimeout(safetyTimer);
    };
  }, []);

  const handleSignoutState = () => {
    setUser(null);
    setSessionId(null);
    localStorage.removeItem("sessionId");
  };

  const fetchUser = async (sid: string) => {
    try {
      const response = await fetch(apiUrl("/api/user/me"), {
        headers: { Authorization: `Bearer ${sid}` },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setSessionId(sid);
      } else if (response.status === 401 && auth.currentUser) {
        // Session expired but Firebase user still exists -> attempt re-sync
        console.log("[Auth] Session 401 but Firebase user present, re-syncing...");
        const idToken = await getIdToken(auth.currentUser);
        await synchronizeSession(idToken);
      } else {
        handleSignoutState();
      }
    } catch (error) {
      console.error("[Auth] fetchUser failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const synchronizeSession = async (token: string) => {
    try {
      const res = await fetch(apiUrl("/api/auth/signin"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firebaseIdToken: token })
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setSessionId(data.sessionId);
        localStorage.setItem("sessionId", data.sessionId);
      }
    } catch (error) {
      console.error("[Auth] Sync session failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, registrationData: any) => {
    // 1. Create user in Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const idToken = await getIdToken(userCredential.user);

    // 2. Send Verification Email with redirect back to the app
    const actionCodeSettings = {
      url: window.location.origin + "/auth/verify?source=firebase_redirect",
      handleCodeInApp: true,
    };
    await sendEmailVerification(userCredential.user, actionCodeSettings);

    // 3. Register in Neon DB via backend
    const res = await apiRequest("POST", "/api/auth/signup", {
      ...registrationData,
      firebaseIdToken: idToken
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to register account in our database");
    }
  };

  const signin = async (email: string, password: string) => {
    // 1. Sign in to Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    if (!userCredential.user.emailVerified) {
      throw new Error("Please verify your email address before signing in.");
    }

    // 2. Sync with Backend to get UUID Session
    const idToken = await getIdToken(userCredential.user);
    const res = await fetch(apiUrl("/api/auth/signin"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firebaseIdToken: idToken })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to synchronize session");
    }

    setUser(data.user);
    setSessionId(data.sessionId);
    localStorage.setItem("sessionId", data.sessionId);
  };

  const resendVerification = async () => {
    if (auth.currentUser) {
      const actionCodeSettings = {
        url: window.location.origin + "/auth/verify?source=firebase_redirect",
        handleCodeInApp: true,
      };
      await sendEmailVerification(auth.currentUser, actionCodeSettings);
    } else {
      throw new Error("No user currently signed in");
    }
  };

  const sendPasswordReset = async (email: string) => {
    const actionCodeSettings = {
      url: window.location.origin + "/signin",
      handleCodeInApp: true,
    };
    await sendPasswordResetEmail(auth, email, actionCodeSettings);
  };

  const setSession = (userData: User, sid: string) => {
    setUser(userData);
    setSessionId(sid);
    localStorage.setItem("sessionId", sid);
  };

  const signout = async () => {
    // 1. Sign out from Backend
    if (sessionId) {
      try {
        await fetch(apiUrl("/api/auth/signout"), {
          method: "POST",
          headers: { Authorization: `Bearer ${sessionId}` },
        });
      } catch (error) {
        console.error("Signout backend error:", error);
      }
    }

    // 2. Sign out from Firebase
    await firebaseSignOut(auth);
    handleSignoutState();
  };

  return (
    <AuthContext.Provider value={{
      user,
      sessionId,
      isLoading,
      signin,
      signup,
      resendVerification,
      sendPasswordReset,
      setSession,
      signout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
