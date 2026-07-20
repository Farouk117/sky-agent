import { Link } from "react-router-dom";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronRight } from "lucide-react";

const groups = [
  {
    num: "01",
    title: "Contact Centre Operations",
    desc: "Full inbound, outbound and blended contact centre capabilities in a single platform.",
    items: [
      "Inbound, outbound and blended campaigns",
      "Manual, preview, auto and predictive dial",
      "Call queues and dispositions",
      "DNC and block lists",
      "Number masking",
      "Answering machine detection",
      "Follow-up notifications",
    ],
  },
  {
    num: "02",
    title: "PBX and Business Phone System",
    desc: "A complete IP PBX with all the routing, extensions and call management your business needs.",
    items: [
      "SIP devices and trunks",
      "Outbound rules and caller ID groups",
      "DID management and click-to-call",
      "IVR and time conditions",
      "Conference, ring group, voicemail",
      "DND, speed dial, call forwarding and transfer",
      "CDR and live call reports",
    ],
  },
  {
    num: "03",
    title: "Supervisor and Quality Control",
    desc: "Give supervisors complete visibility and control over every live and recorded call.",
    items: [
      "Live call monitoring",
      "Call barge, whisper and monitor",
      "Recordings and agent activity logs",
      "Real-time wallboard",
      "Performance dashboards",
    ],
  },
  {
    num: "04",
    title: "Lead and Campaign Management",
    desc: "Import, assign and track leads across targeted outbound campaigns with full follow-up workflows.",
    items: [
      "Lead import and distribution",
      "Lead groups and custom fields",
      "Campaign setup and dispositions",
      "Follow-ups and web forms",
    ],
  },
  {
    num: "05",
    title: "Voice Broadcast",
    desc: "Reach thousands of contacts automatically with scheduled voice messages, surveys and IVR.",
    items: [
      "Scheduled broadcasts",
      "Survey mode",
      "IVR mode",
      "Retries and delivery logic",
      "Broadcast delivery reports",
    ],
  },
  {
    num: "06",
    title: "Reporting and Analytics",
    desc: "Real-time and historical data across every channel, agent and campaign — all in one place.",
    items: [
      "CDR, live calls, missed calls",
      "Real-time wallboard",
      "Lead and campaign reports",
      "Voice broadcast reports",
      "User performance and login/logout",
      "Voicemail and recordings",
    ],
  },
  {
    num: "07",
    title: "Integrations",
    desc: "Connect Sky Agent to your CRM, email and other systems through webhooks and native integrations.",
    items: [
      "Webhooks and CRM readiness",
      "Zoho CRM reference integration",
      "SMTP email settings",
      "Future WhatsApp / SMS channels (where enabled)",
    ],
  },
];

export default function Features() {
  return (
    <>
      <PageHero
        eyebrow="Features"
        title="Everything your call centre team needs in one platform"
        subtitle="From telephony fundamentals to advanced supervision and reporting — Sky Agent brings it all together in a single, dependable stack."
      />

      {/* Feature Groups — Bento Style */}
      <section className="relative py-10 md:py-20 overflow-hidden">
        {/* subtle animated blobs in section background */}
        <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-brand-blue/5 blur-[80px] animate-blob pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-brand-red/5 blur-[80px] animate-blob [animation-delay:3s] pointer-events-none" />
        <div className="container max-w-6xl px-4">
          <div className="rounded-2xl overflow-hidden border bg-border shadow-card divide-y divide-border md:divide-y-0 md:grid md:grid-cols-2 md:gap-px md:bg-border">
            {groups.map((g) => (
              <div
                key={g.title}
                className={`group relative bg-card p-6 md:p-10 hover:bg-muted/30 transition-colors ${
                  g.num === "07" ? "md:col-span-2" : ""
                }`}
              >
                {/* Ghost number */}
                <span className="font-display text-4xl md:text-5xl font-extrabold text-brand-red/10 group-hover:text-brand-red/20 transition-colors select-none absolute top-4 right-5 md:top-6 md:right-8 leading-none">
                  {g.num}
                </span>

                <div className="relative pr-10 md:pr-12">
                  <h3 className="font-display text-lg md:text-xl font-bold text-foreground">{g.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{g.desc}</p>

                  <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                    {g.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-foreground/75">
                        <CheckCircle2 className="h-3.5 w-3.5 text-brand-red mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
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
                <span className="text-xs uppercase tracking-widest text-white/50 font-semibold">Explore the platform</span>
                <h2 className="mt-3 font-display text-2xl md:text-4xl font-bold leading-tight">
                  Ready to see it in action?
                </h2>
                <p className="mt-4 text-white/65 text-sm leading-relaxed max-w-sm mx-auto md:mx-0">
                  Book a walkthrough and our team will show you exactly how Sky Agent fits your team's workflow.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row md:justify-end gap-3">
                <Button asChild size="lg" className="w-full sm:w-auto bg-white text-[#0f172a] font-semibold hover:bg-white/90">
                  <Link to="/demo">Request a Demo</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto border-white/30 text-white bg-white/5 hover:bg-white/15 hover:text-white">
                  <Link to="/pricing">View Pricing <ChevronRight className="h-4 w-4 ml-1" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
