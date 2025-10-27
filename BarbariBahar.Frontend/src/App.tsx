import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { OrderProvider } from './context/OrderContext';

// --- Layouts ---
import MainLayout from './components/shared/MainLayout';
import AdminLayout from './components/admin/AdminLayout';
import DriverLayout from './components/driver/DriverLayout';

// --- Customer Pages ---
import ServiceSelectionPage from './pages/ServiceSelectionPage';
import ProductSelectionPage from './pages/ProductSelectionPage';
import MovingDetailsPage from './pages/MovingDetailsPage';
import AddressSelectionPage from './pages/AddressSelectionPage';
import ServiceDetailsPage from './pages/ServiceDetailsPage';
import QuotePage from './pages/QuotePage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import MyOrdersPage from './pages/MyOrdersPage';

// --- Admin Pages ---
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminPricingPage from './pages/admin/AdminPricingPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminOrderDetailPage from './pages/admin/AdminOrderDetailPage';

// --- Driver Pages ---
import DriverLoginPage from './pages/driver/DriverLoginPage';
import DriverOrdersPage from './pages/driver/DriverOrdersPage';
import DriverOrderDetailsPage from './pages/driver/DriverOrderDetailsPage';

function App() {
  return (
    <OrderProvider>
      <Router>
        <Routes>
          {/* --- Customer Flow --- */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<ServiceSelectionPage />} />
            <Route path="/my-orders" element={<MyOrdersPage />} />
            <Route path="/order/products" element={<ProductSelectionPage />} />
            <Route path="/order/moving-details" element={<MovingDetailsPage />} />
            <Route path="/order/address" element={<AddressSelectionPage />} />
            <Route path="/order/details" element={<ServiceDetailsPage />} />
            <Route path="/order/quote" element={<QuotePage />} />
            <Route path="/order/confirmation" element={<OrderConfirmationPage />} />
          </Route>

          {/* --- Admin Panel --- */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="pricing" element={<AdminPricingPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="orders/:id" element={<AdminOrderDetailPage />} />
          </Route>

          {/* --- Driver Panel --- */}
          <Route path="/driver/login" element={<DriverLoginPage />} />
          <Route path="/driver" element={<DriverLayout />}>
            <Route path="orders" element={<DriverOrdersPage />} />
            <Route path="orders/:id" element={<DriverOrderDetailsPage />} />
          </Route>
        </Routes>
      </Router>
    </OrderProvider>
  );
}

export default App;
