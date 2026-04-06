import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Header } from "@/components/Header";
import { FeatureCard } from "@/components/FeatureCard";
import { FOMABox } from "@/components/FOMABox";
import { NewsScroller } from "@/components/NewsScroller";
import { PreviewWidgets } from "@/components/PreviewWidgets";
import { ComingSoon } from "@/components/ComingSoon";
import { SignInPrompt } from "@/components/SignInPrompt";
import { useAuth } from "@/lib/auth";
import { BarChart3, Newspaper, Zap, Activity, PieChart, BookOpen, Mail } from "lucide-react";
import { SiX, SiInstagram } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import logoImage from "@assets/goldh-logo_1762272901250.png";

const features = [
  {
    icon: BarChart3,
    title: "GOLDH Pulse",
    description: "Real-time snapshots across crypto, equities, FX, and commodities — all confidence-scored and explained in plain English."
  },
  {
    icon: Newspaper,
    title: "Guru Talk",
    description: "AI-tagged news from leading crypto and financial sources, filtered by asset and relevance so you cut through the noise."
  },
  {
    icon: Zap,
    title: "Catalyst intelligence",
    description: "Macro events, earnings releases, and FRED data scored for market impact — so you see what's driving moves before they happen."
  },
  {
    icon: Activity,
    title: "Whale Watch",
    description: "On-chain wallet movements and net flow data surfaced in real time, revealing institutional momentum before it hits price."
  },
  {
    icon: PieChart,
    title: "Portfolio intelligence",
    description: "Advisory signals and asset analysis tuned to your holdings — giving you clarity on risk, exposure, and opportunity."
  },
  {
    icon: BookOpen,
    title: "Learning Hub",
    description: "Structured guides, explainers, and deep dives spanning crypto, macro, and traditional markets — built for every level."
  }
];

export default function Landing() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  const scrollToFeatures = () => {
    const element = document.getElementById("features");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleGetStarted = () => {
    if (user) {
      setLocation("/home");
    } else {
      setLocation("/signup");
    }
  };

  const buttonText = isLoading ? "Loading..." : (user ? "Go to Dashboard" : "Sign Up Free");
  const ctaButtonText = isLoading ? "Loading..." : (user ? "Go to Dashboard" : "Get Started Now");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SignInPrompt />

      {/* News Ticker */}
      <NewsScroller />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 pt-20 sm:pt-0">
        <div className="container mx-auto py-12 sm:py-0">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Logo Side */}
            <div className="flex items-center justify-center order-1 md:order-1">
              <img
                src={logoImage}
                alt="GOLDH - Golden Horizon"
                className="h-[280px] sm:h-[400px] md:h-[480px] lg:h-[560px] w-auto mx-auto"
                data-testid="img-hero-logo"
              />
            </div>

            {/* Content Side */}
            <div className="space-y-6 sm:space-y-8 order-2 md:order-2 text-center md:text-left">
              <div className="space-y-4 sm:space-y-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-[#e3d6b4] via-[#C7AE6A] to-[#b99a45] bg-clip-text text-transparent pb-2">
                  Building Wealth,<br />Bridging Worlds
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto md:mx-0">
                  Track, analyze, and grow your digital assets.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
                <Button
                  size="lg"
                  className="text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto"
                  onClick={handleGetStarted}
                  disabled={isLoading}
                  data-testid="button-hero-start"
                >
                  {buttonText}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto"
                  onClick={scrollToFeatures}
                  data-testid="button-hero-learn"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Preview Widgets - Crypto Intelligence */}
      <PreviewWidgets />

      {/* FOMO Boxes - Token Launching */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 bg-card/30">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Why join early?</h2>
            <p className="text-muted-foreground">Early members get exclusive benefits as we build out the platform.</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <FOMABox
              title="Early User Status"
              description="Sign up early and get exclusive benefits. More rewards, more features, more opportunities. Your journey to crypto mastery starts here."
              variant="premium"
            />
            <FOMABox
              title="Intelligent Finance Platform"
              description="All-in-one crypto intelligence. Market data, news, events, and insights in a single platform. Your command center for digital assets."
              variant="premium"
            />
            <FOMABox
              title="Premium Access Coming Soon"
              description="Subscribe to unlock exclusive features. Advanced analytics, premium insights, and priority support. Be ready when we launch!"
              variant="premium"
            />
          </div>
        </div>
      </section>

      {/* Features Section - Everything You Need */}
      <section id="features" className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 scroll-mt-16 bg-[#1a1a1a]">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16 md:mb-20 space-y-3 sm:space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
              Everything you need
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Six live modules covering the full intelligence stack — built for beginners and seasoned investors alike
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon to GOLDH */}
      <ComingSoon />

      {/* CTA Section - Ready to Start */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C7AE6A]/10 via-background to-[#b99a45]/10"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

        <div className="container mx-auto text-center space-y-6 sm:space-y-8 relative z-10">
          <div className="inline-block px-4 sm:px-6 py-2 bg-primary/10 border border-primary/20 rounded-full mb-2 sm:mb-4">
            <span className="text-primary font-semibold text-sm sm:text-base">Limited Time Offer</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground px-4">
            Ready to Start Your Crypto Journey?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Join thousands of users who trust GOLDH for their crypto intelligence needs. Start free today and unlock premium features as you grow.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-2 sm:pt-4 px-4">
            <Button
              size="lg"
              className="text-base sm:text-lg px-8 sm:px-12 w-full sm:w-auto shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
              onClick={handleGetStarted}
              disabled={isLoading}
              data-testid="button-cta-signup"
            >
              {ctaButtonText}
            </Button>
            <Link href="/learn" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="text-base sm:text-lg px-8 sm:px-12 w-full border-primary/30 hover:border-primary/50 hover:bg-primary/5"
                data-testid="button-cta-learn"
              >
                Explore Learning Hub
              </Button>
            </Link>
          </div>

          <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 md:gap-12 text-xs sm:text-sm text-muted-foreground px-4">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Free forever plan</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-[#1a1a1a]">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10 sm:mb-12 md:mb-16 space-y-3 sm:space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
              Frequently asked questions
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-4">
              Everything you need to know about GOLDH
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-2">
            {[
              {
                question: "What is GOLDH?",
                answer: "GOLDH is an intelligent finance platform that brings together real-time market data, AI-powered insights, and human-level clarity in one unified view."
              },
              {
                question: "Is GOLDH a trading platform?",
                answer: "No — GOLDH is not an exchange or brokerage. We're an intelligence platform that helps you understand markets before you take action wherever you prefer to trade."
              },
              {
                question: "What markets does GOLDH cover?",
                answer: "Crypto, global equities, commodities, indices, Forex, and major macroeconomic events all in one clean dashboard."
              },
              {
                question: "What makes GOLDH different?",
                answer: "No noise. No hype. No nonsense. Just clarity, signal, and perspective. GOLDH combines multi-asset data, AI explanation, expert insight, and event prediction in a single, intuitive platform."
              },
              {
                question: "Who is GOLDH for?",
                answer: "Anyone who wants a smarter way to understand the digital asset markets: Beginners, Investors, Traders, Founders, Wealth builders, Crypto-curious users, and Traditional finance professionals exploring digital assets."
              },
              {
                question: "Is the platform free?",
                answer: "Yes — our Free Tier gives access to core modules. Advanced features and deeper insights sit inside Essential & Premium tiers which will roll out progressively."
              },
              {
                question: "Does GOLDH give financial advice?",
                answer: "No. We provide intelligence, not instructions. Our tools help you understand markets — the decisions are yours."
              },
              {
                question: "How does the AI work?",
                answer: "Our AI aggregates multi-source data, identifies key market drivers, summarises expert commentary, and explains events in plain English so you can see why markets move, not just that they moved."
              },
              {
                question: "Is my data private and secure?",
                answer: "Absolutely. We follow best-practice security controls, industry-grade encryption, and strict privacy protocols. Your data is yours and it stays that way."
              },
              {
                question: "What's coming next?",
                answer: "Modules such as Arbitrage scanner, Copy Trade, Robo Trading Hub, Reward Hunter, and Congressional trading tracker will roll out progressively."
              },
              {
                question: "Why launch at AusCryptoCon?",
                answer: "Because one of GOLDH's co-founders is based in Australia and we believe in launching where our leadership is deeply connected to the community. Australia's crypto space is bold, curious, and ahead of the curve."
              },
              {
                question: "What is the Learning Hub and Academy?",
                answer: "We're building the GOLDH Learning Hub and Academy — guides, explainers, deep dives, structured paths. Rolling out progressively."
              }
            ].map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="bg-card border border-border rounded-lg px-4 sm:px-6 hover:border-primary/30 transition-colors data-[state=open]:border-primary/40"
                data-testid={`faq-item-${index}`}
              >
                <AccordionTrigger className="text-base sm:text-lg font-semibold text-foreground hover:text-primary transition-colors py-4 sm:py-5 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base text-muted-foreground leading-relaxed pb-4 sm:pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-8 sm:mt-10 md:mt-12 text-center">
            <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">Still have questions?</p>
            <a href="mailto:hello@goldh.ai">
              <Button variant="outline" className="border-primary/30 hover:border-primary/50 hover:bg-primary/5 w-full sm:w-auto">
                Contact Support
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-border bg-black">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-primary">GOLDH</h4>
              <p className="text-sm text-muted-foreground">
                Building Wealth, Bridging Worlds. Your gateway to crypto intelligence.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/home" className="hover:text-primary transition-colors">Dashboard</Link></li>
                <li><Link href="/learn" className="hover:text-primary transition-colors">Learning Hub</Link></li>
                <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><Link href="/about" className="hover:text-primary transition-colors">About us</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Contact</h4>
              <div className="flex items-center gap-4">
                <a
                  href="mailto:hello@goldh.ai"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Email"
                  data-testid="link-email"
                >
                  <Mail className="w-5 h-5" />
                </a>
                <a
                  href="https://www.linkedin.com/company/goldh/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="LinkedIn"
                  data-testid="link-linkedin"
                >
                  <FaLinkedin className="w-5 h-5" />
                </a>
                <a
                  href="https://x.com/goldh_ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="X (Twitter)"
                  data-testid="link-x"
                >
                  <SiX className="w-5 h-5" />
                </a>
                <a
                  href="https://www.instagram.com/goldh_ai?brid=BFu4soBqVEyoow8zU2JRlQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Instagram"
                  data-testid="link-instagram"
                >
                  <SiInstagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-border/50 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2025–{new Date().getFullYear()} GOLDH - Golden Horizon. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
