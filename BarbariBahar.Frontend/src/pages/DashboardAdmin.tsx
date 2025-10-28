import {
  Card as AdminCard,
  CardContent as AdminCardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import AdminOrders from "./AdminOrders";
import AdminDrivers from "./AdminDrivers";
import AdminUsers from "./AdminUsers";
import AdminProducts from "./AdminProducts";
import AdminItems from "./AdminItems";
import AdminServiceCategories from "./AdminServiceCategories";
import AdminTickets from "./AdminTickets";

export default function DashboardAdmin() {
  const [tab, setTab] = useState<
    | "overview"
    | "orders"
    | "drivers"
    | "users"
    | "products"
    | "items"
    | "service-categories"
    | "tickets"
  >("overview");
  const [stats, setStats] = useState({
    pendingOrders: 0,
    todayIncome: 0,
    activeDrivers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch("/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-extrabold">داشبورد ادمین</h2>
        <div>
          <Button asChild>
            <Link to="/admin/settings">تنظیمات</Link>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Button
          variant={tab === "overview" ? undefined : "ghost"}
          onClick={() => setTab("overview")}
        >
          ��مای کلی
        </Button>
        <Button
          variant={tab === "orders" ? undefined : "ghost"}
          onClick={() => setTab("orders")}
        >
          سفارش‌ها
        </Button>
        <Button
          variant={tab === "drivers" ? undefined : "ghost"}
          onClick={() => setTab("drivers")}
        >
          رانندگان
        </Button>
        <Button
          variant={tab === "users" ? undefined : "ghost"}
          onClick={() => setTab("users")}
        >
          کاربران
        </Button>
        <Button
          variant={tab === "products" ? undefined : "ghost"}
          onClick={() => setTab("products")}
        >
          محصولات
        </Button>
        <Button
          variant={tab === "items" ? undefined : "ghost"}
          onClick={() => setTab("items")}
        >
          عوامل قیمت‌گذاری
        </Button>
        <Button
          variant={tab === "service-categories" ? undefined : "ghost"}
          onClick={() => setTab("service-categories")}
        >
          دسته‌بندی خدمات
        </Button>
        <Button
          variant={tab === "tickets" ? undefined : "ghost"}
          onClick={() => setTab("tickets")}
        >
          پشتیبانی
        </Button>
        <div className="ms-auto">
          <Button asChild>
            <Link to="/admin/settings">تنظیمات</Link>
          </Button>
        </div>
      </div>

      {tab === "overview" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminCard>
            <AdminCardContent>
              <div className="text-sm text-foreground/70">
                سفارش‌های در انتظار
              </div>
              <div className="text-2xl font-bold mt-2">
                {stats.pendingOrders ?? 0}
              </div>
            </AdminCardContent>
          </AdminCard>
          <AdminCard>
            <AdminCardContent>
              <div className="text-sm text-foreground/70">درآمد امروز</div>
              <div className="text-2xl font-bold mt-2">
                {(stats.todayIncome ?? 0).toLocaleString()} تومان
              </div>
            </AdminCardContent>
          </AdminCard>
          <AdminCard>
            <AdminCardContent>
              <div className="text-sm text-foreground/70">رانندگان فعال</div>
              <div className="text-2xl font-bold mt-2">
                {stats.activeDrivers ?? 0}
              </div>
            </AdminCardContent>
          </AdminCard>
          <AdminCard>
            <AdminCardContent>
              <div className="text-sm text-foreground/70">
                تسویه‌های در انتظار
              </div>
              <div className="text-2xl font-bold mt-2">
                {stats.pendingSettlements ?? 0}
              </div>
            </AdminCardContent>
          </AdminCard>
        </div>
      )}

      {tab === "orders" && (
        <div className="mt-4">
          <AdminOrders />
        </div>
      )}

      {tab === "drivers" && (
        <div className="mt-4">
          <AdminDrivers />
        </div>
      )}

      {tab === "users" && (
        <div className="mt-4">
          <AdminUsers />
        </div>
      )}

      {tab === "products" && (
        <div className="mt-4">
          <AdminProducts />
        </div>
      )}

      {tab === "items" && (
        <div className="mt-4">
          <AdminItems />
        </div>
      )}

      {tab === "service-categories" && (
        <div className="mt-4">
          <AdminServiceCategories />
        </div>
      )}

      {tab === "tickets" && (
        <div className="mt-4">
          <AdminTickets />
        </div>
      )}
    </div>
  );
}
