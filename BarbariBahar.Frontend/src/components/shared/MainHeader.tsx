// src/components/shared/MainHeader.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import { LogIn, LogOut, User } from 'lucide-react';

const MainHeader: React.FC = () => {
  const { isAuthenticated, user, logout } = useOrder();

  // For now, auth modal is handled on Quote page, this is for direct login
  const handleLoginClick = () => {
    // In a real app, this might open the AuthModal globally
    alert('لطفا فرآیند سفارش را تا مرحله نهایی ادامه دهید تا وارد شوید.');
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-[#221896]">
          Bahar
        </Link>
        <nav>
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="font-semibold">سلام، {user?.firstName || 'کاربر'}</span>
              <Link to="/my-orders" className="flex items-center gap-1 text-gray-700 hover:text-blue-600">
                <User size={18} />
                <span>سفارشات من</span>
              </Link>
              <button onClick={logout} className="flex items-center gap-1 text-red-600 hover:text-red-800">
                <LogOut size={18} />
                <span>خروج</span>
              </button>
            </div>
          ) : (
            <button onClick={handleLoginClick} className="flex items-center gap-1 bg-[#FF8B06] text-white font-bold py-2 px-4 rounded-lg">
              <LogIn size={18} />
              <span>ورود / ثبت‌نام</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default MainHeader;
