import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name: string;
  avatarUrl?: string | null;
  avatarColor?: string | null;
  className?: string;
  showPresence?: boolean;
}

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "U"
  );
}

export function UserAvatar({
  name,
  avatarUrl,
  avatarColor,
  className,
  showPresence = false,
}: UserAvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [avatarUrl]);

  const canShowImage = Boolean(avatarUrl) && !imageFailed;

  return (
    <div className={cn("relative shrink-0", className)}>
      <div
        className="flex h-full w-full items-center justify-center overflow-hidden rounded-md bg-foreground text-xs font-semibold text-background"
        style={canShowImage ? undefined : { background: avatarColor || undefined }}
        aria-label={name}
      >
        {canShowImage ? (
          <img
            src={avatarUrl || undefined}
            alt={name}
            className="h-full w-full object-cover"
            onError={() => {
              console.error("[UserAvatar] image failed to load", {
                name,
                avatarUrl,
              });
              setImageFailed(true);
            }}
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>
      {showPresence && (
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[oklch(0.72_0.16_150)] ring-2 ring-sidebar" />
      )}
    </div>
  );
}
