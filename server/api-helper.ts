/**
 * Helper for test scripts that call the API.
 * Requires the server to be running (e.g. npm run dev).
 */

import "dotenv/config";
import { readFileSync, existsSync } from "fs";
import path from "path";

const PORT = parseInt(process.env.PORT || "5784", 10);
export const API_BASE = `http://localhost:${PORT}`;

export function getApiKey(): string {
  const key = process.env.API_KEY;
  if (!key) {
    console.error("Error: API_KEY is not set in .env");
    process.exit(1);
  }
  return key;
}

export async function apiPost<T>(
  path: string,
  body: unknown,
): Promise<{ data?: T; status: number; error?: string }> {
  const apiKey = getApiKey();
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify(body),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("ECONNREFUSED") || msg.includes("fetch failed")) {
      console.error(`Cannot connect to ${API_BASE}. Is the server running? (npm run dev)`);
    }
    throw err;
  }

  const text = await res.text();
  let data: T | undefined;
  try {
    data = text ? (JSON.parse(text) as T) : undefined;
  } catch {
    // non-JSON response
  }

  if (!res.ok) {
    const err = (data as { error?: string })?.error ?? res.statusText;
    return { status: res.status, error: err, data };
  }

  return { status: res.status, data };
}

/** Upload a file via multipart/form-data. For staff/project: use apiPath like /api/staff/endpoint/photo/1 or /api/projects/endpoint/picture. For generic: /api/upload/image */
export async function apiUploadFile<T = { url: string }>(
  apiPath: string,
  localFilePath: string,
  mimeType = "image/png",
): Promise<{ data?: T; status: number; error?: string }> {
  if (!existsSync(localFilePath)) {
    throw new Error(`File not found: ${localFilePath}`);
  }
  const apiKey = getApiKey();
  const formData = new FormData();
  const buffer = readFileSync(localFilePath);
  const blob = new Blob([new Uint8Array(buffer)], { type: mimeType });
  formData.append("file", blob, path.basename(localFilePath));

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${apiPath}`, {
      method: "POST",
      headers: {
        "X-API-Key": apiKey,
      },
      body: formData,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("ECONNREFUSED") || msg.includes("fetch failed")) {
      console.error(`Cannot connect to ${API_BASE}. Is the server running? (npm run dev)`);
    }
    throw err;
  }

  const text = await res.text();
  let data: T | undefined;
  try {
    data = text ? (JSON.parse(text) as T) : undefined;
  } catch {
    // non-JSON response
  }

  if (!res.ok) {
    const err = (data as { error?: string })?.error ?? res.statusText;
    return { status: res.status, error: err, data };
  }

  return { status: res.status, data };
}
