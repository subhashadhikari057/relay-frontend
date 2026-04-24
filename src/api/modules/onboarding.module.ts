import { http } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type { CompleteOnboardingRequest, CompleteOnboardingResponse } from "@/types/api.types";

async function complete(payload: CompleteOnboardingRequest): Promise<CompleteOnboardingResponse> {
  return http.post<CompleteOnboardingResponse>(endpoints.onboarding.complete, payload);
}

export const onboardingModule = {
  complete,
};
