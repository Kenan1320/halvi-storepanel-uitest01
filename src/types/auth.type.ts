export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface LoginData {
  provider: "google" | "local";
  credentials?: { email: string; password: string };
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}
