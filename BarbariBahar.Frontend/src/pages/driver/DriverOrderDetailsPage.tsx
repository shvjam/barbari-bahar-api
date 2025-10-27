// src/pages/driver/DriverOrderDetailsPage.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import { ArrowRight, User, MapPin, Package, Phone, Loader2, Info, CheckCircle, Navigation } from 'lucide-react';
import * as signalR from "@microsoft/signalr";
import api from '../../services/api';
import { OrderStatus } from '../../types';

// Simplified Order Detail interface for Driver
interface OrderAddress {
  type: 'Origin' | 'Destination';
  fullAddress: string;
  latitude: number;
  longitude: number;
}

interface OrderItem {
  itemName: string;
  quantity: number;
}

interface OrderDetail {
  id: number;
  customerName: string;
  customerPhoneNumber: string;
  status: OrderStatus;
  addresses: OrderAddress[];
  items: OrderItem[];
}

const DriverOrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const hubConnection = useRef<signalR.HubConnection | null>(null);
  const locationWatcherId = useRef<number | null>(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<OrderDetail>(`/driver/orders/${id}`);
        setOrder(response.data);
      } catch {
        setError("خطا در دریافت جزئیات سفارش.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();

    // Cleanup on unmount
    return () => {
      hubConnection.current?.stop();
      if (locationWatcherId.current !== null) {
        navigator.geolocation.clearWatch(locationWatcherId.current);
      }
    };
  }, [id]);

  useEffect(() => {
    if (order && (order.status === OrderStatus.HeadingToOrigin || order.status === OrderStatus.InProgress)) {
      if (!hubConnection.current) {
        const connection = new signalR.HubConnectionBuilder()
          .withUrl("http://localhost:5000/locationHub", {
            accessTokenFactory: () => localStorage.getItem("driver_token") || ""
          })
          .withAutomaticReconnect()
          .build();

        hubConnection.current = connection;

        connection.start()
          .then(() => {
            console.log("SignalR Connected for location tracking.");
            startSendingLocation();
          })
          .catch(err => console.error("SignalR Connection Error: ", err));
      }
    } else {
      hubConnection.current?.stop();
      if (locationWatcherId.current !== null) {
        navigator.geolocation.clearWatch(locationWatcherId.current);
        locationWatcherId.current = null;
      }
    }
  }, [order]);

  const startSendingLocation = () => {
    if ("geolocation" in navigator) {
      locationWatcherId.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          hubConnection.current?.invoke("SendLocation", { latitude, longitude })
            .catch(err => console.error("Error sending location: ", err));
        },
        (error) => {
          console.error("Geolocation Error:", error);
        },
        { enableHighAccuracy: true }
      );
    }
  };

  const handleUpdateStatus = async (newStatus: OrderStatus) => {
    setIsUpdating(true);
    try {
      // Note: The API expects a string for the enum.
      await api.patch(`/driver/orders/${id}/status`, { newStatus: newStatus.toString() });
      if (order) {
        setOrder({ ...order, status: newStatus });
      }
    } catch {
      alert('خطا در به‌روزرسانی وضعیت.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-[#221896]" size={48} /></div>;
  }

  if (error || !order) {
    return <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg"><Info className="inline-block" /> {error || 'سفارش یافت نشد.'}</div>;
  }

  const origin = order.addresses.find(a => a.type === 'Origin');
  const destination = order.addresses.find(a => a.type === 'Destination');
  const mapCenter: LatLngExpression = origin ? [origin.latitude, origin.longitude] : [35.6892, 51.3890];

  const InfoCard = ({ icon: Icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h3 className="text-lg font-bold mb-3 flex items-center text-gray-700"><Icon className="w-5 h-5 ml-2 text-[#FF8B06]" />{title}</h3>
      <div className="text-gray-600 space-y-2">{children}</div>
    </div>
  );

  return (
    <div className="p-2 pb-24"> {/* Increased padding-bottom */}
      <header className="flex items-center mb-4">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowRight size={24} className="text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-800 mr-2">جزئیات سفارش #{order.id}</h1>
      </header>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <InfoCard icon={User} title="اطلاعات مشتری">
          <p><strong>نام:</strong> {order.customerName}</p>
          <a href={`tel:${order.customerPhoneNumber}`} className="flex items-center text-blue-600">
            <Phone className="w-4 h-4 ml-2" />
            {order.customerPhoneNumber}
          </a>
        </InfoCard>

        <InfoCard icon={MapPin} title="آدرس‌ها">
          {origin && <p><strong>مبدا:</strong> {origin.fullAddress}</p>}
          {destination && <p><strong>مقصد:</strong> {destination.fullAddress}</p>}
        </InfoCard>

        <div className="bg-white rounded-xl shadow-md h-64 overflow-hidden">
          <MapContainer center={mapCenter} zoom={13} className="h-full w-full">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {origin && <Marker position={[origin.latitude, origin.longitude]}><Popup>مبدا</Popup></Marker>}
            {destination && <Marker position={[destination.latitude, destination.longitude]}><Popup>مقصد</Popup></Marker>}
          </MapContainer>
        </div>

        <InfoCard icon={Package} title="اقلام سفارش">
          <ul className="list-disc list-inside">
            {order.items.map((item, index) => (
              <li key={index}>{item.itemName} (×{item.quantity})</li>
            ))}
          </ul>
        </InfoCard>
      </motion.div>

      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-t-lg border-t space-y-2">
        {order.status === OrderStatus.InProgress && (
          <button
            onClick={() => handleUpdateStatus(OrderStatus.HeadingToOrigin)}
            disabled={isUpdating}
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isUpdating ? <Loader2 className="animate-spin" /> : <Navigation />}
            <span>شروع عزیمت به مبدا</span>
          </button>
        )}
        {(order.status === OrderStatus.HeadingToOrigin) && (
             <button
             onClick={() => handleUpdateStatus(OrderStatus.InProgress)}
             disabled={isUpdating}
             className="w-full bg-yellow-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors hover:bg-yellow-600 disabled:bg-gray-400"
           >
             {isUpdating ? <Loader2 className="animate-spin" /> : <CheckCircle />}
             <span>علامت گذاری به عنوان رسیده به مبدا</span>
           </button>
        )}
        {(order.status === OrderStatus.InProgress || order.status === OrderStatus.HeadingToOrigin) && (
          <button
            onClick={() => handleUpdateStatus(OrderStatus.Completed)}
            disabled={isUpdating}
            className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors hover:bg-green-700 disabled:bg-gray-400"
          >
            {isUpdating ? <Loader2 className="animate-spin" /> : <CheckCircle />}
            <span>علامت‌گذاری به عنوان تکمیل شده</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default DriverOrderDetailsPage;
