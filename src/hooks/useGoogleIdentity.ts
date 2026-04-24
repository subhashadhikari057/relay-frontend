import { useCallback } from "react";

type GoogleCredentialResponse = {
  credential?: string;
};

type GooglePromptNotification = {
  isNotDisplayed?: () => boolean;
  isSkippedMoment?: () => boolean;
  isDismissedMoment?: () => boolean;
  getNotDisplayedReason?: () => string;
  getSkippedReason?: () => string;
  getDismissedReason?: () => string;
};

type GoogleIdentity = {
  accounts: {
    id: {
      initialize: (options: {
        client_id: string;
        callback: (response: GoogleCredentialResponse) => void;
        ux_mode?: "popup" | "redirect";
      }) => void;
      renderButton: (
        parent: HTMLElement,
        options: {
          theme?: "outline" | "filled_blue" | "filled_black";
          size?: "large" | "medium" | "small";
          type?: "standard" | "icon";
          text?: "signin_with" | "signup_with" | "continue_with" | "signin";
          shape?: "rectangular" | "pill" | "circle" | "square";
          width?: string | number;
          locale?: string;
        },
      ) => void;
      prompt: (callback?: (notification: GooglePromptNotification) => void) => void;
      cancel: () => void;
    };
  };
};

declare global {
  interface Window {
    google?: GoogleIdentity;
  }
}

const GOOGLE_SCRIPT_SRC = "https://accounts.google.com/gsi/client?hl=en";
let scriptPromise: Promise<void> | null = null;

function getGoogleClientId() {
  return import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
}

function loadGoogleScript() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google login is only available in the browser."));
  }

  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>("script[data-relay-google-gsi]");

    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load Google login.")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = GOOGLE_SCRIPT_SRC;
    script.dataset.relayGoogleGsi = "true";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google login."));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export function useGoogleIdentity() {
  const clientId = getGoogleClientId();

  const renderButton = useCallback(
    async (
      parent: HTMLElement,
      options: {
        text?: "signin_with" | "signup_with" | "continue_with" | "signin";
        onCredential: (idToken: string) => void;
        onError?: (error: Error) => void;
      },
    ) => {
      if (!clientId) {
        options.onError?.(new Error("Google login is not configured. Set VITE_GOOGLE_CLIENT_ID."));
        return;
      }

      try {
        await loadGoogleScript();
        parent.innerHTML = "";

        console.info("Google sign-in config", {
          origin: window.location.origin,
          clientId,
        });

        window.google?.accounts.id.initialize({
          client_id: clientId,
          ux_mode: "popup",
          callback: (response) => {
            if (!response.credential) {
              options.onError?.(new Error("Google did not return an ID token."));
              return;
            }

            options.onCredential(response.credential);
          },
        });

        window.google?.accounts.id.renderButton(parent, {
          theme: document.documentElement.classList.contains("dark") ? "filled_black" : "outline",
          size: "large",
          type: "standard",
          text: options.text ?? "signin_with",
          shape: "pill",
          width: parent.clientWidth || 400,
          locale: "en",
        });
      } catch (error) {
        options.onError?.(
          error instanceof Error ? error : new Error("Failed to load Google login."),
        );
      }
    },
    [clientId],
  );

  async function getIdToken() {
    if (!clientId) {
      throw new Error("Google login is not configured. Set VITE_GOOGLE_CLIENT_ID.");
    }

    await loadGoogleScript();

    return new Promise<string>((resolve, reject) => {
      let settled = false;
      console.info("Google sign-in config", {
        origin: window.location.origin,
        clientId,
      });

      window.google?.accounts.id.initialize({
        client_id: clientId,
        ux_mode: "popup",
        callback: (response) => {
          if (settled) return;
          settled = true;

          if (!response.credential) {
            reject(new Error("Google did not return an ID token."));
            return;
          }

          resolve(response.credential);
        },
      });

      window.google?.accounts.id.prompt((notification) => {
        if (settled) return;

        if (
          notification.isNotDisplayed?.() ||
          notification.isSkippedMoment?.() ||
          notification.isDismissedMoment?.()
        ) {
          settled = true;
          const reason =
            notification.getNotDisplayedReason?.() ??
            notification.getSkippedReason?.() ??
            notification.getDismissedReason?.() ??
            "unknown";

          reject(new Error(`Google sign-in did not complete: ${reason}.`));
        }
      });
    });
  }

  return {
    isConfigured: Boolean(clientId),
    renderButton,
    getIdToken,
  };
}
