import "./global.css";
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Order from "./pages/Order";
import Placeholder from "./pages/Placeholder";
import DashboardCustomer from "./pages/DashboardCustomer";
import DashboardDriver from "./pages/DashboardDriver";
import DashboardAdmin from "./pages/DashboardAdmin";
import AdminSettings from "./pages/AdminSettings";
import AdminOrders from "./pages/AdminOrders";
import AdminDrivers from "./pages/AdminDrivers";
import AdminUsers from "./pages/AdminUsers";
import { Layout } from "@/components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProducts from "./pages/AdminProducts";
import AdminServiceCategories from "./pages/AdminServiceCategories";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/order" element={<Order />} />
            <Route path="/shop" element={<Placeholder title="فروشگاه کارتن" />} />
            <Route path="/about" element={<Placeholder title="درباره ما" />} />
            <Route path="/contact" element={<Placeholder title="تماس با ما" />} />
            <Route
              path="/dashboard/customer"
              element={
                <ProtectedRoute>
                  <DashboardCustomer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/driver"
              element={
                <ProtectedRoute>
                  <DashboardDriver />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/admin"
              element={
                <ProtectedRoute>
                  <DashboardAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute>
                  <AdminSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute>
                  <AdminOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/drivers"
              element={
                <ProtectedRoute>
                  <AdminDrivers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute>
                  <AdminProducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/service-categories"
              element={
                <ProtectedRoute>
                  <AdminServiceCategories />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

const _rootEl = document.getElementById("root")!;
const _g: any = globalThis;
if (!_g.__react_root) {
  _g.__react_root = createRoot(_rootEl);
}
_g.__react_root.render(<App />);
