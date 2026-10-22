import { API_BASE_URL } from "../config";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function readDetail(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { detail?: unknown };
    if (typeof body?.detail === "string" && body.detail.trim()) return body.detail;
  } catch {
    // Non-JSON error body: fall back to the HTTP status.
  }
  return `HTTP ${res.status}`;
}

async function request(path: string, init?: RequestInit): Promise<Response> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, init);
  } catch {
    throw new ApiError(0, "Le serveur est injoignable.");
  }
  if (!res.ok) throw new ApiError(res.status, await readDetail(res));
  return res;
}

export async function apiGet<T = unknown>(path: string): Promise<T> {
  const res = await request(path);
  return (await res.json()) as T;
}

export async function apiPost<T = unknown>(path: string, body: unknown): Promise<T> {
  const res = await request(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return (await res.json()) as T;
}

export async function apiPut<T = unknown>(path: string, body: unknown): Promise<T> {
  const res = await request(path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return (await res.json()) as T;
}

export async function apiDelete(path: string): Promise<void> {
  await request(path, { method: "DELETE" });
}
