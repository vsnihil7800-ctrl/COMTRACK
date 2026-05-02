import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, registerAuthStore, setToken } from "../services/api";
import { socket } from "../services/socket";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => JSON.parse(localStorage.getItem("comtrack_session") || "null"));

  useEffect(() => {
    registerAuthStore({
      getSession: () => session,
      setSession: (value) => setSession(value)
    });
  }, [session]);

  useEffect(() => {
    setToken(session?.token);
    if (session) {
      localStorage.setItem("comtrack_session", JSON.stringify(session));
      socket.connect();
      socket.emit("join:user", session.user.id);
      socket.emit("join:role", session.user.role);
    } else {
      localStorage.removeItem("comtrack_session");
      socket.disconnect();
    }
  }, [session]);

  const value = useMemo(
    () => ({
      session,
      user: session?.user,
      token: session?.token,
      isAuthed: !!session?.token,
      loginData: (data) => setSession(data),
      logout: () => setSession(null),
      hasRole: (...roles) => roles.includes(session?.user?.role)
    }),
    [session]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export async function fetchProfile() {
  const { data } = await api.get("/auth/profile");
  return data;
}
