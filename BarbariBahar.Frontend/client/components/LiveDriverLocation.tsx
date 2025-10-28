import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

type Position = { lat: number; lng: number };

function apiFetch(path: string) {
  const token = localStorage.getItem("authToken");
  const headers: HeadersInit = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return fetch(path, { headers });
}

export default function LiveDriverLocation({
  driverId,
  open,
  onOpenChange,
}: {
  driverId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [position, setPosition] = useState<Position | null>(null);
  const [history, setHistory] = useState<Position[]>([]);
  const mapRef = useRef<L.Map>(null);

  useEffect(() => {
    if (!open || !driverId) {
      return;
    }

    const fetchLocation = async () => {
      try {
        const res = await apiFetch(`/api/drivers/${driverId}/location`);
        if (res.ok) {
          const data = await res.json();
          const newPos = { lat: data.latitude, lng: data.longitude };
          setPosition(newPos);
          setHistory((prev) => [...prev, newPos]);
          mapRef.current?.panTo(newPos);
        }
      } catch (error) {
        console.error("Failed to fetch driver location:", error);
      }
    };

    fetchLocation(); // Initial fetch
    const interval = setInterval(fetchLocation, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [open, driverId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>موقعیت زنده راننده</DialogTitle>
        </DialogHeader>
        <div style={{ height: "500px", width: "100%" }}>
          {position ? (
            <MapContainer
              center={position}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
              ref={mapRef}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={position} />
              <Polyline positions={history} color="blue" />
            </MapContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              در حال دریافت موقعیت...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
