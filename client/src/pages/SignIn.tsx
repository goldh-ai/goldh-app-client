import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { Header } from "@/components/Header";

export default function SignIn() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { signin, sendPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to reset your password.",
        variant: "destructive",
      });
      return;
    }

    try {
      await sendPasswordReset(email);
      toast({
        title: "Reset Email Sent",
        description: `Check your inbox at ${email} for further instructions.`,
      });
    } catch (error: any) {
      toast({
        title: "Reset Failed",
        description: error.message || "Could not send reset email. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Get redirect path from query params with security validation
  const getRedirectPath = () => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');

    if (!redirect) {
      return '/home';
    }

    const decoded = decodeURIComponent(redirect);

    // Security: Only allow internal paths (must start with / but not //)
    // Prevents open redirect attacks
    if (!decoded.startsWith('/') || decoded.startsWith('//')) {
      console.warn('Invalid redirect path, defaulting to home:', decoded);
      return '/home';
    }

    return decoded;
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signin(email, password);

      const redirectPath = getRedirectPath();

      toast({
        title: "Success!",
        description: "You've been signed in successfully.",
      });

      // Small delay to ensure auth state is updated before navigation
      setTimeout(() => {
        setLocation(redirectPath);
      }, 100);
    } catch (error: any) {
      // Provide user-friendly error messages specifically for Firebase/Sync
      let errorTitle = "Sign In Failed";
      let errorDescription = error.message || "Please check your credentials and try again.";

      if (error.message?.includes("auth/user-not-found")) {
        errorTitle = "Account Not Found";
        errorDescription = "We couldn't find an account with this email. Please Sign-up.";
      } else if (error.message?.includes("auth/wrong-password") || error.message?.includes("invalid-credential")) {
        errorTitle = "Invalid Credentials";
        errorDescription = "The password you entered is incorrect. If you haven't registered, please Sign-up.";
      } else if (error.message?.includes("auth/too-many-requests")) {
        errorTitle = "Account Locked";
        errorDescription = "Too many failed attempts. Please try again later or reset your password.";
      } else if (error.message?.includes("verify your email")) {
        errorTitle = "Email Verification Required";
        errorDescription = "Please check your inbox and verify your email address before signing in.";
      }

      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="pt-28 md:pt-32 pb-16 px-6">
        <div className="container mx-auto max-w-md">
          <Card className="border-primary/20 bg-zinc-900/50 backdrop-blur-sm">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#e3d6b4] via-[#C7AE6A] to-[#b99a45] bg-clip-text text-transparent">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Sign in to access your GOLDH terminal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email/Password Form */}
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    data-testid="input-email"
                    className="bg-background/50 border-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-white">Password</Label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs text-primary hover:underline font-medium"
                      aria-label="Send password reset email"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      data-testid="input-password"
                      className="bg-background/50 border-primary/20 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary text-black hover:bg-primary/90"
                  disabled={isLoading}
                  data-testid="button-signin"
                >
                  {isLoading ? "Authenticating..." : "Sign In"}
                </Button>
              </form>

              {/* Sign Up Link */}
              <div className="text-center text-sm text-zinc-500">
                Don't have an account?{" "}
                <Link href="/signup" className="text-primary hover:underline font-semibold" data-testid="link-signup">
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
