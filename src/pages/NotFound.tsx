import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
            <h1 className="font-display text-7xl font-bold text-foreground">404</h1>
            <p className="mt-4 text-2xl font-semibold text-foreground">Page not found</p>
            <p className="mt-2 text-muted-foreground max-w-sm">
                The page you're looking for doesn't exist or has been moved.
            </p>
            <Button asChild className="mt-8 bg-gradient-red text-white shadow-glow-red hover:opacity-90">
                <Link to="/">Back to Home</Link>
            </Button>
        </div>
    );
}
