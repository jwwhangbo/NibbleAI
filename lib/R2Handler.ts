'use server'

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
