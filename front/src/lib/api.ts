import { API_BASE_URL } from "./config";

const TOKEN_KEY = "token";

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

type ApiFetchOptions = {
  method?: string;
  data?: unknown;
  token?: string; 
  headers?: Record<string, string>;
};

export async function apiFetch<T>(
  endpoint: string,
  { method = "GET", data, token, headers = {} }: ApiFetchOptions = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const isFormData = data instanceof FormData;
  const finalToken = token ?? getToken(); 

  const fetchOptions: RequestInit = {
    method,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(finalToken ? { Authorization: `Bearer ${finalToken}` } : {}),
      ...headers,
    },
    body: data
      ? isFormData
        ? data
        : JSON.stringify(data)
      : undefined,
  };

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Une erreur s'est produite");
  }

  return response.json();
}
