import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function DashboardDriver() {
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
            <div className="text-2xl font-bold mt-2">1</div>
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
            <div className="text-2xl font-bold mt-2">24</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardContent>
            <div className="font-bold">ماموریت‌های محول‌شده</div>
            <div className="mt-3 text-sm text-foreground/70">این بخش لیست مأموریت‌ها را نمایش می‌دهد (نمونه).</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
