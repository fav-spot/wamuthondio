import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface Props {
  children: JSX.Element;
  /** If true, only Owner role may access. Staff is redirected to /admin/log-sale. */
  ownerOnly?: boolean;
}

export const ProtectedAdminRoute = ({ children, ownerOnly = false }: Props) => {
  const { user, hasAdminAccess, isOwner, loading } = useAuth();
  const location = useLocation();
  const toastShown = useRef(false);

  // Show "no access" toast for staff hitting an owner-only route
  useEffect(() => {
    if (!loading && user && hasAdminAccess && ownerOnly && !isOwner && !toastShown.current) {
      toastShown.current = true;
      toast.error("You do not have access to this page.");
    }
  }, [loading, user, hasAdminAccess, ownerOnly, isOwner]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F1F3D]">
        <div className="text-white/70">Loading…</div>
      </div>
    );
  }

  if (!user || !hasAdminAccess) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (ownerOnly && !isOwner) {
    return <Navigate to="/admin/log-sale" replace />;
  }

  return children;
};
