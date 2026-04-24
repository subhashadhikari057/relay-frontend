export const endpoints = {
  auth: {
    signup: "/api/mobile/auth/signup",
    google: "/api/mobile/auth/google",
    me: "/api/mobile/auth/me",
    refresh: "/api/mobile/auth/refresh",
    logout: "/api/mobile/auth/logout",
  },
  onboarding: {
    complete: "/api/mobile/onboarding/complete",
  },
  upload: {
    single: "/api/mobile/upload/single",
  },
} as const;
