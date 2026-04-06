import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  TrendingUp, 
  Droplets, 
  Activity, 
  Zap, 
  Waves, 
  Brain,
  Info,
  DollarSign,
  BarChart3,
  Globe
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { HeroCard } from "@/components/shared/HeroCard";

export default function MarketFoundations() {
  return (
    <AppLayout title="Market Foundations">
      <div className="pb-16 px-6 pt-6 pt-24 lg:pt-6">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <PageHeader 
            title="Market Foundations"
            description="Understanding the Forces That Move Markets"
            label="Knowledge Centre"
          />

          {/* Hero Section */}
          <div className="mb-12">
            <HeroCard
              variant="informational"
              isPageLevel
              title="The Groundwork for Investing"
              subtitle="Master the Fundamental Forces"
              icon={<Info className="w-8 h-8" />}
              description="Financial markets are influenced by a complex interaction of economic conditions, corporate developments, investor sentiment, and global events."
              className="border-[#C7AE6A]/20 bg-[#0A0A0A]"
            />
            
            <div className="mt-8 bg-[#111111] border border-white/5 rounded-3xl p-8">
              <p className="text-muted-foreground leading-relaxed">
                Professional investors rely on structured frameworks to interpret these forces and distinguish meaningful signals from everyday market noise.
                The Market Foundations section introduces the key concepts that help investors understand how markets function and why prices move.
                These concepts form the groundwork for using the GOLDH Intelligence Engine effectively.
              </p>
            </div>
          </div>

          <div className="space-y-12">
            {/* What Moves Financial Markets */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C7AE6A]/10 border border-[#C7AE6A]/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#C7AE6A]" />
                </div>
                <h2 className="text-2xl font-bold text-white">What Moves Financial Markets</h2>
              </div>
              
              <div className="grid gap-6">
                <Card className="bg-[#111111] border-white/5">
                  <CardContent className="p-6">
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      At the most fundamental level, asset prices move because of changes in expectations. 
                      Investors constantly reassess the future outlook for companies, industries, economies, and financial conditions. When expectations change, prices adjust.
                    </p>
                    
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[#C7AE6A]">
                          <BarChart3 className="w-4 h-4" />
                          <h4 className="font-bold">Economic Data</h4>
                        </div>
                        <p className="text-sm text-gray-400">Indicators such as inflation, interest rates, employment figures, and GDP growth provide insights into the overall health of an economy.</p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[#C7AE6A]">
                          <DollarSign className="w-4 h-4" />
                          <h4 className="font-bold">Corporate Performance</h4>
                        </div>
                        <p className="text-sm text-gray-400">Earnings reports, revenue growth, profit margins, and forward guidance can significantly affect the valuation of companies and sectors.</p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[#C7AE6A]">
                          <Droplets className="w-4 h-4" />
                          <h4 className="font-bold">Liquidity Conditions</h4>
                        </div>
                        <p className="text-sm text-gray-400">Changes in monetary policy, central bank actions, and financial system liquidity often influence risk appetite and asset prices.</p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[#C7AE6A]">
                          <Globe className="w-4 h-4" />
                          <h4 className="font-bold">Global Events</h4>
                        </div>
                        <p className="text-sm text-gray-400">Geopolitical developments, regulatory changes, technological innovation, and macroeconomic shifts can alter market dynamics rapidly.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Liquidity */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C7AE6A]/10 border border-[#C7AE6A]/20 flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-[#C7AE6A]" />
                </div>
                <h2 className="text-2xl font-bold text-white">Liquidity: The Fuel of Financial Markets</h2>
              </div>
              
              <Card className="bg-[#111111] border-white/5">
                <CardContent className="p-6 space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    Liquidity refers to how easily assets can be bought or sold without significantly affecting their price.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex gap-3 items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#C7AE6A] mt-2 shrink-0" />
                      <p className="text-sm text-gray-400">When liquidity is abundant, markets tend to rise more easily as capital flows into risk assets.</p>
                    </li>
                    <li className="flex gap-3 items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#C7AE6A] mt-2 shrink-0" />
                      <p className="text-sm text-gray-400">When liquidity tightens, volatility often increases and risk appetite can decline.</p>
                    </li>
                  </ul>
                  <p className="text-sm text-[#C7AE6A] font-semibold mt-4">
                    Tools such as GOLDH Pulse, Whale Watch, and Smart Money Radar help identify shifts in liquidity and capital movement across markets.
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Volatility */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C7AE6A]/10 border border-[#C7AE6A]/20 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-[#C7AE6A]" />
                </div>
                <h2 className="text-2xl font-bold text-white">Volatility: The Market’s Reaction to Information</h2>
              </div>
              
              <Card className="bg-[#111111] border-white/5">
                <CardContent className="p-6 space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    Volatility measures the speed and magnitude of price movements. 
                    Periods of heightened volatility often occur when markets are processing new information.
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    {[
                      "Macroeconomic announcements",
                      "Earnings reports",
                      "Policy decisions",
                      "Geopolitical developments"
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="w-2 h-2 rounded-full bg-[#C7AE6A]" />
                        <span className="text-sm text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    While volatility is often perceived as risk, professional investors also view it as a source of opportunity. Rapid price adjustments can reveal inefficiencies, momentum shifts, or emerging trends.
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Market Catalysts */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C7AE6A]/10 border border-[#C7AE6A]/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-[#C7AE6A]" />
                </div>
                <h2 className="text-2xl font-bold text-white">Market Catalysts</h2>
              </div>
              
              <Card className="bg-[#111111] border-white/5">
                <CardContent className="p-6">
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    A catalyst is an event or development that can change investor expectations and trigger a price movement. 
                    Catalysts often act as the starting point for new market trends.
                  </p>
                  <div className="grid gap-4 md:grid-cols-3">
                    {[
                      "Earnings releases",
                      "Economic data",
                      "Central bank policy",
                      "Regulatory changes",
                      "Tech developments",
                      "Mergers & Acquisitions"
                    ].map((item, i) => (
                      <div key={i} className="text-center p-4 rounded-xl bg-white/5 border border-white/5 hover:border-[#C7AE6A]/30 transition-colors">
                        <span className="text-sm font-semibold text-[#C7AE6A]">{item}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-6 text-center italic">
                    The Catalyst Intelligence Engine is designed to track and interpret these market-moving events.
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Smart Money */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C7AE6A]/10 border border-[#C7AE6A]/20 flex items-center justify-center">
                  <Waves className="w-5 h-5 text-[#C7AE6A]" />
                </div>
                <h2 className="text-2xl font-bold text-white">Smart Money and Institutional Flows</h2>
              </div>
              
              <Card className="bg-[#111111] border-white/5">
                <CardContent className="p-6">
                  <p className="text-muted-foreground leading-relaxed">
                    Large institutional investors — including hedge funds, asset managers, and sovereign wealth funds — control a significant share of global market capital. 
                    When these investors adjust their positions, their capital flows can influence market direction.
                  </p>
                  <p className="text-sm text-[#C7AE6A] mt-4 font-semibold">
                    GOLDH modules such as Whale Watch and Smart Money Radar help monitor large flows, insider activity, and institutional positioning.
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Market Intelligence */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C7AE6A]/10 border border-[#C7AE6A]/20 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-[#C7AE6A]" />
                </div>
                <h2 className="text-2xl font-bold text-white">From Market Understanding to Market Intelligence</h2>
              </div>
              
              <div className="bg-gradient-to-br from-[#111111] to-[#0A0A0A] border border-[#C7AE6A]/20 rounded-3xl p-8">
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Understanding these foundational concepts helps investors interpret the signals generated by the GOLDH platform.
                  Rather than relying solely on headlines or market noise, investors can use structured intelligence to:
                </p>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {[
                    "Identify emerging trends",
                    "Interpret capital flows",
                    "Evaluate catalysts",
                    "Build strong conviction"
                  ].map((item, i) => (
                    <Card key={i} className="bg-white/5 border-white/5 hover:border-[#C7AE6A]/30 transition-all">
                      <CardContent className="p-4 flex flex-col items-center text-center">
                        <div className="w-8 h-8 rounded-full bg-[#C7AE6A]/20 flex items-center justify-center mb-3">
                          <Check className="w-4 h-4 text-[#C7AE6A]" />
                        </div>
                        <span className="text-xs font-bold text-white uppercase tracking-wider">{item}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 text-center">
                  <p className="text-gray-400 mb-6">
                    These foundations prepare investors to move to the next stage of the Learning Hub:
                    <br />
                    <span className="text-white font-bold">Understanding the GOLDH Modules</span>
                  </p>
                  <Link href="/learn/modules">
                    <Button className="bg-[#C7AE6A] hover:bg-[#D4BD7A] text-black font-bold px-8 py-6 rounded-2xl">
                      Explore GOLDH Modules
                    </Button>
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

// Helper icons missing in imports
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
