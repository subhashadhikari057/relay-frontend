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
import { MemberAvatar } from "@/components/app/MemberAvatar";
import { me } from "@/lib/sample-data";

export const Route = createFileRoute("/settings/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const [name, setName] = useState("Sam Rivera");
  const [title, setTitle] = useState("Founding designer");
  const [bio, setBio] = useState("Designing tools for focused teams. Coffee, type, and dark UIs.");
  return (
    <div>
      <SettingsHeader title="Profile" description="How others see you in this workspace." />

      <SettingsSection
        title="Identity"
        footer={
          <>
            <button className={settingsBtnGhost}>Cancel</button>
            <button className={settingsBtnPrimary}>Save</button>
          </>
        }
      >
        <div className="mb-5 flex items-center gap-4">
          <MemberAvatar member={me} size="xl" showPresence />
          <div className="flex flex-wrap gap-2">
            <button className={settingsBtnGhost}>Upload photo</button>
            <button className={settingsBtnGhost}>Remove</button>
          </div>
        </div>
        <Field label="Display name">
          <input
            className={settingsInputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
        <Field label="Title">
          <input
            className={settingsInputClass}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Field>
        <Field label="Bio" hint="Brief description for your profile.">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-md border border-border bg-background/40 px-3 py-2 text-[13px] text-foreground placeholder:text-muted-foreground/60 focus:border-foreground/30 focus:outline-none focus:ring-1 focus:ring-foreground/10"
          />
        </Field>
      </SettingsSection>

      <SettingsSection title="Status" description="Set your current presence and availability.">
        <Field label="Status">
          <div className="flex flex-wrap gap-2">
            {["🎯 Heads down", "🟢 Available", "☕ Coffee break", "🌙 Off the clock"].map((s) => (
              <button
                key={s}
                className="inline-flex h-8 items-center rounded-full border border-border bg-background/40 px-3 text-[12.5px] hover:border-foreground/30"
              >
                {s}
              </button>
            ))}
          </div>
        </Field>
      </SettingsSection>
    </div>
  );
}
