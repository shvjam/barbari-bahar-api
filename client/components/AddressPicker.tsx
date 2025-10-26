import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export type SelectedAddress = { label: string; lat: number; lon: number };

export default function AddressPicker({
  onSelect,
  buttonLabel = "انتخاب از نقشه",
}: {
  onSelect: (a: SelectedAddress) => void;
  buttonLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SelectedAddress[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async (q: string) => {
    if (!q) return setResults([]);
    setLoading(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        q,
      )}&addressdetails=1&limit=6&accept-language=fa`;
      const res = await fetch(url, { headers: { "User-Agent": "barbari-bahar-frontend" } });
      const data = (await res.json()) as any[];
      const mapped = data.map((d) => ({ label: d.display_name, lat: parseFloat(d.lat), lon: parseFloat(d.lon) }));
      setResults(mapped);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return alert("مرورگر شما از Geolocation پشتیبانی نمی‌کند.");
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude: lat, longitude: lon } = pos.coords;
          const rev = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&accept-language=fa`,
            { headers: { "User-Agent": "barbari-bahar-frontend" } },
          );
          const data = await rev.json();
          const label = data.display_name || `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
          const sel = { label, lat, lon };
          onSelect(sel);
          setOpen(false);
        } catch (e) {
          console.error(e);
          alert("خطا در دریافت آدرس از موقعیت فعلی");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setLoading(false);
        alert("دسترسی موقعیت برقرار نشد: " + err.message);
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogTitle className="text-lg font-semibold">انتخاب آدرس</DialogTitle>
        <Card>
          <CardContent className="p-3">
            <div className="flex gap-2">
              <Input value={query} placeholder="جستجوی آدرس یا محله" onChange={(e) => setQuery(e.target.value)} />
              <Button
                onClick={() => {
                  search(query);
                }}
                disabled={!query || loading}
              >
                جستجو
              </Button>
            </div>

            <div className="mt-3 flex gap-2">
              <Button variant="outline" onClick={useCurrentLocation} disabled={loading}>
                استفاده از موقعیت فعلی
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setResults([]);
                  setQuery("");
                }}
              >
                پاک‌سازی
              </Button>
            </div>

            <div className="mt-4 grid gap-2">
              {loading && <div className="text-sm text-foreground/60">در حال بارگذاری...</div>}
              {!loading && results.length === 0 && <div className="text-sm text-foreground/60">نتیجه‌ای یافت نشد</div>}
              {results.map((r, idx) => (
                <div key={idx} className="border rounded p-2 flex items-center justify-between">
                  <div className="text-sm">{r.label}</div>
                  <div>
                    <Button
                      onClick={() => {
                        onSelect(r);
                        setOpen(false);
                      }}
                    >
                      انتخاب
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </DialogContent>

      <div className="inline-flex">
        <Button onClick={() => setOpen(true)}>{buttonLabel}</Button>
      </div>
    </Dialog>
  );
}
