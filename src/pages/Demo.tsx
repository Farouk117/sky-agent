import { useEffect } from "react";
import { PageHero } from "@/components/site/PageHero";
import { Card } from "@/components/ui/card";
import { PhoneCall, Mail, MapPin } from "lucide-react";

export default function Demo() {
    useEffect(() => {
        // Add Calendly script to document on mount
        const script = document.createElement("script");
        script.src = "https://assets.calendly.com/assets/external/widget.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            // Clean up script on unmount
            if (script.parentNode) script.parentNode.removeChild(script);
        };
    }, []);

    return (
        <>
            <PageHero
                eyebrow="Request Demo"
                title="See Sky Agent in action"
                subtitle="Tell us about your team and we'll set up a tailored walkthrough of Sky Agent for your use case."
            />

            <section className="py-16 md:py-24">
                <div className="container grid lg:grid-cols-3 gap-10">
                    {/* Left sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <div>
                            <h3 className="font-display text-xl font-bold text-foreground">Talk to the Sky Agent team</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                We work with support, sales, BPO, government, financial services, healthcare, education
                                and logistics teams across Nigeria.
                            </p>
                        </div>
                        <div className="space-y-4 text-sm">
                            {[
                                { icon: PhoneCall, label: "Sales", value: "+234 (0) 000 000 0000", color: "bg-brand-red/10 text-brand-red" },
                                { icon: Mail, label: "Email", value: "hello@skyagent.ng", color: "bg-brand-blue/10 text-brand-blue" },
                                { icon: MapPin, label: "Head Office", value: "Abuja, Nigeria", color: "bg-foreground/10 text-foreground" },
                            ].map(({ icon: Icon, label, value, color }) => (
                                <div key={label} className="flex items-start gap-3">
                                    <div className={`h-10 w-10 rounded-lg ${color} flex items-center justify-center shrink-0`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-foreground">{label}</div>
                                        <div className="text-muted-foreground">{value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form card */}
                    <div className="lg:col-span-2">
                        <Card className="p-2 md:p-4 shadow-elevated overflow-hidden bg-background">
                            {/* Calendly inline widget begin */}
                            <div
                                className="calendly-inline-widget"
                                data-url="https://calendly.com/"
                                style={{ minWidth: "320px", height: "700px" }}
                            />
                            {/* Calendly inline widget end */}
                        </Card>
                    </div>
                </div>
            </section>
        </>
    );
}
