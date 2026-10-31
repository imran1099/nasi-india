"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError] Unhandled application error:", error);
  }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center py-16 md:py-24 bg-sand-50">
      <Container size="sm" className="text-center space-y-6">
        <Badge variant="gold" size="md">
          Temporary System Notice
        </Badge>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-forest-950">
          Something went wrong
        </h1>
        <p className="text-sm text-forest-800/80 max-w-md mx-auto leading-relaxed">
          An unexpected issue prevented this page from loading completely. Our administrative team has been notified.
        </p>

        {error.digest && (
          <p className="text-[11px] font-mono text-forest-500">
            Error Diagnostic Code: {error.digest}
          </p>
        )}

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button onClick={() => reset()} variant="primary" size="md">
            Try Again
          </Button>
          <Button href="/" variant="outline" size="md">
            Return to Homepage
          </Button>
        </div>
      </Container>
    </div>
  );
}
