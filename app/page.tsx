"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Cpu, Network, Zap } from "lucide-react";

export default function LandingPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden selection:bg-primary/30 selection:text-primary">

            {/* Navbar */}
            <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-md">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <span className="font-mono text-sm tracking-widest text-primary/80">ROADMAP.AI</span>
                    </div>
                    <Button
                        variant="ghost"
                        className="text-sm font-mono text-muted-foreground hover:text-primary hover:bg-transparent"
                        onClick={() => router.push("/dashboard")}
                    >
                        [ DASHBOARD ]
                    </Button>
                </div>
            </header>

            {/* Hero / Landing Screen */}
            <section className="h-screen flex flex-col items-center justify-center text-center px-4 relative">
                {/* Decorative glow behind text */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 space-y-8 max-w-4xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-mono tracking-wider mb-4">
                        <span className="w-1 h-1 bg-primary rounded-full" />
                        SYSTEM ONLINE
                    </div>

                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-6">
                        BUILD YOUR <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary text-glow">
                            FUTURE
                        </span>
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
                        Advanced AI algorithms analyze your profile to construct the optimal learning path.
                        Minimal latency. Maximum efficiency.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
                        <Button
                            size="lg"
                            className="bg-primary text-black hover:bg-primary/90 text-lg px-8 py-6 rounded-none border border-primary/50 shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:shadow-[0_0_30px_rgba(0,243,255,0.5)] transition-all duration-300 group"
                            onClick={() => router.push("/onboarding")}
                        >
                            <span className="font-mono tracking-wider mr-2">INITIALIZE</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>

                        <Button
                            size="lg"
                            variant="outline"
                            className="border-white/10 text-white hover:bg-white/5 hover:border-white/20 text-lg px-8 py-6 rounded-none backdrop-blur-sm font-mono"
                            onClick={() => router.push("/dashboard")}
                        >
                            // DEMO_MODE
                        </Button>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">Scroll to explore</span>
                    <div className="w-[1px] h-12 bg-gradient-to-b from-primary/50 to-transparent" />
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-32 container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <Cpu className="w-8 h-8 text-primary" />,
                            title: "NEURAL ANALYSIS",
                            desc: "Deep learning models parse your resume to extract latent skills and potential."
                        },
                        {
                            icon: <Network className="w-8 h-8 text-secondary" />,
                            title: "ADAPTIVE PATHS",
                            desc: "Dynamic curriculum generation based on real-time market data and your velocity."
                        },
                        {
                            icon: <Zap className="w-8 h-8 text-primary" />,
                            title: "VELOCITY TRACKING",
                            desc: "Monitor your acquisition rate with granular analytics and milestone completion."
                        }
                    ].map((feature, i) => (
                        <Card key={i} className="bg-black/40 border-white/10 hover:border-primary/50 transition-colors duration-500 group rounded-none">
                            <CardHeader>
                                <div className="mb-4 p-3 bg-white/5 w-fit rounded-none group-hover:bg-primary/10 transition-colors">
                                    {feature.icon}
                                </div>
                                <CardTitle className="font-mono text-lg tracking-wider text-white">
                                    {feature.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed">
                                    {feature.desc}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 py-12 bg-black/50 backdrop-blur-sm">
                <div className="container mx-auto px-4 flex justify-between items-center text-xs font-mono text-muted-foreground">
                    <div>
                        SYSTEM_VERSION: 2.0.4
                    </div>
                    <div className="flex gap-8">
                        <span>STATUS: OPERATIONAL</span>
                        <span>LATENCY: 12ms</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
