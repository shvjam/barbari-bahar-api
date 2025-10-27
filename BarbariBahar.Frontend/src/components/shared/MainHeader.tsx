// src/components/shared/MainHeader.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import { LogIn, LogOut, User } from 'lucide-react';
import AuthModal from './AuthModal'; // Import the modal

const MainHeader: React.FC = () => {
  const { isAuthenticated, user, logout } = useOrder();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleLoginClick = () => {
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = () => {
    setIsAuthModalOpen(false);
    // Optionally, you can add a success notification here
  };

  return (
    <>
      <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto p-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary">
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
            <button onClick={handleLoginClick} className="flex items-center gap-1 bg-accent text-white font-bold py-2 px-4 rounded-lg">
                <LogIn size={18} />
                <span>ورود / ثبت‌نام</span>
              </button>
            )}
          </nav>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default MainHeader;
