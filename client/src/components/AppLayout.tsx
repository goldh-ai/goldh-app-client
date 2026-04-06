import React, { useState, createContext, useContext, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import {
    LayoutDashboard,
    Activity,
    Zap,
    Waves,
    Brain,
    Briefcase,
    LineChart,
    MessageSquare,
    Sparkles,
    BookOpen,
    User,
    Shield,
    Info,
    Tag,
    LogOut,
    Menu,
    ChevronRight,
    PanelLeftClose,
    PanelLeftOpen,
    MoreHorizontal,
    BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/lib/auth";
import { useUserPreferences } from "@/lib/userPreferences";
import { AlertsBell } from "@/modules/pulse/components/AlertsBell";
import logoImage from "@assets/goldh-logo.svg";

// ─── Layout Context ────────────────────────────────────────────────────────────
interface AppLayoutContextValue {
    collapsed: boolean;
}
const AppLayoutContext = createContext<AppLayoutContextValue>({ collapsed: false });
export const useAppLayout = () => useContext(AppLayoutContext);

// ─── Nav data ─────────────────────────────────────────────────────────────────
const homeItem = { name: "Home", icon: LayoutDashboard, path: "/home" };

const featuresItems = [
    { name: "GoldH Pulse", icon: Activity, path: "/features/pulse" },
    { name: "Guru Talk", icon: MessageSquare, path: "/features/guru-talk" },
    { name: "Catalyst Intelligence", icon: Zap, path: "/features/catalyst" },
    { name: "Whale Watch", icon: Waves, path: "/features/whale" },
    { name: "STREETScore", icon: BarChart3, path: "/features/streetscore" },
];

const intelligenceHubItems = [
    { name: "Portfolio Intelligence", icon: Briefcase, path: "/portfolio-intelligence" },
    { name: "CIO Insights", icon: LineChart, path: "/insights" },
];

const exploreItems = [
    { name: "Learn", icon: BookOpen, path: "/learn" },
];

// Bottom tab items (mobile primary nav)
const bottomTabs = [
    { name: "Home", icon: LayoutDashboard, path: "/home" },
    { name: "Pulse", icon: Activity, path: "/features/pulse" },
    { name: "Catalyst", icon: Zap, path: "/features/catalyst" },
    { name: "Whale", icon: Waves, path: "/features/whale" },
];

// ─── Path labels (for breadcrumbs) ────────────────────────────────────────────
const pathLabels: Record<string, string> = {
    "/home": "Home",
    "/admin/archive/home": "Home (Legacy)",
    "/features": "Features",
    "/features/pulse": "Pulse",
    "/features/catalyst": "Catalyst",
    "/features/whale": "Whale Watch",
    "/features/guru-talk": "Guru Talk",
    "/features/streetscore": "STREETScore",
    "/intelligence-hub": "Intelligence Hub",
    "/portfolio-intelligence": "Portfolio Intelligence",
    "/insights": "CIO Insights",
    "/profile": "Profile",
    "/learn": "Learn",
    "/wiki": "Wiki",
};

// ─── Breadcrumbs ──────────────────────────────────────────────────────────────
function Breadcrumbs({ location }: { location: string }) {
    // Build crumbs: Home > Section > Sub-page
    const crumbs: { label: string; href: string }[] = [];

    // Walk path segments to build intermediate crumbs
    const segments = location.split("/").filter(Boolean);
    let current = "";
    for (const seg of segments) {
        current += `/${seg}`;
        const label = pathLabels[current];
        if (label) {
            crumbs.push({ label, href: current });
        }
    }

    if (crumbs.length <= 1) return null;

    return (
        <nav aria-label="Breadcrumb" className="hidden md:flex items-center gap-1.5 text-[11px] text-gray-500">
            {crumbs.map((crumb, i) => (
                <React.Fragment key={crumb.href}>
                    {i > 0 && <ChevronRight className="w-3 h-3 text-gray-600 shrink-0" />}
                    {i === crumbs.length - 1 ? (
                        <span className="text-gray-300 font-semibold" aria-current="page">
                            {crumb.label}
                        </span>
                    ) : (
                        <Link href={crumb.href}>
                            <span className="hover:text-white transition-colors cursor-pointer font-medium">
                                {crumb.label}
                            </span>
                        </Link>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
}

// ─── NavItem ──────────────────────────────────────────────────────────────────
function NavItem({
    item,
    active,
    collapsed,
    onClick,
}: {
    item: { name: string; icon: React.ElementType; path: string };
    active: boolean;
    collapsed: boolean;
    onClick?: () => void;
}) {
    return (
        <Link href={item.path} onClick={onClick}>
            <div
                title={collapsed ? item.name : undefined}
                className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer group",
                    collapsed && "justify-center px-2",
                    active
                        ? "bg-[#C7AE6A]/10 text-[#C7AE6A]"
                        : "hover:bg-[#1a1a1a] text-gray-400 hover:text-white"
                )}
            >
                <item.icon
                    className={cn(
                        "w-4 h-4 shrink-0",
                        active ? "text-[#C7AE6A]" : "group-hover:text-white"
                    )}
                />
                {!collapsed && (
                    <span className="text-sm font-medium truncate">{item.name}</span>
                )}
            </div>
        </Link>
    );
}

// ─── NavGroup ─────────────────────────────────────────────────────────────────
function NavGroup({
    title,
    items,
    collapsed,
    location,
    onClick,
}: {
    title: string;
    items: { name: string; icon: React.ElementType; path: string }[];
    collapsed: boolean;
    location: string;
    onClick?: () => void;
}) {
    return (
        <div className="mb-6">
            {!collapsed && (
                <h4 className="px-3 mb-2 text-[10px] font-black uppercase tracking-widest text-gray-600">
                    {title}
                </h4>
            )}
            {collapsed && <div className="mx-auto mb-2 h-px w-6 bg-[#1a1a1a]" />}
            <div className="space-y-1">
                {items.map((item) => {
                    const active =
                        item.path === "/home"
                            ? location === "/home"
                            : item.path === "/features"
                                ? location === "/features"
                                : location.startsWith(item.path);
                    return (
                        <NavItem
                            key={item.name}
                            item={item}
                            active={active}
                            collapsed={collapsed}
                            onClick={onClick}
                        />
                    );
                })}
            </div>
        </div>
    );
}

// ─── SidebarContent ───────────────────────────────────────────────────────────
function SidebarContent({
    collapsed,
    location,
    onCollapseToggle,
    onNavClick,
}: {
    collapsed: boolean;
    location: string;
    onCollapseToggle?: () => void;
    onNavClick?: () => void;
}) {
    const { user, signout } = useAuth();
    const [, setLocation] = useLocation();

    return (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div
                className={cn(
                    "p-4 flex items-center border-b border-[#1a1a1a] transition-all duration-300",
                    collapsed ? "justify-center" : "pl-5"
                )}
            >
                {collapsed ? (
                    <div className="w-8 h-8 rounded bg-[#C7AE6A] flex items-center justify-center shrink-0">
                        <span className="text-black font-black text-lg">G</span>
                    </div>
                ) : (
                    <Link href="/home">
                        <img
                            src={logoImage}
                            alt="GOLDH"
                            className="h-8 w-auto cursor-pointer"
                        />
                    </Link>
                )}
            </div>

            {/* Nav */}
            <nav
                className="flex-1 px-2 py-4 overflow-y-auto custom-scrollbar"
                aria-label="Main navigation"
            >
                {user && (
                    <>
                        <NavItem
                            item={homeItem}
                            active={location === "/home"}
                            collapsed={collapsed}
                            onClick={onNavClick}
                        />
                        <div className="mb-4" />
                        <NavGroup
                            title="Features"
                            items={featuresItems}
                            collapsed={collapsed}
                            location={location}
                            onClick={onNavClick}
                        />
                        <NavGroup
                            title="Intelligence Hub"
                            items={intelligenceHubItems}
                            collapsed={collapsed}
                            location={location}
                            onClick={onNavClick}
                        />
                    </>
                )}
                <NavGroup
                    title="Explore"
                    items={exploreItems}
                    collapsed={collapsed}
                    location={location}
                    onClick={onNavClick}
                />
            </nav>

            {/* Footer */}
            <div className="p-3 border-t border-[#1a1a1a] space-y-1">
                {/* Collapse toggle (desktop only) */}
                {onCollapseToggle && (
                    <button
                        onClick={onCollapseToggle}
                        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                        className={cn(
                            "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-gray-500 hover:text-white hover:bg-[#1a1a1a] transition-all text-sm font-medium",
                            collapsed && "justify-center px-2"
                        )}
                    >
                        {collapsed ? (
                            <PanelLeftOpen className="w-4 h-4 shrink-0" />
                        ) : (
                            <>
                                <PanelLeftClose className="w-4 h-4 shrink-0" />
                                <span>Collapse</span>
                            </>
                        )}
                    </button>
                )}


                {/* Admin (conditional) */}
                {user?.isAdmin && (
                    <>
                        <Link href="/admin" onClick={onNavClick}>
                            <div
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#C7AE6A]/10 transition-all cursor-pointer group text-[#C7AE6A]/70 hover:text-[#C7AE6A]",
                                    location === "/admin" && "bg-[#C7AE6A]/10 text-[#C7AE6A]",
                                    collapsed && "justify-center px-2"
                                )}
                                title={collapsed ? "Admin" : undefined}
                            >
                                <Shield className="w-4 h-4 shrink-0" />
                                {!collapsed && <span className="text-sm font-medium">Admin</span>}
                            </div>
                        </Link>
                        
                        <Link href="/wiki" onClick={onNavClick}>
                            <div
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#C7AE6A]/10 transition-all cursor-pointer group text-[#C7AE6A]/70 hover:text-[#C7AE6A]",
                                    location === "/wiki" && "bg-[#C7AE6A]/10 text-[#C7AE6A]",
                                    collapsed && "justify-center px-2"
                                )}
                                title={collapsed ? "Wiki" : undefined}
                            >
                                <BookOpen className="w-4 h-4 shrink-0" />
                                {!collapsed && <span className="text-sm font-medium">Wiki</span>}
                            </div>
                        </Link>
                    </>
                )}

                {/* Pricing */}
                <Link href="/pricing" onClick={onNavClick}>
                    <div
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#1a1a1a] transition-all cursor-pointer group text-gray-400 hover:text-white",
                            location === "/pricing" && "bg-[#C7AE6A]/10 text-[#C7AE6A]",
                            collapsed && "justify-center px-2"
                        )}
                        title={collapsed ? "Pricing" : undefined}
                    >
                        <Tag className="w-4 h-4 shrink-0" />
                        {!collapsed && <span className="text-sm font-medium">Pricing</span>}
                    </div>
                </Link>

                {/* Sign Out */}
                <button
                    onClick={async () => {
                        await signout();
                        setLocation("/signin");
                    }}
                    aria-label="Sign out"
                    className={cn(
                        "flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-red-500/10 transition-all cursor-pointer group text-gray-400 hover:text-red-400",
                        collapsed && "justify-center px-2"
                    )}
                    title={collapsed ? "Sign Out" : undefined}
                >
                    <LogOut className="w-4 h-4 shrink-0" />
                    {!collapsed && <span className="text-sm font-medium">Sign Out</span>}
                </button>
            </div>
        </div>
    );
}

// ─── Plan tier chip ────────────────────────────────────────────────────────────
function PlanTierChip({ tier }: { tier: string }) {
    const upper = tier.toUpperCase();
    const isAdmin = tier === "admin";
    const isFree = tier === "free";
    return (
        <span
            className={cn(
                "text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border",
                isAdmin
                    ? "bg-[#C7AE6A]/20 text-[#C7AE6A] border-[#C7AE6A]/30"
                    : isFree
                        ? "bg-[#1a1a1a] text-gray-500 border-[#2a2a2a]"
                        : "bg-[#C7AE6A]/10 text-[#C7AE6A] border-[#C7AE6A]/20"
            )}
        >
            {upper}
        </span>
    );
}

// ─── Mobile Bottom Tab Bar ─────────────────────────────────────────────────────
function MobileBottomTabs({
    location,
    onMoreClick,
    visible = true,
}: {
    location: string;
    onMoreClick: () => void;
    visible?: boolean;
}) {
    return (
        <div className={cn(
            "lg:hidden fixed bottom-0 left-0 right-0 z-50 h-16 bg-[#0a0a0a] border-t border-[#1a1a1a] flex items-center justify-around px-2 transition-transform duration-300 ease-in-out",
            !visible && "translate-y-full"
        )}>
            {bottomTabs.map((tab) => {
                const active =
                    tab.path === "/home"
                        ? location === "/home"
                        : location.startsWith(tab.path);
                return (
                    <Link key={tab.name} href={tab.path}>
                        <div
                            className={cn(
                                "flex flex-col items-center gap-1 px-3 py-1 rounded-lg cursor-pointer transition-colors",
                                active ? "text-[#C7AE6A]" : "text-gray-500 hover:text-gray-300"
                            )}
                        >
                            <tab.icon className="w-5 h-5" />
                            <span className="text-[10px] font-semibold">{tab.name}</span>
                        </div>
                    </Link>
                );
            })}
            {/* More button */}
            <button
                onClick={onMoreClick}
                className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-gray-500 hover:text-gray-300 transition-colors"
                aria-label="More navigation options"
            >
                <MoreHorizontal className="w-5 h-5" />
                <span className="text-[10px] font-semibold">More</span>
            </button>
        </div>
    );
}

// ─── AppLayout ────────────────────────────────────────────────────────────────
interface AppLayoutProps {
    children: React.ReactNode;
    title: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, title }) => {
    const [location, setLocation] = useLocation();
    const { user } = useAuth();
    const { preferences, updatePreferences } = useUserPreferences();
    const collapsed = preferences.sidebarCollapsed;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        const handleScroll = () => {
            const currentScrollY = container.scrollTop;
            
            // Scroll down: hide. Scroll up: show.
            // Minimum threshold of 10px to avoid flickering
            if (Math.abs(currentScrollY - lastScrollY.current) < 10) return;

            if (currentScrollY > lastScrollY.current && currentScrollY > 60) {
                setIsBottomNavVisible(false);
            } else {
                setIsBottomNavVisible(true);
            }
            lastScrollY.current = currentScrollY;
        };

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, []);


    const setCollapsed = (val: boolean | ((prev: boolean) => boolean)) => {
        const newValue = typeof val === 'function' ? val(collapsed) : val;
        updatePreferences({ sidebarCollapsed: newValue });
    };

    const sidebarWidth = collapsed ? "w-[64px]" : "w-64";
    const planTier = user?.planTier ?? "free";
    const userInitial = (user?.name ?? user?.email ?? "U")[0].toUpperCase();

    return (
        <AppLayoutContext.Provider value={{ collapsed }}>
            <div className="flex h-screen bg-[#050505] text-gray-300 font-sans antialiased overflow-hidden">
                {/* Desktop Sidebar */}
                <aside
                    className={cn(
                        "hidden lg:flex border-r border-[#1a1a1a] bg-[#0a0a0a] flex-col shrink-0 transition-all duration-300",
                        sidebarWidth
                    )}
                    aria-label="Main sidebar"
                >
                    <SidebarContent
                        collapsed={collapsed}
                        location={location}
                        onCollapseToggle={() => setCollapsed((c) => !c)}
                    />
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    {/* Top Header */}
                    <header className="h-14 border-b border-[#1a1a1a] bg-[#0a0a0a] flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0">
                        <div className="flex items-center gap-4 min-w-0">
                            {/* Mobile: hamburger */}
                            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        aria-label="Open navigation menu"
                                        className="lg:hidden text-gray-400 hover:text-white h-11 w-11"
                                    >
                                        <Menu className="w-5 h-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent
                                    side="left"
                                    className="p-0 w-64 bg-[#0a0a0a] border-r border-[#1a1a1a]"
                                >
                                    <SidebarContent
                                        collapsed={false}
                                        location={location}
                                        onNavClick={() => setIsMobileMenuOpen(false)}
                                    />
                                </SheetContent>
                            </Sheet>

                            {/* Page title / breadcrumbs */}
                            <div className="flex flex-col justify-center min-w-0">
                                <Breadcrumbs location={location} />
                                {/* Mobile fallback: plain title */}
                                <span className="text-sm font-semibold text-white truncate lg:hidden">
                                    {pathLabels[location] || title.split(">").pop()?.trim() || title}
                                </span>
                            </div>
                        </div>

                        {/* Right side */}
                        <div className="flex items-center gap-3 shrink-0">
                            {/* AlertsBell */}
                            <AlertsBell
                                tier={planTier}
                                triggeredCount={0}
                                onClick={() => setLocation("/features/pulse")}
                            />

                            {/* Plan tier chip (desktop) */}
                            <div className="hidden lg:block">
                                <PlanTierChip tier={planTier} />
                            </div>

                            <div className="hidden lg:block h-4 w-px bg-[#1a1a1a]" />

                        {/* Avatar or Login Button */}
                        {user ? (
                            <Link href="/profile">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#C7AE6A] to-[#E5D5A5] flex items-center justify-center shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
                                    <span className="text-[10px] font-black text-black">{userInitial}</span>
                                </div>
                            </Link>
                        ) : (
                            <Link href="/signin">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 border-[#C7AE6A]/30 text-[#C7AE6A] hover:bg-[#C7AE6A]/10 text-xs font-bold uppercase tracking-widest"
                                >
                                    Login
                                </Button>
                            </Link>
                        )}
                        </div>
                    </header>

                    {/* Content Area */}
                    <div 
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto custom-scrollbar bg-[#050505] lg:pb-0 pb-16"
                    >
                        {children}
                    </div>
                </main>

                {/* Mobile Bottom Tab Bar */}
                <MobileBottomTabs
                    location={location}
                    onMoreClick={() => setIsMobileMenuOpen(true)}
                    visible={isBottomNavVisible}
                />
            </div>
        </AppLayoutContext.Provider>
    );
};

export default AppLayout;
