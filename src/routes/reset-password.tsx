import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { AuthShell, Field, PrimaryButton } from "@/components/auth/AuthShell";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Set new password — Relay" }] }),
  component: Reset,
});

function Reset() {
  return (
    <AuthShell
      title="Set a new password"
      subtitle="Choose a strong password you haven't used before"
      footer={
        <Link to="/sign-in" className="text-foreground hover:underline">
          Back to sign in
        </Link>
      }
    >
      <form className="space-y-3">
        <Field
          label="New password"
          type="password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
        />
        <Field
          label="Confirm password"
          type="password"
          placeholder="Repeat password"
          autoComplete="new-password"
        />
        <ul className="space-y-1 pt-1 text-[12px] text-muted-foreground">
          {[
            "At least 8 characters",
            "One number or symbol",
            "Different from your last password",
          ].map((r) => (
            <li key={r} className="flex items-center gap-2">
              <Check className="h-3 w-3 text-[oklch(0.72_0.16_150)]" /> {r}
            </li>
          ))}
        </ul>
        <div className="pt-2">
          <PrimaryButton>
            <Link to="/sign-in">Update password</Link>
          </PrimaryButton>
        </div>
      </form>
    </AuthShell>
  );
}
