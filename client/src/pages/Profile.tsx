import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { HeroCard } from "@/components/shared/HeroCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Loader2, User as UserIcon, Key, Sparkles } from "lucide-react";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth } from "@/lib/firebase";

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function Profile() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/signin");
    }
  }, [isLoading, user, setLocation]);

  if (isLoading || !user) {
    return (
      <AppLayout title="Profile">
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#C7AE6A]" />
        </div>
      </AppLayout>
    );
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.email) {
        throw new Error("No authenticated user found");
      }

      // Re-authenticate the user first
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);

      // Update password
      await updatePassword(currentUser, newPassword);

      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Password change error:", error);
      let errorMessage = "Failed to change password";

      if (error.code === 'auth/wrong-password') {
        errorMessage = "Current password is incorrect";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed attempts. Please try again later.";
      } else if (error.code === 'auth/requires-recent-login') {
        errorMessage = "Please log out and log back in before changing your password.";
      }

      toast({
        title: "Password Change Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const planTier = user.planTier ?? "free";
  const isFree = planTier === "free";

  return (
    <AppLayout title="Profile">
      <div className="py-6 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          <PageHeader
            label="Account"
            title="Profile Settings"
            description="Manage your account and subscription"
            icon={<UserIcon className="w-6 h-6" />}
          />

          <div className="space-y-6">
            {/* Account Information */}
            <Card className="border-[#C7AE6A]/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-[#C7AE6A]" />
                  Account Information
                </CardTitle>
                <CardDescription>Your basic account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">User Name</Label>
                  <Input
                    id="name"
                    value={user.name || "N/A"}
                    disabled
                    className="bg-muted font-medium"
                    data-testid="input-user-name"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    disabled
                    className="bg-muted"
                    data-testid="input-email"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Plan Status */}
            {isFree ? (
              <HeroCard
                variant="promotional"
                title="Unlock Full Access"
                subtitle="Subscription"
                description="Upgrade to Essential or Pro for live market data, alerts, whale tracking, and more."
                icon={<Sparkles className="w-5 h-5" />}
                primaryAction={{
                  label: "View Plans",
                  onClick: () => setLocation("/pricing"),
                }}
                secondaryAction={{
                  label: "Learn More",
                  onClick: () => setLocation("/features"),
                }}
              />
            ) : (
              <HeroCard
                variant="metric"
                title={`${capitalize(planTier)} Member`}
                subtitle="Current Plan"
                description="You have full access to all GOLDH intelligence modules."
                icon={<Sparkles className="w-5 h-5" />}
                metric={{
                  value: capitalize(planTier),
                  label: "Active Plan",
                }}
              />
            )}

            {/* Change Password */}
            <Card className="border-[#C7AE6A]/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-[#C7AE6A]" />
                  Change Password
                </CardTitle>
                <CardDescription>Update your account password</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      disabled={isChangingPassword}
                      data-testid="input-current-password"
                    />
                  </div>

                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min. 6 characters)"
                      disabled={isChangingPassword}
                      data-testid="input-new-password"
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      disabled={isChangingPassword}
                      data-testid="input-confirm-password"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
                    data-testid="button-change-password"
                    className="w-full sm:w-auto bg-[#C7AE6A] hover:bg-[#D4BD7A] text-black font-bold"
                  >
                    {isChangingPassword ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Changing Password...
                      </>
                    ) : (
                      "Change Password"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
