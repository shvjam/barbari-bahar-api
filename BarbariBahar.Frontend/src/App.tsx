// App.tsx (cleaned up)
import { BrowserRouter, Routes, Route } from "react-router-dom";
// ... all other imports
import { QuoteProvider } from "./context/QuoteContext";
import Layout from "./components/shared/Layout";

export default function App() {
  return (
    <BrowserRouter>
      <QuoteProvider>
        <Layout>
          <Routes>
            {/* ... all routes */}
          </Routes>
        </Layout>
      </QuoteProvider>
    </BrowserRouter>
  );
}
