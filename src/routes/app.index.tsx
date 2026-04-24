import { createFileRoute } from "@tanstack/react-router";
import { NotFoundPage } from "@/components/NotFoundPage";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Relay — Workspace" },
      { name: "description", content: "Your Relay workspace — channels, DMs, and threads." },
    ],
  }),
  component: AppIndexPage,
});

function AppIndexPage() {
  return <NotFoundPage />;
}
