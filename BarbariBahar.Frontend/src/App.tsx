// App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Quote from "./pages/Quote";
import ServiceTypeSelection from "./pages/quote/ServiceTypeSelection";
// ... other imports
import { QuoteProvider } from "./context/QuoteContext";

export default function App() {
  return (
    <BrowserRouter>
      <QuoteProvider>
        {/* ... Layout etc. */}
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/quote" element={<Quote />} />
          <Route path="/quote/service-type" element={<ServiceTypeSelection />} />
          {/* ... other routes */}
        </Routes>
      </QuoteProvider>
    </BrowserRouter>
  );
}
