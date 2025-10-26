import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  serviceType: 'shipping' | 'packing' | 'labor';
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon, serviceType }) => {
  const navigate = useNavigate();
  const { setServiceType } = useOrder();

  const handleClick = () => {
    setServiceType(serviceType);
    if (serviceType === 'shipping') {
      navigate('/order/address');
    } else {
      alert(`خدمات '${title}' به زودی اضافه خواهد شد.`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300"
    >
      <div className="text-5xl text-primary mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
};

export default ServiceCard;
