import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { OrderProvider } from './context/OrderContext';
import ServiceSelectionPage from './pages/ServiceSelectionPage';
import AddressSelectionPage from './pages/AddressSelectionPage';
import ServiceDetailsPage from './pages/ServiceDetailsPage';
import QuotePage from './pages/QuotePage';

function App() {
  return (
    <OrderProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ServiceSelectionPage />} />
          <Route path="/order/address" element={<AddressSelectionPage />} />
          <Route path="/order/details" element={<ServiceDetailsPage />} />
          <Route path="/order/quote" element={<QuotePage />} />
        </Routes>
      </Router>
    </OrderProvider>
  );
}

export default App;
