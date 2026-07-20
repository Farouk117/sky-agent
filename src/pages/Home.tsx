import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CTABanner } from "@/components/site/CTABanner";
import dashboard from "@/assets/dashboard-hero.jpg";
import { CheckCircle2, PhoneIncoming, PhoneOutgoing } from "lucide-react";

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative bg-hero text-white overflow-hidden bg-[length:400%_400%] animate-gradient-pan">
        {/* Animated grid */}
        <div className="absolute inset-0 bg-animated-grid opacity-20 pointer-events-none" />
        <div className="absolute inset-0 grid-glow opacity-30" />
        <div className="absolute -top-32 -right-20 h-[400px] w-[400px] rounded-full bg-brand-red/30 blur-[100px] animate-blob mix-blend-screen" />
        <div className="absolute -bottom-40 -left-20 h-[400px] w-[400px] rounded-full bg-brand-blue/30 blur-[100px] animate-blob [animation-delay:2s] mix-blend-screen" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-purple-500/20 blur-[120px] animate-blob [animation-delay:4s] mix-blend-screen pointer-events-none" />

        <div className="container relative pt-14 pb-10 md:pt-24 md:pb-14">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Text */}
            <div className="animate-fade-up text-center lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium">
                <span className="h-2 w-2 rounded-full bg-brand-red animate-pulse-dot" />
                Connected. Resolved.
              </span>
              <h1 className="mt-5 font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.08]">
                Cloud Contact Centre Software for{" "}
                <span className="text-brand-red-glow font-extrabold">Modern Nigerian Businesses</span>
              </h1>
              <p className="mt-5 text-base md:text-lg text-white/70 max-w-xl mx-auto lg:mx-0">
                Sky Agent helps teams manage inbound calls, outbound campaigns, customer support,
                agent performance, voice broadcasting, PBX, and real-time reporting from one reliable platform.
              </p>
              <div className="mt-7 flex flex-col sm:flex-row justify-center lg:justify-start gap-3">
                <Button asChild size="lg" className="w-full sm:w-auto bg-gradient-red text-white shadow-glow-red hover:opacity-90">
                  <Link to="/demo">Request a Demo</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto border-white/30 text-white bg-white/5 hover:bg-white/10 hover:text-white">
                  <Link to="/demo">Talk to Sales</Link>
                </Button>
              </div>
              <div className="mt-7 flex flex-wrap justify-center lg:justify-start items-center gap-4 text-sm text-white/60">
                {["White-label ready", "Enterprise-grade", "Nigeria hosted-friendly"].map(label => (
                  <span key={label} className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-brand-red-glow" /> {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Dashboard image */}
            <div className="relative animate-fade-up animate-float-slow mt-4 lg:mt-0">
              <div className="absolute -inset-4 bg-gradient-accent opacity-20 blur-3xl rounded-3xl" />
              <div className="relative rounded-xl sm:rounded-2xl border border-white/10 overflow-hidden shadow-elevated">
                <img
                  src={dashboard}
                  alt="Sky Agent live contact centre dashboard"
                  width={1600}
                  height={1088}
                  className="w-full h-auto"
                />
              </div>
              {/* Floating stat chips — hidden on small screens */}
              <div className="absolute -bottom-4 -left-4 hidden sm:flex items-center gap-3 rounded-xl bg-navy-soft border border-white/10 px-4 py-3 shadow-glow-blue">
                <PhoneIncoming className="h-5 w-5 text-brand-blue-glow" />
                <div className="text-xs">
                  <div className="text-white/60">Live inbound</div>
                  <div className="font-semibold">128 calls</div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 hidden sm:flex items-center gap-3 rounded-xl bg-navy-soft border border-white/10 px-4 py-3 shadow-glow-red">
                <PhoneOutgoing className="h-5 w-5 text-brand-red-glow" />
                <div className="text-xs">
                  <div className="text-white/60">Campaign connects</div>
                  <div className="font-semibold">+12.5%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-y bg-muted/40">
        <div className="container py-5 text-center">
          <p className="text-sm text-muted-foreground">
            Built for{" "}
            {["support teams", "sales teams", "BPOs", "enterprises", "public institutions"].map((w, i, arr) => (
              <span key={w}>
                <strong className="text-foreground font-semibold">{w}</strong>
                {i < arr.length - 1 ? ", " : "."}
              </span>
            ))}
          </p>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
