import { useMemo, useState } from "react";
import { Search, MessageSquare } from "lucide-react";
import { Modal } from "./Modal";
import { UserAvatar } from "./UserAvatar";
import { useWorkspaceMembers } from "@/queries/modules/workspaces.queries";
import { useOpenDmMutation } from "@/queries/modules/dms.queries";
import { cn } from "@/lib/utils";

export function NewDmModal({
  open,
  workspaceId,
  currentUserId,
  onClose,
  onOpenConversation,
}: {
  open: boolean;
  workspaceId: string;
  currentUserId: string;
  onClose: () => void;
  onOpenConversation: (directConversationId: string) => void;
}) {
  const [q, setQ] = useState("");
  const membersQuery = useWorkspaceMembers(workspaceId);
  const openDmMutation = useOpenDmMutation();

  const candidates = useMemo(() => {
    const members = membersQuery.data?.members ?? [];
    const query = q.trim().toLowerCase();
    return members
      .filter((m) => m.userId !== currentUserId)
      .filter((m) => {
        if (!query) return true;
        const label = `${m.displayName ?? ""} ${m.fullName} ${m.email}`.toLowerCase();
        return label.includes(query);
      });
  }, [currentUserId, membersQuery.data?.members, q]);

  const colorFromSeed = (seed: string) => {
    let h = 0;
    for (let i = 0; i < seed.length; i += 1) {
      h = (h * 31 + seed.charCodeAt(i)) % 360;
    }
    return `hsl(${h} 65% 45%)`;
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New direct message"
      description="Pick someone in your workspace to start a DM."
      size="lg"
      footer={
        <button
          onClick={onClose}
          className="inline-flex h-8 items-center rounded-md border border-border bg-background/40 px-3 text-[12.5px] hover:border-foreground/30"
        >
          Close
        </button>
      }
    >
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search members by name or email..."
            className="h-9 w-full rounded-md border border-border bg-background/40 pl-9 pr-3 text-[13px] focus:border-foreground/30 focus:outline-none"
          />
        </div>

        <div className="max-h-[420px] overflow-y-auto rounded-lg border border-border bg-background/30">
          {membersQuery.isLoading && (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">
              Loading workspace members...
            </div>
          )}
          {membersQuery.isError && (
            <div className="px-4 py-10 text-center text-sm text-destructive">
              {membersQuery.error.message || "Could not load members."}
            </div>
          )}
          {!membersQuery.isLoading && !membersQuery.isError && candidates.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">
              No members found.
            </div>
          )}
          {!membersQuery.isLoading &&
            !membersQuery.isError &&
            candidates.map((m) => {
              const label = m.displayName?.trim() || m.fullName;
              const isPending =
                openDmMutation.isPending &&
                openDmMutation.variables?.payload.participantUserIds?.[0] === m.userId;

              return (
                <button
                  key={m.userId}
                  disabled={openDmMutation.isPending}
                  onClick={() => {
                    if (openDmMutation.isPending) return;
                    openDmMutation.mutate(
                      {
                        workspaceId,
                        payload: { participantUserIds: [m.userId] },
                      },
                      {
                        onSuccess: (conversation) => {
                          onOpenConversation(conversation.id);
                          onClose();
                        },
                      },
                    );
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left last:border-b-0",
                    openDmMutation.isPending
                      ? "cursor-not-allowed opacity-80"
                      : "hover:bg-foreground/[0.04]",
                  )}
                >
                  <UserAvatar
                    name={label}
                    avatarColor={colorFromSeed(m.userId)}
                    className="h-9 w-9 rounded-md"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-semibold text-foreground">
                      {label}
                    </div>
                    <div className="truncate text-[12px] text-muted-foreground">{m.email}</div>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-md border border-border bg-background/50 px-2.5 py-1 text-[12px] text-muted-foreground">
                    <MessageSquare className="h-3.5 w-3.5" />
                    {isPending ? "Opening..." : "Message"}
                  </div>
                </button>
              );
            })}
        </div>
      </div>
    </Modal>
  );
}
