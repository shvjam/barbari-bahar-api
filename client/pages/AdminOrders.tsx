import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import OrderDetails from "@/components/admin/OrderDetails";

type Order = {
  id: string;
  customerName?: string;
  origin?: string;
  destination?: string;
  status?: string;
  price?: number;
  createdAt?: string;
};

function apiFetch(path: string, opts: RequestInit = {}) {
  const token = localStorage.getItem("authToken");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return fetch(path, { ...opts, headers });
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/api/admin/orders?page=${page}&perPage=${perPage}`);
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Error ${res.status}: ${txt.substring(0, 200)}`);
      }

      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        const data = await res.json().catch(async (e) => {
          const txt = await res.text().catch(() => "");
          throw new Error(`Invalid JSON response: ${txt.substring(0, 200)}`);
        });
        // Expecting { orders: Order[], total: number }
        setOrders(data.orders || data);
      } else {
        const txt = await res.text().catch(() => "");
        throw new Error(`Expected JSON but received: ${txt.substring(0, 200)}`);
      }
    } catch (err) {
      console.error(err);
      toast({ title: "خطا در بارگیری سفارش‌ها", description: String(err) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const changeStatus = async (id: string, status: string) => {
    try {
      const res = await apiFetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      toast({ title: "وضعیت بروز شد" });
      load();
    } catch (err) {
      console.error(err);
      toast({ title: "خطا هنگام تغییر وضعیت", description: String(err) });
    }
  };

  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const exportCSV = () => {
    const rows = orders.map((o) => ({ id: o.id, customer: o.customerName || "", origin: o.origin || "", destination: o.destination || "", price: o.price || 0, status: o.status || "" }));
    const csv = [Object.keys(rows[0] || {}).join(","), ...rows.map(r => Object.values(r).map(v => `"${String(v).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders_page_${page}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">سفارش‌ها</h3>
        <div className="flex items-center gap-2">
          <div className="text-sm text-foreground/60">صفحه {page}</div>
          <Button size="sm" onClick={exportCSV}>صادر کردن CSV</Button>
        </div>
      </div>
      <Card>
        <CardContent>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-foreground/70 text-left">
                  <th className="pb-2">#</th>
                  <th className="pb-2">مشتری</th>
                  <th className="pb-2">مبدا</th>
                  <th className="pb-2">مقصد</th>
                  <th className="pb-2">قیمت</th>
                  <th className="pb-2">وضعیت</th>
                  <th className="pb-2">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-foreground/60">
                      در حال بارگذاری...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-foreground/60">
                      سفارش یافت نشد
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o.id} className="border-t">
                      <td className="py-2">{o.id}</td>
                      <td className="py-2">{o.customerName || "—"}</td>
                      <td className="py-2">{o.origin || "—"}</td>
                      <td className="py-2">{o.destination || "—"}</td>
                      <td className="py-2">{o.price ? `${o.price.toLocaleString()} تومان` : "��"}</td>
                      <td className="py-2">{o.status || "—"}</td>
                      <td className="py-2 flex gap-2">
                        <Button size="sm" onClick={() => changeStatus(o.id, "confirmed")}>تایید</Button>
                        <Button size="sm" variant="destructive" onClick={() => changeStatus(o.id, "cancelled")}>
                          کنسل
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-foreground/60">نمایش {orders.length} سفارش</div>
            <div className="flex items-center gap-2">
              <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                قبلی
              </Button>
              <Button onClick={() => setPage((p) => p + 1)}>بعدی</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
