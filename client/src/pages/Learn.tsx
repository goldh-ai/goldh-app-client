import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  BookOpen, 
  GraduationCap, 
  FileText, 
  Lightbulb, 
  BookMarked, 
  Zap, 
  Search, 
  Target, 
  Layers,
  Rocket
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { HeroCard } from "@/components/shared/HeroCard";

export default function Learn() {
  const sections = [
    {
      icon: Layers,
      title: "Understanding the GOLDH Modules",
      status: "New",
      path: "/learn/modules",
      description: "Explore the 14 interconnected modules designed to support every stage of your investment decision process."
    },
    {
      icon: Target,
      title: "Opportunity Playbooks",
      status: "New",
      path: "/learn/playbooks",
      description: "Step-by-step guides on how to apply GOLDH intelligence to real-world market situations and identify high-conviction opportunities."
    },
    {
      icon: BookOpen,
      title: "Market Foundations",
      status: "New",
      path: "/learn/market-foundations",
      description: "Bite-sized explainers that break down crypto, markets, macro events, trading basics, and investing principles — in plain English."
    },
    {
      icon: FileText,
      title: "Market Deep Dives",
      status: "New",
      path: "/learn/deep-dives",
      description: "Long-form insights into major market events, global shifts, emerging technologies, and wealth-building strategies with real-world impact."
    },
    {
      icon: Lightbulb,
      title: "Market Myths & Truths",
      status: "",
      path: "/learn/myths-truths", // Placeholder
      description: "Cutting through hype, misinformation, and tribalism with clean, fact-based clarity."
    },
    {
      icon: BookMarked,
      title: "Investment Glossary",
      status: "",
      path: "/learn/glossary", // Placeholder
      description: "Simple definitions for everything from blockchain to basis points — so you always stay ahead of the jargon."
    },
    {
      icon: GraduationCap,
      title: "GOLDH Academy",
      status: "Coming Soon",
      path: "/learn/academy", // Placeholder
      description: "Structured learning paths aligned with your subscription tier, built by industry professionals to help you master the markets."
    }
  ];

  return (
    <AppLayout title="Learn">
      <div className="pb-16 px-6 pt-6 pt-24 lg:pt-6">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <PageHeader 
            title="Learning Hub"
            description="Your gateway to smarter investing — without the overwhelm."
            label="Knowledge Centre"
          />

          {/* Phase 2: Start Here - The GOLDH Intelligence Engine */}
          <div className="mb-12">
            <HeroCard
              variant="informational"
              isPageLevel
              title="Start Here: The GOLDH Intelligence Engine"
              subtitle="Master the Intelligence Framework Behind GOLDH"
              icon={<Zap className="w-8 h-8" />}
              description="Financial markets generate an overwhelming amount of information every day. The real challenge is understanding what matters, interpreting signals correctly, and acting with conviction. GOLDH was built to bring institutional-grade investment intelligence to a wider community of investors."
              className="border-[#C7AE6A]/20 bg-[#0A0A0A]"
            />
            
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <Card className="bg-[#111111] border-white/5">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-[#C7AE6A]">Why GOLDH Was Created</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    For decades, institutional investors have had access to sophisticated intelligence — research teams, macro analysis, and advanced tools. Retail investors rarely have access to this level of support. 
                  </p>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    GOLDH was created to help close this gap, providing an institutional-style intelligence framework to help you move from information to insight, and from insight to action.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-[#111111] border-white/5">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-[#C7AE6A]">The GOLDH Intelligence Framework</h3>
                  <div className="space-y-3">
                    {[
                      { step: "1. Intelligence", desc: "Understanding what is happening in the market through real-time data." },
                      { step: "2. Signals", desc: "Filtering information to identify meaningful patterns." },
                      { step: "3. Opportunities", desc: "Discovering situations with favourable risk-reward potential." },
                      { step: "4. Strategy", desc: "Developing a clear investment approach based on conviction." },
                      { step: "5. Execution", desc: "Implementing strategies efficiently using analytical tools." }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C7AE6A] mt-2 shrink-0" />
                        <div>
                          <p className="font-semibold text-sm text-foreground">{item.step}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Workflow and Modules Summary */}
            <div className="mt-8 bg-[#111111] border border-white/5 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Layers className="w-6 h-6 text-[#C7AE6A]" />
                Building Conviction with the 14 Modules
              </h3>
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <h4 className="font-bold text-[#C7AE6A] mb-3 text-sm uppercase tracking-wider">Market Intelligence</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    GOLDH Pulse, Guru Talk, Catalyst Engine, Whale Watch. High-level radar for real-time market movements.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-[#C7AE6A] mb-3 text-sm uppercase tracking-wider">Signal Confirmation</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    STREETScore, Launch Radar, Smart Money Radar. Distinguishing meaningful signals from market noise.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-[#C7AE6A] mb-3 text-sm uppercase tracking-wider">Opportunity & Strategy</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Yield Finder, Arbitrage Scanner, Reward Hunter, Portfolio Intelligence, Robo Hub. Finding and executing trades.
                  </p>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-white mb-2">Turning Intelligence into Decisions</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                    By combining real-time data, analytical tools, and structured insights, the GOLDH Intelligence Engine helps investors navigate complex markets with a clearer framework for decision-making.
                  </p>
                </div>
                <Link href="/learn/modules">
                  <Button className="bg-[#C7AE6A] hover:bg-[#D4BD7A] text-black font-bold px-8 py-6 rounded-2xl shrink-0">
                    <Rocket className="w-4 h-4 mr-2" />
                    Explore Modules
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Resources & structured Learning:
            </h2>
            
            <div className="grid gap-6">
              {sections.map((section, index) => {
                const Icon = section.icon;
                const Content = (
                  <Card 
                    key={index} 
                    className="group hover:border-[#C7AE6A]/30 hover:shadow-lg hover:shadow-[#C7AE6A]/5 transition-all bg-[#0A0A0A] border-white/5 h-full cursor-pointer"
                    data-testid={`section-${index}`}
                  >
                    <CardContent className="p-6 md:p-8">
                      <div className="flex items-start gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-[#C7AE6A]/10 border border-[#C7AE6A]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#C7AE6A]/20 transition-colors">
                          <Icon className="w-7 h-7 text-[#C7AE6A]" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-white transition-colors tracking-tight">
                              {section.title}
                            </h3>
                            {section.status && (
                              <span className="px-3 py-1 bg-[#C7AE6A]/10 border border-[#C7AE6A]/20 rounded-full text-[10px] font-black uppercase tracking-widest text-[#C7AE6A]">
                                {section.status}
                              </span>
                            )}
                          </div>
                          <p className="text-base text-gray-400 leading-relaxed max-w-3xl">
                            {section.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );

                return section.path ? (
                  <Link key={index} href={section.path}>
                    {Content}
                  </Link>
                ) : Content;
              })}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

/* 
 * PRESERVED CODE - Original Learning Hub with search and accordion
 * Uncomment to restore the original functionality
 * 
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, BookOpen, Loader2 } from "lucide-react";
import { LearningTopic } from "@shared/types";

export default function Learn() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedItem, setExpandedItem] = useState<string>("");
  const [filteredTopics, setFilteredTopics] = useState<LearningTopic[]>([]);

  const { data: learningTopics, isLoading } = useQuery<LearningTopic[]>({
    queryKey: ["/api/learning/topics"],
  });

  useEffect(() => {
    if (!learningTopics) return;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filtered = learningTopics.filter(
        topic =>
          topic.title.toLowerCase().includes(query) ||
          topic.question.toLowerCase().includes(query) ||
          topic.answer.toLowerCase().includes(query)
      );
      setFilteredTopics(filtered);

      if (filtered.length > 0) {
        setExpandedItem(filtered[0].id);
        
        setTimeout(() => {
          const element = document.getElementById(`topic-${filtered[0].id}`);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      }
    } else {
      setFilteredTopics(learningTopics);
    }
  }, [searchQuery, learningTopics]);

  const handleRelatedClick = (topicId: string) => {
    setExpandedItem(topicId);
    setTimeout(() => {
      const element = document.getElementById(`topic-${topicId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-12 text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Learning Hub
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your friendly guide to understanding crypto and blockchain. Simple explanations for everyone.
            </p>
          </div>

          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for any crypto term..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-lg h-12"
                data-testid="input-search-topics"
              />
            </div>
            {searchQuery && (
              <p className="mt-2 text-sm text-muted-foreground">
                Found {filteredTopics.length} topic{filteredTopics.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          <Card>
            <CardContent className="p-6">
              {filteredTopics.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground">
                    No topics found matching "{searchQuery}"
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Try searching for blockchain, wallet, token, or staking
                  </p>
                </div>
              ) : (
                <Accordion
                  type="single"
                  collapsible
                  value={expandedItem}
                  onValueChange={setExpandedItem}
                  className="space-y-2"
                >
                  {filteredTopics.map((topic, index) => (
                    <AccordionItem
                      key={topic.id}
                      value={topic.id}
                      id={`topic-${topic.id}`}
                      className="border border-border rounded-md px-4 scroll-mt-24"
                      data-testid={`accordion-topic-${topic.id}`}
                    >
                      <AccordionTrigger className="text-left hover:no-underline py-4">
                        <div className="flex items-start gap-3 pr-4">
                          <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-sm font-bold text-primary">
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">
                              {topic.question}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {topic.title}
                            </p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4 pl-11">
                        <p className="text-base text-foreground leading-relaxed mb-4">
                          {topic.answer}
                        </p>
                        
                        {topic.relatedTopics && topic.relatedTopics.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-border">
                            <p className="text-sm font-semibold text-muted-foreground mb-2">
                              You might also like:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {topic.relatedTopics.map((relatedId) => {
                                const relatedTopic = learningTopics?.find(t => t.id === relatedId);
                                return relatedTopic ? (
                                  <button
                                    key={relatedId}
                                    onClick={() => handleRelatedClick(relatedId)}
                                    className="text-sm px-3 py-1 rounded-md bg-primary/10 text-primary hover-elevate active-elevate-2 transition-all"
                                    data-testid={`button-related-${relatedId}`}
                                  >
                                    {relatedTopic.title}
                                  </button>
                                ) : null;
                              })}
                            </div>
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
*/
