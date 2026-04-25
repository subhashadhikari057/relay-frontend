import { useEffect, useState, useCallback } from "react";
import {
  messagesByChannel as seedChannel,
  messagesByDM as seedDM,
  threadReplies as seedThreads,
  channels as seedChannels,
  type Message,
  type Channel,
} from "./sample-data";

/**
 * Lightweight global store backed by useSyncExternalStore-style subscription.
 * No external dependency. Persists key slices to localStorage when in browser.
 */

type State = {
  channels: Channel[];
  channelMessages: Record<string, Message[]>;
  dmMessages: Record<string, Message[]>;
  threads: Record<string, Message[]>;
  pinnedIds: string[];
  savedIds: string[];
  unreadByChannel: Record<string, number>;
  theme: "light" | "dark" | "system";
  density: "comfortable" | "compact";
};

let state: State = {
  channels: [...seedChannels],
  channelMessages: structuredCloneSafe(seedChannel),
  dmMessages: structuredCloneSafe(seedDM),
  threads: structuredCloneSafe(seedThreads),
  pinnedIds: ["m4"],
  savedIds: [],
  unreadByChannel: Object.fromEntries(seedChannels.map((c) => [c.id, c.unread ?? 0])),
  theme: "dark",
  density: "comfortable",
};

function structuredCloneSafe<T>(v: T): T {
  return typeof structuredCloneSafe === "function" && typeof structuredClone !== "undefined"
    ? structuredClone(v)
    : JSON.parse(JSON.stringify(v));
}

const listeners = new Set<() => void>();
function notify() {
  listeners.forEach((l) => l());
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// Persist a small slice
const PERSIST_KEY = "relay:state:v1";
if (typeof window !== "undefined") {
  try {
    const raw = localStorage.getItem(PERSIST_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      state = {
        ...state,
        pinnedIds: parsed.pinnedIds ?? state.pinnedIds,
        savedIds: parsed.savedIds ?? state.savedIds,
        theme: parsed.theme ?? state.theme,
        density: parsed.density ?? state.density,
        channels: parsed.channels ?? state.channels,
      };
    }
  } catch {
    // ignore
  }
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      PERSIST_KEY,
      JSON.stringify({
        pinnedIds: state.pinnedIds,
        savedIds: state.savedIds,
        theme: state.theme,
        density: state.density,
        channels: state.channels,
      }),
    );
  } catch {
    // ignore
  }
}

// Hooks
export function useStore<T>(selector: (s: State) => T): T {
  const [, force] = useState(0);
  useEffect(() => {
    const unsub = subscribe(() => force((n) => n + 1));
    return () => {
      unsub();
    };
  }, []);
  return selector(state);
}

// Actions
export function sendChannelMessage(
  channelId: string,
  content: string,
  attachments?: Message["attachments"],
) {
  if (!content.trim() && (!attachments || attachments.length === 0)) return;
  const msg: Message = {
    id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    authorId: "me",
    content,
    createdAt: new Date().toISOString(),
    attachments,
  };
  state = {
    ...state,
    channelMessages: {
      ...state.channelMessages,
      [channelId]: [...(state.channelMessages[channelId] ?? []), msg],
    },
  };
  notify();
}

export function sendDMMessage(userId: string, content: string) {
  if (!content.trim()) return;
  const msg: Message = {
    id: `dm_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    authorId: "me",
    content,
    createdAt: new Date().toISOString(),
  };
  state = {
    ...state,
    dmMessages: {
      ...state.dmMessages,
      [userId]: [...(state.dmMessages[userId] ?? []), msg],
    },
  };
  notify();
}

export function sendThreadReply(threadId: string, content: string) {
  if (!content.trim()) return;
  const msg: Message = {
    id: `t_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    authorId: "me",
    content,
    createdAt: new Date().toISOString(),
  };
  state = {
    ...state,
    threads: {
      ...state.threads,
      [threadId]: [...(state.threads[threadId] ?? []), msg],
    },
  };
  notify();
}

export function toggleReaction(channelId: string, messageId: string, emoji: string) {
  const msgs = state.channelMessages[channelId];
  if (!msgs) return;
  const next = msgs.map((m) => {
    if (m.id !== messageId) return m;
    const reactions = m.reactions ?? [];
    const existing = reactions.find((r) => r.emoji === emoji);
    let newReactions;
    if (existing) {
      if (existing.mine) {
        const count = existing.count - 1;
        newReactions =
          count <= 0
            ? reactions.filter((r) => r.emoji !== emoji)
            : reactions.map((r) => (r.emoji === emoji ? { ...r, count, mine: false } : r));
      } else {
        newReactions = reactions.map((r) =>
          r.emoji === emoji ? { ...r, count: r.count + 1, mine: true } : r,
        );
      }
    } else {
      newReactions = [...reactions, { emoji, count: 1, mine: true }];
    }
    return { ...m, reactions: newReactions };
  });
  state = {
    ...state,
    channelMessages: { ...state.channelMessages, [channelId]: next },
  };
  notify();
}

export function togglePin(messageId: string) {
  state = {
    ...state,
    pinnedIds: state.pinnedIds.includes(messageId)
      ? state.pinnedIds.filter((id) => id !== messageId)
      : [...state.pinnedIds, messageId],
  };
  persist();
  notify();
}

export function toggleSave(messageId: string) {
  state = {
    ...state,
    savedIds: state.savedIds.includes(messageId)
      ? state.savedIds.filter((id) => id !== messageId)
      : [...state.savedIds, messageId],
  };
  persist();
  notify();
}

export function markChannelRead(channelId: string) {
  if ((state.unreadByChannel[channelId] ?? 0) === 0) return;
  state = {
    ...state,
    unreadByChannel: { ...state.unreadByChannel, [channelId]: 0 },
  };
  notify();
}

export function createChannel(data: { name: string; description?: string; isPrivate?: boolean }) {
  const id = `c_${Date.now()}`;
  const ch: Channel = {
    id,
    name: data.name,
    private: data.isPrivate,
    topic: data.description,
    unread: 0,
  };
  state = {
    ...state,
    channels: [...state.channels, ch],
    channelMessages: { ...state.channelMessages, [id]: [] },
    unreadByChannel: { ...state.unreadByChannel, [id]: 0 },
  };
  persist();
  notify();
  return id;
}

export function deleteChannel(channelId: string) {
  state = {
    ...state,
    channels: state.channels.filter((c) => c.id !== channelId),
  };
  persist();
  notify();
}

export function setTheme(theme: State["theme"]) {
  state = { ...state, theme };
  persist();
  notify();
  applyTheme(theme);
}

export function setDensity(density: State["density"]) {
  state = { ...state, density };
  persist();
  notify();
}

export function applyTheme(theme: State["theme"]) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = theme === "dark" || (theme === "system" && sysDark);
  root.classList.toggle("dark", isDark);
  root.classList.toggle("light", !isDark);
}

// Convenience hook
export function useTheme() {
  const theme = useStore((s) => s.theme);
  const set = useCallback((t: State["theme"]) => setTheme(t), []);
  return { theme, setTheme: set };
}

export function useDensity() {
  const density = useStore((s) => s.density);
  const set = useCallback((nextDensity: State["density"]) => setDensity(nextDensity), []);
  return { density, setDensity: set };
}
