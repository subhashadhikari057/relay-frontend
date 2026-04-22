import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import {
  AuthShell,
  Field,
  PrimaryButton,
  SocialButtons,
  Divider,
} from "@/components/auth/AuthShell";

export const Route = createFileRoute("/sign-in")({
  head: () => ({ meta: [{ title: "Sign in — Relay" }] }),
  component: SignIn,
});

function SignIn() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your Relay workspace"
      footer={
        <>
          New to Relay?{" "}
          <Link to="/sign-up" className="text-foreground hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <SocialButtons />
      <Divider>or continue with email</Divider>
      <form className="space-y-3">
        <Field label="Email" type="email" placeholder="you@company.com" autoComplete="email" />
        <Field
          label="Password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          rightSlot={
            <Link
              to="/forgot-password"
              className="text-[11.5px] text-muted-foreground hover:text-foreground"
            >
              Forgot?
            </Link>
          }
        />
        <label className="flex items-center gap-2 pt-1 text-[12.5px] text-muted-foreground">
          <input
            type="checkbox"
            className="h-3.5 w-3.5 rounded border-border bg-surface-elevated accent-foreground"
          />
          Remember me on this device
        </label>
        <div className="pt-2">
          <PrimaryButton>
            <Link to="/app" className="flex items-center gap-1.5">
              Sign in <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </PrimaryButton>
        </div>
      </form>
    </AuthShell>
  );
}
