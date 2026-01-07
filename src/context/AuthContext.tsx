import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export type Role = "admin" | "user" | "owner";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  roles: Role[];
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (payload: { email: string; password: string }) => Promise<void>;
  signup: (payload: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("srp_token");
  if (token) {
    config.headers = {
      ...(config.headers as any),
      Authorization: `Bearer ${token}`,
    } as any;
  }
  return config;
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("srp_token");
    const storedUser = localStorage.getItem("srp_user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const persistSession = (jwt: string, authUser: AuthUser) => {
    localStorage.setItem("srp_token", jwt);
    localStorage.setItem("srp_user", JSON.stringify(authUser));
    setToken(jwt);
    setUser(authUser);
  };

  const login: AuthContextValue["login"] = async ({ email, password }) => {
    const { data } = await api.post("/auth/login", { email, password });
    persistSession(data.token, data.user);
  };

  const signup: AuthContextValue["signup"] = async ({ name, email, password }) => {
    const { data } = await api.post("/auth/signup", { name, email, password });
    persistSession(data.token, data.user);
  };

  const logout = () => {
    localStorage.removeItem("srp_token");
    localStorage.removeItem("srp_user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
