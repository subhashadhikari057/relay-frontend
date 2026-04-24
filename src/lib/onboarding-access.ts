const ONBOARDING_ACCESS_KEY = "relay:onboarding-allowed";

export function allowOnboardingAccess() {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(ONBOARDING_ACCESS_KEY, "1");
}

export function clearOnboardingAccess() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(ONBOARDING_ACCESS_KEY);
}

export function hasOnboardingAccess() {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(ONBOARDING_ACCESS_KEY) === "1";
}
