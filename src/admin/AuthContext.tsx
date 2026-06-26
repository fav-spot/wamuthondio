import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AdminRole = "Owner" | "Staff" | null;

interface AdminUserRow {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string | null;
  is_active: boolean | null;
}

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  adminUser: AdminUserRow | null;
  role: AdminRole;
  fullName: string;
  isOwner: boolean;
  isStaff: boolean;
  /** True if user has any active admin_users row (Owner or Staff). */
  hasAdminAccess: boolean;
  /** Legacy alias — true for Owner only. */
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const loadAdminUser = async (userId: string): Promise<AdminUserRow | null> => {
  const { data } = await supabase
    .from("admin_users")
    .select("id,email,full_name,role,is_active")
    .eq("id", userId)
    .maybeSingle();
  return (data as AdminUserRow | null) ?? null;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUserRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        // Defer to avoid deadlock
        setTimeout(() => {
          loadAdminUser(newSession.user.id).then((row) => setAdminUser(row));
        }, 0);
      } else {
        setAdminUser(null);
      }
    });

    // THEN check existing session
    supabase.auth.getSession().then(({ data: { session: existing } }) => {
      setSession(existing);
      setUser(existing?.user ?? null);
      if (existing?.user) {
        loadAdminUser(existing.user.id).then((row) => {
          setAdminUser(row);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const role: AdminRole =
    adminUser?.is_active && adminUser.role === "Owner"
      ? "Owner"
      : adminUser?.is_active && adminUser.role === "Staff"
        ? "Staff"
        : null;

  const isOwner = role === "Owner";
  const isStaff = role === "Staff";
  const hasAdminAccess = isOwner || isStaff;
  const fullName = adminUser?.full_name ?? "";

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        adminUser,
        role,
        fullName,
        isOwner,
        isStaff,
        hasAdminAccess,
        isAdmin: isOwner,
        loading,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
