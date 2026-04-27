import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { authModule } from "@/api/modules/auth.module";
import { workspacesModule } from "@/api/modules/workspaces.module";
import { workspaceInvitesModule } from "@/api/modules/workspace-invites.module";
import { useAuthSessionState } from "@/lib/auth-session";
import { rememberCurrentUser } from "@/lib/current-user";
import { rememberCurrentWorkspace } from "@/lib/current-workspace";
import { clearPendingInviteToken, setPendingInviteToken } from "@/lib/pending-invite";

export const Route = createFileRoute("/join/$inviteToken")({
  component: JoinInviteRoute,
});

function JoinInviteRoute() {
  const { inviteToken } = Route.useParams();
  const auth = useAuthSessionState();
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) {
      return;
    }

    if (!inviteToken) {
      return;
    }

    // Always store the token so login/signup can continue the flow.
    setPendingInviteToken(inviteToken);

    if (auth.status === "unauthenticated") {
      // Send to sign-in; after auth succeeds, handleAuthSuccess will accept the invite.
      window.location.assign("/sign-in");
      return;
    }

    if (auth.status !== "authenticated") {
      return;
    }

    startedRef.current = true;

    (async () => {
      try {
        const accepted = await workspaceInvitesModule.acceptInvite(inviteToken);
        clearPendingInviteToken();

        if (accepted.accessToken) {
          authModule.rememberAccessToken(accepted.accessToken);
        }
        if (accepted.user) {
          rememberCurrentUser(accepted.user);
        }

        const workspace =
          accepted.activeWorkspace && accepted.activeWorkspace.id === accepted.workspaceId
            ? accepted.activeWorkspace
            : await workspacesModule.getById(accepted.workspaceId);
        rememberCurrentWorkspace(workspace);
        window.location.assign(`/app/${workspace.slug}`);
      } catch {
        // Invalid/expired token; fall back to home.
        clearPendingInviteToken();
        window.location.assign("/");
      }
    })();
  }, [auth.status, inviteToken]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-md flex-col items-center justify-center px-6 py-24 text-center">
        <div className="text-sm text-muted-foreground">Joining workspace…</div>
      </div>
    </div>
  );
}
