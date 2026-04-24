import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "sonner";
import { NotFoundPage } from "@/components/NotFoundPage";
import { ThemeBoot } from "@/components/ThemeBoot";
import { QueryProvider } from "@/queries/QueryProvider";

import appCss from "../styles.css?url";

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
  notFoundComponent: NotFoundPage,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-foreground antialiased">
        <ThemeBoot />
        <QueryProvider>{children}</QueryProvider>
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
