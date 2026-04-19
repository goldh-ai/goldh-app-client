import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "./lib/auth";
import { UserPreferencesProvider } from "./lib/userPreferences";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { GlobalContentProtection } from "@/components/GlobalContentProtection";

// Public pages
import Landing from "@/pages/Landing";
import Features from "@/pages/Features";
import FeaturesGuruTalk from "@/pages/FeaturesGuruTalk";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import VerifyEmail from "@/pages/VerifyEmail";
import AboutUs from "@/pages/AboutUs";
import Pricing from "@/pages/Pricing";

// Auth-protected pages
import Dashboard2 from "@/pages/dashboard2/Dashboard2";
import AssetPage from "@/pages/AssetPage";
import Profile from "@/pages/Profile";
import Learn from "@/pages/Learn";
import MarketFoundations from "@/pages/MarketFoundations";
import GoldhModules from "@/pages/GoldhModules";
import MarketDeepDives from "@/pages/MarketDeepDives";
import OpportunityPlaybooks from "@/pages/OpportunityPlaybooks";
import PortfolioIntelligence from "@/pages/PortfolioIntelligence";
import IntelligenceHub from "@/pages/IntelligenceHub";
import CIOInsights from "@/pages/CIOInsights";
import ArchivedCalendar from "@/pages/admin/ArchivedCalendar";

// Feature modules
import PulseOverviewPage from "@/modules/pulse/PulseOverviewPage";
import PulseAssetDetailPage from "@/modules/pulse/PulseAssetDetailPage";
import CatalystFeed from "@/modules/catalyst/pages/CatalystFeed";
import WhaleWatchPage from "@/modules/whale/WhaleWatchPage";
import STREETScorePage from "@/modules/streetscore/pages/STREETScorePage";
import ArbitrageScannerPage from "@/modules/arbitrage/pages/ArbitrageScannerPage";

import NotFound from "@/pages/not-found";

function RootRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 animate-spin border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (user) {
    return <Redirect to="/home" />;
  }

  return <Landing />;
}

function Router() {
  return (
    <Switch>
      {/* Auth */}
      <Route path="/auth/verify">
        <VerifyEmail />
      </Route>
      <Route path="/signin">
        <SignIn />
      </Route>
      <Route path="/signup">
        <SignUp />
      </Route>

      {/* Root */}
      <Route path="/">
        <RootRoute />
      </Route>
      <Route path="/landing" component={Landing} />

      {/* Dashboard */}
      <Route path="/home">
        <ProtectedRoute mode="prompt">
          <Dashboard2 />
        </ProtectedRoute>
      </Route>
      <Route path="/home2">
        <Redirect to="/home" />
      </Route>

      {/* Features */}
      <Route path="/features">
        <ProtectedRoute mode="prompt">
          <Features />
        </ProtectedRoute>
      </Route>
      <Route path="/features/guru-talk">
        <ProtectedRoute mode="prompt">
          <FeaturesGuruTalk />
        </ProtectedRoute>
      </Route>
      <Route path="/features/calendar">
        <ProtectedRoute mode="prompt">
          <ArchivedCalendar />
        </ProtectedRoute>
      </Route>

      {/* Asset */}
      <Route path="/asset/:symbol">
        <ProtectedRoute mode="prompt">
          <AssetPage />
        </ProtectedRoute>
      </Route>

      {/* Pulse */}
      <Route path="/features/pulse">
        <ProtectedRoute mode="prompt">
          <PulseOverviewPage />
        </ProtectedRoute>
      </Route>
      <Route path="/features/pulse/asset/:symbol">
        <ProtectedRoute mode="prompt">
          <PulseAssetDetailPage />
        </ProtectedRoute>
      </Route>

      {/* Catalyst */}
      <Route path="/features/catalyst">
        <ProtectedRoute mode="prompt">
          <CatalystFeed />
        </ProtectedRoute>
      </Route>

      {/* Whale Watch */}
      <Route path="/features/whale">
        <ProtectedRoute mode="prompt">
          <WhaleWatchPage />
        </ProtectedRoute>
      </Route>

      {/* STREETScore */}
      <Route path="/features/streetscore">
        <ProtectedRoute mode="prompt">
          <STREETScorePage />
        </ProtectedRoute>
      </Route>

      {/* Arbitrage Scanner (Module 8) */}
      <Route path="/features/arbitrage">
        <ProtectedRoute mode="prompt">
          <ArbitrageScannerPage />
        </ProtectedRoute>
      </Route>

      {/* User */}
      <Route path="/profile">
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      </Route>
      <Route path="/portfolio-intelligence">
        <ProtectedRoute mode="prompt">
          <PortfolioIntelligence />
        </ProtectedRoute>
      </Route>
      <Route path="/intelligence-hub">
        <ProtectedRoute mode="prompt">
          <IntelligenceHub />
        </ProtectedRoute>
      </Route>
      <Route path="/insights">
        <ProtectedRoute mode="prompt">
          <CIOInsights />
        </ProtectedRoute>
      </Route>

      {/* Learn */}
      <Route path="/learn" component={Learn} />
      <Route path="/learn/market-foundations" component={MarketFoundations} />
      <Route path="/learn/modules" component={GoldhModules} />
      <Route path="/learn/deep-dives" component={MarketDeepDives} />
      <Route path="/learn/playbooks" component={OpportunityPlaybooks} />

      {/* Public */}
      <Route path="/about" component={AboutUs} />
      <Route path="/pricing" component={Pricing} />

      <Route component={NotFound} />
    </Switch>
  );
}

import { useUmfSnapshot, useUmfMovers } from "@/hooks/useUmf";

function DataPrefetcher() {
  useUmfSnapshot();
  useUmfMovers();
  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserPreferencesProvider>
          <TooltipProvider>
            <DataPrefetcher />
            <GlobalContentProtection />
            <Toaster />
            <Router />
          </TooltipProvider>
        </UserPreferencesProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
