import { cn } from "@/lib/utils";

interface WorkspaceAvatarProps {
  name: string;
  avatarUrl?: string | null;
  avatarColor?: string | null;
  className?: string;
}

export function WorkspaceAvatar({ name, avatarUrl, avatarColor, className }: WorkspaceAvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase() || "R";

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-foreground text-sm font-bold text-background",
        className,
      )}
      style={avatarUrl ? undefined : { background: avatarColor || undefined }}
      aria-label={name}
    >
      {avatarUrl ? (
        <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span>{initial}</span>
      )}
    </div>
  );
}
