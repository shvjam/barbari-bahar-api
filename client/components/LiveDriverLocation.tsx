import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function LiveDriverLocation({ driverId, open, onOpenChange }: { driverId: string | null; open: boolean; onOpenChange: (v: boolean) => void }) {
  const [pos, setPos] = useState<{ lat: number; lon: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!open || !driverId) return;
    let mounted = true;
    let timer: any;

    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/driver-location/${driverId}`);
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`Error ${res.status}: ${txt.substring(0,200)}`);
        }
        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("application/json")) {
          const txt = await res.text().catch(() => "");
          throw new Error(`Expected JSON but received: ${txt.substring(0,200)}`);
        }
        const data = await res.json();
        if (!mounted) return;
        setPos({ lat: data.lat, lon: data.lon });
      } catch (err) {
        console.error(err);
        toast({ title: "خطا در بارگیری مکان راننده", description: String(err) });
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    timer = setInterval(load, 3000);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [driverId, open]);

  const iframeSrc = pos
    ? `https://www.openstreetmap.org/export/embed.html?marker=${pos.lat}%2C${pos.lon}&layer=mapnik&bbox=${pos.lon - 0.01}%2C${pos.lat - 0.01}%2C${pos.lon + 0.01}%2C${pos.lat + 0.01}`
    : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogTitle className="text-lg font-semibold">مکان زنده راننده</DialogTitle>
        <Card>
          <CardContent>
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
                  <Button onClick={() => onOpenChange(false)}>بستن</Button>
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
