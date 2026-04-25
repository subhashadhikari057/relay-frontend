import { useMemo, useState } from "react";
import { Search, UserPlus } from "lucide-react";
import { Modal } from "./Modal";
import { UserAvatar } from "./UserAvatar";
import { useWorkspaceMembers } from "@/queries/modules/workspaces.queries";
import { useAddChannelMemberMutation, useChannelMembers } from "@/queries/modules/channels.queries";
import { cn } from "@/lib/utils";

export function AddChannelMemberModal({
  open,
  workspaceId,
  channelId,
  onClose,
}: {
  open: boolean;
  workspaceId: string;
  channelId: string;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const workspaceMembersQuery = useWorkspaceMembers(workspaceId);
  const channelMembersQuery = useChannelMembers(workspaceId, channelId);
  const addMemberMutation = useAddChannelMemberMutation();

  const existingIds = useMemo(() => {
    const ids = new Set<string>();
    (channelMembersQuery.data?.members ?? []).forEach((m) => ids.add(m.userId));
    return ids;
  }, [channelMembersQuery.data?.members]);

  const candidates = useMemo(() => {
    const members = workspaceMembersQuery.data?.members ?? [];
    const query = q.trim().toLowerCase();
    return members
      .filter((m) => !existingIds.has(m.userId))
      .filter((m) => {
        if (!query) return true;
        const label = `${m.displayName ?? ""} ${m.fullName} ${m.email}`.toLowerCase();
        return label.includes(query);
      });
  }, [existingIds, q, workspaceMembersQuery.data?.members]);

  const isLoading = workspaceMembersQuery.isLoading || channelMembersQuery.isLoading;
  const isError = workspaceMembersQuery.isError || channelMembersQuery.isError;
  const errorMessage =
    (workspaceMembersQuery.isError ? workspaceMembersQuery.error.message : null) ||
    (channelMembersQuery.isError ? channelMembersQuery.error.message : null);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add people"
      description="Add an existing workspace member to this private channel."
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
          {isLoading && (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">
              Loading members...
            </div>
          )}
          {isError && (
            <div className="px-4 py-10 text-center text-sm text-destructive">
              {errorMessage || "Could not load members."}
            </div>
          )}
          {!isLoading && !isError && candidates.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">
              No members to add.
            </div>
          )}
          {!isLoading &&
            !isError &&
            candidates.map((m) => {
              const label = m.displayName?.trim() || m.fullName;
              const pendingForThisUser =
                addMemberMutation.isPending &&
                addMemberMutation.variables?.payload.userId === m.userId;

              return (
                <div
                  key={m.userId}
                  className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-b-0"
                >
                  <UserAvatar name={label} className="h-8 w-8" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-semibold text-foreground">
                      {label}
                    </div>
                    <div className="truncate text-[12px] text-muted-foreground">{m.email}</div>
                  </div>
                  <button
                    onClick={() => {
                      if (addMemberMutation.isPending) return;
                      addMemberMutation.mutate(
                        {
                          workspaceId,
                          channelId,
                          payload: { userId: m.userId, role: "member" },
                        },
                        { onSuccess: () => onClose() },
                      );
                    }}
                    disabled={addMemberMutation.isPending}
                    className={cn(
                      "inline-flex h-8 items-center gap-2 rounded-md px-3 text-[12.5px] font-semibold",
                      addMemberMutation.isPending
                        ? "bg-foreground/[0.08] text-muted-foreground cursor-not-allowed"
                        : "bg-foreground text-background hover:opacity-90",
                    )}
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    {pendingForThisUser ? "Adding..." : "Add"}
                  </button>
                </div>
              );
            })}
        </div>
      </div>
    </Modal>
  );
}
