import React, { useEffect, useState } from "react";
import { Card as UiCard, CardContent as UiCardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import LiveDriverLocation from "@/components/LiveDriverLocation";

export default function DashboardCustomer() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selDriver, setSelDriver] = useState<string | null>(null);
  const [locOpen, setLocOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/orders`);
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;
        setOrders(Array.isArray(data.orders) ? data.orders : data);
      } catch (e) {
        console.debug(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const openLocation = (driverId?: string | null) => {
    if (!driverId) return;
    setSelDriver(driverId);
    setLocOpen(true);
  };

  const activeOrders = orders.filter((o) => o.status && o.status !== "completed" && o.status !== "cancelled");

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-extrabold">داشبورد مشتری</h2>
        <div>
          <Button asChild>
            <Link to="/order">ثبت سفارش جدید</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <UiCard>
          <UiCardContent>
            <div className="text-sm text-foreground/70">سفارش‌های فعال</div>
            <div className="text-2xl font-bold mt-2">{activeOrders.length}</div>
          </UiCardContent>
        </UiCard>
        <UiCard>
          <UiCardContent>
            <div className="text-sm text-foreground/70">سفارش‌های تکمیل‌شده</div>
            <div className="text-2xl font-bold mt-2">0</div>
          </UiCardContent>
        </UiCard>
        <UiCard>
          <UiCardContent>
            <div className="text-sm text-foreground/70">موجودی کیف پول</div>
            <div className="text-2xl font-bold mt-2">0 تومان</div>
          </UiCardContent>
        </UiCard>
      </div>

      <div className="mt-6">
        <UiCard>
          <UiCardContent>
            <div className="font-bold">سابقه سفارش‌ها</div>
            <div className="mt-3 text-sm text-foreground/70">این بخش لیست سفارش‌های مشتری را نمایش می‌دهد.</div>

            <div className="mt-4">
              {loading ? (
                <div className="py-6 text-center text-foreground/60">در حال بارگذاری...</div>
              ) : activeOrders.length === 0 ? (
                <div className="py-6 text-center text-foreground/60">سفارشی یافت نشد</div>
              ) : (
                <div className="grid gap-3">
                  {activeOrders.map((o) => (
                    <div key={o.id} className="border rounded p-3 flex items-center justify-between">
                      <div>
                        <div className="font-bold">{o.id}</div>
                        <div className="text-sm text-foreground/70">{o.customerName} — {o.status}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {o.driverId ? (
                          <Button size="sm" onClick={() => openLocation(o.driverId)}>نما��ش موقعیت راننده</Button>
                        ) : (
                          <div className="text-sm text-foreground/60">راننده تخصیص نیافته</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </UiCardContent>
        </UiCard>
      </div>

      <LiveDriverLocation driverId={selDriver} open={locOpen} onOpenChange={setLocOpen} />
    </div>
  );
}
