
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";

import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

export type UserRole = "admin" | "fermier" | "veterinaire";

type JWTPayload = {
  sub: string;
  email: string;
  name?: string;
  role?: UserRole;
  niveau_id?: number | null;
  actif?: boolean;
  exp: number;
};

type AuthContextType = {
  userId: string | null;
  email: string | null;
  name: string | null;
  role: UserRole | null;
  niveauId: number | null;
  actif: boolean | null;
  token: string | null;
  loading: boolean;
  logout: () => void;
  setToken: (token: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [decoded, setDecoded] = useState<JWTPayload | null>(null);
  const [loading, setLoading] = useState(true);

  // Charger le token au démarrage.
  useEffect(() => {
    const stored = localStorage.getItem("token");

    if (stored) {
      setTokenState(stored);
    } else {
      setLoading(false);
    }
  }, []);

  // Décoder le JWT et contrôler son expiration côté frontend.
  useEffect(() => {
    if (!token) {
      setDecoded(null);
      setLoading(false);
      return;
    }

    try {
      const payload = jwtDecode<JWTPayload>(token);

      if (!payload.exp || payload.exp * 1000 <= Date.now()) {
        localStorage.removeItem("token");
        setTokenState(null);
        setDecoded(null);
        setLoading(false);
        return;
      }

      setDecoded(payload);
    } catch {
      localStorage.removeItem("token");
      setTokenState(null);
      setDecoded(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const setToken = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setLoading(true);
    setTokenState(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setTokenState(null);
    setDecoded(null);
    setLoading(false);
  };

  const value = useMemo<AuthContextType>(
    () => ({
      token,
      userId: decoded?.sub ?? null,
      email: decoded?.email ?? null,
      name: decoded?.name ?? null,
      role: decoded?.role ?? null,
      niveauId: decoded?.niveau_id ?? null,
      actif: decoded?.actif ?? null,
      logout,
      setToken,
      loading,
    }),
    [token, decoded, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
};
