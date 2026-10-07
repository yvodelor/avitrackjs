import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
 
} from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

type JWTPayload = {
  sub: string;
  email: string;
  name?: string;
  role?: number;
  exp: number;
};

type AuthContextType = {
  userId: string | null;
  email: string | null;
  name: string | null;
  role: number | null;
  token: string | null;
  logout: () => void;
  setToken: (token: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [decoded, setDecoded] = useState<JWTPayload | null>(null);

  // 🔄 load token
  useEffect(() => {
    const stored = localStorage.getItem("token"); // ✅ FIX ICI
    if (stored) setTokenState(stored);
  }, []);

  // 🔓 decode token
  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode<JWTPayload>(token);
        setDecoded(decodedToken);
      } catch (err) {
        console.error("Token invalide", err);
        setDecoded(null);
      }
    } else {
      setDecoded(null);
    }
  }, [token]);

  const setToken = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setTokenState(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setTokenState(null);
    setDecoded(null);
  };

  const value = useMemo(
    () => ({
      token,
      userId: decoded?.sub ?? null,
      email: decoded?.email ?? null,
      name: decoded?.name ?? null,
      role: decoded?.role?? null,
      logout,
      setToken
    }),
    [token, decoded]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook custom
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};