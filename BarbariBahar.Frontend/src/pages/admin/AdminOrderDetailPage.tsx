// src/pages/admin/AdminOrderDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
// ... other imports
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import AssignDriverModal from '../../components/admin/AssignDriverModal';
import UpdateStatusModal, { OrderStatus } from '../../components/admin/UpdateStatusModal';

// ... (interface definitions remain the same)

const AdminOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // ... (state hooks remain the same)

  // ... (fetchOrderDetail, handleAssignDriver, handleUpdateStatus functions remain the same)

  if (loading && !order) { /* ... */ }
  if (error || !order) { /* ... */ }

  const origin = order.addresses.find(a => a.type === 'Origin');
  // ... (mapCenter logic)

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* ... (Header and back link) */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-bold mb-4 flex items-center">اقلام سفارش</h3>
              <ul className="space-y-3">
                {order.items.map((item, index) => (
                  <li key={index} className="flex justify-between items-center text-gray-700 border-b pb-2">
                    <span>{item.itemName} (×{item.quantity})</span>
                    <span className="font-semibold">{item.totalPrice.toLocaleString('fa-IR')} تومان</span>
                  </li>
                ))}
                <li className="flex justify-between items-center text-xl font-bold pt-2">
                  <span>جمع کل:</span>
                  <span>{order.finalPrice.toLocaleString('fa-IR')} تومان</span>
                </li>
              </ul>
            </div>

            {/* Map */}
            <div className="bg-white p-6 rounded-xl shadow-md h-80">
              <MapContainer center={mapCenter} zoom={12} className="h-full w-full rounded-lg">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {origin && <Marker position={[origin.latitude, origin.longitude]} />}
                {destination && <Marker position={[destination.latitude, destination.longitude]} />}
              </MapContainer>
            </div>
          </div>

          <div className="space-y-6">
            {/* ... (Customer, Address, Driver, Actions sections) */}
          </div>
        </div>
      </motion.div>

      {/* ... (Modals) */}
    </>
  );
};

export default AdminOrderDetailPage;
