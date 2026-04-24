export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    me: () => [...queryKeys.auth.all, "me"] as const,
  },
  onboarding: {
    all: ["onboarding"] as const,
  },
} as const;
