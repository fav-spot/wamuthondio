import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import { AuthProvider, useAuth } from "./admin/AuthContext";
import { ProtectedAdminRoute } from "./admin/ProtectedAdminRoute";
import { AdminLayout } from "./admin/AdminLayout";
import AdminLogin from "./admin/pages/AdminLogin";
import Dashboard from "./admin/pages/Dashboard";
import LogSale from "./admin/pages/LogSale";
import SalesHistory from "./admin/pages/SalesHistory";
import Balances from "./admin/pages/Balances";
import Customers from "./admin/pages/Customers";
import MediaManager from "./admin/pages/MediaManager";
import BrandsManager from "./admin/pages/BrandsManager";
import StockLog from "./admin/pages/StockLog";
import Reports from "./admin/pages/Reports";
import Inquiries from "./admin/pages/Inquiries";
import StaffUsers from "./admin/pages/StaffUsers";

const queryClient = new QueryClient();

const Protected = ({ children, ownerOnly = false }: { children: JSX.Element; ownerOnly?: boolean }) => (
  <ProtectedAdminRoute ownerOnly={ownerOnly}>
    <AdminLayout>{children}</AdminLayout>
  </ProtectedAdminRoute>
);

/** Redirect /admin → dashboard for owner, log-sale for staff. */
const AdminIndexRedirect = () => {
  const { loading, hasAdminAccess, isOwner } = useAuth();
  if (loading) return null;
  if (!hasAdminAccess) return <Navigate to="/admin/login" replace />;
  return <Navigate to={isOwner ? "/admin/dashboard" : "/admin/log-sale"} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminIndexRedirect />} />

            {/* Owner-only routes */}
            <Route path="/admin/dashboard" element={<Protected ownerOnly><Dashboard /></Protected>} />
            <Route path="/admin/customers" element={<Protected ownerOnly><Customers /></Protected>} />
            <Route path="/admin/media" element={<Protected ownerOnly><MediaManager /></Protected>} />
            <Route path="/admin/brands" element={<Protected ownerOnly><BrandsManager /></Protected>} />
            <Route path="/admin/stock" element={<Protected ownerOnly><StockLog /></Protected>} />
            <Route path="/admin/reports" element={<Protected ownerOnly><Reports /></Protected>} />
            <Route path="/admin/inquiries" element={<Protected ownerOnly><Inquiries /></Protected>} />
            <Route path="/admin/staff" element={<Protected ownerOnly><StaffUsers /></Protected>} />

            {/* Shared (Owner + Staff) routes */}
            <Route path="/admin/log-sale" element={<Protected><LogSale /></Protected>} />
            <Route path="/admin/sales" element={<Protected><SalesHistory /></Protected>} />
            <Route path="/admin/balances" element={<Protected><Balances /></Protected>} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
