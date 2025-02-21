'use server'
import axios from "axios";

/**
 * Uploads a file to the R2 storage.
 *
 * @param {File} resource - The file to be uploaded.
 * @param {string} key - The key (path) where the file will be stored.
 * @returns {Promise<string>} - A promise that resolves to the URL of the uploaded file.
 * @throws {Error} - Throws an error if the R2 worker access point, authentication key, or R2 access point is not set, or if the upload fails.
 */
export async function Upload(resource: File, key: string) : Promise<string> {
  if (!process.env.R2_WORKER_AP) {
    throw new Error("R2 worker access point not set");
  }
  if (!process.env.R2_AUTH_HEADER_KEY) {
    throw new Error("failed to find authentication key for r2 storage");
  }
  if (!process.env.NEXT_PUBLIC_R2_AP) {
    throw new Error('failed to find R2 access point')
  }
  const requestUrl = new URL(key, process.env.R2_WORKER_AP);
  const response = await fetch(requestUrl.toString(), {
    method: "PUT",
    headers: {
      "X-Custom-Auth-Key": process.env.R2_AUTH_HEADER_KEY,
      "Content-Type": resource.type,
    },
    body: resource,
  });

  if (!response.ok) {
    throw new Error("Failed to upload content");
  }

  return new URL(key, process.env.NEXT_PUBLIC_R2_AP).toString();
}


/**
 * Uploads a file to R2 storage and tracks the upload progress.
 *
 * @param resource - The file to be uploaded.
 * @param key - The key (path) where the file will be stored in R2.
 * @param onProgress - A callback function that receives the upload progress as a percentage.
 * @returns A promise that resolves to the URL of the uploaded file.
 * @throws Will throw an error if the R2 worker access point, authentication key, or access point is not set.
 * @throws Will throw an error if the upload fails.
 */
export async function UploadTrackProgress(
  resource: File,
  key: string,
  onProgress: (percentage: number) => void
): Promise<string> {
  if (!process.env.R2_WORKER_AP) {
    throw new Error("R2 worker access point not set");
  }
  if (!process.env.R2_AUTH_HEADER_KEY) {
    throw new Error("failed to find authentication key for r2 storage");
  }
  if (!process.env.NEXT_PUBLIC_R2_AP) {
    throw new Error("failed to find R2 access point");
  }

  const requestUrl = new URL(key, process.env.R2_WORKER_AP).toString();

  const response = await axios.put(requestUrl, resource, {
    headers: {
      "X-Custom-Auth-Key": process.env.R2_AUTH_HEADER_KEY,
      "Content-Type": resource.type,
    },
    onUploadProgress: (progressEvent) => {
      const { loaded, total } = progressEvent;
      const percentage = total ? Math.floor((loaded * 100) / total) : 0;
      onProgress(percentage);
    },
  });

  if (response.status !== 200) {
    throw new Error("Failed to upload content");
  }

  return new URL(key, process.env.NEXT_PUBLIC_R2_AP).toString();
}