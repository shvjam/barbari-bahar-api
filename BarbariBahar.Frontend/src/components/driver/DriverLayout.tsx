// src/components/driver/DriverLayout.tsx
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const DriverLayout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('driver_token');
    if (!token) {
      navigate('/driver/login', { replace: true });
    }
  }, [navigate]);

  return (
    <div dir="rtl" className="flex flex-col h-screen bg-gray-50 font-['Vazirmatn']">
      <main className="flex-1 overflow-y-auto p-4">
        <Outlet />
      </main>
      {/* Placeholder for Bottom Navigation */}
      <footer className="bg-white shadow-t-md p-4">
        <p className="text-center text-gray-500">Driver Navigation</p>
      </footer>
    </div>
  );
};

export default DriverLayout;
