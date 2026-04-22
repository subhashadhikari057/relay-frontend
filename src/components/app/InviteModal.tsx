import { useState } from "react";
import { Copy, Check, Mail } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "./Modal";
import { cn } from "@/lib/utils";

export function InviteModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [emails, setEmails] = useState("");
  const [copied, setCopied] = useState(false);
  const link = "https://relay.app/join/acme-x82h-q1";

  const copy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("Invite link copied");
    setTimeout(() => setCopied(false), 1500);
  };

  const send = () => {
    if (!emails.trim()) return;
    const count = emails.split(",").filter((e) => e.trim()).length;
    toast.success(`Sent ${count} invite${count === 1 ? "" : "s"}`, {
      description: "We'll let you know when they accept.",
    });
    setEmails("");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Invite teammates"
      description="Send an invite or share a link. Free up to 10 members on the current plan."
      footer={
        <>
          <button
            onClick={onClose}
            className="inline-flex h-8 items-center rounded-md border border-border bg-background/40 px-3 text-[12.5px] hover:border-foreground/30"
          >
            Done
          </button>
          <button
            onClick={send}
            disabled={!emails.trim()}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-[12.5px] font-semibold",
              emails.trim()
                ? "bg-foreground text-background hover:opacity-90"
                : "bg-foreground/[0.08] text-muted-foreground cursor-not-allowed",
            )}
          >
            <Mail className="h-3.5 w-3.5" /> Send invites
          </button>
        </>
      }
    >
      <div className="mb-5">
        <label className="mb-1 block text-[12.5px] font-medium">Email addresses</label>
        <textarea
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
          placeholder="taylor@acme.com, jordan@acme.com"
          rows={3}
          className="w-full resize-none rounded-md border border-border bg-background/40 px-3 py-2 text-[13px] focus:border-foreground/30 focus:outline-none"
        />
        <p className="mt-1 text-[11.5px] text-muted-foreground">
          Separate multiple emails with commas.
        </p>
      </div>

      <div>
        <label className="mb-1 block text-[12.5px] font-medium">Or share a link</label>
        <div className="flex h-9 items-center overflow-hidden rounded-md border border-border bg-background/40">
          <input
            readOnly
            value={link}
            className="h-full flex-1 bg-transparent px-3 text-[12.5px] focus:outline-none"
          />
          <button
            onClick={copy}
            className="flex h-full items-center gap-1.5 border-l border-border bg-background/60 px-3 text-[12.5px] hover:bg-background"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-success" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <p className="mt-1 text-[11.5px] text-muted-foreground">
          Anyone with this link can join Acme Inc.
        </p>
      </div>
    </Modal>
  );
}
