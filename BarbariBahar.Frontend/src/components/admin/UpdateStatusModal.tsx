// src/components/admin/UpdateStatusModal.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

// Enum for order statuses to ensure type safety
export enum OrderStatus {
  PendingPayment = 'PendingPayment',
  PendingAdminApproval = 'PendingAdminApproval',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

const statusOptions = [
  { value: OrderStatus.InProgress, label: 'در حال انجام' },
  { value: OrderStatus.Completed, label: 'تکمیل شده' },
  { value: OrderStatus.Cancelled, label: 'لغو شده' },
];

interface UpdateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newStatus: OrderStatus) => void;
  currentStatus: OrderStatus;
}

const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({ isOpen, onClose, onSave, currentStatus }) => {
  const [newStatus, setNewStatus] = useState<OrderStatus>(currentStatus);

  useEffect(() => {
    if (isOpen) {
      setNewStatus(currentStatus);
    }
  }, [isOpen, currentStatus]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(newStatus);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative"
      >
        <button onClick={onClose} className="absolute top-4 left-4 text-gray-500 hover:text-gray-800">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-6">تغییر وضعیت سفارش</h2>

        <div className="space-y-4">
          <label htmlFor="status" className="block text-md font-medium text-gray-700">
            وضعیت جدید را انتخاب کنید:
          </label>
          <select
            id="status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8B06] focus:border-transparent transition"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end pt-6 mt-4">
          <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg mr-2 hover:bg-gray-300">
            لغو
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            ذخیره تغییرات
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default UpdateStatusModal;
