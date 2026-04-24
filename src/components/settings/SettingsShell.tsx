import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Settings,
  User,
  Bell,
  Palette,
  Users,
  Plug,
  CreditCard,
  Shield,
  Menu,
  X,
} from "lucide-react";
import { getCurrentWorkspace, getWorkspaceHomePath } from "@/lib/current-workspace";
import { cn } from "@/lib/utils";

type NavItem = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  group: string;
};

const NAV: NavItem[] = [
  { to: "/settings", label: "General", icon: Settings, group: "Workspace" },
  { to: "/settings/members", label: "Members", icon: Users, group: "Workspace" },
  { to: "/settings/integrations", label: "Integrations", icon: Plug, group: "Workspace" },
  { to: "/settings/billing", label: "Billing", icon: CreditCard, group: "Workspace" },
  { to: "/settings/security", label: "Security", icon: Shield, group: "Workspace" },
  { to: "/settings/profile", label: "Profile", icon: User, group: "Account" },
  { to: "/settings/notifications", label: "Notifications", icon: Bell, group: "Account" },
  { to: "/settings/appearance", label: "Appearance", icon: Palette, group: "Account" },
];

export function SettingsShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);
  const workspaceHomePath = getWorkspaceHomePath(getCurrentWorkspace());

  const groups = Array.from(new Set(NAV.map((n) => n.group)));

  const NavList = () => (
    <nav className="flex flex-col gap-5">
      {groups.map((g) => (
        <div key={g}>
          <div className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {g}
          </div>
          <div className="flex flex-col gap-px">
            {NAV.filter((n) => n.group === g).map((n) => {
              const active = location.pathname === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setNavOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13.5px] transition-colors",
                    active
                      ? "bg-foreground/[0.06] text-foreground"
                      : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground",
                  )}
                >
                  <n.icon className="h-3.5 w-3.5" />
                  {n.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="hidden w-[260px] shrink-0 flex-col border-r border-border bg-sidebar md:flex">
        <button
          onClick={() => navigate({ to: workspaceHomePath })}
          className="flex items-center gap-2 border-b border-sidebar-border px-4 py-4 text-[13px] text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to workspace
        </button>
        <div className="px-3 py-4">
          <h1 className="mb-4 px-2 text-[15px] font-semibold">Settings</h1>
          <NavList />
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 items-center gap-2 border-b border-border bg-background px-3 md:hidden">
          <button
            onClick={() => setNavOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground"
          >
            <Menu className="h-4 w-4" />
          </button>
          <span className="text-[14px] font-semibold">Settings</span>
          <Link
            to={workspaceHomePath}
            className="ml-auto text-[12px] text-muted-foreground hover:text-foreground"
          >
            Back
          </Link>
        </header>

        {/* Mobile drawer */}
        {navOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-background/70 backdrop-blur-sm"
              onClick={() => setNavOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 w-[260px] bg-sidebar border-r border-sidebar-border p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-[15px] font-semibold">Settings</h2>
                <button
                  onClick={() => setNavOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <NavList />
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-8 sm:py-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export function SettingsHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-8 border-b border-border pb-5">
      <h1 className="text-[22px] font-semibold tracking-tight">{title}</h1>
      {description && <p className="mt-1 text-[13.5px] text-muted-foreground">{description}</p>}
    </div>
  );
}

export function SettingsSection({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <section className="mb-6 overflow-hidden rounded-xl border border-border bg-surface-elevated/40">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-[14px] font-semibold">{title}</h2>
        {description && <p className="mt-0.5 text-[12.5px] text-muted-foreground">{description}</p>}
      </div>
      <div className="px-5 py-4">{children}</div>
      {footer && (
        <div className="flex items-center justify-end gap-2 border-t border-border bg-foreground/[0.02] px-5 py-3">
          {footer}
        </div>
      )}
    </section>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4 last:mb-0">
      <label className="mb-1 block text-[12.5px] font-medium text-foreground">{label}</label>
      {children}
      {hint && <p className="mt-1 text-[11.5px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex w-full items-start justify-between gap-4 rounded-lg border border-border bg-background/30 px-4 py-3 text-left hover:border-foreground/20"
    >
      <div className="min-w-0">
        <div className="text-[13px] font-medium text-foreground">{label}</div>
        {description && (
          <div className="mt-0.5 text-[12px] text-muted-foreground">{description}</div>
        )}
      </div>
      <span
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors",
          checked ? "bg-foreground" : "bg-foreground/[0.12]",
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-background shadow transition-transform",
            checked ? "translate-x-[18px]" : "translate-x-0.5",
          )}
        />
      </span>
    </button>
  );
}

export const settingsInputClass =
  "h-9 w-full rounded-md border border-border bg-background/40 px-3 text-[13px] text-foreground placeholder:text-muted-foreground/60 focus:border-foreground/30 focus:outline-none focus:ring-1 focus:ring-foreground/10";

export const settingsBtnPrimary =
  "inline-flex h-8 items-center justify-center rounded-md bg-foreground px-3 text-[12.5px] font-semibold text-background hover:opacity-90 transition-opacity";
export const settingsBtnGhost =
  "inline-flex h-8 items-center justify-center rounded-md border border-border bg-background/40 px-3 text-[12.5px] font-medium text-foreground hover:border-foreground/30 transition-colors";
