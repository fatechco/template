const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "";

class ApiClient {
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth-token");
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${BASE_URL}${path}`;
    const response = await fetch(url, {
      ...options,
      headers: { ...this.getHeaders(), ...options.headers },
    });

    const json = await response.json();

    if (!response.ok || !json.success) {
      throw new Error(json.error || `Request failed: ${response.status}`);
    }

    return json.data as T;
  }

  async get<T>(path: string, params?: Record<string, any>): Promise<T> {
    const url = params
      ? `${path}?${new URLSearchParams(
          Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null).map(([k, v]) => [k, String(v)]))
        ).toString()}`
      : path;
    return this.request<T>(url);
  }

  async post<T>(path: string, body?: any): Promise<T> {
    return this.request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined });
  }

  async put<T>(path: string, body?: any): Promise<T> {
    return this.request<T>(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined });
  }

  async delete<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: "DELETE" });
  }

  // Paginated fetch helper
  async list<T>(path: string, params?: Record<string, any>): Promise<{ data: T[]; pagination: { total: number; page: number; pageSize: number; totalPages: number } }> {
    const url = params
      ? `${path}?${new URLSearchParams(Object.fromEntries(Object.entries(params).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)]))).toString()}`
      : path;
    const response = await fetch(`${BASE_URL}${url}`, { headers: this.getHeaders() });
    const json = await response.json();
    if (!json.success) throw new Error(json.error);
    return { data: json.data, pagination: json.pagination };
  }
}

export const apiClient = new ApiClient();
