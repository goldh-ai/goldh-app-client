import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Waves, 
  Zap, 
  TrendingUp, 
  LineChart, 
  ShieldCheck, 
  Globe, 
  Cpu, 
  Search,
  BookOpen,
  ArrowRight
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { HeroCard } from "@/components/shared/HeroCard";

export default function MarketDeepDives() {
  const sections = [
    {
      title: "Macro and Economic Cycles",
      icon: Globe,
      description: "Economic cycles play a central role in shaping financial markets. Periods of expansion, slowdown, and recovery often influence corporate earnings, interest rates, and investor sentiment.",
      details: [
        "Inflation and employment data",
        "Central bank policy shifts",
        "Global trade conditions",
        "Market leadership rotations"
      ]
    },
    {
      title: "Liquidity and Capital Flows",
      icon: Waves,
      description: "Liquidity is one of the most important drivers of financial markets. When liquidity is abundant, risk assets tend to perform well. When it tightens, volatility increases.",
      details: [
        "Monetary policy impacts",
        "Institutional capital allocation",
        "Whale transaction activity",
        "Market participation shifts"
      ]
    },
    {
      title: "Institutional Behaviour",
      icon: ShieldCheck,
      description: "A significant portion of global financial markets is driven by institutionals. Understanding how they operate provides valuable context for interpreting market behaviour.",
      details: [
        "Portfolio rebalancing cycles",
        "Sector rotation strategies",
        "Risk management frameworks",
        "Valuation model driven trends"
      ]
    },
    {
      title: "Technological Innovation",
      icon: Cpu,
      description: "Innovation cycles historically play a major role in shaping markets. Developments can create new industries and transform existing sectors entirely.",
      details: [
        "Emerging investment themes",
        "Digital asset evolution",
        "Launch Radar signals",
        "Disruptive tech adoption"
      ]
    }
  ];

  return (
    <AppLayout title="Market Deep Dives">
      <div className="pb-16 px-6 pt-6 pt-24 lg:pt-6">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <PageHeader 
            title="Market Deep Dives"
            description="Understanding the Structural Forces That Shape Markets"
            label="Knowledge Centre"
          />

          {/* Hero Section */}
          <div className="mb-16">
            <HeroCard
              variant="informational"
              isPageLevel
              title="Beyond the Daily Noise"
              subtitle="Master the Long-Term Market Dynamics"
              icon={<Search className="w-8 h-8" />}
              description="Financial markets do not move randomly. Behind daily price movements are deeper forces that shape long-term market behaviour — economic cycles, liquidity conditions, and shifts in technology and policy."
              className="border-[#C7AE6A]/20 bg-[#0A0A0A]"
            />
            
            <div className="mt-8 bg-[#111111] border border-white/5 rounded-3xl p-8">
              <p className="text-muted-foreground leading-relaxed">
                Professional investors study these structural dynamics closely because they influence asset performance across sectors, regions, and time horizons.
                These insights examine the underlying mechanisms that drive market trends and cycles, rather than focusing only on short-term price movements.
              </p>
            </div>
          </div>

          {/* Core Deep Dive Sections */}
          <div className="grid gap-8 mb-20">
            {sections.map((section, idx) => (
              <Card key={idx} className="bg-[#0A0A0A] border-white/5 overflow-hidden group hover:border-[#C7AE6A]/20 transition-all">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="p-8 md:w-2/3 border-b md:border-b-0 md:border-r border-white/5">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-[#C7AE6A]/10 border border-[#C7AE6A]/20 flex items-center justify-center group-hover:bg-[#C7AE6A]/20 transition-colors">
                          <section.icon className="w-6 h-6 text-[#C7AE6A]" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {section.description}
                      </p>
                    </div>
                    <div className="p-8 md:w-1/3 bg-white/[0.02]">
                      <h3 className="text-xs font-black text-[#C7AE6A] uppercase tracking-widest mb-4">Key Focus Areas</h3>
                      <ul className="space-y-3">
                        {section.details.map((detail, dIdx) => (
                          <li key={dIdx} className="flex items-center gap-3 text-sm text-gray-400">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#C7AE6A]" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Risk Management Section */}
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-[#C7AE6A]/10 border border-[#C7AE6A]/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[#C7AE6A]" />
              </div>
              <h2 className="text-2xl font-bold text-white">Risk Management and Market Discipline</h2>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  Professional investors place significant emphasis on risk management. 
                  Markets are inherently uncertain, and even well-researched investment ideas can be affected by unexpected events or shifts in market sentiment.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  The GOLDH Intelligence Engine provides tools designed to help investors interpret signals more systematically and approach markets with greater discipline.
                </p>
              </div>
              
              <div className="bg-[#111111] border border-white/5 rounded-3xl p-8 space-y-4">
                <h3 className="font-bold text-white">Disciplined Approach Fundamentals:</h3>
                <div className="grid gap-3">
                  {[
                    "Diversification across assets and sectors",
                    "Awareness of macroeconomic conditions",
                    "Monitoring of liquidity and capital flows",
                    "Evaluation of signal strength and conviction"
                  ].map((item, i) => (
                    <div key={i} className="flex gap-3 items-center p-3 rounded-xl bg-white/5 border border-white/5">
                      <div className="w-5 h-5 rounded-full bg-[#C7AE6A]/20 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-[#C7AE6A]" />
                      </div>
                      <span className="text-sm text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Conclusion */}
          <section>
            <div className="bg-gradient-to-br from-[#111111] to-[#0A0A0A] border border-[#C7AE6A]/20 rounded-3xl p-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-6">Building a Deeper Market Perspective</h2>
              <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-10">
                By studying macro cycles, liquidity conditions, institutional behaviour, and innovation trends, investors can develop a broader perspective on market dynamics. 
                These insights help place short-term market movements into a larger context.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/learn">
                  <Button className="w-full sm:w-auto bg-[#C7AE6A] hover:bg-[#D4BD7A] text-black font-bold px-10 py-7 rounded-2xl text-lg">
                    Explore Learning Hub
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/intelligence-hub">
                  <Button variant="outline" className="w-full sm:w-auto border-white/10 hover:bg-white/5 text-white font-bold px-10 py-7 rounded-2xl text-lg">
                    View Market Intel
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}

function Check(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
