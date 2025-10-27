// src/components/shared/LiveLocationTracker.tsx
import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression, LatLng } from 'leaflet';
import * as signalR from "@microsoft/signalr";
import { Truck } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
import { divIcon } from 'leaflet';

interface LiveLocationTrackerProps {
  orderId: number;
}

const LiveLocationTracker: React.FC<LiveLocationTrackerProps> = ({ orderId }) => {
  const [driverLocation, setDriverLocation] = useState<LatLng | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const hubConnection = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5000/locationHub", {
        accessTokenFactory: () => localStorage.getItem("customer_token") || ""
      })
      .withAutomaticReconnect()
      .build();

    hubConnection.current = connection;

    connection.start()
      .then(() => {
        console.log("Customer SignalR Connected.");
        setIsConnected(true);
        // Subscribe to order updates
        connection.invoke("SubscribeToOrder", orderId)
          .catch(err => console.error("Error subscribing to order: ", err));
      })
      .catch(err => console.error("Customer SignalR Connection Error: ", err));

    connection.on("ReceiveLocationUpdate", (receivedDriverId, location) => {
      console.log("Location update received:", location);
      setDriverLocation(new LatLng(location.latitude, location.longitude));
    });

    // Cleanup on unmount
    return () => {
      hubConnection.current?.invoke("UnsubscribeFromOrder", orderId);
      hubConnection.current?.stop();
    };
  }, [orderId]);

  const truckIcon = divIcon({
    html: renderToStaticMarkup(<Truck size={32} className="text-blue-600" />),
    className: 'bg-transparent border-0',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });

  return (
    <div className="bg-white p-4 rounded-xl shadow-md h-80 mt-6">
      <h3 className="text-lg font-bold mb-3">ردیابی زنده راننده</h3>
      {!isConnected && <p>در حال اتصال به سرور...</p>}
      <MapContainer
        center={driverLocation || [35.6892, 51.3890]} // Default to Tehran
        zoom={13}
        className="h-full w-full rounded-lg"
        style={{ height: 'calc(100% - 40px)' }} // Adjust height to account for title
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {driverLocation && (
          <Marker position={driverLocation} icon={truckIcon}>
            <Popup>موقعیت فعلی راننده</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default LiveLocationTracker;
