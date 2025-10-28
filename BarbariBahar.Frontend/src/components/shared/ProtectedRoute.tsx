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
    const token = localStorage.getItem("customer_token") || localStorage.getItem("admin_token") || localStorage.getItem("driver_token");

    if (!token) {
      setIsAuthenticated(false);
      navigate("/login", { replace: true });
      return;
    }

    try {
      const decodedToken = jwtDecode<JwtPayload>(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        localStorage.clear();
        setIsAuthenticated(false);
        navigate("/login", { replace: true });
      } else {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.clear();
      setIsAuthenticated(false);
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  if (isAuthenticated === true) {
    return <>{children}</>;
  }

  return null; // Render nothing while checking
}
