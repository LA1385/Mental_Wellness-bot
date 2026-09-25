const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
const ADMIN_API_KEY = import.meta.env.VITE_ADMIN_KEY ?? "";

// Vite embeds this value in the browser bundle at build time. It is out of source control,
// but anyone who can access the deployed dashboard can still extract it from the bundle.
export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiFetch<T>(
  path: string,
  params?: Record<string, string>,
): Promise<T> {
  const url = new URL(`${API_BASE_URL}${path}`, window.location.origin);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "X-Admin-Key": ADMIN_API_KEY,
    },
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const body: unknown = await response.json();
      if (
        typeof body === "object" &&
        body !== null &&
        "error" in body &&
        typeof body.error === "string"
      ) {
        message = body.error;
      }
    } catch {
      // Keep the HTTP status fallback when the error body is not valid JSON.
    }

    throw new ApiError(response.status, message);
  }

  return response.json() as Promise<T>;
}
