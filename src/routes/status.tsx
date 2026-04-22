import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/status")({
  head: () => ({
    meta: [
      { title: "System Status — Relay" },
      { name: "description", content: "Live status of every Relay subsystem." },
      { property: "og:title", content: "System Status — Relay" },
      { property: "og:description", content: "Live status of every Relay subsystem." },
    ],
  }),
  component: StatusPage,
});

const services = [
  { name: "API", status: "operational", uptime: "99.998%" },
  { name: "Web app", status: "operational", uptime: "99.997%" },
  { name: "Realtime / WebSockets", status: "operational", uptime: "99.984%" },
  { name: "Search", status: "degraded", uptime: "99.62%" },
  { name: "File storage", status: "operational", uptime: "99.999%" },
  { name: "Notifications (push & email)", status: "operational", uptime: "99.991%" },
  { name: "Mobile apps", status: "operational", uptime: "99.95%" },
];

const incidents = [
  {
    date: "April 21, 2026",
    title: "Elevated search latency in eu-west",
    severity: "Minor",
    status: "Investigating",
    body: "We're seeing intermittent slow search responses (>2s p95) in the eu-west region. Other regions unaffected.",
  },
  {
    date: "April 14, 2026",
    title: "Brief WebSocket reconnects",
    severity: "Minor",
    status: "Resolved",
    body: "A 3-minute window of automatic WebSocket reconnects affected ~4% of sessions. No messages were lost.",
  },
];

function StatusPage() {
  const allOk = services.every((s) => s.status === "operational");
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-background font-bold text-sm">
              R
            </span>
            <span className="text-[15px] font-semibold tracking-tight">Relay</span>
            <span className="ml-2 text-[12.5px] text-muted-foreground">Status</span>
          </Link>
          <Link to="/app" className="text-[13px] text-muted-foreground hover:text-foreground">
            Open app →
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <div
          className={`flex items-center gap-3 rounded-xl border p-5 ${
            allOk
              ? "border-[oklch(0.72_0.16_150)]/40 bg-[oklch(0.72_0.16_150)]/5"
              : "border-[oklch(0.78_0.15_75)]/40 bg-[oklch(0.78_0.15_75)]/5"
          }`}
        >
          {allOk ? (
            <CheckCircle2 className="h-6 w-6 text-[oklch(0.72_0.16_150)]" />
          ) : (
            <AlertTriangle className="h-6 w-6 text-[oklch(0.78_0.15_75)]" />
          )}
          <div>
            <div className="text-[15px] font-semibold">
              {allOk ? "All systems operational" : "Some systems are degraded"}
            </div>
            <div className="text-[12.5px] text-muted-foreground">
              Last updated just now · automatically refreshed every 60s
            </div>
          </div>
        </div>

        <h2 className="mt-10 text-[11.5px] uppercase tracking-wider text-muted-foreground">
          Services
        </h2>
        <div className="mt-3 divide-y divide-border rounded-xl border border-border bg-surface/30">
          {services.map((s) => {
            const ok = s.status === "operational";
            return (
              <div key={s.name} className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                      ok ? "bg-[oklch(0.72_0.16_150)]" : "bg-[oklch(0.78_0.15_75)]"
                    } animate-pulse-dot`}
                  />
                  <span className="truncate text-[14px] font-medium">{s.name}</span>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="hidden text-[11.5px] text-muted-foreground sm:inline">
                    {s.uptime} uptime
                  </span>
                  <span
                    className={`text-[12px] capitalize ${ok ? "text-[oklch(0.72_0.16_150)]" : "text-[oklch(0.85_0.15_75)]"}`}
                  >
                    {s.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <h2 className="mt-10 text-[11.5px] uppercase tracking-wider text-muted-foreground">
          Recent incidents
        </h2>
        <div className="mt-3 space-y-3">
          {incidents.map((i) => (
            <div key={i.title} className="rounded-xl border border-border bg-surface/30 p-5">
              <div className="flex flex-wrap items-center gap-2 text-[12px] text-muted-foreground">
                <time>{i.date}</time>
                <span>·</span>
                <span>{i.severity}</span>
                <span>·</span>
                <span
                  className={
                    i.status === "Resolved"
                      ? "text-[oklch(0.72_0.16_150)]"
                      : "text-[oklch(0.85_0.15_75)]"
                  }
                >
                  {i.status}
                </span>
              </div>
              <h3 className="mt-2 text-[15px] font-semibold">{i.title}</h3>
              <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">{i.body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-3xl px-4 text-center text-[12px] text-muted-foreground sm:px-6">
          © 2026 Relay Labs ·{" "}
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>{" "}
          ·{" "}
          <Link to="/help" className="hover:text-foreground">
            Help
          </Link>{" "}
          ·{" "}
          <Link to="/changelog" className="hover:text-foreground">
            Changelog
          </Link>
        </div>
      </footer>
    </div>
  );
}
