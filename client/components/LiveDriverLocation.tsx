import React, { useEffect, useState } from "react";
import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function LiveDriverLocation({
  driverId,
  open,
  onOpenChange,
}: {
  driverId: string | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [pos, setPos] = useState<{ lat: number; lon: number } | null>(null);
  const [driverName, setDriverName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [autoFollow, setAutoFollow] = useState(true);
  const timerRef = useRef<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!open || !driverId) return;
    let mounted = true;

    const loadDriver = async () => {
      try {
        const res = await fetch(`/api/admin/drivers`);
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;
        const drv = (data.drivers || data || []).find((d: any) => d.id === driverId);
        setDriverName(drv ? drv.name : `ID: ${driverId}`);
      } catch (e) {
        console.debug("Failed to load driver list", e);
      }
    };

    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/driver-location/${driverId}`);
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`Error ${res.status}: ${txt.substring(0, 200)}`);
        }
        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("application/json")) {
          const txt = await res.text().catch(() => "");
          throw new Error(`Expected JSON but received: ${txt.substring(0, 200)}`);
        }
        const data = await res.json();
        if (!mounted) return;
        setPos({ lat: data.lat, lon: data.lon });
        setLastUpdated(Date.now());
      } catch (err) {
        console.error(err);
        toast({ title: "خطا در بارگیری مکان راننده", description: String(err) });
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadDriver();
    load();
    timerRef.current = window.setInterval(load, 3000);
    return () => {
      mounted = false;
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [driverId, open]);

  const iframeSrc = pos
    ? `https://www.openstreetmap.org/export/embed.html?marker=${pos.lat}%2C${pos.lon}&layer=mapnik&bbox=${pos.lon - 0.01}%2C${pos.lat - 0.01}%2C${pos.lon + 0.01}%2C${pos.lat + 0.01}`
    : undefined;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v && timerRef.current) { window.clearInterval(timerRef.current); timerRef.current = null; } onOpenChange(v); }}>
      <DialogContent className="max-w-3xl">
        <DialogTitle className="text-lg font-semibold">مکان زنده راننده</DialogTitle>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between gap-4 mb-3">
              <div>
                <div className="text-sm text-foreground/70">راننده</div>
                <div className="font-semibold">{driverName || (driverId ? `ID: ${driverId}` : "—")}</div>
              </div>
              <div className="text-sm text-foreground/60">
                به‌روز شده: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : "—"}
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm">دنبال کردن خودکار</label>
                <button className={`px-2 py-1 rounded border ${autoFollow ? "bg-primary text-white" : ""}`} onClick={() => setAutoFollow((s) => !s)}>{autoFollow ? "روشن" : "خاموش"}</button>
              </div>
            </div>

            {loading && !pos ? (
              <div className="py-6 text-center text-foreground/60">در حال بارگذاری...</div>
            ) : pos ? (
              <div className="grid gap-3">
                <div className="text-sm text-foreground/70">مختصات</div>
                <div className="font-mono">{pos.lat.toFixed(6)}, {pos.lon.toFixed(6)}</div>
                <div className="border rounded overflow-hidden">
                  <iframe title="driver-map" src={iframeSrc} className="w-full h-[400px]" />
                </div>

                <div className="pt-3 flex gap-2">
                  <Button onClick={() => window.open(`https://www.openstreetmap.org/?mlat=${pos.lat}&mlon=${pos.lon}#map=15/${pos.lat}/${pos.lon}`, "_blank")}>باز کردن در OSM</Button>
                  <Button onClick={() => { setPos(null); setLastUpdated(null); if (timerRef.current) { window.clearInterval(timerRef.current); timerRef.current = null; } onOpenChange(false); }}>بستن</Button>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-foreground/60">مکان موجود نیست</div>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
