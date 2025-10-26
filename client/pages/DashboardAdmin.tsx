import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import AdminOrders from "./AdminOrders";
import AdminDrivers from "./AdminDrivers";
import AdminUsers from "./AdminUsers";

export default function DashboardAdmin() {
  const [tab, setTab] = useState<"overview" | "orders" | "drivers" | "users">("overview");
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
        <Button variant={tab === "overview" ? undefined : "ghost"} onClick={() => setTab("overview")}>نمای کلی</Button>
        <Button variant={tab === "orders" ? undefined : "ghost"} onClick={() => setTab("orders")}>سفارش‌ها</Button>
        <Button variant={tab === "drivers" ? undefined : "ghost"} onClick={() => setTab("drivers")}>رانندگان</Button>
        <Button variant={tab === "users" ? undefined : "ghost"} onClick={() => setTab("users")}>کاربران</Button>
        <div className="ms-auto">
          <Button asChild>
            <Link to="/admin/settings">تنظیمات</Link>
          </Button>
        </div>
      </div>

      {tab === "overview" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent>
              <div className="text-sm text-foreground/70">سفارش‌های در انتظار</div>
              <div className="text-2xl font-bold mt-2">3</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="text-sm text-foreground/70">درآمد امروز</div>
              <div className="text-2xl font-bold mt-2">45,000,000 تومان</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="text-sm text-foreground/70">رانندگان فعال</div>
              <div className="text-2xl font-bold mt-2">12</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="text-sm text-foreground/70">تسویه‌های در انتظار</div>
              <div className="text-2xl font-bold mt-2">2</div>
            </CardContent>
          </Card>
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
    </div>
  );
}
