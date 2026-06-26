import { ReactNode, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, PlusCircle, ListOrdered, Wallet, Users,
  Image as ImageIcon, Package, BarChart3, LogOut, Menu, X,
  Tag, Inbox, UserCog,
} from "lucide-react";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import flameLogo from "@/assets/flame-logo.png";

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  ownerOnly: boolean;
  badgeKey?: "inquiries";
  /** Override label for staff. */
  staffLabel?: string;
};

const NAV: NavItem[] = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, ownerOnly: true },
  { to: "/admin/log-sale", label: "Log a Sale", icon: PlusCircle, ownerOnly: false },
  { to: "/admin/sales", label: "Sales History", icon: ListOrdered, ownerOnly: false, staffLabel: "My Sales" },
  { to: "/admin/balances", label: "Balances Owed", icon: Wallet, ownerOnly: false, staffLabel: "Balances" },
  { to: "/admin/customers", label: "Customers", icon: Users, ownerOnly: true },
  { to: "/admin/accessories", label: "Accessories", icon: Package, ownerOnly: true },
  { to: "/admin/media", label: "Media Manager", icon: ImageIcon, ownerOnly: true },
  { to: "/admin/brands", label: "Brands Manager", icon: Tag, ownerOnly: true },
  { to: "/admin/stock", label: "Stock Log", icon: Package, ownerOnly: true },
  { to: "/admin/reports", label: "Reports", icon: BarChart3, ownerOnly: true },
  { to: "/admin/staff", label: "Staff Users", icon: UserCog, ownerOnly: true },
  { to: "/admin/inquiries", label: "Inquiries", icon: Inbox, ownerOnly: true, badgeKey: "inquiries" },
];

const initialsOf = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { signOut, isOwner, fullName, role, adminUser } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [todayInquiries, setTodayInquiries] = useState(0);

  const visibleNav = NAV.filter((n) => isOwner || !n.ownerOnly);

  useEffect(() => {
    if (!isOwner) return; // Only owner sees inquiries badge
    const loadTodayCount = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count } = await supabase
        .from("inquiries")
        .select("*", { count: "exact", head: true })
        .gte("created_at", today.toISOString());
      setTodayInquiries(count ?? 0);
    };
    loadTodayCount();
    const t = setInterval(loadTodayCount, 60000);
    return () => clearInterval(t);
  }, [isOwner]);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    navigate("/admin/login");
  };

  const renderBadge = (key?: "inquiries") => {
    if (key !== "inquiries" || todayInquiries === 0) return null;
    return (
      <span className="ml-auto inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[#E85D04] text-white text-[10px] font-bold">
        {todayInquiries}
      </span>
    );
  };

  const displayName = fullName || adminUser?.email || "User";
  const roleBadgeClass =
    role === "Owner"
      ? "bg-[#E85D04] text-white"
      : "bg-gray-200 text-gray-700";

  const UserCard = ({ compact = false }: { compact?: boolean }) => (
    <div className={`mx-3 mb-3 rounded-xl bg-white/5 border border-white/10 p-3 ${compact ? "" : ""}`}>
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-[#E85D04] text-white font-bold flex items-center justify-center text-sm shrink-0">
          {initialsOf(displayName)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-white truncate">{displayName}</div>
          <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${roleBadgeClass}`}>
            {role ?? "—"}
          </span>
        </div>
      </div>
      <button
        onClick={handleSignOut}
        className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-white/80 bg-white/5 hover:bg-white/10"
      >
        <LogOut className="h-3.5 w-3.5" />
        Sign Out
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#F8F6F1]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col bg-[#0F1F3D] text-white">
        <div className="p-6 border-b border-white/10">
          <div className="text-lg font-extrabold flex items-center gap-2">
            <img
              src={flameLogo}
              alt="Wamuthondio Gas Supply Logo"
              style={{ height: 28, width: "auto", objectFit: "contain", background: "transparent" }}
            />
            <span>Wamuthondio Gas</span>
          </div>
          <div className="text-xs text-white/50 mt-1">Admin Panel</div>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {visibleNav.map(({ to, label, icon: Icon, badgeKey, staffLabel }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#E85D04] text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {!isOwner && staffLabel ? staffLabel : label}
              {renderBadge(badgeKey)}
            </NavLink>
          ))}
        </nav>
        <UserCard />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#0F1F3D] text-white px-4 py-3 flex items-center justify-between">
        <div className="font-extrabold text-sm flex items-center gap-2">
          <img
            src={flameLogo}
            alt="Wamuthondio Gas Supply Logo"
            style={{ height: 24, width: "auto", objectFit: "contain", background: "transparent" }}
          />
          <span>Wamuthondio Admin</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-30 pt-14 bg-[#0F1F3D] text-white overflow-y-auto flex flex-col">
          <nav className="p-4 space-y-1 flex-1">
            {visibleNav.map(({ to, label, icon: Icon, badgeKey, staffLabel }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium ${
                    isActive ? "bg-[#E85D04] text-white" : "text-white/70"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {!isOwner && staffLabel ? staffLabel : label}
                {renderBadge(badgeKey)}
              </NavLink>
            ))}
          </nav>
          <UserCard compact />
        </div>
      )}

      <main className="flex-1 md:ml-0 pt-14 md:pt-0 overflow-x-hidden">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
};
