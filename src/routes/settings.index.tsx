import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  SettingsHeader,
  SettingsSection,
  Field,
  settingsInputClass,
  settingsBtnPrimary,
  settingsBtnGhost,
} from "@/components/settings/SettingsShell";

export const Route = createFileRoute("/settings/")({
  component: GeneralPage,
});

function GeneralPage() {
  const [name, setName] = useState("Acme Inc.");
  const [url, setUrl] = useState("acme");
  return (
    <div>
      <SettingsHeader title="General" description="Workspace identity and defaults." />

      <SettingsSection
        title="Workspace name"
        description="The display name shown across Relay to your team."
        footer={
          <>
            <button className={settingsBtnGhost}>Cancel</button>
            <button className={settingsBtnPrimary}>Save changes</button>
          </>
        }
      >
        <Field label="Name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={settingsInputClass}
          />
        </Field>
        <Field label="Workspace URL" hint="Your team will sign in at relay.app/{url}">
          <div className="flex h-9 items-center overflow-hidden rounded-md border border-border bg-background/40 focus-within:border-foreground/30">
            <span className="px-3 text-[12.5px] text-muted-foreground">relay.app/</span>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value.replace(/[^a-z0-9-]/g, ""))}
              className="h-full flex-1 bg-transparent pr-3 text-[13px] focus:outline-none"
            />
          </div>
        </Field>
      </SettingsSection>

      <SettingsSection title="Workspace icon" description="Upload a square logo or pick a color.">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-foreground text-background text-2xl font-bold">
            A
          </div>
          <div className="flex flex-wrap gap-2">
            <button className={settingsBtnGhost}>Upload image</button>
            <button className={settingsBtnGhost}>Remove</button>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Danger zone"
        description="Permanent actions that affect your entire workspace."
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="text-[13px] font-medium text-foreground">Delete workspace</div>
            <div className="text-[12px] text-muted-foreground">
              All channels, messages and files will be removed.
            </div>
          </div>
          <button className="inline-flex h-8 shrink-0 items-center rounded-md border border-destructive/40 bg-destructive/10 px-3 text-[12.5px] font-medium text-destructive hover:bg-destructive/20">
            Delete workspace
          </button>
        </div>
      </SettingsSection>
    </div>
  );
}
