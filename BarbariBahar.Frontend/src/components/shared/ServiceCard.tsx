import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder, type ServiceType } from '../../context/OrderContext';
import { motion } from 'framer-motion';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  serviceType: ServiceType;
  path: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon, serviceType, path }) => {
  const navigate = useNavigate();
  const { setServiceType } = useOrder();

  const handleClick = () => {
    setServiceType(serviceType);
    navigate(path);
  };

  return (
    <motion.div
      onClick={handleClick}
      whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-lg p-8 max-w-sm text-center cursor-pointer"
    >
      <div className="mx-auto bg-primary rounded-full h-20 w-20 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
      <div className="mt-6 text-sm font-semibold text-accent">انتخاب سرویس</div>
    </motion.div>
  );
};

export default ServiceCard;
