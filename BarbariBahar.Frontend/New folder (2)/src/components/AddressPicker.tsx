import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

type Position = { lat: number; lng: number };

function LocationPicker({ onSelect }: { onSelect: (pos: Position) => void }) {
  const [position, setPosition] = useState<Position | null>(null);

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        onSelect(e.latlng);
      },
    });
    return null;
  };

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <MapContainer
        center={[35.6892, 51.389]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapEvents />
        {position && <Marker position={position} />}
      </MapContainer>
    </div>
  );
}

export default function AddressPicker({
  buttonLabel,
  onSelect,
}: {
  buttonLabel: string;
  onSelect: (address: {
    label: string;
    lat: number;
    lon: number;
  }) => void;
}) {
  const [selectedPos, setSelectedPos] = useState<Position | null>(null);

  const handleConfirm = () => {
    if (selectedPos) {
      onSelect({
        label: `مختصات: ${selectedPos.lat.toFixed(4)}, ${selectedPos.lng.toFixed(
          4,
        )}`,
        lat: selectedPos.lat,
        lon: selectedPos.lng,
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{buttonLabel}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>انتخاب آدرس از روی نقشه</DialogTitle>
        </DialogHeader>
        <LocationPicker onSelect={setSelectedPos} />
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={!selectedPos}
            >
              تایید
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
