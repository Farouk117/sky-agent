import { Link } from "react-router-dom";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronRight } from "lucide-react";

const solutions = [
  {
    num: "01",
    title: "Customer Support Teams",
    desc: "Reduce missed calls, resolve issues faster and lift response quality with structured queues, IVR and real-time reporting.",
    outcomes: ["Faster first-call resolution", "Reduced average handle time", "Improved customer satisfaction scores"],
  },
  {
    num: "02",
    title: "Sales & Telemarketing Teams",
    desc: "Manage leads, run targeted outbound campaigns, track follow-ups and measure agent performance in real-time.",
    outcomes: ["Higher connect & conversion rates", "Automated follow-up workflows", "Campaign-level ROI visibility"],
  },
  {
    num: "03",
    title: "BPO & Outsourced Call Centres",
    desc: "Support multiple clients, teams and campaigns from one multi-tenant-ready platform with full data isolation.",
    outcomes: ["Multi-client campaign management", "Per-agent performance reporting", "Easy onboarding of new clients"],
  },
  {
    num: "04",
    title: "Government & Public Institutions",
    desc: "Run citizen support lines, public hotlines, awareness campaigns and scheduled information broadcasts reliably.",
    outcomes: ["High-volume citizen communication", "Multi-department routing", "Scheduled voice broadcasts"],
  },
  {
    num: "05",
    title: "Financial Services & Collections",
    desc: "Automate reminders, manage support requests and coordinate outbound collections responsibly and compliantly.",
    outcomes: ["Scheduled payment reminders", "DNC list compliance", "Collections campaign tracking"],
  },
  {
    num: "06",
    title: "Healthcare Providers",
    desc: "Handle appointment scheduling, patient calls, follow-ups and service updates with clinical-grade reliability.",
    outcomes: ["Appointment reminder broadcasts", "Patient queue management", "Follow-up scheduling workflows"],
  },
  {
    num: "07",
    title: "Education & Admissions Teams",
    desc: "Manage enquiries, admissions campaigns and parent communication across intake seasons at scale.",
    outcomes: ["Admissions inquiry routing", "Broadcast to prospective students", "Agent tracking per intake"],
  },
  {
    num: "08",
    title: "Logistics & E-commerce",
    desc: "Handle delivery updates, complaints and customer support at scale during peak demand periods.",
    outcomes: ["Delivery status broadcasts", "Complaint queue prioritisation", "Peak volume handling"],
  },
];

export default function Solutions() {
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title="Built for every customer-facing team"
        subtitle="Whether you're a growing SME or a national institution, Sky Agent adapts to how your team already works."
      />

      {/* Solutions Bento Grid */}
      <section className="relative py-10 md:py-20 overflow-hidden">
        <div className="absolute top-10 right-10 h-[350px] w-[350px] rounded-full bg-brand-red/5 blur-[80px] animate-blob pointer-events-none" />
        <div className="absolute bottom-10 left-10 h-[300px] w-[300px] rounded-full bg-brand-blue/5 blur-[80px] animate-blob [animation-delay:2.5s] pointer-events-none" />
        <div className="container max-w-6xl px-4">
          <div className="rounded-2xl overflow-hidden border bg-border shadow-card divide-y divide-border md:divide-y-0 md:grid md:grid-cols-2 md:gap-px md:bg-border">
            {solutions.map((s) => (
              <div
                key={s.title}
                className="group relative bg-card p-6 md:p-10 hover:bg-muted/30 transition-colors"
              >
                {/* Ghost number */}
                <span className="font-display text-4xl md:text-5xl font-extrabold text-brand-red/10 group-hover:text-brand-red/20 transition-colors select-none absolute top-4 right-5 md:top-6 md:right-8 leading-none">
                  {s.num}
                </span>

                <div className="relative pr-10 md:pr-12">
                  <h3 className="font-display text-lg md:text-xl font-bold text-foreground">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>

                  <ul className="mt-4 space-y-2">
                    {s.outcomes.map((o) => (
                      <li key={o} className="flex items-center gap-2 text-sm text-foreground/75">
                        <CheckCircle2 className="h-3.5 w-3.5 text-brand-red shrink-0" />
                        {o}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      to="/demo"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-red no-underline"
                    >
                      See how it works <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA strip */}
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
