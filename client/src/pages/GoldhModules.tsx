import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Activity, 
  Zap, 
  Waves, 
  MessageSquare,
  Shield,
  Rocket,
  Search,
  Target,
  Layers,
  TrendingUp,
  DollarSign,
  Briefcase,
  LineChart,
  Repeat,
  Binary,
  Check
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { HeroCard } from "@/components/shared/HeroCard";

export default function GoldhModules() {
  const moduleCategories = [
    {
      title: "Market Intelligence",
      description: "Monitor markets and identify emerging activity across different asset classes.",
      modules: [
        {
          name: "GOLDH Pulse",
          icon: Activity,
          subtitle: "Your real-time market radar",
          description: "Provides a real-time overview of market movements across equities, crypto, ETFs, and macro indicators. It highlights unusual activity, emerging trends, and shifts in market momentum."
        },
        {
          name: "Guru Talk",
          icon: MessageSquare,
          subtitle: "Insights from influential market participants",
          description: "Tracks commentary, positioning, and insights from respected investors, analysts, and market participants. Helps investors understand how experienced professionals interpret market developments."
        },
        {
          name: "Catalyst Intelligence Engine",
          icon: Zap,
          subtitle: "Understanding what moves markets",
          description: "Tracks and highlights key events such as earnings announcements, economic data releases, regulatory decisions, or technological developments that drive market movements."
        },
        {
          name: "Whale Watch",
          icon: Waves,
          subtitle: "Tracking large capital flows",
          description: "Monitors unusual transaction activity and large market movements from institutional investors. Understanding these flows provides insight into emerging market trends."
        }
      ]
    },
    {
      title: "Signal Confirmation",
      description: "Distinguish meaningful trends from short-term noise with multiple confirmation signals.",
      modules: [
        {
          name: "STREETScore",
          icon: Shield,
          subtitle: "AI-driven conviction scoring",
          description: "Aggregates signals from multiple sources to generate a conviction score that reflects the strength of a potential market opportunity."
        },
        {
          name: "Launch Radar",
          icon: Rocket,
          subtitle: "Tracking emerging investment themes",
          description: "Monitors emerging developments that may represent new investment themes or early-stage opportunities in innovation cycles."
        },
        {
          name: "Smart Money Radar",
          icon: Target,
          subtitle: "Monitoring institutional and insider activity",
          description: "Tracks congressional trades, corporate insider activity, and institutional holdings to see how experienced investors view market conditions."
        }
      ]
    },
    {
      title: "Opportunity Discovery",
      description: "Identify potential opportunities across different market segments and inefficiencies.",
      modules: [
        {
          name: "Yield Finder",
          icon: DollarSign,
          subtitle: "Identifying yield opportunities",
          description: "Scans opportunities that may offer income generation or yield potential across different market segments."
        },
        {
          name: "Arbitrage Scanner",
          icon: Layers,
          subtitle: "Detecting market inefficiencies",
          description: "Identifies pricing differences across exchanges or markets, allowing investors to observe where inefficiencies occur."
        },
        {
          name: "Reward Hunter",
          icon: Zap,
          subtitle: "Tracking ecosystem incentives",
          description: "Tracks rewards, incentives, or participation opportunities within market ecosystems that may provide additional value."
        }
      ]
    },
    {
      title: "Strategy and Positioning",
      description: "Translate opportunities into structured investment approaches and monitor exposure.",
      modules: [
        {
          name: "Copy Trade Finder",
          icon: Search,
          subtitle: "Learning from successful strategies",
          description: "Highlights strategies and positioning patterns used by experienced traders and market participants to observe how successful strategies are structured."
        },
        {
          name: "Portfolio Intelligence",
          icon: Briefcase,
          subtitle: "Monitoring portfolio exposure",
          description: "Helps investors monitor asset exposure, portfolio composition, and overall positioning for a balanced investment approach."
        }
      ]
    },
    {
      title: "Execution and Automation",
      description: "Final stage of the process — implementing and managing strategies efficiently.",
      modules: [
        {
          name: "Robo Hub",
          icon: Repeat,
          subtitle: "Strategy automation tools",
          description: "Provides automation capabilities that allow investors to implement systematic strategies and streamline execution processes."
        },
        {
          name: "Crypto Futures ROI Scanner",
          icon: Binary,
          subtitle: "Exploring opportunities in derivatives",
          description: "Identifies potential opportunities within the crypto derivatives market through leverage, funding dynamics, and volatility patterns."
        }
      ]
    }
  ];

  return (
    <AppLayout title="GOLDH Modules">
      <div className="pb-16 px-6 pt-6 pt-24 lg:pt-6">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <PageHeader 
            title="Understanding the GOLDH Modules"
            description="How the GOLDH Intelligence Engine Works"
            label="Knowledge Centre"
          />

          {/* Intro Card */}
          <div className="mb-16">
            <HeroCard
              variant="informational"
              isPageLevel
              title="The GOLDH Intelligence Engine"
              subtitle="An Integrated System for Better Decisions"
              icon={<Layers className="w-8 h-8" />}
              description="The GOLDH platform is built around a set of interconnected analytical tools designed to help investors move from market information to investment decisions. These tools are organised into 14 modules, each supporting a different stage of the investment process."
              className="border-[#C7AE6A]/20 bg-[#0A0A0A]"
            />
            
            <div className="mt-12">
              <h3 className="text-xl font-bold text-white mb-8 text-center uppercase tracking-widest text-[#C7AE6A]">The Professional Workflow</h3>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {[
                  "Market Intelligence",
                  "Signal Confirmation",
                  "Opportunity Discovery",
                  "Strategy",
                  "Execution"
                ].map((step, i) => (
                  <div key={i} className="flex flex-col md:flex-row items-center gap-4 flex-1">
                    <div className="flex-1 w-full p-4 rounded-xl bg-[#111111] border border-white/5 text-center">
                      <span className="text-xs font-black text-[#C7AE6A] uppercase tracking-wider">{step}</span>
                    </div>
                    {i < 4 && <TrendingUp className="w-4 h-4 text-gray-600 rotate-90 md:rotate-0" />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Categories and Modules */}
          <div className="space-y-20">
            {moduleCategories.map((category, catIdx) => (
              <section key={catIdx} className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-white mb-2">{category.title}</h2>
                  <p className="text-muted-foreground max-w-2xl">{category.description}</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {category.modules.map((module, modIdx) => (
                    <Card key={modIdx} className="bg-[#0A0A0A] border-white/5 hover:border-[#C7AE6A]/20 transition-all group">
                      <CardContent className="p-8">
                        <div className="flex gap-6">
                          <div className="w-12 h-12 rounded-xl bg-[#C7AE6A]/10 border border-[#C7AE6A]/20 flex items-center justify-center shrink-0 group-hover:bg-[#C7AE6A]/20 transition-colors">
                            <module.icon className="w-6 h-6 text-[#C7AE6A]" />
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-xl font-bold text-white group-hover:text-[#C7AE6A] transition-colors">{module.name}</h3>
                            <p className="text-sm font-semibold text-gray-300">{module.subtitle}</p>
                            <p className="text-sm text-muted-foreground leading-relaxed pt-2">
                              {module.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Conclusion */}
          <section className="mt-32">
            <div className="bg-gradient-to-br from-[#111111] to-[#0A0A0A] border border-[#C7AE6A]/20 rounded-3xl p-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-6">A System Designed to Work Together</h2>
              <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-10">
                Each module plays a specific role within the GOLDH Intelligence Engine. Together, these tools provide a structured framework for interpreting markets and identifying opportunities.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <div className="px-6 py-4 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-sm font-bold text-white">Identify Trends</span>
                </div>
                <div className="px-6 py-4 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-sm font-bold text-white">Interpret Capital Flows</span>
                </div>
                <div className="px-6 py-4 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-sm font-bold text-white">Evaluate Catalysts</span>
                </div>
                <div className="px-6 py-4 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-sm font-bold text-white">Build Conviction</span>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-gray-400">
                  Ready to start using the engine?
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/features/pulse">
                    <Button className="w-full sm:w-auto bg-[#C7AE6A] hover:bg-[#D4BD7A] text-black font-bold px-10 py-7 rounded-2xl text-lg">
                      Launch GOLDH Pulse
                    </Button>
                  </Link>
                  <Link href="/learn">
                    <Button variant="outline" className="w-full sm:w-auto border-white/10 hover:bg-white/5 text-white font-bold px-10 py-7 rounded-2xl text-lg">
                      Back to Learning Hub
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
