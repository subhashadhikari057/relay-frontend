import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { SettingsHeader, SettingsSection, Toggle } from "@/components/settings/SettingsShell";
import { useTheme } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings/appearance")({
  component: AppearancePage,
});

function AppearancePage() {
  const { theme, setTheme } = useTheme();
  const [density, setDensity] = useState<"comfortable" | "compact">("comfortable");
  const [reduce, setReduce] = useState(false);

  return (
    <div>
      <SettingsHeader title="Appearance" description="Make Relay feel like your own." />

      <SettingsSection title="Theme">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { id: "light", label: "Light", preview: "bg-[oklch(0.96_0_0)]" },
            { id: "dark", label: "Dark", preview: "bg-[oklch(0.16_0.005_260)]" },
            {
              id: "system",
              label: "System",
              preview: "bg-gradient-to-br from-[oklch(0.16_0.005_260)] to-[oklch(0.96_0_0)]",
            },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id as "light" | "dark" | "system")}
              className={cn(
                "relative overflow-hidden rounded-xl border p-3 text-left transition-colors",
                theme === t.id
                  ? "border-foreground/40"
                  : "border-border hover:border-foreground/20",
              )}
            >
              <div className={cn("h-20 w-full rounded-md border border-border", t.preview)} />
              <div className="mt-2.5 flex items-center justify-between">
                <span className="text-[13px] font-medium">{t.label}</span>
                {theme === t.id && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background">
                    <Check className="h-3 w-3" />
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </SettingsSection>

      <SettingsSection title="Density">
        <div className="flex gap-2">
          {(["comfortable", "compact"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDensity(d)}
              className={cn(
                "flex-1 rounded-md border px-3 py-2 text-[12.5px] capitalize transition-colors",
                density === d
                  ? "border-foreground/40 bg-foreground/[0.06] text-foreground"
                  : "border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground",
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </SettingsSection>

      <SettingsSection title="Accessibility">
        <Toggle
          checked={reduce}
          onChange={setReduce}
          label="Reduce motion"
          description="Disable non-essential animations and transitions."
        />
      </SettingsSection>
    </div>
  );
}
