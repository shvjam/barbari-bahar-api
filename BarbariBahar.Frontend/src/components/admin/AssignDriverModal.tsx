// src/components/admin/AssignDriverModal.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2, AlertTriangle } from 'lucide-react';
import api from '../../services/api';

interface Driver {
  id: number;
  firstName: string;
  lastName: string;
  mobile: string;
}

interface AssignDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (driverId: number) => void;
  orderId: number;
}

const AssignDriverModal: React.FC<AssignDriverModalProps> = ({ isOpen, onClose, onAssign, orderId }) => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchDrivers = async () => {
        setLoading(true);
        setError(null);
        try {
          // Fetch only active drivers from the real API endpoint
          const response = await api.get<Driver[]>('/admin/drivers', {
            params: { status: 'Active' }
          });
          setDrivers(response.data);
          if (response.data.length === 0) {
            setError('هیچ راننده فعالی یافت نشد.');
          }
        } catch (err) {
          console.error(err);
          setError('خطا در دریافت لیست رانندگان.');
        } finally {
          setLoading(false);
        }
      };
      fetchDrivers();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAssign = () => {
    if (selectedDriver) {
      onAssign(selectedDriver);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative"
      >
        <button onClick={onClose} className="absolute top-4 left-4 text-gray-500 hover:text-gray-800">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-6">اختصاص راننده به سفارش #{orderId}</h2>

        {loading ? (
          <div className="flex justify-center items-center h-48"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
        ) : error ? (
          <div className="text-red-600 bg-red-50 p-4 rounded-lg text-center"><AlertTriangle className="inline ml-2" />{error}</div>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {drivers.map(driver => (
              <div
                key={driver.id}
                onClick={() => setSelectedDriver(driver.id)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedDriver === driver.id ? 'bg-blue-100 border-blue-500 ring-2 ring-blue-500' : 'border-gray-300 hover:bg-gray-50'}`}
              >
                <p className="font-bold">{driver.firstName} {driver.lastName}</p>
                <p className="text-sm text-gray-600">{driver.mobile}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end pt-6 mt-4 border-t">
          <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg mr-2 hover:bg-gray-300">لغو</button>
          <button
            type="button"
            onClick={handleAssign}
            disabled={!selectedDriver || loading}
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            تخصیص راننده
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AssignDriverModal;
