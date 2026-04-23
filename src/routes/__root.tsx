import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "sonner";
import { ThemeBoot } from "@/components/ThemeBoot";

import appCss from "../styles.css?url";

function NotFoundComponent() {
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
          The page you're looking for doesn't exist, has been moved, or is taking a quiet day.
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

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Relay — Calm team chat for product teams" },
      {
        name: "description",
        content:
          "Relay is a premium, dark-first team chat for product teams who care about craft. Channels, threads, search — done right.",
      },
      { name: "author", content: "Relay Labs" },
      { property: "og:title", content: "Relay — Calm team chat for product teams" },
      {
        property: "og:description",
        content: "Premium team communication for teams who care about craft.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@relayapp" },
      { name: "twitter:title", content: "Relay — Calm team chat for product teams" },
      {
        name: "twitter:description",
        content: "Premium team communication for teams who care about craft.",
      },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3cfaf496-b796-44de-8df4-9cc5afc6c2b2/id-preview-3d908eea--e9cf5b25-1d44-4ec2-8b9b-46d39d07de94.lovable.app-1776713858144.png",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3cfaf496-b796-44de-8df4-9cc5afc6c2b2/id-preview-3d908eea--e9cf5b25-1d44-4ec2-8b9b-46d39d07de94.lovable.app-1776713858144.png",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-foreground antialiased">
        <ThemeBoot />
        {children}
        <Analytics />
        <Toaster theme="dark" position="bottom-right" richColors closeButton />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
