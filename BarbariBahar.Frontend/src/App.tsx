import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { OrderProvider } from './context/OrderContext';

// --- Customer Pages ---
// Main flow
import ServiceSelectionPage from './pages/ServiceSelectionPage'; // The new main entry point
import ProductSelectionPage from './pages/ProductSelectionPage'; // The renamed page
import MovingDetailsPage from './pages/MovingDetailsPage'; // The new moving details page
import AddressSelectionPage from './pages/AddressSelectionPage';
import ServiceDetailsPage from './pages/ServiceDetailsPage';
import QuotePage from './pages/QuotePage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';

// --- Admin Pages ---
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminLayout from './components/admin/AdminLayout';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminPricingPage from './pages/admin/AdminPricingPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminOrderDetailPage from './pages/admin/AdminOrderDetailPage';

function App() {
  return (
    <OrderProvider>
      <Router>
        <Routes>
          {/* --- Customer Ordering Flow --- */}
          <Route path="/" element={<ServiceSelectionPage />} />
          <Route path="/order/products" element={<ProductSelectionPage />} />
          <Route path="/order/moving-details" element={<MovingDetailsPage />} />
          <Route path="/order/address" element={<AddressSelectionPage />} />
          <Route path="/order/details" element={<ServiceDetailsPage />} />
          <Route path="/order/quote" element={<QuotePage />} />
          <Route path="/order/confirmation" element={<OrderConfirmationPage />} />

          {/* --- Admin Panel --- */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="pricing" element={<AdminPricingPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="orders/:id" element={<AdminOrderDetailPage />} />
          </Route>
        </Routes>
      </Router>
    </OrderProvider>
  );
}

export default App;
