import { http } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type { UploadSingleResponse } from "@/types/api.types";

async function uploadSingle(file: File): Promise<UploadSingleResponse> {
  const formData = new FormData();
  formData.append("file", file);

  return http.post<UploadSingleResponse>(endpoints.upload.single, formData);
}

export const uploadModule = {
  uploadSingle,
};
