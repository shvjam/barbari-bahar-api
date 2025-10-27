import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type Order = {
  id: number;
  status: string;
  customerName?: string;
  origin: { fullAddress: string };
  destination: { fullAddress: string };
};

function apiFetch(path: string, opts: RequestInit = {}) {
  const token = localStorage.getItem("authToken");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return fetch(path, { ...opts, headers });
}

export default function DashboardDriver() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/driver/orders");
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setOrders(data || []);
    } catch (err) {
      console.error(err);
      toast({ title: "خطا در بارگیری ماموریت‌ها", description: String(err) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const res = await apiFetch(`/api/driver/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ newStatus }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      toast({ title: "وضعیت بروز شد" });
      loadOrders();
    } catch (err) {
      console.error(err);
      toast({ title: "خطا در بروزرسانی وضعیت", description: String(err) });
    }
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-extrabold">داشبورد راننده</h2>
        <div>
          <Button asChild>
            <Link to="/">نمایش پروفایل</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent>
            <div className="text-sm text-foreground/70">ماموریت‌های جاری</div>
            <div className="text-2xl font-bold mt-2">
              {orders.filter((o) => o.status === "InProgress").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="text-sm text-foreground/70">درآمد امروز</div>
            <div className="text-2xl font-bold mt-2">0 تومان</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="text-sm text-foreground/70">مجموع سفارش‌ها</div>
            <div className="text-2xl font-bold mt-2">{orders.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardContent>
            <div className="font-bold">ماموریت‌های محول‌شده</div>
            {loading ? (
              <div className="py-6 text-center">در حال بارگیری...</div>
            ) : (
              <div className="grid gap-4 mt-4">
                {orders.map((o) => (
                  <div key={o.id} className="border p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="font-bold">سفارش #{o.id}</div>
                      <div className="text-sm">{o.status}</div>
                    </div>
                    <div className="text-sm mt-2">
                      <p>
                        <strong>مشتری:</strong> {o.customerName || "نامشخص"}
                      </p>
                      <p>
                        <strong>مبدا:</strong> {o.origin.fullAddress}
                      </p>
                      <p>
                        <strong>مقصد:</strong> {o.destination.fullAddress}
                      </p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      {o.status === "InProgress" && (
                        <Button
                          size="sm"
                          onClick={() => updateStatus(o.id, "Completed")}
                        >
                          تکمیل شد
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
