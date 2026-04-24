import { http, setAccessToken } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type { AuthTokenResponse, GoogleLoginRequest, SignupRequest } from "@/types/api.types";

async function signup(payload: SignupRequest): Promise<AuthTokenResponse> {
  return http.post<AuthTokenResponse>(endpoints.auth.signup, payload);
}

async function loginWithGoogle(payload: GoogleLoginRequest): Promise<AuthTokenResponse> {
  return http.post<AuthTokenResponse>(endpoints.auth.google, payload);
}

function rememberAccessToken(token: string | null) {
  setAccessToken(token);
}

export const authModule = {
  signup,
  loginWithGoogle,
  rememberAccessToken,
};
