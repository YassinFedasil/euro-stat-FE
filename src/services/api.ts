import { API_BASE_URL } from "../config";

async function request(path: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(`${API_BASE_URL}${path}`, init);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
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

export async function apiDelete(path: string): Promise<void> {
  await request(path, { method: "DELETE" });
}
