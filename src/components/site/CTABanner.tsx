import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface CTABannerProps {
  title?: string;
  subtitle?: string;
}

export const CTABanner: React.FC<CTABannerProps> = ({
  title = "Start Scaling Your Contact Centre Today",
  subtitle = "Configure and launch your call centre in minutes. Trusted by support, sales, BPO and government teams across Nigeria.",
}) => (
  <section className="py-12 md:py-20">
    <div className="container px-4">
      <div className="rounded-2xl bg-hero text-white text-center px-6 py-12 md:py-20 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-brand-red/20 blur-3xl animate-blob" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-brand-blue/20 blur-3xl animate-blob [animation-delay:3s]" />
        <div className="relative max-w-2xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
          <p className="mt-4 text-white/70 text-sm md:text-base leading-relaxed">{subtitle}</p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <Button asChild size="lg" className="w-full sm:w-auto bg-gradient-red text-white shadow-glow-red hover:opacity-90">
              <Link to="/demo">Request a Demo</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white">
              <Link to="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </section>
);
