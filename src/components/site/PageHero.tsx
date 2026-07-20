import React from "react";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  subtitle: string;
}

export const PageHero: React.FC<PageHeroProps> = ({ eyebrow, title, subtitle }) => (
  <section className="relative bg-hero text-white overflow-hidden bg-[length:400%_400%] animate-gradient-pan py-14 md:py-24 text-center">
    {/* Animated moving grid */}
    <div className="absolute inset-0 bg-animated-grid opacity-15 pointer-events-none" />

    {/* Floating blobs */}
    <div className="absolute -top-24 -right-24 h-[350px] w-[350px] rounded-full bg-brand-red/25 blur-[90px] animate-blob mix-blend-screen pointer-events-none" />
    <div className="absolute -bottom-24 -left-24 h-[350px] w-[350px] rounded-full bg-brand-blue/25 blur-[90px] animate-blob [animation-delay:2s] mix-blend-screen pointer-events-none" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-purple-500/15 blur-[100px] animate-blob [animation-delay:4s] mix-blend-screen pointer-events-none" />

    <div className="container relative max-w-3xl px-4">
      {eyebrow && (
        <span className="inline-block rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-1 text-xs font-bold uppercase tracking-widest text-white/80 mb-5">
          {eyebrow}
        </span>
      )}
      <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
        {title}
      </h1>
      <p className="mt-4 text-base md:text-lg text-white/65 leading-relaxed">
        {subtitle}
      </p>
    </div>
  </section>
);
