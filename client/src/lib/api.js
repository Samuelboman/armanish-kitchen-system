// Small wrapper around fetch for the Armanish Delight API (VITE_API_URL).

export const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(message, { status = 0, code, details } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status; // 0 means the request never reached the server
    this.code = code; // e.g. "ITEM_UNAVAILABLE" from POST /api/orders
    this.details = details ?? {}; // the rest of the error body, e.g. { menuItem }
  }
}

// Calls the API and returns the parsed JSON body. Throws ApiError with a message
// that can be shown to the customer when the request fails.
export async function apiFetch(path, { method = "GET", body, token, headers = {}, signal } = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      signal,
      headers: {
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new ApiError("We couldn't reach the server. Check your internet connection and try again.");
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    // Non-JSON response (e.g. a proxy error page); handled below.
  }

  if (!response.ok || data?.success === false) {
    const { message, code, success: _success, ...details } = data ?? {};
    throw new ApiError(message || "Something went wrong. Please try again.", {
      status: response.status,
      code,
      details,
    });
  }

  return data;
}
