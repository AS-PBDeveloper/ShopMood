// Centralized API client with automatic access-token refresh on 401
// In production: REACT_APP_API_URL = https://your-app.onrender.com
// In local dev: empty string — proxy in package.json forwards to localhost:5000
const BASE = (process.env.REACT_APP_API_URL || "").replace(/\/+$/, "");

let isRefreshing = false;
let failedQueue = [];

const processQueue = (newToken) => {
  failedQueue.forEach((cb) => cb(newToken));
  failedQueue = [];
};

/**
 * Attempt to get a fresh access token from the server using the httpOnly
 * refresh-token cookie, then update localStorage so AuthContext stays in sync.
 */
const tryRefresh = async () => {
  const res = await fetch(`${BASE}/api/auth/refresh-token`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Refresh failed");
  const { token } = await res.json();

  // Patch the stored userInfo with the new token
  const stored = localStorage.getItem("userInfo");
  if (stored) {
    const userInfo = JSON.parse(stored);
    userInfo.token = token;
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  }
  return token;
};

/**
 * Drop-in replacement for fetch() that:
 *  1. Injects the Bearer token from localStorage automatically.
 *  2. On 401, transparently refreshes the token and retries once.
 *  3. On second 401, dispatches a custom "auth:logout" event so AuthContext
 *     can clear the session.
 */
export const apiFetch = async (url, options = {}) => {
  const stored = localStorage.getItem("userInfo");
  const token = stored ? JSON.parse(stored).token : null;

  const headers = {
    ...options.headers,
  };

  // Only inject Authorization if a token exists and no override is set
  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE}${url}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (response.status !== 401) {
    return response;
  }

  // 401 — attempt token refresh
  if (isRefreshing) {
    // Queue the retry until refresh is done
    return new Promise((resolve) => {
      failedQueue.push(async (newToken) => {
        const retryHeaders = { ...headers, Authorization: `Bearer ${newToken}` };
        resolve(
          fetch(`${BASE}${url}`, {
            ...options,
            headers: retryHeaders,
            credentials: "include",
          }),
        );
      });
    });
  }

  isRefreshing = true;
  try {
    const newToken = await tryRefresh();
    processQueue(newToken);
    const retryHeaders = { ...headers, Authorization: `Bearer ${newToken}` };
    return fetch(`${BASE}${url}`, {
      ...options,
      headers: retryHeaders,
      credentials: "include",
    });
  } catch {
    // Refresh also failed — force logout
    window.dispatchEvent(new Event("auth:logout"));
    return response; // return the original 401
  } finally {
    isRefreshing = false;
  }
};
