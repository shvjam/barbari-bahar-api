// src/pages/admin/AdminLoginPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import OtpLoginForm from '../../components/shared/OtpLoginForm';

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleAdminLogin = (token: string) => {
    localStorage.setItem('admin_token', token);
    navigate('/admin');
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-100 flex items-center justify-center font-['Vazirmatn'] p-4">
      <OtpLoginForm
        title="ورود به پنل مدیریت"
        subtitle="بهار | Bahar Admin Panel"
        onLoginSuccess={handleAdminLogin}
        roleToCheck="Admin"
      />
    </div>
  );
};

export default AdminLoginPage;
