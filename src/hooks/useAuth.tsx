import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { api } from "@/lib/api";

/* =======================
   Types
======================= */

interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

/* =======================
   Context
======================= */

const AuthContext = createContext<AuthContextType | null>(null);

/* =======================
   Provider
======================= */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const userData = await api.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("auth_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password);
    localStorage.setItem("auth_token", response.access_token);
    setUser(response.user);
  };

  const register = async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => {
    const response = await api.register(
      email,
      password,
      firstName,
      lastName
    );
    localStorage.setItem("auth_token", response.access_token);
    setUser(response.user);
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* =======================
   Hook
======================= */

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
