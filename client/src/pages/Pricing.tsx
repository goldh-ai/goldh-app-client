import React from "react";
import { Link } from "wouter";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Zap, Target, Sparkles, Layout, ChevronDown, Shield, Eye, Brain, Lock } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/lib/auth";

export default function Pricing() {
    const { user } = useAuth();
    const [openFaq, setOpenFaq] = React.useState<number | null>(null);
    const [isAnnual, setIsAnnual] = React.useState(false);

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const tiers = [
        {
            name: "FREE",
            subtitle: "Market Awareness",
            monthlyPrice: "0",
            annualPrice: "0",
            desc: "Understand how global markets move.",
            bestFor: "New investors exploring market intelligence.",
            upgradeHint: "Upgrade for real-time intelligence",
            icon: Eye,
            groups: [
                {
                    title: "Market Overview",
                    features: [
                        "GOLDH Pulse – Daily market snapshot",
                        "Daily AI Market Recap",
                    ],
                },
                {
                    title: "Investor Insights",
                    features: [
                        "Guru Talk (Preview)",
                    ],
                },
                {
                    title: "Market Catalysts",
                    features: [
                        "Catalyst Intelligence (Lite)",
                    ],
                },
                {
                    title: "Event Intelligence",
                    features: [
                        "Macro & Crypto event calendar",
                    ],
                },
            ],
            cta: "Start Free",
            highlight: false,
        },
        {
            name: "ESSENTIAL",
            subtitle: "Real-Time Market Intelligence",
            monthlyPrice: "29",
            annualPrice: "290",
            saveText: "2 months free",
            desc: "See what markets are doing right now.",
            bestFor: "Active investors who want real-time market clarity.",
            upgradeHint: "Upgrade for actionable trade signals",
            icon: Zap,
            groups: [
                {
                    title: "Everything in FREE, plus:",
                    features: [],
                },
                {
                    title: "Real-Time Intelligence",
                    features: [
                        "GOLDH Pulse – Live multi-asset dashboard",
                        "Real-time market data",
                    ],
                },
                {
                    title: "Institutional Signals",
                    features: [
                        "Whale Watch – Track large capital flows",
                    ],
                },
                {
                    title: "Event Engine",
                    features: [
                        "Catalyst Intelligence – Earnings & macro catalysts",
                    ],
                },
                {
                    title: "Investor Intelligence",
                    features: [
                        "Guru Talk – Full investor insights",
                    ],
                },
                {
                    title: "Alert System",
                    features: [
                        "Unlimited custom alerts",
                    ],
                },
            ],
            cta: "Select Essential",
            highlight: false,
        },
        {
            name: "PRO",
            subtitle: "Actionable Investment Intelligence",
            monthlyPrice: "79",
            annualPrice: "790",
            saveText: "2 months free",
            desc: "Turn market signals into structured opportunities.",
            bestFor: "Serious traders and professional investors.",
            upgradeHint: "Upgrade for AI automation",
            icon: Target,
            groups: [
                {
                    title: "Everything in ESSENTIAL, plus:",
                    features: [],
                },
                {
                    title: "Opportunity Discovery",
                    features: [
                        "STREETScore – AI conviction scoring",
                        "Yield Finder – Ranked income opportunities",
                    ],
                },
                {
                    title: "Market Inefficiencies",
                    features: [
                        "Arbitrage Scanner – Cross-market mispricing",
                    ],
                },
                {
                    title: "Strategy Intelligence",
                    features: [
                        "Copy Trade Finder – Compare with top investors",
                    ],
                },
                {
                    title: "Research & Signals",
                    features: [
                        "CIO Investment Briefs",
                        "GOLDH Alerts",
                    ],
                },
                {
                    title: "Portfolio Tools",
                    features: [
                        "Portfolio Intelligence Dashboard",
                    ],
                },
            ],
            cta: "Select Pro",
            highlight: true,
            badge: "MOST POPULAR FOR ACTIVE INVESTORS",
        },
        {
            name: "ELITE AI",
            subtitle: "Automated Alpha",
            monthlyPrice: "199",
            annualPrice: "1,990",
            saveText: "2 months free",
            desc: "Build and automate AI investment strategies.",
            bestFor: "Professional traders and quantitative investors.",
            upgradeHint: "Full platform access",
            icon: Sparkles,
            groups: [
                {
                    title: "Everything in PRO, plus:",
                    features: [],
                },
                {
                    title: "Strategy Automation",
                    features: [
                        "Robo Hub – Build automated strategies",
                    ],
                },
                {
                    title: "Early Opportunity Discovery",
                    features: [
                        "Launch Radar – Emerging token opportunities",
                        "Reward Hunter – Airdrops and incentive programs",
                    ],
                },
                {
                    title: "Smart Money Intelligence",
                    features: [
                        "Smart Money Radar – Congress, insider & institutional trades",
                    ],
                },
                {
                    title: "Advanced Trading Tools",
                    features: [
                        "Crypto Futures ROI Scanner – Leverage modelling",
                        "AI Strategy Tools",
                    ],
                },
                {
                    title: "Predictive Intelligence",
                    features: [
                        "Scenario modelling engine",
                    ],
                },
                {
                    title: "Platform Benefits",
                    features: [
                        "Early access to new modules",
                        "Priority support",
                    ],
                },
            ],
            cta: "Select Elite AI",
            highlight: false,
        },
    ];

    const compareRows = [
        { feature: "Market data",                    free: "Delayed",  essential: "Real-time", pro: "Real-time", elite: "Real-time" },
        { feature: "GOLDH Pulse",                    free: "Lite",     essential: "Full",      pro: "Full",      elite: "Full"      },
        { feature: "Guru Talk insights",             free: "Preview",  essential: "Full",      pro: "Full",      elite: "Full"      },
        { feature: "Catalyst Intelligence",          free: "Lite",     essential: "Full",      pro: "Full",      elite: "Full"      },
        { feature: "Whale Watch",                    free: "—",        essential: "✔",         pro: "✔",         elite: "✔"         },
        { feature: "STREETScore",                    free: "—",        essential: "—",         pro: "✔",         elite: "✔"         },
        { feature: "Yield Finder",                   free: "—",        essential: "—",         pro: "✔",         elite: "✔"         },
        { feature: "Arbitrage Scanner",              free: "—",        essential: "—",         pro: "✔",         elite: "✔"         },
        { feature: "Copy Trade Finder",              free: "—",        essential: "—",         pro: "✔",         elite: "✔"         },
        { feature: "Portfolio Intelligence Dashboard", free: "—",      essential: "—",         pro: "✔",         elite: "✔"         },
        { feature: "CIO Investment Briefs",          free: "—",        essential: "—",         pro: "✔",         elite: "✔"         },
        { feature: "Robo Hub",                       free: "—",        essential: "—",         pro: "—",         elite: "✔"         },
        { feature: "Launch Radar",                   free: "—",        essential: "—",         pro: "—",         elite: "✔"         },
        { feature: "Reward Hunter",                  free: "—",        essential: "—",         pro: "—",         elite: "✔"         },
        { feature: "Congressional Trading Tracker",  free: "—",        essential: "—",         pro: "—",         elite: "✔"         },
        { feature: "Crypto Futures ROI Scanner",     free: "—",        essential: "—",         pro: "—",         elite: "✔"         },
    ];

    const faqs = [
        {
            q: "Can I change plans anytime?",
            a: "Yes. You can upgrade or downgrade your plan based on your needs.",
        },
        {
            q: "Is annual billing discounted?",
            a: "Yes. Annual plans include a 17% saving versus monthly billing.",
        },
        {
            q: "Is GOLDH for personal or institutional use?",
            a: "Current plans are for personal use. For enterprise, institutional, or API licensing, please contact support.",
        },
        {
            q: "Which plan is right for me?",
            a: "Free is for market awareness, Essential for real-time intelligence, Pro for structured trade intelligence, and Elite AI for automation and advanced strategy tools.",
        },
    ];

    const pageContent = (
        <main className="container mx-auto px-4 sm:px-6 pt-16 pb-12 md:pb-32 max-w-6xl animate-in fade-in duration-700 space-y-24 bg-black">

            {/* INSTITUTIONAL POSITIONING */}
            <div className="flex flex-col items-center justify-center text-center space-y-6 pt-8">
                <div className="space-y-4">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <div className="h-px w-12 bg-[#C7AE6A]/50" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C7AE6A]">Institutional Grade</span>
                        <div className="h-px w-12 bg-[#C7AE6A]/50" />
                    </div>
                    <h1 className="text-4xl sm:text-7xl font-black text-white tracking-normal [word-spacing:0.16em] leading-[0.9] uppercase max-w-4xl mx-auto">
                        GOLDH <span className="text-[#C7AE6A]">Investment Intelligence</span> Platform
                    </h1>
                    <div className="max-w-2xl mx-auto py-2">
                        <p className="text-lg sm:text-xl text-gray-400 font-medium leading-relaxed">
                            Discover opportunities across global equities, crypto markets, macro trends, and smart money flows.
                        </p>
                    </div>
                </div>
            </div>

            {/* HOW GOLDH WORKS - THE SYSTEM FLOW */}
            <div className="space-y-12 py-12 border-y border-white/5 bg-[#0a0a0a]/30 -mx-4 px-4 sm:mx-0 sm:px-8 rounded-3xl">
                <div className="text-center space-y-3">
                    <h2 className="text-3xl font-black text-white tracking-normal [word-spacing:0.16em] uppercase">How <span className="text-[#C7AE6A]">GOLDH</span> Works</h2>
                    <p className="text-gray-500 font-medium text-sm">The Golden Intelligence Loop: From raw market data to automated alpha.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                    {[
                        { step: "01", title: "Intelligence", sub: "Understand Markets", icon: Brain, desc: "Process global data streams into clear market snapshots." },
                        { step: "02", title: "Signals", sub: "Identify Opportunities", icon: Zap, desc: "Track smart money flows and technical catalysts in real-time." },
                        { step: "03", title: "Trades", sub: "Structured Ideas", icon: Target, desc: "Convert signals into actionable investment scores and briefs." },
                        { step: "04", title: "Automation", sub: "AI-Driven Alpha", icon: Sparkles, desc: "Deploy and automate institutional-grade strategies." },
                    ].map((item, idx) => (
                        <div key={idx} className="relative group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#C7AE6A]/20 transition-all">
                            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center text-[10px] font-black text-[#C7AE6A]">
                                {item.step}
                            </div>
                            <div className="space-y-4">
                                <div className="w-10 h-10 rounded-xl bg-[#C7AE6A]/10 flex items-center justify-center">
                                    <item.icon className="w-5 h-5 text-[#C7AE6A]" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-white font-black uppercase text-sm tracking-widest">{item.title}</h4>
                                    <p className="text-[#C7AE6A] text-[10px] font-black uppercase tracking-widest">{item.sub}</p>
                                </div>
                                <p className="text-gray-500 text-xs font-semibold leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                    {/* Connecting line for desktop */}
                    <div className="hidden md:block absolute top-[2.5rem] left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-[#C7AE6A]/20 to-transparent -z-10" />
                </div>
            </div>

            {/* BILLING TOGGLE - PLACED ABOVE PRICING GRID */}
            <div className="flex justify-center -mb-8">
                <div className="flex items-center gap-4 bg-[#0a0a0a] border border-[#1a1a1a] p-1.5 rounded-2xl shadow-2xl">
                    <button
                        onClick={() => setIsAnnual(false)}
                        className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${!isAnnual ? 'bg-white/10 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setIsAnnual(true)}
                        className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${isAnnual ? 'bg-[#C7AE6A] text-black shadow-lg shadow-[#C7AE6A]/20' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        Annual <span className="px-2 py-0.5 rounded-full bg-black/10 text-[10px] font-black uppercase">2 Months Free</span>
                    </button>
                </div>
            </div>

            {/* PRICING GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {tiers.map((tier, i) => (
                    <div
                        key={i}
                        className={`p-5 sm:p-8 rounded-3xl border flex flex-col justify-between transition-all duration-500 relative ${tier.highlight
                            ? 'bg-[#C7AE6A] border-transparent shadow-[0_40px_80px_rgba(199,174,106,0.15)] sm:scale-105 z-10'
                            : 'bg-[#0a0a0a] border-white/10 hover:border-white/20'
                            }`}
                    >
                        {tier.badge && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-xl whitespace-nowrap">
                                {tier.badge}
                            </div>
                        )}

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tier.highlight ? 'bg-black/10' : 'bg-white/5'}`}>
                                    <tier.icon className={`w-6 h-6 ${tier.highlight ? 'text-black' : 'text-[#C7AE6A]'}`} />
                                </div>
                                <div className="space-y-0.5">
                                     <h4 className={`text-2xl font-black uppercase tracking-normal ${tier.highlight ? 'text-black' : 'text-white'}`}>{tier.name}</h4>
                                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${tier.highlight ? 'text-black/60' : 'text-[#C7AE6A]'}`}>{tier.subtitle}</p>
                                    {tier.highlight && (
                                        <p className="text-[10px] font-black text-black/40 uppercase tracking-widest mt-1">Most Popular For Active Investors</p>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-baseline">
                                        <span className={`text-5xl font-black ${tier.highlight ? 'text-black' : 'text-white'}`}>
                                            ${isAnnual ? tier.annualPrice : tier.monthlyPrice}
                                        </span>
                                        <span className={`text-xs font-bold ml-1 ${tier.highlight ? 'text-black/50' : 'text-gray-600'}`}>
                                            /{isAnnual ? 'year' : 'month'}
                                        </span>
                                    </div>
                                    {isAnnual && tier.saveText && (
                                        <p className={`text-xs font-bold ${tier.highlight ? 'text-black/70' : 'text-[#C7AE6A]'}`}>
                                            (${tier.monthlyPrice}/month value • {tier.saveText})
                                        </p>
                                    )}
                                    <p className={`text-xs font-medium leading-relaxed pt-1 ${tier.highlight ? 'text-black/60' : 'text-gray-500'}`}>
                                        {tier.desc}
                                    </p>
                                    <p className={`text-[11px] font-semibold leading-relaxed ${tier.highlight ? 'text-black/50' : 'text-gray-600'}`}>
                                        Best for: {tier.bestFor}
                                    </p>
                                </div>
                            </div>

                             <div className={`h-px ${tier.highlight ? 'bg-black/10' : 'bg-white/5'}`} />

                            <div className="space-y-6">
                                {tier.groups.map((group, j) => (
                                    <div key={j} className="space-y-3">
                                        <h5 className={`text-[10px] font-black uppercase tracking-widest ${tier.highlight ? 'text-black/60' : 'text-gray-500'}`}>
                                            {group.title}
                                        </h5>
                                        {group.features.length > 0 && (
                                            <ul className="space-y-2.5">
                                                {group.features.map((feature, k) => (
                                                    <li key={k} className="flex gap-3">
                                                        <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${tier.highlight ? 'text-black' : 'text-[#C7AE6A]'}`} />
                                                        <span className={`text-[11px] font-bold leading-tight ${tier.highlight ? 'text-black/80' : 'text-gray-400'}`}>{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-8 space-y-4">
                            <Link href="/signup" className="w-full">
                                <Button
                                    className={`w-full h-14 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${tier.highlight
                                        ? 'bg-black text-[#C7AE6A] hover:bg-black/90 shadow-xl'
                                        : 'bg-white/5 text-white hover:bg-white hover:text-black border border-white/10'
                                        }`}
                                >
                                    {tier.cta}
                                </Button>
                            </Link>
                            <p className={`text-center text-[10px] font-semibold tracking-wider uppercase ${tier.highlight ? 'text-black/40' : 'text-gray-600'}`}>
                                {tier.upgradeHint}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* THE MODULE MAP - INTELLIGENCE ENGINE */}
            <div className="space-y-12">
                <div className="text-center space-y-3">
                    <h2 className="text-3xl font-black text-white tracking-wide [word-spacing:0.25em] uppercase">The <span className="text-[#C7AE6A]">GOLDH Intelligence</span> Engine</h2>
                    <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">A visual map of the platform core</p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-[#0a0a0a]/50 overflow-hidden shadow-2xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 border-b border-white/10 divide-x divide-white/10">
                        {["Market Intelligence", "Investor Signals", "Trading Tools", "Automation"].map((header, i) => (
                            <div key={i} className="px-6 py-4 bg-white/5 text-center">
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">{header}</span>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
                        {[
                            ["GOLDH Pulse", "Guru Talk", "STREETScore", "Robo Hub"],
                            ["Catalyst Intelligence", "Whale Watch", "Arbitrage Scanner", "AI Strategy"],
                            ["Event Calendar", "Smart Money Radar", "Yield Finder", "Scenario Engine"],
                        ].map((row, rIdx) => (
                            <React.Fragment key={rIdx}>
                                {row.map((cell, cIdx) => (
                                    <div key={cIdx} className={`px-6 py-5 flex items-center justify-center text-center transition-all ${rIdx < 2 ? 'border-b border-white/10' : ''} hover:bg-[#C7AE6A]/5 group`}>
                                        <span className="text-xs font-bold text-gray-400 group-hover:text-[#C7AE6A] transition-colors">{cell}</span>
                                    </div>
                                ))}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            {/* COMPARE PLANS TABLE */}
            <div className="space-y-8">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-black text-white tracking-normal [word-spacing:0.16em] uppercase">Compare <span className="text-[#C7AE6A]">Plans</span></h2>
                    <p className="text-gray-600 text-xs font-semibold uppercase tracking-widest">See what's included at every level</p>
                </div>

                {/* Mobile View: Stacked Cards */}
                <div className="md:hidden space-y-4">
                    {compareRows.map((row, i) => (
                        <div key={i} className="p-5 bg-[#0a0a0a] border border-white/10 rounded-2xl space-y-4">
                            <h4 className="text-sm font-black text-[#C7AE6A] uppercase tracking-widest">{row.feature}</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] text-gray-500 font-black uppercase">Free</p>
                                    <p className={`text-xs font-bold ${row.free === "✔" ? 'text-[#C7AE6A]' : row.free === "—" ? 'text-gray-700' : 'text-gray-400'}`}>{row.free}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-gray-500 font-black uppercase">Essential</p>
                                    <p className={`text-xs font-bold ${row.essential === "✔" ? 'text-[#C7AE6A]' : row.essential === "—" ? 'text-gray-700' : 'text-gray-400'}`}>{row.essential}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-[#C7AE6A] font-black uppercase">Pro</p>
                                    <p className={`text-xs font-bold ${row.pro === "✔" ? 'text-[#C7AE6A]' : row.pro === "—" ? 'text-gray-700' : 'text-gray-400'}`}>{row.pro}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-gray-500 font-black uppercase">Elite AI</p>
                                    <p className={`text-xs font-bold ${row.elite === "✔" ? 'text-[#C7AE6A]' : row.elite === "—" ? 'text-gray-700' : 'text-gray-400'}`}>{row.elite}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop View: Traditional Table */}
                <div className="hidden md:block overflow-x-auto rounded-2xl border border-white/10 bg-[#0a0a0a]/50">
                    <table className="w-full min-w-[640px] text-xs">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left px-5 py-4 text-gray-500 font-black uppercase tracking-widest text-[10px] w-[35%]">Feature</th>
                                {["FREE", "ESSENTIAL", "PRO", "ELITE AI"].map((h, i) => (
                                    <th key={i} className={`px-4 py-4 text-center font-black uppercase tracking-widest text-[10px] ${h === "PRO" ? 'text-[#C7AE6A]' : 'text-gray-500'}`}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {compareRows.map((row, i) => (
                                <tr key={i} className={`border-b border-[#1a1a1a]/30 ${i % 2 === 0 ? 'bg-white/[0.02]' : 'bg-transparent'}`}>
                                    <td className="px-5 py-3 text-gray-400 font-semibold">{row.feature}</td>
                                    {[row.free, row.essential, row.pro, row.elite].map((val, j) => (
                                        <td key={j} className={`px-4 py-3 text-center font-bold ${val === "✔" ? 'text-[#C7AE6A]' : val === "—" ? 'text-gray-700' : 'text-gray-400'}`}>
                                            {val}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* TRUST & COMPLIANCE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {[
                    { icon: Shield, title: "Not a Broker", desc: "Intelligence only. Trade wherever you prefer." },
                    { icon: Eye, title: "No Hidden Fees", desc: "What you see is what you pay. No surprises." },
                    { icon: Brain, title: "AI-Powered", desc: "Explains why markets move in plain English." },
                    { icon: Lock, title: "Cancel Anytime", desc: "No lock-ins. Downgrade or cancel freely." },
                ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-5 bg-[#0a0a0a] border border-white/10 rounded-2xl hover:border-[#C7AE6A]/20 transition-all">
                        <div className="w-9 h-9 rounded-xl bg-[#C7AE6A]/10 border border-[#C7AE6A]/20 flex items-center justify-center shrink-0">
                            <item.icon className="w-4 h-4 text-[#C7AE6A]" />
                        </div>
                        <div className="space-y-0.5">
                            <h4 className="text-xs font-black text-white uppercase tracking-widest">{item.title}</h4>
                            <p className="text-[11px] text-gray-500 font-medium">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* FAQ ACCORDION */}
            <div className="space-y-10 max-w-3xl mx-auto">
                <div className="text-center space-y-3">
                    <h2 className="text-3xl font-black text-white tracking-normal [word-spacing:0.16em] uppercase">Pricing <span className="text-[#C7AE6A]">FAQs</span></h2>
                    <p className="text-gray-500 font-medium text-sm">Common questions about plans and billing.</p>
                </div>
                <div className="space-y-3">
                    {faqs.map((faq, i) => (
                        <div
                            key={i}
                            className={`bg-[#0a0a0a] border rounded-2xl transition-all duration-300 overflow-hidden ${openFaq === i ? 'border-[#C7AE6A]/30' : 'border-white/10 hover:border-white/20'}`}
                        >
                            <button
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                className="w-full flex items-center justify-between p-5 text-left"
                            >
                                <span className="text-sm font-bold text-white pr-4">{faq.q}</span>
                                <ChevronDown className={`w-4 h-4 text-gray-500 shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-[#C7AE6A]' : ''}`} />
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-40 pb-6' : 'max-h-0'}`}>
                                <p className="px-6 text-sm text-gray-400 leading-relaxed font-medium">{faq.a}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FOUNDER STATEMENT */}
            <div className="max-w-3xl mx-auto pt-4 border-t border-[#1a1a1a] text-center space-y-3">
                <p className="text-sm text-gray-500 font-medium leading-relaxed italic">
                    GOLDH was created to close the intelligence gap between institutional investors and everyday market participants.
                </p>
                <p className="text-sm text-gray-600 font-medium leading-relaxed italic">
                    Our mission is to make professional-grade market intelligence more accessible.
                </p>
            </div>

            {/* FOOTER DISCLAIMER */}
            <div className="pt-8 border-t border-[#1a1a1a] text-center space-y-4 max-w-4xl mx-auto">
                <p className="text-xs text-gray-600 font-bold leading-relaxed">
                    For personal use only. <br />
                    For corporate, institutional, API or enterprise licensing, please contact support.
                </p>
                <p className="text-[10px] text-gray-700 font-medium">
                    Institutional Direction • Strategic Positioning • Clear Value Progression
                </p>
            </div>
        </main>
    );

    return user
        ? <AppLayout title="Pricing">{pageContent}</AppLayout>
        : <><Header /><div className="pt-20">{pageContent}</div></>;
}
