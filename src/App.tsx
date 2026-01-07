import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth, type Role } from "./context/AuthContext";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import UserDashboard from "./pages/dashboard/UserDashboard";
import OwnerDashboard from "./pages/dashboard/OwnerDashboard";
import StoreList from "./pages/StoreList";

const queryClient = new QueryClient();

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.25, ease: "easeInOut" }}
    className="min-h-screen"
  >
    {children}
  </motion.div>
);

const ProtectedRoute = ({ children, roles }: { children: React.ReactNode; roles?: Role[] }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/auth/login" replace />;
  if (roles && !roles.some((r) => user.roles.includes(r))) return <Navigate to="/" replace />;

  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route
      path="/"
      element={
        <PageTransition>
          <Index />
        </PageTransition>
      }
    />
    <Route
      path="/auth/login"
      element={
        <PageTransition>
          <LoginPage />
        </PageTransition>
      }
    />
    <Route
      path="/auth/signup"
      element={
        <PageTransition>
          <SignupPage />
        </PageTransition>
      }
    />
    <Route
      path="/dashboard/admin"
      element={
        <ProtectedRoute roles={["admin"]}>
          <PageTransition>
            <AdminDashboard />
          </PageTransition>
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard/user"
      element={
        <ProtectedRoute roles={["user"]}>
          <PageTransition>
            <UserDashboard />
          </PageTransition>
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard/owner"
      element={
        <ProtectedRoute roles={["owner"]}>
          <PageTransition>
            <OwnerDashboard />
          </PageTransition>
        </ProtectedRoute>
      }
    />
    <Route
      path="/stores"
      element={
        <ProtectedRoute>
          <PageTransition>
            <StoreList />
          </PageTransition>
        </ProtectedRoute>
      }
    />
    <Route
      path="*"
      element={
        <PageTransition>
          <NotFound />
        </PageTransition>
      }
    />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AnimatePresence mode="wait">
            <AppRoutes />
          </AnimatePresence>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
