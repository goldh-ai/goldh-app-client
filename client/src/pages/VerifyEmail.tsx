import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { applyActionCode, getIdToken, confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, XCircle, Eye, EyeOff, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { apiUrl } from "@/lib/queryClient";

export default function VerifyEmail() {
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'resetForm'>('loading');
    const [mode, setMode] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [oobCode, setOobCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const checkVerification = async () => {
            const params = new URLSearchParams(window.location.search);
            const code = params.get("oobCode");
            const actionMode = params.get("mode");
            const source = params.get("source");

            setMode(actionMode);

            if (!code) {
                // FALLBACK: If we are redirected from Firebase's default handler, 
                // the user might already be verified but the code is consumed/missing.
                if (source === 'firebase_redirect' || auth.currentUser?.emailVerified) {
                    console.log("[VerifyEmail] Detected redirect or already verified state. Showing success.");
                    setStatus('success');
                    return;
                }

                setStatus('error');
                setErrorMessage("Missing secure verification code.");
                return;
            }

            setOobCode(code);

            if (actionMode === 'resetPassword') {
                handleResetInitiation(code);
            } else {
                handleVerification(code);
            }
        };

        checkVerification();
    }, []);

    const handleResetInitiation = async (code: string) => {
        try {
            // Verify code is valid before showing form
            await verifyPasswordResetCode(auth, code);
            setStatus('resetForm');
        } catch (error: any) {
            setStatus('error');
            setErrorMessage(error.message || "This password reset link is invalid or has expired.");
        }
    };

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast({
                title: "Passwords Mismatch",
                description: "The passwords you entered do not match.",
                variant: "destructive",
            });
            return;
        }

        if (newPassword.length < 6) {
            toast({
                title: "Insecure Password",
                description: "Password must be at least 6 characters long.",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await confirmPasswordReset(auth, oobCode, newPassword);
            setStatus('success');
            toast({
                title: "Password Updated",
                description: "Your password has been reset successfully. You can now sign in.",
            });
            setTimeout(() => setLocation("/signin"), 3000);
        } catch (error: any) {
            toast({
                title: "Reset Failed",
                description: error.message || "Could not update password. Link may be expired.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVerification = async (code: string) => {
        try {
            await applyActionCode(auth, code);
            const user = auth.currentUser;
            if (user) {
                await user.reload();
                const idToken = await getIdToken(user, true);

                const res = await fetch(apiUrl("/api/auth/verify"), {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ firebaseIdToken: idToken })
                });

                if (res.ok) {
                    setStatus('success');
                    toast({
                        title: "Account Verified",
                        description: "Your GOLDH account is now fully active.",
                    });
                    setTimeout(() => setLocation("/signin"), 3000);
                } else {
                    const data = await res.json();
                    throw new Error(data.error || "Failed to sync verification with our system.");
                }
            } else {
                setStatus('success');
                toast({
                    title: "Email Verified",
                    description: "Success! Please sign in to access your GOLDH dashboard.",
                });
                setTimeout(() => setLocation("/signin"), 3000);
            }
        } catch (error: any) {
            setStatus('error');
            setErrorMessage(error.message || "The verification link is invalid or has expired.");
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <div className="pt-28 md:pt-32 pb-16 px-6 flex items-center justify-center">
                <div className="container mx-auto max-w-md">
                    <Card className="border-primary/20 bg-zinc-900/50 backdrop-blur-sm">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl sm:text-3xl font-serif text-primary">
                                {mode === 'resetPassword' ? "Reset Password" : "Verify Your Identity"}
                            </CardTitle>
                            <CardDescription className="text-zinc-400">
                                {mode === 'resetPassword' ? "Enter your new credentials below" : "Authenticating your secure GOLDH account"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center py-6 text-center">
                            {status === 'loading' && (
                                <div className="space-y-4 py-10">
                                    <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
                                    <p className="text-zinc-400">Verifying security credentials...</p>
                                </div>
                            )}

                            {status === 'resetForm' && (
                                <form onSubmit={handlePasswordReset} className="w-full space-y-4 text-left">
                                    <div className="space-y-2">
                                        <Label htmlFor="new-password">New Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="new-password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                required
                                                className="bg-background/50 border-primary/20 pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                                            >
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirm-password">Confirm Password</Label>
                                        <Input
                                            id="confirm-password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            className="bg-background/50 border-primary/20"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full bg-primary text-black hover:bg-primary/90 mt-4"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</>
                                        ) : (
                                            "Reset Password"
                                        )}
                                    </Button>
                                </form>
                            )}

                            {status === 'success' && (
                                <div className="space-y-4 py-6">
                                    <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
                                    <p className="text-zinc-200 text-lg sm:text-xl font-medium">
                                        {mode === 'resetPassword' ? "Password Reset Complete" : "Verification Complete"}
                                    </p>
                                    <p className="text-zinc-400">Redirecting to sign in...</p>
                                    <Button
                                        className="mt-6 bg-primary text-black hover:bg-primary/90 px-8"
                                        onClick={() => setLocation("/signin")}
                                    >
                                        {mode === 'resetPassword' ? "Sign In Now" : "Sign In to Access Dashboard"}
                                    </Button>
                                </div>
                            )}

                            {status === 'error' && (
                                <div className="space-y-4 py-6">
                                    <XCircle className="h-16 w-16 text-red-500 mx-auto" />
                                    <p className="text-zinc-200 text-xl font-medium">Link Exception</p>
                                    <p className="text-zinc-400 max-w-[280px] mx-auto">{errorMessage}</p>
                                    <Button
                                        variant="outline"
                                        className="mt-6 border-primary/50 text-primary hover:bg-primary/10"
                                        onClick={() => setLocation("/signin")}
                                    >
                                        Return to Sign In
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
