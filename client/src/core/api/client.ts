import { API_BASE_URL } from "./endpoints";

export interface ApiFetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export class ApiError extends Error {
  public status: number;
  public data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { params, headers, ...customConfig } = options;

  let url = endpoint;
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
    url = `${API_BASE_URL}/${cleanEndpoint}`;
  }

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        searchParams.append(key, String(val));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  const config: RequestInit = {
    method: customConfig.method || "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...customConfig,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorData: unknown;
    try {
      errorData = await response.json();
    } catch {
      errorData = await response.text();
    }
    const message =
      (errorData as { error?: { message?: string }; message?: string })?.error?.message ||
      (errorData as { message?: string })?.message ||
      response.statusText ||
      `HTTP Error ${response.status}`;
    throw new ApiError(message, response.status, errorData);
  }

  // If status is 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  get: <T>(url: string, options?: ApiFetchOptions) =>
    apiClient<T>(url, { ...options, method: "GET" }),
  post: <T>(url: string, body?: unknown, options?: ApiFetchOptions) =>
    apiClient<T>(url, { ...options, method: "POST", body: body ? JSON.stringify(body) : undefined }),
  put: <T>(url: string, body?: unknown, options?: ApiFetchOptions) =>
    apiClient<T>(url, { ...options, method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(url: string, body?: unknown, options?: ApiFetchOptions) =>
    apiClient<T>(url, { ...options, method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(url: string, options?: ApiFetchOptions) =>
    apiClient<T>(url, { ...options, method: "DELETE" }),
};

export default api;
