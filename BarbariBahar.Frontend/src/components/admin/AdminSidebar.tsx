// src/components/admin/AdminSidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, DollarSign, LogOut, ShoppingCart, Users } from 'lucide-react';

const AdminSidebar: React.FC = () => {
  const linkClasses = "flex items-center px-4 py-3 text-gray-200 hover:bg-gray-700 rounded-lg transition-colors";
  const activeLinkClasses = "bg-gray-700 text-white";

  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-4 flex flex-col fixed">
      <div className="text-2xl font-bold mb-10 text-center">
        <span className="text-[#FF8B06]">Bahar</span> Admin
      </div>
      <nav className="flex-grow">
        <ul className="space-y-3">
          <li>
            <NavLink to="/admin" end className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
              <LayoutDashboard className="ml-3" />
              <span>داشبورد</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/orders" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
              <ShoppingCart className="ml-3" />
              <span>سفارشات</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/drivers" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
              <Users className="ml-3" />
              <span>رانندگان</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/products" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
              <Package className="ml-3" />
              <span>محصولات</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/pricing" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
              <DollarSign className="ml-3" />
              <span>قیمت‌گذاری</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      <div>
        <button className={`${linkClasses} w-full`}>
          <LogOut className="ml-3" />
          <span>خروج</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
