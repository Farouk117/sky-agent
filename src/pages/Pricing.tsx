import { Link } from "react-router-dom";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { Check, ChevronRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const tiers = [
  {
    num: "01",
    name: "Starter",
    tagline: "For small teams starting with call management and basic reports.",
    features: [
      "Core inbound & outbound calling",
      "Basic IVR and queues",
      "Call recording",
      "Standard CDR reports",
      "Email support",
    ],
    featured: false,
    cta: "Get Started",
  },
  {
    num: "02",
    name: "Business",
    tagline: "For growing teams needing campaigns, supervisor tools and advanced reporting.",
    features: [
      "Everything in Starter",
      "Outbound campaigns & dialers",
      "Supervisor: monitor, whisper, barge",
      "Real-time wallboards",
      "Lead management & web forms",
      "Priority support",
    ],
    featured: true,
    cta: "Request Pricing",
  },
  {
    num: "03",
    name: "Enterprise",
    tagline: "For BPOs, government agencies and large organisations at scale.",
    features: [
      "Everything in Business",
      "Multi-team / multi-tenant setup",
      "Custom routing and IVR flows",
      "Advanced integrations & webhooks",
      "Voice broadcast at scale",
      "Dedicated account manager",
    ],
    featured: false,
    cta: "Talk to Sales",
  },
];



const faqs = [
  { q: "Can Sky Agent support inbound and outbound calls?", a: "Yes. Sky Agent supports inbound, outbound and blended operations from the same platform — with predictive, preview and auto-dialing modes." },
  { q: "Can supervisors monitor live calls?",               a: "Yes, with live monitor, whisper and barge features, plus real-time agent status wallboards for full visibility." },
  { q: "Can we run voice broadcast campaigns?",             a: "Yes. Sky Agent includes scheduled voice broadcast with IVR and survey modes, plus retry and delivery reporting." },
  { q: "Can it support multiple agents and campaigns?",     a: "Yes. Sky Agent is designed for scalable contact centre operations across multiple agents, teams and concurrent campaigns." },
  { q: "Can it integrate with CRM tools?",                  a: "Yes, through supported integrations and webhooks — including a Zoho CRM reference integration and SMTP email settings." },
  { q: "Is pricing per agent or per seat?",                 a: "Pricing is tailored to your organisation size, number of agents and features required. Contact our team for a custom quote." },
];

export default function Pricing() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Flexible plans that scale with your contact centre"
        subtitle="Every deployment is different. Choose the tier that fits your team and request tailored pricing."
      />

      {/* Tier cards */}
      <section className="relative py-10 md:py-20 overflow-hidden">
        <div className="absolute -top-20 right-0 h-[400px] w-[400px] rounded-full bg-brand-red/5 blur-[100px] animate-blob pointer-events-none" />
        <div className="absolute bottom-0 -left-20 h-[350px] w-[350px] rounded-full bg-brand-blue/5 blur-[100px] animate-blob [animation-delay:2s] pointer-events-none" />
        <div className="container max-w-6xl px-4">
          <div className="rounded-2xl overflow-hidden border bg-border shadow-card divide-y divide-border md:divide-y-0 md:grid md:grid-cols-3 md:gap-px md:bg-border">
            {tiers.map((t) => (
              <div
                key={t.name}
                className={`group relative flex flex-col p-6 md:p-10 transition-colors
                  ${t.featured ? "bg-hero text-white" : "bg-card hover:bg-muted/30"}`}
              >
                {/* Ghost number */}
                <span className={`font-display text-4xl md:text-5xl font-extrabold select-none absolute top-4 right-5 md:top-6 md:right-8 leading-none transition-colors
                  ${t.featured ? "text-white/10" : "text-brand-red/10 group-hover:text-brand-red/20"}`}>
                  {t.num}
                </span>

                {t.featured && (
                  <span className="inline-flex self-start mb-3 rounded-full bg-brand-red text-white text-xs font-bold px-3 py-1">
                    Most Popular
                  </span>
                )}

                <h3 className={`font-display text-xl md:text-2xl font-bold ${t.featured ? "text-white" : "text-foreground"}`}>
                  {t.name}
                </h3>
                <p className={`mt-2 text-sm ${t.featured ? "text-white/65" : "text-muted-foreground"}`}>
                  {t.tagline}
                </p>

                <div className="my-5 border-t border-current/10 pt-5">
                  <span className={`text-xs uppercase tracking-widest font-semibold ${t.featured ? "text-white/40" : "text-muted-foreground"}`}>
                    Custom pricing
                  </span>
                  <div className={`mt-1 font-display text-lg font-bold ${t.featured ? "text-white" : "text-foreground"}`}>
                    Tailored to your team
                  </div>
                </div>

                <ul className="space-y-3 flex-1 mb-7">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <span className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center shrink-0
                        ${t.featured ? "bg-white/10" : "bg-brand-red/10"}`}>
                        <Check className="h-3 w-3 text-brand-red" />
                      </span>
                      <span className={t.featured ? "text-white/80" : "text-foreground/80"}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className={`w-full font-semibold ${
                    t.featured
                      ? "bg-white text-[#0f172a] hover:bg-white/90"
                      : "bg-foreground text-background hover:opacity-80"
                  }`}
                >
                  <Link to="/demo">
                    {t.cta} <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}

      <section className="pb-12 md:pb-20 bg-muted/30">
        <div className="container max-w-4xl px-4 py-12 md:py-16">
          <span className="block text-center text-xs font-semibold uppercase tracking-widest text-brand-red mb-3">FAQ</span>
          <h2 className="font-display text-2xl md:text-4xl font-bold text-foreground text-center">
            Frequently asked questions
          </h2>

          <Accordion type="single" collapsible className="mt-8 space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="rounded-xl border bg-card px-5 md:px-6 shadow-sm"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5 text-sm md:text-base">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5 text-sm">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="pb-12 md:pb-24">
        <div className="container max-w-6xl px-4">
          <div className="rounded-2xl bg-hero text-white p-8 md:p-14 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-brand-red/20 blur-3xl animate-blob" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-brand-blue/20 blur-3xl animate-blob [animation-delay:3s]" />
            <div className="relative grid md:grid-cols-2 gap-8 items-center text-center md:text-left">
              <div>
                <span className="text-xs uppercase tracking-widest text-white/50 font-semibold">Ready to get started?</span>
                <h2 className="mt-3 font-display text-2xl md:text-4xl font-bold leading-tight">
                  Let us show you Sky Agent in action
                </h2>
                <p className="mt-4 text-white/65 text-sm leading-relaxed max-w-sm mx-auto md:mx-0">
                  Talk to our team and we'll walk you through the exact features your team needs — no pressure, no fluff.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row md:justify-end gap-3">
                <Button asChild size="lg" className="w-full sm:w-auto bg-white text-[#0f172a] font-semibold hover:bg-white/90">
                  <Link to="/demo">Request a Demo</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto border-white/30 text-white bg-white/5 hover:bg-white/15 hover:text-white">
                  <Link to="/demo">Talk to Sales</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
