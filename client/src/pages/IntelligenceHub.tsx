import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Sparkles, ArrowRight, Bot } from "lucide-react";
import { useLocation } from "wouter";

export default function IntelligenceHub() {
    const [, setLocation] = useLocation();

    const modules = [
        {
            icon: ShieldCheck,
            title: "Portfolio Intelligence",
            description: "Institutional alpha signals, high-conviction positions, and risk management protocols.",
            route: "/portfolio-intelligence",
            buttonText: "Access Portfolio Intelligence",
            color: "text-[#C7AE6A]",
            bgColor: "bg-[#C7AE6A]/10",
            borderColor: "border-[#C7AE6A]/20"
        },
        {
            icon: Sparkles,
            title: "CIO Insights",
            description: "Proprietary research briefs, strategic market alerts, and investment takeaways.",
            route: "/insights",
            buttonText: "Access Insights",
            color: "text-[#C7AE6A]",
            bgColor: "bg-[#C7AE6A]/10",
            borderColor: "border-[#C7AE6A]/20"
        }
    ];

    return (
        <AppLayout title="Intelligence Hub">
            <main className="container mx-auto px-6 pt-6 pb-20 max-w-6xl animate-in fade-in duration-700">
                <div className="flex flex-col items-center text-center mb-16 space-y-4">
                    <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 mb-2">
                        <Bot className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-[#d5c28f] to-primary bg-clip-text text-transparent">
                        Intelligence Hub
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto opacity-70 leading-relaxed text-balance">
                        Institutional-grade research and advisory intelligence for high-conviction decision making.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mt-12">
                    {modules.map((module, index) => {
                        const Icon = module.icon;
                        return (
                            <Card
                                key={index}
                                className="bg-[#0a0a0a] hover:bg-[#0f0f0f] border-[#222] hover:border-primary/40 transition-all duration-500 group cursor-pointer relative overflow-hidden shadow-2xl rounded-3xl"
                                onClick={() => setLocation(module.route)}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <CardHeader className="space-y-4 relative z-10 p-8 md:p-10">
                                    <div className={`w-16 h-16 rounded-2xl ${module.bgColor} border-2 ${module.borderColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                                        <Icon className={`w-8 h-8 ${module.color}`} />
                                    </div>
                                    <div className="space-y-2">
                                        <CardTitle className="text-2xl md:text-3xl font-bold tracking-tight group-hover:text-primary transition-colors duration-300">
                                            {module.title}
                                        </CardTitle>
                                        <CardDescription className="text-base md:text-lg text-gray-400 leading-relaxed text-balance">
                                            {module.description}
                                        </CardDescription>
                                    </div>
                                </CardHeader>

                                <CardContent className="relative z-10 px-8 pb-8 md:px-10 md:pb-10">
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-between bg-primary/5 hover:bg-primary/20 text-primary border border-primary/10 hover:border-primary/30 transition-all rounded-2xl h-14 px-8 text-base font-bold"
                                    >
                                        {module.buttonText}
                                        <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </main>
        </AppLayout>
    );
}
