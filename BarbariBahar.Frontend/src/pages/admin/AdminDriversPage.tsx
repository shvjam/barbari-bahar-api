// src/pages/admin/AdminDriversPage.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Loader, AlertTriangle, Check, X } from 'lucide-react';
import api from '../../services/api';

// Enums and types should be aligned with your backend
enum DriverStatus {
  PendingApproval = 'PendingApproval',
  Active = 'Active',
  Rejected = 'Rejected',
}

interface Driver {
  id: number;
  firstName: string;
  lastName: string;
  mobile: string;
  status: DriverStatus;
}

const statusTabs = [
  { key: DriverStatus.PendingApproval, label: 'در انتظار تایید' },
  { key: DriverStatus.Active, label: 'فعال' },
  { key: DriverStatus.Rejected, label: 'رد شده' },
];

const AdminDriversPage: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStatus, setActiveStatus] = useState(DriverStatus.PendingApproval);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const response = await api.get<Driver[]>('/admin/drivers');
      setDrivers(response.data);
    } catch (err) {
      console.error(err);
      setError('خطا در دریافت لیست رانندگان.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleUpdateStatus = async (driverId: number, newStatus: DriverStatus) => {
    try {
      await api.patch(`/admin/drivers/${driverId}/status`, { status: newStatus });
      // Refresh the list to show the change
      fetchDrivers();
    } catch (err) {
      console.error(err);
      alert('خطا در به‌روزرسانی وضعیت راننده.');
    }
  };

  const filteredDrivers = useMemo(() => {
    return drivers.filter(driver => driver.status === activeStatus);
  }, [drivers, activeStatus]);

  if (error) {
    return <div className="flex justify-center items-center h-full bg-red-50 text-red-700 p-4 rounded-lg"><AlertTriangle className="ml-3" /> {error}</div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">مدیریت رانندگان</h2>

      <div className="flex border-b-2 border-gray-200 mb-6">
        {statusTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveStatus(tab.key)}
            className={`py-3 px-5 text-md font-semibold transition-all duration-300 ${
              activeStatus === tab.key
                ? 'border-b-4 border-accent text-primary'
                : 'text-gray-500 hover:text-secondary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64"><Loader className="animate-spin text-primary" size={48} /></div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <table className="w-full text-right">
            <thead className="border-b-2 border-gray-200">
              <tr>
                <th className="py-3 px-4">نام</th>
                <th className="py-3 px-4">موبایل</th>
                {activeStatus === DriverStatus.PendingApproval && <th className="py-3 px-4">عملیات</th>}
              </tr>
            </thead>
            <tbody>
              {filteredDrivers.length > 0 ? filteredDrivers.map(driver => (
                <tr key={driver.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">{driver.firstName} {driver.lastName}</td>
                  <td className="py-3 px-4">{driver.mobile}</td>
                  {activeStatus === DriverStatus.PendingApproval && (
                    <td className="py-3 px-4">
                      <div className="flex gap-3">
                        <button onClick={() => handleUpdateStatus(driver.id, DriverStatus.Active)} className="text-green-600 hover:text-green-800 p-2 bg-green-100 rounded-full">
                          <Check size={20} />
                        </button>
                        <button onClick={() => handleUpdateStatus(driver.id, DriverStatus.Rejected)} className="text-red-600 hover:text-red-800 p-2 bg-red-100 rounded-full">
                          <X size={20} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              )) : (
                <tr>
                  <td colSpan={activeStatus === DriverStatus.PendingApproval ? 3 : 2} className="text-center py-8 text-gray-500">
                    موردی برای نمایش وجود ندارد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default AdminDriversPage;
