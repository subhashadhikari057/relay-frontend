import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import {
  AuthShell,
  Field,
  PrimaryButton,
  SocialButtons,
  Divider,
} from "@/components/auth/AuthShell";

export const Route = createFileRoute("/sign-up")({
  head: () => ({ meta: [{ title: "Create account — Relay" }] }),
  component: SignUp,
});

function SignUp() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Start collaborating with your team in minutes"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/sign-in" className="text-foreground hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <SocialButtons />
      <Divider>or sign up with email</Divider>
      <form className="space-y-3">
        <Field label="Full name" placeholder="Alex Mercer" autoComplete="name" />
        <Field label="Work email" type="email" placeholder="you@company.com" autoComplete="email" />
        <Field
          label="Password"
          type="password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          hint="Use 8+ characters with a mix of letters and numbers."
        />
        <p className="pt-1 text-[11.5px] text-muted-foreground">
          By creating an account you agree to our{" "}
          <a href="#" className="text-foreground hover:underline">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="text-foreground hover:underline">
            Privacy Policy
          </a>
          .
        </p>
        <div className="pt-2">
          <PrimaryButton>
            <Link to="/onboarding" className="flex items-center gap-1.5">
              Create account <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </PrimaryButton>
        </div>
      </form>
    </AuthShell>
  );
}
