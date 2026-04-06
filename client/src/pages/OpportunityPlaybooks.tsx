import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Target, 
  Search, 
  Zap, 
  Waves, 
  TrendingUp, 
  Shield, 
  Rocket, 
  DollarSign, 
  Layers,
  ArrowRight,
  ChevronRight
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { HeroCard } from "@/components/shared/HeroCard";

export default function OpportunityPlaybooks() {
  const playbooks = [
    {
      title: "Playbook 1: Trading Market Catalysts",
      description: "Market catalysts are events that can trigger meaningful price movements. Examples include earnings, macro data, and policy decisions.",
      steps: [
        { label: "Step 1", title: "Identify the catalyst", desc: "Use the Catalyst Intelligence Engine to track upcoming market-moving events." },
        { label: "Step 2", title: "Monitor market reaction", desc: "Observe real-time price movements through GOLDH Pulse." },
        { label: "Step 3", title: "Evaluate signal strength", desc: "Check STREETScore to assess the conviction of the signal." },
        { label: "Step 4", title: "Confirm capital flows", desc: "Use Whale Watch and Smart Money Radar to confirm institutional support." }
      ]
    },
    {
      title: "Playbook 2: Following Smart Money Activity",
      description: "Institutional investors move large amounts of capital. Tracking these flows provides insight into emerging trends or shifts in sentiment.",
      steps: [
        { label: "Step 1", title: "Identify unusual flows", desc: "Use Whale Watch to detect significant capital movements." },
        { label: "Step 2", title: "Understand the context", desc: "Review relevant developments through Catalyst Intelligence." },
        { label: "Step 3", title: "Confirm market sentiment", desc: "Check STREETScore and insights from Guru Talk." },
        { label: "Step 4", title: "Monitor price behaviour", desc: "Observe ongoing market activity through GOLDH Pulse." }
      ]
    },
    {
      title: "Playbook 3: Identifying Emerging Themes",
      description: "Innovation cycles constantly produce new technologies. Investors who identify these early may gain insights into future growth area.",
      steps: [
        { label: "Step 1", title: "Track emerging developments", desc: "Use Launch Radar to identify new technologies or themes." },
        { label: "Step 2", title: "Monitor market activity", desc: "Observe early price movements through GOLDH Pulse." },
        { label: "Step 3", title: "Evaluate supporting signals", desc: "Check STREETScore and capital flows through Whale Watch." },
        { label: "Step 4", title: "Assess long-term potential", desc: "Use insights from Guru Talk and Deep Dives." }
      ]
    },
    {
      title: "Playbook 4: Yield and Ecosystem Opportunities",
      description: "Identify yield opportunities or ecosystem incentives that may complement traditional investment strategies.",
      steps: [
        { label: "Step 1", title: "Identify yield opportunities", desc: "Use Yield Finder to scan available yield strategies." },
        { label: "Step 2", title: "Track ecosystem incentives", desc: "Monitor opportunities through Reward Hunter." },
        { label: "Step 3", title: "Evaluate sustainability", desc: "Assess market conditions through Pulse and Catalyst Intelligence." }
      ]
    },
    {
      title: "Playbook 5: Monitoring Market Inefficiencies",
      description: "Financial markets are generally efficient, but temporary pricing differences can occur across exchanges or markets.",
      steps: [
        { label: "Step 1", title: "Detect price discrepancies", desc: "Use Arbitrage Scanner to identify market inefficiencies." },
        { label: "Step 2", title: "Confirm market conditions", desc: "Review overall activity through GOLDH Pulse." },
        { label: "Step 3", title: "Assess signal quality", desc: "Check STREETScore and relevant catalysts." }
      ]
    }
  ];

  return (
    <AppLayout title="Opportunity Playbooks">
      <div className="pb-16 px-6 pt-6 pt-24 lg:pt-6">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <PageHeader 
            title="Opportunity Playbooks"
            description="Turning Market Intelligence into Investment Opportunities"
            label="Knowledge Centre"
          />

          {/* Hero Section */}
          <div className="mb-16">
            <HeroCard
              variant="informational"
              isPageLevel
              title="Execution Frameworks"
              subtitle="Translate Signals into Actionable Ideas"
              icon={<Target className="w-8 h-8" />}
              description="Understanding market intelligence is only the first step. The next step is learning how to interpret signals and translate them into potential opportunities using multiple sources of intelligence."
              className="border-[#C7AE6A]/20 bg-[#0A0A0A]"
            />
            
            <div className="mt-8 bg-gradient-to-r from-[#C7AE6A]/10 to-transparent border-l-4 border-[#C7AE6A] rounded-r-3xl p-8">
              <p className="text-white font-medium leading-relaxed">
                The Opportunity Playbooks section illustrates how investors can combine the modules within the GOLDH Intelligence Engine to analyse real market scenarios. Each playbook represents a structured approach to identifying and evaluating opportunities.
              </p>
            </div>
          </div>

          {/* Playbooks */}
          <div className="space-y-24">
            {playbooks.map((playbook, idx) => (
              <section key={idx} className="space-y-8">
                <div className="max-w-3xl">
                  <h2 className="text-3xl font-bold text-white mb-4">{playbook.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {playbook.description}
                  </p>
                </div>

                <div className="grid gap-4">
                  {playbook.steps.map((step, sIdx) => (
                    <div key={sIdx} className="group flex flex-col md:flex-row items-stretch gap-4">
                      <div className="md:w-32 flex items-center justify-center p-4 rounded-2xl bg-[#C7AE6A]/10 border border-[#C7AE6A]/20 group-hover:bg-[#C7AE6A]/20 transition-colors">
                        <span className="text-sm font-black text-[#C7AE6A] uppercase tracking-tighter">{step.label}</span>
                      </div>
                      <div className="flex-1 p-6 rounded-2xl bg-[#0A0A0A] border border-white/5 group-hover:border-[#C7AE6A]/20 transition-all flex flex-col justify-center">
                        <h4 className="font-bold text-white mb-1">{step.title}</h4>
                        <p className="text-sm text-muted-foreground">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Conclusion */}
          <section className="mt-32">
            <div className="bg-[#111111] border border-white/5 rounded-3xl p-12">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-white mb-6">Combining Intelligence for Better Decisions</h2>
                <p className="text-muted-foreground leading-relaxed mb-10">
                  Each playbook demonstrates how multiple modules within the GOLDH Intelligence Engine can be combined to interpret market conditions more effectively. Rather than relying on isolated indicators, investors can use the platform as an integrated framework.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                  {[
                    { label: "Monitor", icon: Activity },
                    { label: "Evaluate", icon: Shield },
                    { label: "Assess", icon: Waves },
                    { label: "Identify", icon: Zap }
                  ].map((item, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center gap-3">
                      <item.icon className="w-5 h-5 text-[#C7AE6A]" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#C7AE6A]">{item.label}</span>
                    </div>
                  ))}
                </div>

                <Link href="/features/pulse">
                  <Button className="w-full sm:w-auto bg-[#C7AE6A] hover:bg-[#D4BD7A] text-black font-bold px-12 py-8 rounded-2xl text-xl">
                    Launch GOLDH Pulse
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

function Activity(props: any) {
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
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
