import { useState } from "react";
import { Copy, Check, Mail, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "./Modal";
import { workspacesModule } from "@/api/modules/workspaces.module";
import { cn } from "@/lib/utils";

export function InviteModal({
  open,
  onClose,
  workspaceId,
}: {
  open: boolean;
  onClose: () => void;
  workspaceId?: string | null;
}) {
  const [inviteInput, setInviteInput] = useState("");
  const [invites, setInvites] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lastInviteLink, setLastInviteLink] = useState("");
  const link = lastInviteLink || "Create an invite first to get share link";
  const canSubmit = invites.length > 0 && Boolean(workspaceId) && !submitting;

  const addInvite = () => {
    const email = inviteInput.trim().toLowerCase();
    if (!email) return;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error("Enter a valid email address.");
      return;
    }

    if (invites.includes(email)) {
      toast.error("That teammate is already in the invite list.");
      return;
    }

    setInvites((current) => [...current, email]);
    setInviteInput("");
  };

  const copy = () => {
    if (!lastInviteLink) return;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("Invite link copied");
    setTimeout(() => setCopied(false), 1500);
  };

  const send = async () => {
    if (!workspaceId) {
      toast.error("Workspace is not ready yet.");
      return;
    }

    if (invites.length === 0) return;

    setSubmitting(true);
    let sent = 0;
    let failed = 0;

    try {
      for (const email of invites) {
        try {
          const created = await workspacesModule.inviteMember(workspaceId, {
            email,
            role: "member",
          });
          const base = window.location.origin.replace(/\/$/, "");
          setLastInviteLink(`${base}/join/${created.inviteToken}`);
          sent += 1;
        } catch {
          failed += 1;
        }
      }

      if (sent > 0) {
        toast.success(`Sent ${sent} invite${sent === 1 ? "" : "s"}`, {
          description:
            failed > 0
              ? `${failed} failed. Check duplicates/existing members.`
              : "Invites created successfully.",
        });
      } else {
        toast.error("No invites were sent.");
      }

      setInvites([]);
      setInviteInput("");
      if (sent > 0) {
        onClose();
      }
    } finally {
      setSubmitting(false);
    }
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
            disabled={!canSubmit}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-[12.5px] font-semibold",
              canSubmit
                ? "bg-foreground text-background hover:opacity-90"
                : "bg-foreground/[0.08] text-muted-foreground cursor-not-allowed",
            )}
          >
            <Mail className="h-3.5 w-3.5" /> {submitting ? "Sending..." : "Send invites"}
          </button>
        </>
      }
    >
      <div className="mb-5">
        <label className="mb-1 block text-[12.5px] font-medium">Invite by email</label>
        <div className="flex gap-2">
          <input
            value={inviteInput}
            onChange={(event) => setInviteInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addInvite();
              }
            }}
            placeholder="teammate@company.com"
            className="block h-10 flex-1 rounded-md border border-border bg-background/40 px-3 text-sm placeholder:text-muted-foreground/60 focus:border-foreground/30 focus:outline-none"
          />
          <button
            type="button"
            onClick={addInvite}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-background/40 px-3 text-[13px] transition hover:border-foreground/30"
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>
        {invites.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {invites.map((email, index) => (
              <span
                key={email}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/50 py-1 pl-2.5 pr-1 text-[12px]"
              >
                {email}
                <button
                  type="button"
                  onClick={() =>
                    setInvites((current) => current.filter((_, itemIndex) => itemIndex !== index))
                  }
                  className="flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground transition hover:bg-foreground/10 hover:text-foreground"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            ))}
          </div>
        )}
        <p className="mt-1 text-[11.5px] text-muted-foreground">
          Add teammates one by one, then send all invites together.
        </p>
      </div>

      <div>
        <label className="mb-1 block text-[12.5px] font-medium">Or share a link</label>
        <div className="flex h-9 items-center overflow-hidden rounded-md border border-border bg-background/40">
          <input
            readOnly
            value={link}
            aria-label="Latest invite link"
            className="h-full flex-1 bg-transparent px-3 text-[12.5px] focus:outline-none"
          />
          <button
            onClick={copy}
            disabled={!lastInviteLink}
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
