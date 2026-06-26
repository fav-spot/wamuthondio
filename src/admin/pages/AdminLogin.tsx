import { useState, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../AuthContext";
import { usePageTitle } from "@/hooks/usePageTitle";
import flameLogo from "@/assets/flame-logo.png";

const AdminLogin = () => {
  usePageTitle("Admin Login — Wamuthondio Gas");
  const navigate = useNavigate();
  const { user, hasAdminAccess, isOwner, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user && hasAdminAccess) {
      navigate(isOwner ? "/admin/dashboard" : "/admin/log-sale", { replace: true });
    }
  }, [user, hasAdminAccess, isOwner, loading, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: signErr } = await supabase.auth.signInWithPassword({ email, password });
    if (signErr) {
      setError("Invalid email or password.");
      setSubmitting(false);
      return;
    }
    // Verify admin_users access (Owner or active Staff)
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data: adminRow } = await supabase
        .from("admin_users")
        .select("role,is_active")
        .eq("id", session.user.id)
        .maybeSingle();
      if (!adminRow || !adminRow.is_active) {
        await supabase.auth.signOut();
        setError("This account does not have admin access.");
        setSubmitting(false);
        return;
      }
      const dest = adminRow.role === "Owner" ? "/admin/dashboard" : "/admin/log-sale";
      navigate(dest, { replace: true });
      return;
    }
    navigate("/admin/log-sale", { replace: true });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#0F1F3D", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <img
            src={flameLogo}
            alt="Wamuthondio Gas Supply Logo"
            style={{
              height: 48,
              width: "auto",
              objectFit: "contain",
              background: "transparent",
              margin: "0 auto 12px",
              filter: "drop-shadow(0 4px 12px rgba(232,93,4,0.3))",
            }}
          />
          <div className="text-2xl font-extrabold text-[#0F1F3D]">
            Wamuthondio Gas
          </div>
          <div className="text-sm text-gray-500 mt-1">Admin Panel</div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#0F1F3D] mb-1">Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0F1F3D] mb-1">Password</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 outline-none"
            />
          </div>
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#E85D04] hover:bg-[#d35402] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60"
          >
            {submitting ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
