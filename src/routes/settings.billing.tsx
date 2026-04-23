import { createFileRoute } from "@tanstack/react-router";
import { Check, Download } from "lucide-react";
import {
  SettingsHeader,
  SettingsSection,
  settingsBtnGhost,
  settingsBtnPrimary,
} from "@/components/settings/SettingsShell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings/billing")({
  component: BillingPage,
});

const INVOICES = [
  { id: "INV-0231", date: "Apr 1, 2026", amount: "$96.00", status: "Paid" },
  { id: "INV-0218", date: "Mar 1, 2026", amount: "$96.00", status: "Paid" },
  { id: "INV-0204", date: "Feb 1, 2026", amount: "$96.00", status: "Paid" },
  { id: "INV-0191", date: "Jan 1, 2026", amount: "$84.00", status: "Paid" },
];

function BillingPage() {
  return (
    <div>
      <SettingsHeader title="Billing" description="Plan, payment method and invoices." />

      <SettingsSection title="Current plan">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-foreground/20 bg-foreground/[0.06] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider">
                Pro
              </span>
              <span className="text-[14px] font-semibold">$8 / user / month</span>
            </div>
            <p className="mt-1 text-[12.5px] text-muted-foreground">
              12 active members · renews May 1, 2026.
            </p>
          </div>
          <div className="flex gap-2">
            <button className={settingsBtnGhost}>Cancel plan</button>
            <a href="/#pricing" className={settingsBtnPrimary}>
              Upgrade
            </a>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {[
            { label: "Members", value: "12 / Unlimited" },
            { label: "Storage", value: "8.4 GB / 100 GB" },
            { label: "Message history", value: "Unlimited" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-lg border border-border bg-background/30 px-3 py-2.5"
            >
              <div className="text-[11.5px] text-muted-foreground">{s.label}</div>
              <div className="mt-0.5 text-[13px] font-medium">{s.value}</div>
            </div>
          ))}
        </div>
      </SettingsSection>

      <SettingsSection title="Payment method">
        <div className="flex items-center justify-between rounded-lg border border-border bg-background/30 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-12 items-center justify-center rounded-md bg-foreground text-background text-[10px] font-bold">
              VISA
            </div>
            <div>
              <div className="text-[13px] font-medium">Visa ending in 4242</div>
              <div className="text-[11.5px] text-muted-foreground">Expires 12 / 2027</div>
            </div>
          </div>
          <button className={settingsBtnGhost}>Update</button>
        </div>
      </SettingsSection>

      <SettingsSection title="Invoices">
        <div className="overflow-hidden rounded-lg border border-border">
          {INVOICES.map((inv, i) => (
            <div
              key={inv.id}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 text-[13px]",
                i !== INVOICES.length - 1 && "border-b border-border",
              )}
            >
              <span className="w-24 font-mono text-[12px] text-muted-foreground">{inv.id}</span>
              <span className="hidden flex-1 text-muted-foreground sm:inline">{inv.date}</span>
              <span className="ml-auto sm:ml-0 tabular-nums">{inv.amount}</span>
              <span className="inline-flex items-center gap-1 text-[11.5px] text-success">
                <Check className="h-3 w-3" /> {inv.status}
              </span>
              <button className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground">
                <Download className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </SettingsSection>
    </div>
  );
}
