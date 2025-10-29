import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Order from "./pages/Order";
import Quote from "./pages/Quote";
import ServiceTypeSelection from "./pages/quote/ServiceTypeSelection";
import LocationSelection from "./pages/quote/LocationSelection";
import QuoteDetailsForm from "./pages/quote/QuoteDetailsForm";
import PurchasePackingSupplies from "./pages/quote/formSteps/PurchasePackingSupplies";
import ProductSelection from "./pages/Quote/ProductSelection";
// ... other page imports
import Layout from "./components/shared/Layout";
import { QuoteProvider } from "./context/QuoteContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <QuoteProvider>
            <Toaster />
            <Sonner />
            <Layout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/order" element={<Order />} />
                <Route path="/quote" element={<Quote />} />
                <Route path="/quote/service-type" element={<ServiceTypeSelection />} />
                <Route path="/quote/location" element={<LocationSelection />} />
                <Route path="/quote/details" element={<QuoteDetailsForm />} />
                <Route path="/quote/packing-supplies" element={<PurchasePackingSupplies />} />
                <Route path="/quote/products" element={<ProductSelection />} />
                {/* ... other routes */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </QuoteProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
