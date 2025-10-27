// src/pages/driver/DriverLoginPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import OtpLoginForm from '../../components/shared/OtpLoginForm';

const DriverLoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleDriverLogin = (token: string) => {
    localStorage.setItem('driver_token', token);
    navigate('/driver/orders');
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-100 flex items-center justify-center font-['Vazirmatn'] p-4">
      <OtpLoginForm
        title="ورود به پنل رانندگان"
        subtitle="بهار | Bahar Driver Panel"
        onLoginSuccess={handleDriverLogin}
        roleToCheck="Driver"
      />
    </div>
  );
};

export default DriverLoginPage;
