import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { AuthShell, Field, PrimaryButton } from "@/components/auth/AuthShell";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Forgot password — Relay" }] }),
  component: Forgot,
});

function Forgot() {
  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your email and we'll send you a reset link"
      footer={
        <>
          Remembered it?{" "}
          <Link to="/sign-in" className="text-foreground hover:underline">
            Back to sign in
          </Link>
        </>
      }
    >
      <form className="space-y-4">
        <Field label="Email" type="email" placeholder="you@company.com" autoComplete="email" />
        <PrimaryButton type="submit">
          <Mail className="h-3.5 w-3.5" />
          Send reset link
        </PrimaryButton>
      </form>
      <div className="mt-5 rounded-md border border-border bg-surface-elevated/40 px-3 py-2.5 text-[12px] text-muted-foreground">
        We'll send a one-time link valid for 30 minutes. Check your spam folder if you don't see it.
      </div>
    </AuthShell>
  );
}
