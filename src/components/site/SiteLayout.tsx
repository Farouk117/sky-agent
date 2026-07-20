import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Cloud, Sun, Moon, Monitor, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AgentConsole } from "@/components/AgentConsole";
import { cn } from "@/lib/utils";

const navLinks = [
    { to: "/", label: "Home" },
    { to: "/features", label: "Features" },
    { to: "/solutions", label: "Solutions" },
    { to: "/pricing", label: "Pricing" },
    { to: "/demo", label: "Request Demo", highlight: true },
];

const footerPlatform = [
    { to: "/features", label: "Features" },
    { to: "/solutions", label: "Solutions" },
    { to: "/pricing", label: "Pricing" },
];

const footerUseCases = [
    "Customer Support", "Sales Campaigns", "Voice Broadcast", "BPO Operations", "Government Hotlines",
];

const footerCompany = [
    { to: "/demo", label: "Request Demo" },
    { to: "/demo", label: "Talk to Sales" },
    { to: "/demo", label: "Contact Us" },
];

export function SiteLayout() {
    const location = useLocation();
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showSimulator, setShowSimulator] = useState(false);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);

    useEffect(() => {
        setMobileOpen(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [location.pathname]);

    if (showSimulator) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
                    <div className="container flex h-16 items-center justify-between">
                        <Link to="/" className="flex shrink-0 items-center gap-2 no-underline">
                            <img src="/logo.png" alt="Sky Agent Logo" className="h-10 w-auto object-contain dark:brightness-0 dark:invert" />
                        </Link>
                        <span className="text-sm font-semibold text-yellow-500">⚡ Live Simulator Mode</span>
                        <Button variant="outline" size="sm" onClick={() => setShowSimulator(false)}>
                            ← Exit Simulator
                        </Button>
                    </div>
                </header>
                <main className="flex-1">
                    <AgentConsole onBackToLanding={() => setShowSimulator(false)} />
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            {/* ── Navbar ── */}
            <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
                <div className="container flex h-16 items-center justify-between gap-4">
                    {/* Logo */}
                    <Link to="/" className="flex shrink-0 items-center gap-2 no-underline">
                        <img src="/logo.png" alt="Sky Agent Logo" className="h-10 w-auto object-contain dark:brightness-0 dark:invert" />
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-6">
                        {navLinks.map(({ to, label, highlight }) => (
                            <Link
                                key={to}
                                to={to}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-primary no-underline",
                                    location.pathname === to ? "text-primary" : "text-muted-foreground",
                                    highlight && "font-semibold text-brand-red hover:text-brand-red"
                                )}
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right controls */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
                            title="Toggle theme"
                        >
                            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </Button>
                        <Button
                            size="sm"
                            className="hidden sm:inline-flex bg-gradient-red text-white shadow-glow-red hover:opacity-90"
                            onClick={() => setShowSimulator(true)}
                        >
                            <Monitor className="h-4 w-4" /> Live Demo
                        </Button>
                        {/* Hamburger */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setMobileOpen(o => !o)}
                        >
                            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile dropdown */}
                {mobileOpen && (
                    <div className="border-t md:hidden">
                        <nav className="container flex flex-col gap-1 py-3">
                            {navLinks.map(({ to, label, highlight }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    className={cn(
                                        "rounded-md px-3 py-2.5 text-sm font-medium no-underline transition-colors",
                                        location.pathname === to
                                            ? "bg-muted text-primary"
                                            : "text-foreground hover:bg-muted",
                                        highlight && "text-brand-red font-semibold"
                                    )}
                                >
                                    {label}
                                </Link>
                            ))}
                            <Button
                                className="mt-2 bg-gradient-red text-white"
                                onClick={() => { setMobileOpen(false); setShowSimulator(true); }}
                            >
                                <Monitor className="h-4 w-4" /> Live Demo
                            </Button>
                        </nav>
                    </div>
                )}
            </header>

            {/* ── Page content ── */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* ── Footer ── */}
            <footer className="border-t bg-muted/30 mt-8">
                <div className="container py-14">
                    <div className="grid gap-10 md:grid-cols-4 lg:grid-cols-5">
                        {/* Brand */}
                        <div className="md:col-span-2">
                            <Link to="/" className="inline-flex items-center gap-2 no-underline">
                                <img src="/logo.png" alt="Sky Agent Logo" className="h-10 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity dark:brightness-0 dark:invert" />
                            </Link>
                            <p className="mt-4 max-w-[240px] text-sm text-muted-foreground leading-relaxed">
                                Cloud contact centre software built for Nigerian businesses. Connected. Resolved.
                            </p>
                        </div>

                        {/* Platform */}
                        <div>
                            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Platform</h4>
                            <ul className="space-y-2.5">
                                {footerPlatform.map(({ to, label }) => (
                                    <li key={to}>
                                        <Link to={to} className="text-sm text-muted-foreground hover:text-foreground no-underline transition-colors">{label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Use cases */}
                        <div>
                            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Use Cases</h4>
                            <ul className="space-y-2.5">
                                {footerUseCases.map(label => (
                                    <li key={label}>
                                        <Link to="/solutions" className="text-sm text-muted-foreground hover:text-foreground no-underline transition-colors">{label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Company</h4>
                            <ul className="space-y-2.5">
                                {footerCompany.map(({ to, label }) => (
                                    <li key={label}>
                                        <Link to={to} className="text-sm text-muted-foreground hover:text-foreground no-underline transition-colors">{label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t pt-6 text-xs text-muted-foreground">
                        <span>© {new Date().getFullYear()} IT Sky Solutions Limited. All rights reserved.</span>
                        <span>hello@skyagent.ng · Abuja, Nigeria</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
