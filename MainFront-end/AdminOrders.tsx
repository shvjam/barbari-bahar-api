import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import OrderDetails from "@/components/admin/OrderDetails";

type Order = {
  id: number;
  customerName?: string;
  origin: { fullAddress: string };
  destination: { fullAddress: string };
  status?: string;
  finalPrice?: number;
  createdAt?: string;
  driverId?: number;
};

type Driver = {
  id: number;
  firstName: string;
  lastName: string;
};

function apiFetch(path: string, opts: RequestInit = {}) {
  const token = localStorage.getItem("authToken");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return fetch(path, { ...opts, headers });
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const [ordersRes, driversRes] = await Promise.all([
        apiFetch(`/api/admin/orders`),
        apiFetch(`/api/admin/Drivers`),
      ]);

      if (!ordersRes.ok) throw new Error(`Orders fetch failed: ${ordersRes.status}`);
      if (!driversRes.ok) throw new Error(`Drivers fetch failed: ${driversRes.status}`);

      const ordersData = await ordersRes.json();
      const driversData = await driversRes.json();

      setOrders(ordersData || []);
      setDrivers(driversData || []);
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

  const changeStatus = async (id: number, status: string) => {
    try {
      const res = await apiFetch(`/api/orders/admin/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ newStatus: status }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      toast({ title: "وضعیت بروز شد" });
      load();
    } catch (err) {
      console.error(err);
      toast({ title: "خطا هنگام تغییر وضعیت", description: String(err) });
    }
  };

  const assignDriver = async (orderId: number, driverId: number) => {
    try {
      const res = await apiFetch(`/api/admin/orders/${orderId}/assign-driver`, {
        method: "PUT",
        body: JSON.stringify({ driverId }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      toast({ title: "راننده تخصیص داده شد" });
      load();
    } catch (err) {
      console.error(err);
      toast({ title: "خطا در تخصیص راننده", description: String(err) });
    }
  };

  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const exportCSV = () => {
    const rows = orders.map((o) => ({
      id: o.id,
      customer: o.customerName || "",
      origin: o.origin?.fullAddress || "",
      destination: o.destination?.fullAddress || "",
      price: o.finalPrice || 0,
      status: o.status || "",
    }));
    const csv = [
      Object.keys(rows[0] || {}).join(","),
      ...rows.map((r) =>
        Object.values(r)
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(","),
      ),
    ].join("\n");
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
          <Button size="sm" onClick={exportCSV}>
            صادر کردن CSV
          </Button>
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
                  <th className="pb-2">راننده</th>
                  <th className="pb-2">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-6 text-center text-foreground/60"
                    >
                      در حال بارگذاری...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-6 text-center text-foreground/60"
                    >
                      سفارش یافت نشد
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o.id} className="border-t">
                      <td className="py-2">{o.id}</td>
                      <td className="py-2">{o.customerName || "—"}</td>
                      <td className="py-2">{o.origin?.fullAddress || "—"}</td>
                      <td className="py-2">
                        {o.destination?.fullAddress || "—"}
                      </td>
                      <td className="py-2">
                        {o.finalPrice
                          ? `${o.finalPrice.toLocaleString()} تومان`
                          : "—"}
                      </td>
                      <td className="py-2">{o.status || "—"}</td>
                      <td className="py-2">
                        {o.driverId ? (
                          drivers.find((d) => d.id === o.driverId)?.firstName +
                          " " +
                          drivers.find((d) => d.id === o.driverId)?.lastName
                        ) : (
                          <select
                            onChange={(e) =>
                              assignDriver(o.id, Number(e.target.value))
                            }
                            defaultValue=""
                          >
                            <option value="" disabled>
                              انتخاب راننده
                            </option>
                            {drivers.map((d) => (
                              <option key={d.id} value={d.id}>
                                {d.firstName} {d.lastName}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="py-2 flex gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            changeStatus(o.id, "PendingCustomerConfirmation")
                          }
                        >
                          تایید
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => changeStatus(o.id, "Cancelled")}
                        >
                          کنسل
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedOrder(o.id);
                            setDetailsOpen(true);
                          }}
                        >
                          جزئیات
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-foreground/60">
              نمایش {orders.length} سفارش
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                قبلی
              </Button>
              <Button onClick={() => setPage((p) => p + 1)}>بعدی</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <OrderDetails
        id={selectedOrder}
        open={detailsOpen}
        onOpenChange={(v) => {
          setDetailsOpen(v);
          if (!v) setSelectedOrder(null);
        }}
      />
    </div>
  );
}
