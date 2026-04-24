import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  AuthShell,
  Field,
  PrimaryButton,
  SocialButtons,
  Divider,
} from "@/components/auth/AuthShell";
import { useGoogleIdentity } from "@/hooks/useGoogleIdentity";
import { useGoogleLoginMutation, useSignupMutation } from "@/queries/modules/auth.queries";
import type { ApiError } from "@/api/client";

export const Route = createFileRoute("/sign-up")({
  head: () => ({ meta: [{ title: "Create account — Relay" }] }),
  component: SignUp,
});

function SignUp() {
  const { isConfigured, renderButton } = useGoogleIdentity();
  const googleLogin = useGoogleLoginMutation("/onboarding");
  const signup = useSignupMutation("/onboarding");
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupError, setSignupError] = useState<string | null>(null);

  useEffect(() => {
    const element = googleButtonRef.current;
    if (!element) return;

    void renderButton(element, {
      text: "signup_with",
      onCredential: (idToken) => {
        setGoogleError(null);
        void googleLogin.mutateAsync({ idToken }).catch((error: unknown) => {
          setGoogleError(error instanceof Error ? error.message : "Google sign-up failed.");
        });
      },
      onError: (error) => setGoogleError(error.message),
    });
  }, [googleLogin, renderButton]);

  function handleSignupSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSignupError(null);

    if (!fullName.trim()) {
      setSignupError("Full name is required.");
      return;
    }

    if (!email.trim()) {
      setSignupError("Work email is required.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      setSignupError("Enter a valid email address.");
      return;
    }

    if (!password) {
      setSignupError("Password is required.");
      return;
    }

    if (password.length < 8) {
      setSignupError("Password must be at least 8 characters.");
      return;
    }

    void signup
      .mutateAsync({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        displayName: fullName.trim().split(/\s+/)[0] || undefined,
      })
      .catch((error: unknown) => {
        const apiError = error as ApiError | undefined;
        setSignupError(apiError?.message || "Sign-up failed.");
      });
  }

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
      <SocialButtons
        googleSlot={
          <div
            ref={googleButtonRef}
            className="mx-auto flex min-h-11 w-full max-w-[400px] justify-center overflow-hidden rounded-full [&_iframe]:!m-0"
          />
        }
        googleLoading={googleLogin.isPending}
        googleDisabled={!isConfigured}
      />
      {(googleError || googleLogin.error || !isConfigured) && (
        <p className="mt-3 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-[12.5px] text-destructive">
          {!isConfigured
            ? "Google login is not configured. Set VITE_GOOGLE_CLIENT_ID in the frontend environment."
            : googleError || googleLogin.error?.message || "Google sign-up failed."}
        </p>
      )}
      <Divider>or sign up with email</Divider>
      <form className="space-y-3" onSubmit={handleSignupSubmit}>
        <Field
          label="Full name"
          placeholder="Alex Mercer"
          autoComplete="name"
          value={fullName}
          onChange={setFullName}
        />
        <Field
          label="Work email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          value={email}
          onChange={setEmail}
        />
        <Field
          label="Password"
          type="password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          hint="Use 8+ characters with a mix of letters and numbers."
          value={password}
          onChange={setPassword}
        />
        {signupError && (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-[12.5px] text-destructive">
            {signupError}
          </p>
        )}
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
          <PrimaryButton type="submit">
            {signup.isPending ? "Creating account..." : "Create account"}{" "}
            <ArrowRight className="h-3.5 w-3.5" />
          </PrimaryButton>
        </div>
      </form>
    </AuthShell>
  );
}
