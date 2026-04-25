import { Link, useLocation } from "@tanstack/react-router";
import { ArrowRight, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthSessionState } from "@/lib/auth-session";
import { getWorkspaceHomePath, useStoredCurrentWorkspace } from "@/lib/current-workspace";
import { useTheme } from "@/lib/store";
import { Route as RootRoute } from "@/routes/__root";

export function PublicNav() {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const initialSession = RootRoute.useLoaderData();
  const authState = useAuthSessionState();
  const { workspace } = useStoredCurrentWorkspace();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const status = isMounted
    ? authState.status === "pending"
      ? initialSession.status
      : authState.status
    : initialSession.status;
  const currentWorkspace = isMounted
    ? (workspace ?? initialSession.workspace)
    : initialSession.workspace;
  const workspaceHomePath = getWorkspaceHomePath(currentWorkspace);
  const shouldContinueSetup = initialSession.requiresOnboarding || !currentWorkspace;
  const authenticatedCtaPath = shouldContinueSetup ? "/onboarding" : workspaceHomePath;
  const authenticatedCtaLabel = shouldContinueSetup ? "Continue setup" : "Dashboard";
  const renderedTheme = isMounted ? theme : "dark";
  const prefersDark = isMounted && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = renderedTheme === "dark" || (renderedTheme === "system" && prefersDark);
  const isHome = location.pathname === "/";

  const scrollToSection = (id: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isHome) return;
    event.preventDefault();
    const section = document.getElementById(id);
    if (!section) return;

    const top = section.getBoundingClientRect().top + window.scrollY - 88;
    window.scrollTo({ top, behavior: "smooth" });
    window.history.replaceState(null, "", `#${id}`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-sm font-bold text-background">
              R
            </span>
            <span className="text-[15px] font-semibold tracking-tight">Relay</span>
          </Link>
          <nav className="hidden items-center gap-6 text-[13px] text-muted-foreground md:flex">
            <a
              href={isHome ? "#features" : "/#features"}
              onClick={scrollToSection("features")}
              className="transition-colors hover:text-foreground"
            >
              Features
            </a>
            <a
              href={isHome ? "#pricing" : "/#pricing"}
              onClick={scrollToSection("pricing")}
              className="transition-colors hover:text-foreground"
            >
              Pricing
            </a>
            <Link to="/changelog" className="transition-colors hover:text-foreground">
              Changelog
            </Link>
            <Link to="/help" className="transition-colors hover:text-foreground">
              Help
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface-elevated/60 text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {status === "authenticated" ? (
            <Link
              to={authenticatedCtaPath}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-[13px] font-medium text-primary-foreground transition hover:opacity-90"
            >
              {authenticatedCtaLabel} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <>
              <Link
                to="/sign-in"
                className="hidden px-2 text-[13px] text-muted-foreground hover:text-foreground sm:inline"
              >
                Sign in
              </Link>
              <Link
                to="/sign-up"
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-[13px] font-medium text-primary-foreground transition hover:opacity-90"
              >
                Get started <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
