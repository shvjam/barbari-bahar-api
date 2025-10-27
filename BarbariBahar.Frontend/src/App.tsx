import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { OrderProvider } from './context/OrderContext';

// Customer Pages
import ServiceSelectionPage from './pages/ServiceSelectionPage';
import AddressSelectionPage from './pages/AddressSelectionPage';
import ServiceDetailsPage from './pages/ServiceDetailsPage';
import QuotePage from './pages/QuotePage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminLayout from './components/admin/AdminLayout';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminPricingPage from './pages/admin/AdminPricingPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage'; // Import new page
import AdminOrderDetailPage from './pages/admin/AdminOrderDetailPage'; // Import new page

function App() {
  return (
    <OrderProvider>
      <Router>
        <Routes>
          {/* Customer Ordering Flow */}
          <Route path="/" element={<ServiceSelectionPage />} />
          <Route path="/order/address" element={<AddressSelectionPage />} />
          <Route path="/order/details" element={<ServiceDetailsPage />} />
          <Route path="/order/quote" element={<QuotePage />} />
          <Route path="/order/confirmation" element={<OrderConfirmationPage />} />

          {/* Admin Panel */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="pricing" element={<AdminPricingPage />} />
            <Route path="orders" element={<AdminOrdersPage />} /> {/* Add orders list route */}
            <Route path="orders/:id" element={<AdminOrderDetailPage />} /> {/* Add order detail route */}
          </Route>
        </Routes>
      </Router>
    </OrderProvider>
  );
}

export default App;
