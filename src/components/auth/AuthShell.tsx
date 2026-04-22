import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(60%_50%_at_50%_30%,black,transparent)]" />
      <div className="absolute inset-x-0 top-0 h-[600px] bg-hero-glow" />

      <div className="relative flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-background font-bold text-sm">
              R
            </span>
            <span className="text-[15px] font-semibold tracking-tight">Relay</span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to site
          </Link>
        </header>

        <main className="flex flex-1 items-start justify-center px-4 pt-8 pb-16 sm:items-center sm:pt-0">
          <div className="w-full max-w-[400px]">
            <div className="text-center">
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
              <p className="mt-1.5 text-[13.5px] text-muted-foreground">{subtitle}</p>
            </div>

            <div className="mt-7 rounded-xl border border-border bg-surface/80 p-6 shadow-elegant backdrop-blur-sm">
              {children}
            </div>

            {footer && (
              <div className="mt-5 text-center text-[13px] text-muted-foreground">{footer}</div>
            )}
          </div>
        </main>
      </div>

      {/* Outlet enables nested auth routes if needed */}
      <Outlet />
    </div>
  );
}

// Shared form primitives used across auth pages
export function Field({
  label,
  type = "text",
  placeholder,
  hint,
  rightSlot,
  autoComplete,
  defaultValue,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  hint?: string;
  rightSlot?: ReactNode;
  autoComplete?: string;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[12px] font-medium text-foreground/90">{label}</span>
        {rightSlot}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        className="block h-10 w-full rounded-md border border-border bg-surface-elevated/60 px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/10"
      />
      {hint && <p className="mt-1.5 text-[11.5px] text-muted-foreground">{hint}</p>}
    </label>
  );
}

export function PrimaryButton({
  children,
  onClick,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-md bg-primary text-sm font-medium text-primary-foreground transition hover:opacity-90"
    >
      {children}
    </button>
  );
}

export function SocialButtons() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {[
        { l: "Google", icon: <GoogleIcon /> },
        { l: "Apple", icon: <AppleIcon /> },
      ].map((b) => (
        <button
          key={b.l}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-surface-elevated/60 px-3 text-[13px] font-medium text-foreground transition hover:border-foreground/30"
        >
          {b.icon}
          {b.l}
        </button>
      ))}
    </div>
  );
}

export function Divider({ children }: { children: ReactNode }) {
  return (
    <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-wider text-muted-foreground">
      <span className="h-px flex-1 bg-border" />
      {children}
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.96h5.52c-.24 1.5-1.74 4.38-5.52 4.38-3.32 0-6.04-2.76-6.04-6.16S8.68 6.22 12 6.22c1.9 0 3.16.8 3.88 1.5l2.64-2.54C16.86 3.66 14.66 2.7 12 2.7 6.92 2.7 2.84 6.78 2.84 11.84S6.92 20.98 12 20.98c6.92 0 9.16-4.86 9.16-7.36 0-.5-.06-.88-.14-1.42H12z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-foreground" aria-hidden="true">
      <path d="M16.365 1.43c0 1.14-.46 2.23-1.21 3.02-.81.86-2.13 1.52-3.21 1.43-.13-1.1.4-2.27 1.16-3.06.83-.86 2.27-1.5 3.26-1.39zM20.5 17.16c-.55 1.27-.81 1.84-1.52 2.96-.99 1.56-2.39 3.51-4.12 3.52-1.54.02-1.94-1-4.03-1-2.09.01-2.53 1.02-4.07.99-1.74-.03-3.06-1.78-4.05-3.34-2.78-4.36-3.07-9.47-1.36-12.18 1.22-1.93 3.13-3.06 4.94-3.06 1.83 0 2.99 1.01 4.51 1.01 1.47 0 2.37-1.02 4.49-1.02 1.6 0 3.31.87 4.52 2.38-3.97 2.18-3.32 7.86.69 9.74z" />
    </svg>
  );
}
