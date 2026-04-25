import { useState } from "react";
import { Hash, Lock } from "lucide-react";
import { Modal } from "./Modal";
import { useCreateChannelMutation } from "@/queries/modules/channels.queries";
import type { ChannelSummary } from "@/types/api.types";
import { cn } from "@/lib/utils";

interface CreateChannelModalProps {
  open: boolean;
  workspaceId?: string | null;
  onClose: () => void;
  onCreate?: (channel: ChannelSummary) => void;
}

export function CreateChannelModal({
  open,
  workspaceId,
  onClose,
  onCreate,
}: CreateChannelModalProps) {
  const createChannel = useCreateChannelMutation();
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  const valid = slug.length >= 2;

  const submit = () => {
    if (!valid || !workspaceId || createChannel.isPending) return;

    createChannel.mutate(
      {
        workspaceId,
        payload: {
          name: slug,
          topic: topic.trim() || undefined,
          description: description.trim() || undefined,
          type: isPrivate ? "private" : "public",
        },
      },
      {
        onSuccess: (channel) => {
          onCreate?.(channel);
          setName("");
          setTopic("");
          setDescription("");
          setIsPrivate(false);
          onClose();
        },
      },
    );
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create a channel"
      description="Channels are where your team gathers around topics or projects."
      footer={
        <>
          <button
            onClick={onClose}
            className="inline-flex h-8 items-center rounded-md border border-border bg-background/40 px-3 text-[12.5px] hover:border-foreground/30"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!valid || !workspaceId || createChannel.isPending}
            className={cn(
              "inline-flex h-8 items-center rounded-md px-3 text-[12.5px] font-semibold",
              valid && workspaceId && !createChannel.isPending
                ? "bg-foreground text-background hover:opacity-90"
                : "bg-foreground/[0.08] text-muted-foreground cursor-not-allowed",
            )}
          >
            {createChannel.isPending ? "Creating..." : "Create channel"}
          </button>
        </>
      }
    >
      <div className="mb-4">
        <label className="mb-1 block text-[12.5px] font-medium">Name</label>
        <div className="flex h-10 items-center overflow-hidden rounded-md border border-border bg-background/40 focus-within:border-foreground/30">
          <span className="pl-3 pr-1 text-muted-foreground">
            {isPrivate ? <Lock className="h-3.5 w-3.5" /> : <Hash className="h-3.5 w-3.5" />}
          </span>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. design-crits"
            className="h-full flex-1 bg-transparent pr-3 text-[13px] focus:outline-none"
          />
        </div>
        <p className="mt-1 text-[11.5px] text-muted-foreground">
          Lowercase, no spaces. Will appear as{" "}
          <span className="text-foreground">#{slug || "channel-name"}</span>
        </p>
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-[12.5px] font-medium">
          Topic <span className="text-muted-foreground">(optional)</span>
        </label>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="What should people discuss here?"
          className="h-9 w-full rounded-md border border-border bg-background/40 px-3 text-[13px] focus:border-foreground/30 focus:outline-none"
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-[12.5px] font-medium">
          Description <span className="text-muted-foreground">(optional)</span>
        </label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What's this channel about?"
          className="h-9 w-full rounded-md border border-border bg-background/40 px-3 text-[13px] focus:border-foreground/30 focus:outline-none"
        />
      </div>

      <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-background/30 px-4 py-3">
        <div className="min-w-0">
          <div className="text-[13px] font-medium">Make private</div>
          <div className="mt-0.5 text-[11.5px] text-muted-foreground">
            Only invited people can see and join this channel.
          </div>
        </div>
        <button
          onClick={() => setIsPrivate(!isPrivate)}
          className={cn(
            "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors",
            isPrivate ? "bg-foreground" : "bg-foreground/[0.12]",
          )}
        >
          <span
            className={cn(
              "inline-block h-4 w-4 transform rounded-full bg-background shadow transition-transform",
              isPrivate ? "translate-x-[18px]" : "translate-x-0.5",
            )}
          />
        </button>
      </div>
    </Modal>
  );
}
