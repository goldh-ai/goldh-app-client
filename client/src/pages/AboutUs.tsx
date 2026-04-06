import React from "react";
import { Link } from "wouter";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronRight, Check, Quote, ShieldCheck, Sparkles,
  BrainCircuit, Rocket, Zap, ArrowRight, Activity, Database, Cpu,
  Workflow, Globe, BarChart3, Coins, LineChart, Shield, Users,
  ChevronDown, Lock, Eye, Brain
} from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/lib/auth";

export default function AboutUs() {
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);



  const faqs = [
    {
      q: "What is GOLDH?",
      a: "GOLDH is an intelligent finance platform that brings together real-time market data, AI-powered insights, and human-level clarity in one unified view."
    },
    {
      q: "Is GOLDH a trading platform?",
      a: "No — GOLDH is not an exchange or brokerage. We're an intelligence platform that helps you understand markets before you take action wherever you prefer to trade."
    },
    {
      q: "What markets does GOLDH cover?",
      a: "Crypto, global equities, commodities, indices, FX, and major macroeconomic events — all in one clean dashboard."
    },
    {
      q: "What makes GOLDH different?",
      a: "No noise. No hype. No nonsense. Just clarity, signal, and perspective. GOLDH combines multi-asset data, AI explanation, expert insight, and event prediction in a single, intuitive platform."
    },
  ];



  const pageContent = (
    <div className="relative text-left">

        {/* Visual Accent Orbs */}
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#C7AE6A]/5 blur-[150px] rounded-full pointer-events-none z-0" aria-hidden="true" />
        <div className="absolute top-[40%] right-0 translate-x-1/4 w-[400px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none z-0" aria-hidden="true" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-24 md:space-y-40 py-24 md:py-32 animate-in fade-in translate-y-4 duration-1000 relative z-10">

          {/* ═══ HERO SECTION ═══ */}
          <section className="text-center space-y-12 max-w-4xl mx-auto relative px-4 sm:px-0">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl mx-auto">
                <Sparkles className="w-3.5 h-3.5 text-[#C7AE6A]" />
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[#C7AE6A]">Institutional Intelligence Engine</span>
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-white leading-[1.05] tracking-tighter">
                From market noise <br />
                <span className="bg-gradient-to-r from-white via-[#C7AE6A] to-gray-400 bg-clip-text text-transparent">to clear, confident decisions.</span>
              </h1>
              <p className="text-lg md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-medium">
                GOLDH helps you understand what's happening across markets, why it matters, and what to watch next — <span className="text-white">without overwhelm.</span>
              </p>
            </div>

            <div className="flex flex-col items-center pt-6 space-y-4">
              <p className="text-gray-400 font-medium">
                Explore our tiered access plans on the <Link href="/pricing" className="text-[#C7AE6A] hover:underline font-bold">Pricing page</Link>.
              </p>
              <Link href="/signup" className="w-full sm:w-auto">
                <Button className="w-full h-16 px-12 bg-[#C7AE6A] hover:bg-[#b99a45] text-black font-extrabold text-sm rounded-2xl shadow-xl shadow-[#C7AE6A]/20 transition-all hover:scale-105 active:scale-95 group">
                  Start Free Today
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </section>


          {/* ═══ WHAT YOU GET — INTEL PIPELINE ═══ */}
          <section className="space-y-20 py-24 bg-gradient-to-b from-transparent via-[#C7AE6A]/[0.02] to-transparent border-y border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
              <div className="absolute top-[20%] left-[-10%] w-[120%] h-px bg-gradient-to-r from-transparent via-[#C7AE6A] to-transparent rotate-[2deg]" />
              <div className="absolute top-[50%] left-[-10%] w-[120%] h-px bg-gradient-to-r from-transparent via-[#C7AE6A] to-transparent -rotate-[1deg]" />
            </div>

            <div className="text-center space-y-4 relative z-10 px-6">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-tight">What you get <br className="md:hidden" /> with GOLDH</h2>
              <p className="text-[#C7AE6A] font-black uppercase tracking-[0.4em] text-[10px]">Intelligence Pipeline</p>
            </div>

            <div className="max-w-6xl mx-auto px-8 relative z-10 space-y-24">
              <div className="hidden lg:block absolute top-[160px] left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
                {[
                  { title: "Daily Market Updates", desc: "A clear daily snapshot of what's moving across all your tracked assets.", icon: Database, accent: "text-blue-500" },
                  { title: "In-Depth Insights", desc: "Context around why markets are reacting, powered by AI and expert analysis.", icon: Cpu, accent: "text-[#C7AE6A]" },
                  { title: "Smart Decisions", desc: "A structured way to evaluate decisions with signals, risk calibration, and alpha.", icon: Workflow, accent: "text-emerald-500" }
                ].map((item, i) => (
                  <div key={i} className="relative group perspective-1000">
                    <div className="bg-[#0a0a0a] border border-white/10 p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] space-y-8 group-hover:bg-[#111] group-hover:border-[#C7AE6A]/50 transition-all duration-700 relative z-10 shadow-2xl min-h-[250px] lg:min-h-[300px] flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500">
                          <item.icon className={`w-8 h-8 ${item.accent}`} />
                        </div>
                        <span className="text-5xl font-black text-white/5 group-hover:text-[#C7AE6A]/20 transition-colors uppercase italic">{`0${i + 1}`}</span>
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-2xl font-black text-white tracking-tight leading-tight">{item.title}</h4>
                        <div className="w-12 h-1 bg-gradient-to-r from-[#C7AE6A] to-transparent rounded-full" />
                        <p className="text-sm text-gray-400 leading-relaxed font-medium">{item.desc}</p>
                      </div>
                    </div>
                    {i < 2 && (
                      <div className="hidden lg:flex absolute top-[160px] -right-6 h-px items-center justify-center z-0">
                        <div className="w-2 h-2 rounded-full bg-[#C7AE6A] shadow-[0_0_10px_#C7AE6A]" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Manifesto Quote */}
              <div className="pt-12 relative px-4">
                <div className="bg-[#050505] border border-white/10 p-8 sm:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] flex flex-col md:flex-row gap-8 items-center justify-between group hover:border-[#C7AE6A]/30 transition-all backdrop-blur-sm">
                  <blockquote className="text-xl sm:text-2xl md:text-3xl font-black text-white italic font-serif tracking-tight flex-1">
                    "We don't tell you what to buy. We give you clarity so you can decide with confidence."
                  </blockquote>
                  <div className="h-20 w-px bg-white/10 hidden md:block" />
                  <div className="flex flex-col items-end shrink-0">
                    <span className="text-[#C7AE6A] font-black uppercase tracking-widest text-[10px]">Core Philosophy</span>
                    <Quote className="w-10 h-10 text-[#C7AE6A]/20" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ═══ TRUST & DIFFERENTIATOR STRIP ═══ */}
          <section className="px-4 sm:px-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Shield, title: "Not a Broker", desc: "Intelligence only. Trade wherever you prefer." },
                { icon: Eye, title: "No Noise, No Hype", desc: "Just clarity, signal, and perspective." },
                { icon: Brain, title: "AI-Powered", desc: "Explains why markets move, not just that they moved." },
                { icon: Lock, title: "Privacy First", desc: "Industry-grade encryption. Your data is yours." },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-6 bg-[#0a0a0a] border border-white/5 rounded-2xl hover:border-[#C7AE6A]/20 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-[#C7AE6A]/10 border border-[#C7AE6A]/20 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-[#C7AE6A]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-white">{item.title}</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>



          {/* ═══ FAQ ACCORDION ═══ */}
          <section className="space-y-12 max-w-3xl mx-auto px-4 sm:px-0">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter">Frequently Asked <span className="text-[#C7AE6A]">Questions</span></h2>
              <p className="text-gray-500 font-medium text-sm">Everything you need to know about GOLDH.</p>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className={`bg-[#0a0a0a] border rounded-2xl transition-all duration-300 overflow-hidden ${openFaq === i ? 'border-[#C7AE6A]/30' : 'border-white/5 hover:border-white/10'}`}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-6 text-left"
                    aria-expanded={openFaq === i}
                  >
                    <span className="text-sm font-bold text-white pr-4">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-500 shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-[#C7AE6A]' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-96 pb-6' : 'max-h-0'}`}>
                    <p className="px-6 text-sm text-gray-400 leading-relaxed font-medium">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
    </div>
  );

  return user
    ? <AppLayout title="About Us">{pageContent}</AppLayout>
    : <><Header /><div className="pt-20">{pageContent}</div></>;
}
