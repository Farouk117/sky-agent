import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
    eyebrow?: string;
    title: string;
    subtitle?: string;
    className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ eyebrow, title, subtitle, className }) => (
    <div className={cn("mx-auto max-w-2xl text-center", className)}>
        {eyebrow && (
            <p className="text-sm font-bold uppercase tracking-widest text-brand-red">{eyebrow}</p>
        )}
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {title}
        </h2>
        {subtitle && (
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">{subtitle}</p>
        )}
    </div>
);
