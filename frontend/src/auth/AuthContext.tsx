import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "../lib/api";
import type { Role } from "./roles";

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: Role;
};

type LoginValues = { email: string; password: string };
type RegisterValues = LoginValues & { firstName: string; lastName: string };

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (values: LoginValues) => Promise<void>;
  register: (values: RegisterValues) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<{ user: User }>("/auth/me")
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(values: LoginValues) {
    const data = await api<{ user: User }>("/auth/login", { method: "POST", body: values });
    setUser(data.user);
  }

  async function register(values: RegisterValues) {
    const data = await api<{ user: User }>("/auth/register", { method: "POST", body: values });
    setUser(data.user);
  }

  async function logout() {
    await api<void>("/auth/logout", { method: "POST" });
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
