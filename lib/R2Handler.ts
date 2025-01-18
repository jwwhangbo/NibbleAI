'use server'

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
