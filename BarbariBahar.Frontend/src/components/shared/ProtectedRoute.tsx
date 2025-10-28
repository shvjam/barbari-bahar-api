import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp: number;
}

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check for any of the possible tokens
    const token = localStorage.getItem("customer_token") || localStorage.getItem("admin_token") || localStorage.getItem("driver_token");

    if (!token) {
      setIsAuthenticated(false);
      navigate("/login", { replace: true });
      return;
    }

    try {
      const decodedToken = jwtDecode<JwtPayload>(token);
      const currentTime = Date.now() / 1000; // JWT exp is in seconds

      if (decodedToken.exp < currentTime) {
        // Token is expired
        localStorage.clear(); // Clear all tokens just in case
        setIsAuthenticated(false);
        navigate("/login", { replace: true });
      } else {
        // Token is valid and not expired
        setIsAuthenticated(true);
      }
    } catch (error) {
      // Token is malformed or invalid
      console.error("Invalid token:", error);
      localStorage.clear();
      setIsAuthenticated(false);
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // Render children only after authentication check is complete and successful
  if (isAuthenticated === true) {
    return <>{children}</>;
  }

  // Render null or a loading spinner while checking authentication
  return null;
}
