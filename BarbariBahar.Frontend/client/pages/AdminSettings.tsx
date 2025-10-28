import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

export default function AdminSettings() {
  const [siteName, setSiteName] = useState("Builder Delivery");
  const [adminEmail, setAdminEmail] = useState("admin@example.com");
  const [maintenance, setMaintenance] = useState(false);
  const { toast } = useToast();

  const save = () => {
    // In real app this would call backend API. Here we show a toast and keep state.
    toast({
      title: "تنظیمات ذخیره شد",
      description: "تغییرات شما با موفقیت ذخیره شد",
    });
  };

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-4">تنظیمات ادمین</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="grid gap-3">
              <div>
                <Label htmlFor="siteName">نام سایت</Label>
                <Input id="siteName" value={siteName} onChange={(e) => setSiteName(e.target.value)} className="mt-2" />
              </div>

              <div>
                <Label htmlFor="adminEmail">ایمیل ادمین</Label>
                <Input id="adminEmail" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} className="mt-2" />
              </div>

              <div className="flex items-center gap-3">
                <Checkbox checked={maintenance} onCheckedChange={(v) => setMaintenance(Boolean(v))} id="maintenance" />
                <Label htmlFor="maintenance">حالت نگهداری (Maintenance)</Label>
              </div>

              <div className="pt-3">
                <Button onClick={save}>ذخیره تنظیمات</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
