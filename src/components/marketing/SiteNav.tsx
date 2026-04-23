import { Link } from "@tanstack/react-router";
import { ArrowRight, Menu, Moon, Sun, X } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/lib/store";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Features", to: "/", hash: "features" },
  { label: "Pricing", to: "/", hash: "pricing" },
  { label: "Changelog", to: "/changelog" },
  { label: "Help", to: "/help" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const isDark = theme !== "light";

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-sm font-bold text-background">
              R
            </span>
            <span className="text-[15px] font-semibold tracking-tight">Relay</span>
          </Link>

          <nav className="hidden items-center gap-6 text-[13px] text-muted-foreground md:flex">
            {navItems.map((item) =>
              item.hash ? (
                <a
                  key={`${item.to}-${item.hash}`}
                  href={`${item.to}#${item.hash}`}
                  className="transition-colors hover:text-foreground"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.to}
                  to={item.to}
                  className="transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface-elevated/60 text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link
            to="/sign-in"
            className="hidden px-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground sm:inline"
          >
            Sign in
          </Link>
          <Link
            to="/sign-up"
            className="hidden items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-[13px] font-medium text-primary-foreground transition hover:opacity-90 sm:inline-flex"
          >
            Get started <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation"
            aria-expanded={open}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface-elevated/60 text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "border-t border-border bg-background px-4 py-3 md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav className="mx-auto flex max-w-6xl flex-col gap-1 text-[13px]">
          {navItems.map((item) =>
            item.hash ? (
              <a
                key={`${item.to}-${item.hash}`}
                href={`${item.to}#${item.hash}`}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-muted-foreground transition-colors hover:bg-foreground/[0.04] hover:text-foreground"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-muted-foreground transition-colors hover:bg-foreground/[0.04] hover:text-foreground"
              >
                {item.label}
              </Link>
            ),
          )}
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Link
              to="/sign-in"
              onClick={() => setOpen(false)}
              className="inline-flex h-9 items-center justify-center rounded-md border border-border text-[13px] text-foreground"
            >
              Sign in
            </Link>
            <Link
              to="/sign-up"
              onClick={() => setOpen(false)}
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary text-[13px] font-medium text-primary-foreground"
            >
              Get started
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
