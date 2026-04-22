export type Presence = "online" | "away" | "offline";

export type Member = {
  id: string;
  name: string;
  handle: string;
  initials: string;
  color: string;
  role?: string;
  presence: Presence;
  title?: string;
};

export type Channel = {
  id: string;
  name: string;
  private?: boolean;
  unread?: number;
  mentions?: number;
  topic?: string;
};

export type Message = {
  id: string;
  authorId: string;
  content: string;
  createdAt: string; // ISO
  edited?: boolean;
  reactions?: { emoji: string; count: number; mine?: boolean }[];
  replies?: number;
  threadParticipants?: string[];
  attachments?: { kind: "image" | "file"; name: string; meta?: string }[];
};

export const members: Member[] = [
  {
    id: "u1",
    name: "Alex Mercer",
    handle: "alex",
    initials: "AM",
    color: "oklch(0.7 0.13 250)",
    role: "Admin",
    presence: "online",
    title: "Founding Engineer",
  },
  {
    id: "u2",
    name: "Priya Nair",
    handle: "priya",
    initials: "PN",
    color: "oklch(0.72 0.16 150)",
    presence: "online",
    title: "Design Lead",
  },
  {
    id: "u3",
    name: "Marcus Chen",
    handle: "marcus",
    initials: "MC",
    color: "oklch(0.78 0.15 75)",
    presence: "away",
    title: "Product Manager",
  },
  {
    id: "u4",
    name: "Lina Ortiz",
    handle: "lina",
    initials: "LO",
    color: "oklch(0.7 0.13 305)",
    presence: "online",
    title: "Frontend Engineer",
  },
  {
    id: "u5",
    name: "Jonas Becker",
    handle: "jonas",
    initials: "JB",
    color: "oklch(0.62 0.21 25)",
    presence: "offline",
    title: "Infra",
  },
  {
    id: "u6",
    name: "Yui Tanaka",
    handle: "yui",
    initials: "YT",
    color: "oklch(0.65 0.18 200)",
    presence: "online",
    title: "Researcher",
  },
];

export const me: Member = {
  id: "me",
  name: "You",
  handle: "you",
  initials: "YO",
  color: "oklch(0.985 0 0)",
  presence: "online",
  title: "Member",
};

export const channels: Channel[] = [
  { id: "c1", name: "general", topic: "Company-wide announcements and chat", unread: 0 },
  { id: "c2", name: "engineering", topic: "Eng standups, PRs, deploys", unread: 3, mentions: 1 },
  { id: "c3", name: "design", topic: "Design crits and shipped work" },
  { id: "c4", name: "product", topic: "Roadmap and discovery", unread: 12 },
  { id: "c5", name: "founders", private: true, topic: "Private — leadership only" },
  { id: "c6", name: "random", topic: "Off-topic" },
  { id: "c7", name: "incidents", topic: "Production incidents", unread: 1, mentions: 1 },
];

export const dms = [
  { id: "d1", userId: "u2" },
  { id: "d2", userId: "u3" },
  { id: "d3", userId: "u4" },
  { id: "d4", userId: "u6" },
];

export const messagesByDM: Record<string, Message[]> = {
  u2: [
    {
      id: "dm1",
      authorId: "u2",
      content: "Hey — got a sec to look at the new thread panel mocks before I post in #design?",
      createdAt: "2026-04-20T08:42:00Z",
    },
    {
      id: "dm2",
      authorId: "me",
      content: "Yes — pulling them up now. Figma link?",
      createdAt: "2026-04-20T08:44:00Z",
    },
    {
      id: "dm3",
      authorId: "u2",
      content: "Sent it 🙏 the right rail spacing feels tight at 1280 — wdyt?",
      createdAt: "2026-04-20T08:45:00Z",
      reactions: [{ emoji: "👀", count: 1, mine: true }],
    },
    {
      id: "dm4",
      authorId: "me",
      content: "Agree. Let's bump the gutter to 16 and tighten the avatar column.",
      createdAt: "2026-04-20T08:51:00Z",
    },
    {
      id: "dm5",
      authorId: "u2",
      content: "Perfect. Pushing v3 today.",
      createdAt: "2026-04-20T08:53:00Z",
      reactions: [{ emoji: "🚀", count: 1 }],
    },
  ],
  u3: [
    {
      id: "dm6",
      authorId: "u3",
      content: "Standup notes are in the doc. Anything to add before I share with leadership?",
      createdAt: "2026-04-20T09:30:00Z",
    },
    {
      id: "dm7",
      authorId: "me",
      content: "Looks good. Add the presence latency win.",
      createdAt: "2026-04-20T09:34:00Z",
    },
  ],
  u4: [
    {
      id: "dm8",
      authorId: "u4",
      content: "Pushed the Safari fix. Mind giving it a quick review when you can? 🙏",
      createdAt: "2026-04-20T09:55:00Z",
    },
  ],
  u6: [
    {
      id: "dm9",
      authorId: "u6",
      content: "Maintenance window is locked in for 23:00 UTC.",
      createdAt: "2026-04-20T10:10:00Z",
    },
  ],
};

export type Notification = {
  id: string;
  kind: "mention" | "reply" | "reaction" | "dm" | "channel";
  authorId: string;
  context: string; // e.g. "#engineering" or "DM"
  preview: string;
  createdAt: string;
  unread?: boolean;
};

export const notifications: Notification[] = [
  {
    id: "n1",
    kind: "mention",
    authorId: "u3",
    context: "#engineering",
    preview: "Morning team — quick standup in #engineering at 10. Drop blockers in thread",
    createdAt: "2026-04-20T09:02:00Z",
    unread: true,
  },
  {
    id: "n2",
    kind: "reply",
    authorId: "u4",
    context: "Thread in #engineering",
    preview: "Need design review on the composer changes before I merge.",
    createdAt: "2026-04-20T09:08:00Z",
    unread: true,
  },
  {
    id: "n3",
    kind: "reaction",
    authorId: "u2",
    context: "#engineering",
    preview: "reacted ❤️ to your message",
    createdAt: "2026-04-20T08:40:00Z",
    unread: true,
  },
  {
    id: "n4",
    kind: "dm",
    authorId: "u2",
    context: "Direct message",
    preview: "Perfect. Pushing v3 today.",
    createdAt: "2026-04-20T08:53:00Z",
  },
  {
    id: "n5",
    kind: "channel",
    authorId: "u3",
    context: "#general",
    preview: "Welcome to the team @lina 🎉 — give her a warm hello!",
    createdAt: "2026-04-19T18:30:00Z",
  },
  {
    id: "n6",
    kind: "mention",
    authorId: "u1",
    context: "#incidents",
    preview: "@you can you confirm the rollback completed cleanly?",
    createdAt: "2026-04-19T16:12:00Z",
  },
  {
    id: "n7",
    kind: "reaction",
    authorId: "u6",
    context: "#design",
    preview: "reacted 🔥 to your message",
    createdAt: "2026-04-18T14:00:00Z",
  },
  {
    id: "n8",
    kind: "reply",
    authorId: "u5",
    context: "Thread in #incidents",
    preview: "Confirmed — error rate back to baseline.",
    createdAt: "2026-04-18T11:20:00Z",
  },
];

export const messagesByChannel: Record<string, Message[]> = {
  c2: [
    {
      id: "m1",
      authorId: "u3",
      content: "Morning team — quick standup in #engineering at 10. Drop blockers in thread 🧵",
      createdAt: "2026-04-20T09:02:00Z",
      reactions: [
        { emoji: "👀", count: 4 },
        { emoji: "🚀", count: 2, mine: true },
      ],
      replies: 3,
      threadParticipants: ["u1", "u4"],
    },
    {
      id: "m2",
      authorId: "u1",
      content:
        "Shipped the new presence system to staging. Latency dropped ~38% on the websocket gateway. PR up for review.",
      createdAt: "2026-04-20T09:14:00Z",
      attachments: [{ kind: "file", name: "presence-bench.pdf", meta: "PDF · 412 KB" }],
      reactions: [
        { emoji: "🔥", count: 6, mine: true },
        { emoji: "🙌", count: 3 },
      ],
    },
    {
      id: "m3",
      authorId: "u4",
      content:
        "Pushed a fix for the composer caret jump on Safari. Was a stale selection range after an emoji insert. Should feel a lot smoother now.",
      createdAt: "2026-04-20T09:21:00Z",
      edited: true,
      reactions: [{ emoji: "✅", count: 2 }],
      replies: 1,
      threadParticipants: ["u1"],
    },
    {
      id: "m4",
      authorId: "u2",
      content:
        "New thread panel mocks are in Figma — pulled in the comments from yesterday. Page → **Workspace / Thread v3**.",
      createdAt: "2026-04-20T10:02:00Z",
      reactions: [{ emoji: "❤️", count: 5 }],
    },
    {
      id: "m5",
      authorId: "u6",
      content:
        "Heads up: scheduled maintenance on the search index tonight 23:00 UTC — expect ~2 min of degraded search.",
      createdAt: "2026-04-20T10:18:00Z",
    },
    {
      id: "m6",
      authorId: "u1",
      content:
        "Anyone seeing slow cold-start on the edge functions in eu-west? I'm getting ~900ms p95.",
      createdAt: "2026-04-20T10:34:00Z",
      replies: 2,
      threadParticipants: ["u5", "u4"],
    },
  ],
  c1: [
    {
      id: "g1",
      authorId: "u3",
      content: "Welcome to the team @lina 🎉 — give her a warm hello!",
      createdAt: "2026-04-20T08:30:00Z",
      reactions: [
        { emoji: "👋", count: 11, mine: true },
        { emoji: "🎉", count: 6 },
      ],
    },
    {
      id: "g2",
      authorId: "u2",
      content: "Friday demo signups are open. Bring something rough — that's the point.",
      createdAt: "2026-04-20T08:55:00Z",
    },
  ],
};

export const threadReplies: Record<string, Message[]> = {
  m1: [
    {
      id: "t1",
      authorId: "u1",
      content: "No blockers — wrapping the presence PR.",
      createdAt: "2026-04-20T09:05:00Z",
    },
    {
      id: "t2",
      authorId: "u4",
      content: "Need design review on the composer changes before I merge.",
      createdAt: "2026-04-20T09:08:00Z",
    },
    {
      id: "t3",
      authorId: "u3",
      content: "Cool — added it to the agenda.",
      createdAt: "2026-04-20T09:11:00Z",
    },
  ],
};

export function getMember(id: string): Member {
  if (id === "me") return me;
  return members.find((m) => m.id === id) ?? members[0];
}

export function formatTime(iso: string): string {
  // Use UTC to avoid SSR/client hydration mismatches across timezones.
  const d = new Date(iso);
  const h = d.getUTCHours();
  const m = d.getUTCMinutes();
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}
