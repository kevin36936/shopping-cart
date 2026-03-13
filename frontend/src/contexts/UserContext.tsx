import React, {
  createContext,
  useEffect,
  useState,
  useMemo,
  useContext,
} from "react";
import axios from "axios";
import type { User } from "../types/user.types";

export interface UserContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (newToken: string, userData: User) => void;
  logout: () => void;
}

export const UserContext = createContext<UserContextValue | undefined>(
  undefined,
);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const API_URL = import.meta.env.VITE_API_URL;

  const login = (newToken: string, userData: User) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // --- Check for existing token on app start ---
  useEffect(() => {
    let isMounted = true;
    const storedToken = localStorage.getItem("token");
    const verifyToken = async (token: string) => {
      try {
        const res = await axios.get(`${API_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (isMounted) {
          const { id, email } = res.data.user;
          setToken(storedToken);
          setUser({ id, email });
        }
      } catch {
        localStorage.removeItem("token");
        if (isMounted) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    if (storedToken) verifyToken(storedToken);
    return () => {
      isMounted = false;
    };
  }, [API_URL]);

  const value = useMemo(
    () => ({ user, token, loading, login, logout }),
    [user, token],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
