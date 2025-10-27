// src/components/admin/AssignDriverModal.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Loader, AlertTriangle } from 'lucide-react';
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
          // TODO: Replace this with a real API call to '/api/drivers' when the endpoint is available.
          // const response = await api.get<Driver[]>('/drivers');
          // setDrivers(response.data);

          // Using MOCK DATA as the backend endpoint is not yet implemented.
          const mockDrivers: Driver[] = [
            { id: 101, firstName: 'علی', lastName: 'رضایی', mobile: '09123456789' },
            { id: 102, firstName: 'محمد', lastName: 'حسینی', mobile: '09129876543' },
            { id: 103, firstName: 'سارا', lastName: 'احمدی', mobile: '09121112233' },
          ];
          setDrivers(mockDrivers);

        } catch (err) {
          // This will be triggered once the real API call is in place and fails.
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
        <h2 className="text-2xl font-bold mb-6">اختصاص راننده به سفارش</h2>

        {loading ? (
          <div className="flex justify-center items-center h-48"><Loader className="animate-spin" /></div>
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

        <div className="flex justify-end pt-6">
          <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg mr-2 hover:bg-gray-300">لغو</button>
          <button
            type="button"
            onClick={handleAssign}
            disabled={!selectedDriver || loading || error}
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            تخصیص
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AssignDriverModal;
