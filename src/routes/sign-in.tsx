import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  AuthShell,
  Divider,
  Field,
  PrimaryButton,
  SocialButtons,
} from "@/components/auth/AuthShell";
import { useGoogleIdentity } from "@/hooks/useGoogleIdentity";
import { useGoogleLoginMutation, useLoginMutation } from "@/queries/modules/auth.queries";
import type { ApiError } from "@/api/client";

export const Route = createFileRoute("/sign-in")({
  head: () => ({ meta: [{ title: "Sign in — Relay" }] }),
  component: SignIn,
});

function SignIn() {
  const { isConfigured, renderButton } = useGoogleIdentity();
  const googleLogin = useGoogleLoginMutation();
  const login = useLoginMutation();
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    const element = googleButtonRef.current;
    if (!element) return;

    void renderButton(element, {
      text: "signin_with",
      onCredential: (idToken) => {
        setGoogleError(null);
        void googleLogin.mutateAsync({ idToken }).catch((error: unknown) => {
          setGoogleError(error instanceof Error ? error.message : "Google sign-in failed.");
        });
      },
      onError: (error) => setGoogleError(error.message),
    });
  }, [googleLogin, renderButton]);

  function handleSignInSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginError(null);

    if (!email.trim()) {
      setLoginError("Email is required.");
      return;
    }

    if (!password) {
      setLoginError("Password is required.");
      return;
    }

    void login
      .mutateAsync({
        email: email.trim(),
        password,
      })
      .catch((error: unknown) => {
        const apiError = error as ApiError | undefined;
        setLoginError(apiError?.message || "Sign-in failed.");
      });
  }

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
            : googleError || googleLogin.error?.message || "Google sign-in failed."}
        </p>
      )}
      <Divider>or continue with email</Divider>
      <form className="space-y-3" onSubmit={handleSignInSubmit}>
        <Field
          label="Email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          value={email}
          onChange={setEmail}
        />
        <Field
          label="Password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          value={password}
          onChange={setPassword}
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
        {loginError && (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-[12.5px] text-destructive">
            {loginError}
          </p>
        )}
        <div className="pt-2">
          <PrimaryButton type="submit">
            {login.isPending ? "Signing in..." : "Sign in"}{" "}
            <ArrowRight className="h-3.5 w-3.5" />
          </PrimaryButton>
        </div>
      </form>
    </AuthShell>
  );
}
