"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { apiRequest } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    try {
      const data = await apiRequest("/api/auth/me");
      const currentUser = data.user || data;

      setUser(currentUser);
      return currentUser;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshUser();
  }, []);

  async function login(email, password) {
    const data = await apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const currentUser = await refreshUser();

    if (!currentUser) {
      throw new Error("Could not restore your login session");
    }

    return data;
  }

  async function register(userData) {
    return await apiRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async function logout() {
    await apiRequest("/api/auth/logout", {
      method: "POST",
    });

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
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