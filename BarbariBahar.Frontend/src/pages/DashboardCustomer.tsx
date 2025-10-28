import React, { useEffect, useState } from "react";
import {
  Card as UiCard,
  CardContent as UiCardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import LiveDriverLocation from "../components/LiveDriverLocation";
import { useToast } from "../hooks/use-toast";
import CustomerTickets from "../components/CustomerTickets";

const Card = UiCard as typeof UiCard;
const CardContent = UiCardContent as typeof UiCardContent;

type Order = {
  id: number;
  status: string;
  driverId?: string | null;
  customerName?: string;
};

function apiFetch(path: string, opts: RequestInit = {}) {
  const token = localStorage.getItem("authToken");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return fetch(path, { ...opts, headers });
}

export default function DashboardCustomer() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selDriver, setSelDriver] = useState<string | null>(null);
  const [locOpen, setLocOpen] = useState(false);
  const { toast } = useToast();
  const [tab, setTab] = useState<"orders" | "tickets">("orders");
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [ordersRes, walletRes] = await Promise.all([
          apiFetch(`/api/Order/my-orders`),
          apiFetch(`/api/users/me/wallet`),
        ]);

        if (!ordersRes.ok) throw new Error(`Orders fetch failed: ${ordersRes.status}`);
        if (walletRes.ok) {
          const walletData = await walletRes.json();
          setWalletBalance(walletData.balance || 0);
        }

        const ordersData = await ordersRes.json();
        setOrders(ordersData || []);
      } catch (err) {
        console.error(err);
        toast({
          title: "خطا در بارگیری سفارش‌ها",
          description: String(err),
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [toast]);

  const openLocation = (driverId?: string | null) => {
    if (!driverId) return;
    setSelDriver(driverId);
    setLocOpen(true);
  };

  const activeOrders = orders.filter(
    (o) => o.status && o.status !== "completed" && o.status !== "cancelled",
  );

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

      <div className="flex items-center gap-2 mb-4">
        <Button
          variant={tab === "orders" ? "default" : "ghost"}
          onClick={() => setTab("orders")}
        >
          سفارش‌ها
        </Button>
        <Button
          variant={tab === "tickets" ? "default" : "ghost"}
          onClick={() => setTab("tickets")}
        >
          پشتیبانی
        </Button>
      </div>

      {tab === "orders" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent>
                <div className="text-sm text-foreground/70">سفارش‌های فعال</div>
                <div className="text-2xl font-bold mt-2">
                  {activeOrders.length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="text-sm text-foreground/70">
                  سفارش‌های تکمیل‌شده
                </div>
                <div className="text-2xl font-bold mt-2">
                  {orders.length - activeOrders.length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="text-sm text-foreground/70">موجودی کیف پول</div>
                <div className="text-2xl font-bold mt-2">
                  {walletBalance.toLocaleString()} تومان
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card>
              <CardContent>
                <div className="font-bold">سابقه سفارش‌ها</div>
                <div className="mt-4">
                  {loading ? (
                    <div className="py-6 text-center text-foreground/60">
                      در حال بارگذاری...
                    </div>
                  ) : activeOrders.length === 0 ? (
                    <div className="py-6 text-center text-foreground/60">
                      سفارشی یافت نشد
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {activeOrders.map((o) => (
                        <div
                          key={o.id}
                          className="border rounded p-3 flex items-center justify-between"
                        >
                          <div>
                            <div className="font-bold">سفارش #{o.id}</div>
                            <div className="text-sm text-foreground/70">
                              وضعیت: {o.status}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {o.driverId ? (
                              <Button
                                size="sm"
                                onClick={() => openLocation(o.driverId)}
                              >
                                نمایش موقعیت راننده
                              </Button>
                            ) : (
                              <div className="text-sm text-foreground/60">
                                راننده تخصیص نیافته
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {tab === "tickets" && <CustomerTickets />}

      <LiveDriverLocation
        driverId={selDriver}
        open={locOpen}
        onOpenChange={setLocOpen}
      />
    </div>
  );
}
