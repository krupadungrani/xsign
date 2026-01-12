// API configuration for production and development
// Use relative URLs when deployed to Vercel (both frontend and API on same domain)
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const apiUrl = (path: string) => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // Use relative URL when no explicit API_URL is set (Vercel deployment)
  if (!API_BASE_URL) {
    return `/api/${cleanPath}`;
  }
  return `${API_BASE_URL}/${cleanPath}`;
};

export const apiRequest = async (
  method: string,
  path: string,
  data?: unknown
): Promise<Response> => {
  const url = apiUrl(path);
  
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }

  return res;
};
