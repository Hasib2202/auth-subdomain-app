// client/src/contexts/AuthContext.tsx
"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authService, User } from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (
    username: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<void>;
  signup: (
    username: string,
    password: string,
    shopNames: string[]
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if we have a token first
        if (!authService.isAuthenticated()) {
          setLoading(false);
          return;
        }

        // Try to validate the token first
        try {
          await authService.validate();
        } catch (validateError) {
          console.error("Token validation failed:", validateError);
          // Token is invalid, clear it and don't try to get profile
          localStorage.removeItem("auth_token");
          setUser(null);
          setLoading(false);
          return;
        }

        // Try to get user profile using the token
        const profileData = await authService.getProfile();
        // The profile endpoint returns {id, username, shops}
        setUser({
          id: profileData.id,
          username: profileData.username,
          shops: profileData.shops,
        });
      } catch (error) {
        console.error("Auth check failed:", error);
        // Token might be invalid, clear it
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_token");
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (
    username: string,
    password: string,
    rememberMe?: boolean
  ) => {
    const response = await authService.login({
      username,
      password,
      rememberMe,
    });

    // Ensure token is stored before setting user
    if (response.access_token && typeof window !== "undefined") {
      localStorage.setItem("auth_token", response.access_token);
    }

    setUser(response.user);
  };

  const signup = async (
    username: string,
    password: string,
    shopNames: string[]
  ) => {
    const response = await authService.signup({
      username,
      password,
      shopNames,
    });

    // Ensure token is stored before setting user
    if (response.access_token && typeof window !== "undefined") {
      localStorage.setItem("auth_token", response.access_token);
    }

    setUser(response.user);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
