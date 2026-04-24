import { Link } from "@tanstack/react-router";

export function NotFoundPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(50%_50%_at_50%_50%,black,transparent)]" />
      <div className="relative max-w-md text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-surface-elevated text-2xl font-bold">
          R
        </div>
        <h1 className="text-7xl font-semibold tracking-tight text-foreground">404</h1>
        <h2 className="mt-3 text-xl font-semibold text-foreground">This page is off-the-grid</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist, has been moved, or is taking a quiet
          day.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
          <Link
            to="/help"
            className="inline-flex items-center justify-center rounded-md border border-border bg-surface-elevated/60 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-foreground/30"
          >
            Visit help center
          </Link>
        </div>
      </div>
    </div>
  );
}
