import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function DashboardCustomer() {
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
        <Card>
          <CardContent>
            <div className="text-sm text-foreground/70">سفارش‌های فعال</div>
            <div className="text-2xl font-bold mt-2">2</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="text-sm text-foreground/70">سفارش‌های تکمیل‌شده</div>
            <div className="text-2xl font-bold mt-2">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="text-sm text-foreground/70">موجودی کیف پول</div>
            <div className="text-2xl font-bold mt-2">0 تومان</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardContent>
            <div className="font-bold">سابقه سفارش‌ها</div>
            <div className="mt-3 text-sm text-foreground/70">این بخش لیست سفارش‌های مشتری را نمایش می‌دهد (فعلاً نمونه).</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
