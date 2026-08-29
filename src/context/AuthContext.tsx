import React, { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "../config";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  bank?: string;
  permissions?: string[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("arvix_token");
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("arvix_auth") === "true";
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("arvix_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    localStorage.setItem("arvix_auth", isAuthenticated ? "true" : "false");
    if (token) {
      localStorage.setItem("arvix_token", token);
    } else {
      localStorage.removeItem("arvix_token");
    }
    if (user) {
      localStorage.setItem("arvix_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("arvix_user");
    }
  }, [isAuthenticated, user, token]);

  const login = async (email: string, password?: string): Promise<boolean> => {
    try {
      // 1. Try real backend API authentication
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password || "password123",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const loggedInUser: User = {
          id: data.user.user_id,
          name: data.user.full_name,
          email: data.user.email,
          role: data.user.role,
          bank: data.user.partner_bank || "NPCI Central Switch",
          permissions: data.user.permissions || [],
        };
        setToken(data.access_token);
        setUser(loggedInUser);
        setIsAuthenticated(true);
        return true;
      }
    } catch (err) {
      console.warn("[AuthContext] Backend unavailable, using local session fallback:", err);
    }

    // 2. Demo Sandbox Fallback
    const roleMapping: Record<string, { name: string; role: string; bank: string }> = {
      "admin@npci.gov.in": { name: "NPCI Master Administrator", role: "ADMIN", bank: "NPCI Central Switch" },
      "analyst@npci.gov.in": { name: "Lead Fraud Specialist", role: "ANALYST", bank: "NPCI Central Switch" },
      "a.sengupta@npci.gov.in": { name: "Abhirup Sengupta", role: "ANALYST", bank: "NPCI Central Switch" },
      "partner.hdfc@npci.gov.in": { name: "HDFC Fraud Response Officer", role: "PARTNER_BANK", bank: "HDFC Bank" },
      "partner.icici@npci.gov.in": { name: "ICICI Risk Intelligence Desk", role: "PARTNER_BANK", bank: "ICICI Bank" },
      "auditor@rbi.gov.in": { name: "RBI Compliance Inspector", role: "AUDITOR", bank: "RBI Oversight Committee" },
      "customer@gmail.com": { name: "Rahul Sharma (Citizen)", role: "CUSTOMER", bank: "Retail UPI User" },
    };

    const matched = roleMapping[email.toLowerCase()] || {
      name: email.split("@")[0].replace(".", " "),
      role: "ANALYST",
      bank: "NPCI Central Switch",
    };

    const fallbackUser: User = {
      id: `USR_${Date.now()}`,
      name: matched.name,
      email: email,
      role: matched.role,
      bank: matched.bank,
      permissions: ["*"],
    };

    setToken(`demo-bearer-token-${Date.now()}`);
    setUser(fallbackUser);
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    localStorage.removeItem("arvix_auth");
    localStorage.removeItem("arvix_user");
    localStorage.removeItem("arvix_token");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
