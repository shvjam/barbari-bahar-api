// src/pages/AddressSelectionPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import { LatLng } from 'leaflet';
import { motion } from 'framer-motion';
import { Pin, ArrowLeft, MapPin } from 'lucide-react';
import { useOrder, type OrderAddress } from '../context/OrderContext';

const AddressSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { origin: initialOrigin, destination: initialDestination, setOriginAddress, setDestinationAddress } = useOrder();

  const [origin, setOrigin] = useState<OrderAddress>(initialOrigin);
  const [destination, setDestination] = useState<OrderAddress>(initialDestination);
  const [activeSelection, setActiveSelection] = useState<'origin' | 'destination'>('origin');

  const tehranPosition: LatLngExpression = [35.6892, 51.3890];

  useEffect(() => {
    // Update context whenever local state changes
    setOriginAddress(origin);
  }, [origin, setOriginAddress]);

  useEffect(() => {
    setDestinationAddress(destination);
  }, [destination, setDestinationAddress]);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        if (activeSelection === 'origin') {
          setOrigin(prev => ({ ...prev, latlng: e.latlng }));
        } else {
          setDestination(prev => ({ ...prev, latlng: e.latlng }));
        }
      },
    });
    return null;
  };

  const handleNextStep = () => {
    navigate('/order/details');
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-['Vazirmatn'] flex flex-col">
      <header className="bg-[#221896] text-white text-center p-6 shadow-md z-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold"
        >
          انتخاب مبدأ و مقصد
        </motion.h1>
      </header>

      <div className="flex-grow flex flex-col md:flex-row-reverse">
        {/* Map Section */}
        <div className="w-full md:w-2/3 h-64 md:h-auto">
          <MapContainer center={tehranPosition} zoom={13} scrollWheelZoom={true} className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {origin.latlng && <Marker position={origin.latlng}></Marker>}
            {destination.latlng && <Marker position={destination.latlng}></Marker>}
            <MapClickHandler />
          </MapContainer>
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/3 p-6 bg-white shadow-lg overflow-y-auto">
          <div className="flex justify-around mb-6">
            <button
              onClick={() => setActiveSelection('origin')}
              className={`w-full text-center py-3 text-lg font-semibold transition-colors duration-300 ${activeSelection === 'origin' ? 'border-b-4 border-[#FF8B06] text-[#221896]' : 'text-gray-500'}`}
            >
              <Pin className="inline-block ml-2"/> مبدأ
            </button>
            <button
              onClick={() => setActiveSelection('destination')}
              className={`w-full text-center py-3 text-lg font-semibold transition-colors duration-300 ${activeSelection === 'destination' ? 'border-b-4 border-[#FF8B06] text-[#221896]' : 'text-gray-500'}`}
            >
              <MapPin className="inline-block ml-2"/> مقصد
            </button>
          </div>

          <motion.div
            key={activeSelection}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {activeSelection === 'origin' ? (
              <AddressForm address={origin} setAddress={setOrigin} title="آدرس مبدأ" />
            ) : (
              <AddressForm address={destination} setAddress={setDestination} title="آدرس مقصد" />
            )}
          </motion.div>

          <div className="mt-8">
            <button
              onClick={handleNextStep}
              className="w-full bg-[#221896] text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-[#001AA8] transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400"
              disabled={!origin.latlng || !destination.latlng || !origin.fullAddress || !destination.fullAddress}
            >
              <span>مرحله بعد</span>
              <ArrowLeft size={22} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component for the address form
interface AddressFormProps {
  address: OrderAddress;
  setAddress: React.Dispatch<React.SetStateAction<OrderAddress>>;
  title: string;
}

const AddressForm: React.FC<AddressFormProps> = ({ address, setAddress, title }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
      <div className="text-sm text-gray-600 p-3 bg-blue-50 rounded-lg">
        {address.latlng
          ? `موقعیت: ${address.latlng.lat.toFixed(4)}, ${address.latlng.lng.toFixed(4)}`
          : 'لطفاً موقعیت را روی نقشه انتخاب کنید.'
        }
      </div>
      <div>
        <label htmlFor="fullAddress" className="block text-md font-medium text-gray-700 mb-2">
          آدرس کامل
        </label>
        <textarea
          id="fullAddress"
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8B06] focus:border-transparent transition"
          placeholder="مثال: تهران، خیابان آزادی، پلاک ۱۲۳، واحد ۴"
          value={address.fullAddress}
          onChange={(e) => setAddress(prev => ({ ...prev, fullAddress: e.target.value }))}
        />
      </div>
    </div>
  );
};

export default AddressSelectionPage;
