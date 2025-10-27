// src/components/admin/AdminHeader.tsx
import React from 'react';
import { Bell, UserCircle } from 'lucide-react';

const AdminHeader: React.FC = () => {
  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <div>
        {/* Can add search bar or other actions here */}
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-gray-500 hover:text-gray-800">
          <Bell size={24} />
        </button>
        <div className="flex items-center space-x-2">
          <span className="text-gray-700">Admin User</span>
          <UserCircle size={28} className="text-gray-600" />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
