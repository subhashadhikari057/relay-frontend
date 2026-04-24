import { http, setAccessToken } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type {
  AuthTokenResponse,
  GoogleLoginRequest,
  LoginRequest,
  SignupRequest,
} from "@/types/api.types";

async function signup(payload: SignupRequest): Promise<AuthTokenResponse> {
  return http.post<AuthTokenResponse>(endpoints.auth.signup, payload);
}

async function login(payload: LoginRequest): Promise<AuthTokenResponse> {
  return http.post<AuthTokenResponse>(endpoints.auth.login, payload);
}

async function loginWithGoogle(payload: GoogleLoginRequest): Promise<AuthTokenResponse> {
  return http.post<AuthTokenResponse>(endpoints.auth.google, payload);
}

async function refresh(): Promise<AuthTokenResponse> {
  return http.post<AuthTokenResponse>(endpoints.auth.refresh);
}

async function session(): Promise<AuthTokenResponse> {
  return http.post<AuthTokenResponse>(endpoints.auth.session);
}

function rememberAccessToken(token: string | null) {
  setAccessToken(token);
}

export const authModule = {
  signup,
  login,
  loginWithGoogle,
  refresh,
  session,
  rememberAccessToken,
};
