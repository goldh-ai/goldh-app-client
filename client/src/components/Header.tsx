import { User, LogOut, Shield, Menu, Activity, Database, Briefcase } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logoImage from "@assets/goldh-logo.svg";

export function Header() {
  const [location, setLocation] = useLocation();
  const { user, signout, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/") return location === "/";
    if (path === "/intelligence-hub") {
      return location === path || location === "/portfolio-intelligence" || location === "/insights";
    }
    if (path === "/features") {
      return location === path || (location.startsWith("/features/") && !location.startsWith("/features/pulse") && !location.startsWith("/features/catalyst") && !location.startsWith("/features/whale"));
    }
    if (path === "/features/pulse") {
      return location === path || location.startsWith("/features/pulse/");
    }
    if (path === "/features/catalyst") {
      return location === path || location.startsWith("/features/catalyst/");
    }
    if (path === "/features/whale") {
      return location === path || location.startsWith("/features/whale/");
    }
    return location === path;
  };

  const handleSignOut = async () => {
    await signout();
    // Set a flag to prevent the sign-in prompt from appearing immediately after logout
    sessionStorage.setItem("goldh-just-logged-out", "true");
    setLocation("/signin");
  };

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    setLocation(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href={user ? "/home" : "/"}>
          <div className="flex items-center gap-3 hover-elevate cursor-pointer px-3 py-2 rounded-md transition-all">
            <img
              src={logoImage}
              alt="GOLDH Logo"
              className="h-12 md:h-14 lg:h-16 w-auto"
            />
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          <Link href={user ? "/home" : "/"}>
            <Button
              variant={isActive("/") || isActive("/home") ? "default" : "ghost"}
              data-testid="button-nav-home"
              className={isActive("/") || isActive("/home") ? "" : "text-foreground"}
            >
              Home
            </Button>
          </Link>
          <Link href="/intelligence-hub">
            <Button
              variant={isActive("/intelligence-hub") ? "default" : "ghost"}
              data-testid="button-nav-hub"
              className={isActive("/intelligence-hub") ? "" : "text-foreground"}
            >
              Intelligence Hub
            </Button>
          </Link>
          <Link href="/features">
            <Button
              variant={isActive("/features") ? "default" : "ghost"}
              data-testid="button-nav-features"
              className={isActive("/features") ? "" : "text-foreground"}
            >
              Features
            </Button>
          </Link>
          <Link href="/pricing">
            <Button
              variant={isActive("/pricing") ? "default" : "ghost"}
              data-testid="button-nav-pricing"
              className={isActive("/pricing") ? "" : "text-foreground"}
            >
              Pricing
            </Button>
          </Link>
          <Link href="/learn">
            <Button
              variant={isActive("/learn") ? "default" : "ghost"}
              data-testid="button-nav-learn"
              className={isActive("/learn") ? "" : "text-foreground"}
            >
              Learn
            </Button>
          </Link>
          <Link href="/about">
            <Button
              variant={isActive("/about") ? "default" : "ghost"}
              data-testid="button-nav-about"
              className={isActive("/about") ? "" : "text-foreground"}
            >
              About
            </Button>
          </Link>

          {isLoading ? (
            <div className="w-24 h-9 bg-muted/50 rounded-md animate-pulse" />
          ) : user ? (
            <>
              <Link href="/profile">
                <Button
                  variant={isActive("/profile") ? "default" : "ghost"}
                  data-testid="button-nav-profile"
                  className={isActive("/profile") ? "" : "text-foreground"}
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              </Link>
              {user.isAdmin && (
                <>
                  <Link href="/admin">
                    <Button
                      variant={isActive("/admin") || location.startsWith("/admin/") ? "default" : "ghost"}
                      data-testid="button-nav-admin"
                      className={isActive("/admin") || location.startsWith("/admin/") ? "border-[#C7AE6A]" : "text-[#C7AE6A] border-[#C7AE6A]/30 border"}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                </>
              )}
              <Button
                variant="ghost"
                onClick={handleSignOut}
                data-testid="button-nav-signout"
                className="text-foreground"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/signin">
                <Button
                  variant={isActive("/signin") ? "default" : "ghost"}
                  data-testid="button-nav-login"
                  className={isActive("/signin") ? "" : "text-foreground"}
                >
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  variant="default"
                  className="bg-gradient-to-r from-[#C7AE6A] to-[#b99a45] hover:from-[#b99a45] hover:to-[#C7AE6A] text-black font-semibold border-[#C7AE6A]/20"
                  data-testid="button-nav-signup"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open navigation menu"
              data-testid="button-mobile-menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle className="text-left text-primary">Navigation</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-8 mt-8">
              <Button
                variant={isActive("/") || isActive("/home") ? "default" : "ghost"}
                onClick={() => handleNavClick(user ? "/home" : "/")}
                className={`justify-start ${isActive("/") || isActive("/home") ? "" : "text-foreground"}`}
                data-testid="button-mobile-nav-home"
              >
                Home
              </Button>
              <Button
                variant={isActive("/intelligence-hub") ? "default" : "ghost"}
                onClick={() => handleNavClick("/intelligence-hub")}
                className={`justify-start ${isActive("/intelligence-hub") ? "" : "text-foreground"}`}
                data-testid="button-mobile-nav-hub"
              >
                Intelligence Hub
              </Button>
              <Button
                variant={isActive("/features") ? "default" : "ghost"}
                onClick={() => handleNavClick("/features")}
                className={`justify-start ${isActive("/features") ? "" : "text-foreground"}`}
                data-testid="button-mobile-nav-features"
              >
                Features
              </Button>
              <Button
                variant={isActive("/pricing") ? "default" : "ghost"}
                onClick={() => handleNavClick("/pricing")}
                className={`justify-start ${isActive("/pricing") ? "" : "text-foreground"}`}
                data-testid="button-mobile-nav-pricing"
              >
                Pricing
              </Button>
              <Button
                variant={isActive("/learn") ? "default" : "ghost"}
                onClick={() => handleNavClick("/learn")}
                className={`justify-start ${isActive("/learn") ? "" : "text-foreground"}`}
                data-testid="button-mobile-nav-learn"
              >
                Learn
              </Button>
              <Button
                variant={isActive("/about") ? "default" : "ghost"}
                onClick={() => handleNavClick("/about")}
                className={`justify-start ${isActive("/about") ? "" : "text-foreground"}`}
                data-testid="button-mobile-nav-about"
              >
                About
              </Button>


              {isLoading ? (
                <div className="w-full h-9 bg-muted/50 rounded-md animate-pulse" />
              ) : user ? (
                <>
                  <Button
                    variant={isActive("/profile") ? "default" : "ghost"}
                    onClick={() => handleNavClick("/profile")}
                    className={`justify-start ${isActive("/profile") ? "" : "text-foreground"}`}
                    data-testid="button-mobile-nav-profile"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                  {user.isAdmin && (
                    <>
                      <Button
                        variant={isActive("/admin") || location.startsWith("/admin/") ? "default" : "ghost"}
                        onClick={() => handleNavClick("/admin")}
                        className={`justify-start ${isActive("/admin") || location.startsWith("/admin/") ? "border-[#C7AE6A]" : "text-[#C7AE6A] border-[#C7AE6A]/30 border"}`}
                        data-testid="button-mobile-nav-admin"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Admin Control Center
                      </Button>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    onClick={async () => {
                      setMobileMenuOpen(false);
                      await handleSignOut();
                    }}
                    className="justify-start text-foreground"
                    data-testid="button-mobile-nav-signout"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant={isActive("/signin") ? "default" : "ghost"}
                    onClick={() => handleNavClick("/signin")}
                    className={`justify-start ${isActive("/signin") ? "" : "text-foreground"}`}
                    data-testid="button-mobile-nav-login"
                  >
                    Login
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => handleNavClick("/signup")}
                    className="justify-start bg-gradient-to-r from-[#C7AE6A] to-[#b99a45] hover:from-[#b99a45] hover:to-[#C7AE6A] text-black font-semibold"
                    data-testid="button-mobile-nav-signup"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
