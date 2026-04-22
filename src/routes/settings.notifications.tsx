import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SettingsHeader, SettingsSection, Toggle } from "@/components/settings/SettingsShell";

export const Route = createFileRoute("/settings/notifications")({
  component: NotificationsPage,
});

function NotificationsPage() {
  const [push, setPush] = useState(true);
  const [email, setEmail] = useState(true);
  const [mentions, setMentions] = useState(true);
  const [dms, setDms] = useState(true);
  const [allMessages, setAllMessages] = useState(false);
  const [keywords, setKeywords] = useState(true);

  return (
    <div>
      <SettingsHeader title="Notifications" description="Choose what reaches you and how." />

      <SettingsSection title="Channels">
        <div className="flex flex-col gap-2.5">
          <Toggle
            checked={push}
            onChange={setPush}
            label="Push notifications"
            description="Desktop and mobile push alerts."
          />
          <Toggle
            checked={email}
            onChange={setEmail}
            label="Email digest"
            description="Daily summary of your unread activity."
          />
        </div>
      </SettingsSection>

      <SettingsSection title="What to notify me about">
        <div className="flex flex-col gap-2.5">
          <Toggle
            checked={allMessages}
            onChange={setAllMessages}
            label="All new messages"
            description="Every message in every channel — high volume."
          />
          <Toggle
            checked={mentions}
            onChange={setMentions}
            label="Direct mentions"
            description="When someone @mentions you or your group."
          />
          <Toggle
            checked={dms}
            onChange={setDms}
            label="Direct messages"
            description="One-to-one and group DMs."
          />
          <Toggle
            checked={keywords}
            onChange={setKeywords}
            label="Keyword alerts"
            description="Triggered by terms like 'release', 'incident'."
          />
        </div>
      </SettingsSection>

      <SettingsSection
        title="Do not disturb"
        description="Silence notifications during focus hours."
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-[12.5px] font-medium">Start</label>
            <input
              type="time"
              defaultValue="20:00"
              className="h-9 w-full rounded-md border border-border bg-background/40 px-3 text-[13px]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[12.5px] font-medium">End</label>
            <input
              type="time"
              defaultValue="08:00"
              className="h-9 w-full rounded-md border border-border bg-background/40 px-3 text-[13px]"
            />
          </div>
        </div>
      </SettingsSection>
    </div>
  );
}
