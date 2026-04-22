import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Monitor, Smartphone, Globe } from "lucide-react";
import {
  SettingsHeader,
  SettingsSection,
  Toggle,
  settingsBtnPrimary,
  settingsBtnGhost,
  settingsInputClass,
  Field,
} from "@/components/settings/SettingsShell";

export const Route = createFileRoute("/settings/security")({
  component: SecurityPage,
});

const SESSIONS = [
  {
    id: "s1",
    icon: Monitor,
    name: "MacBook Pro · Safari",
    location: "Lisbon, PT",
    current: true,
    last: "Active now",
  },
  {
    id: "s2",
    icon: Smartphone,
    name: "iPhone 15 · Relay",
    location: "Lisbon, PT",
    current: false,
    last: "2h ago",
  },
  {
    id: "s3",
    icon: Globe,
    name: "Chrome · Windows",
    location: "Berlin, DE",
    current: false,
    last: "Yesterday",
  },
];

function SecurityPage() {
  const [tfa, setTfa] = useState(true);
  const [sso, setSso] = useState(false);

  return (
    <div>
      <SettingsHeader title="Security" description="Protect your account and team." />

      <SettingsSection
        title="Password"
        footer={
          <>
            <button className={settingsBtnGhost}>Cancel</button>
            <button className={settingsBtnPrimary}>Update password</button>
          </>
        }
      >
        <Field label="Current password">
          <input type="password" className={settingsInputClass} />
        </Field>
        <Field
          label="New password"
          hint="At least 12 characters with a mix of letters and numbers."
        >
          <input type="password" className={settingsInputClass} />
        </Field>
        <Field label="Confirm new password">
          <input type="password" className={settingsInputClass} />
        </Field>
      </SettingsSection>

      <SettingsSection title="Two-factor & SSO">
        <div className="flex flex-col gap-2.5">
          <Toggle
            checked={tfa}
            onChange={setTfa}
            label="Two-factor authentication"
            description="Require a 6-digit code at sign-in."
          />
          <Toggle
            checked={sso}
            onChange={setSso}
            label="Single sign-on (SAML)"
            description="Pro plan — enforce SSO for your domain."
          />
        </div>
      </SettingsSection>

      <SettingsSection title="Active sessions" description="Devices currently signed in.">
        <div className="flex flex-col gap-2">
          {SESSIONS.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-3 rounded-lg border border-border bg-background/30 px-3 py-2.5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-foreground/[0.06]">
                <s.icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-[13px] font-medium">{s.name}</span>
                  {s.current && (
                    <span className="rounded-full border border-success/30 bg-success/10 px-1.5 py-px text-[10px] font-medium text-success">
                      Current
                    </span>
                  )}
                </div>
                <div className="truncate text-[11.5px] text-muted-foreground">
                  {s.location} · {s.last}
                </div>
              </div>
              {!s.current && (
                <button className="text-[12px] text-muted-foreground hover:text-destructive">
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
        <button className="mt-3 text-[12px] text-destructive hover:underline">
          Sign out of all other sessions
        </button>
      </SettingsSection>
    </div>
  );
}
