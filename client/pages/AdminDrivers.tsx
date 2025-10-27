import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type Driver = {
  id: string;
  name: string;
  phone?: string;
  active?: boolean;
};

function apiFetch(path: string, opts: RequestInit = {}) {
  const token = localStorage.getItem("authToken");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return fetch(path, { ...opts, headers });
}

export default function AdminDrivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/api/admin/drivers`);
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Error ${res.status}: ${txt.substring(0, 200)}`);
      }
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        const data = await res.json().catch(async () => {
          const txt = await res.text().catch(() => "");
          throw new Error(`Invalid JSON response: ${txt.substring(0, 200)}`);
        });
        setDrivers(data.drivers || data);
      } else {
        const txt = await res.text().catch(() => "");
        throw new Error(`Expected JSON but received: ${txt.substring(0, 200)}`);
      }
    } catch (err) {
      console.error(err);
      toast({ title: "خطا در بارگیری رانندگان", description: String(err) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const addDriver = async () => {
    if (!name || name.trim() === "") return toast({ title: "نام راننده را وارد کنید" });
    setSubmitting(true);
    try {
      const res = await apiFetch(`/api/admin/drivers`, {
        method: "POST",
        body: JSON.stringify({ name, phone }),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Error ${res.status}: ${txt.substring(0,200)}`);
      }
      toast({ title: "راننده اضافه شد" });
      setName("");
      setPhone("");
      await load();
    } catch (err) {
      console.error(err);
      toast({ title: "خطا هنگام افزودن راننده", description: String(err) });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (id: string, active: boolean) => {
    try {
      const res = await apiFetch(`/api/admin/drivers/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ active }),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Error ${res.status}: ${txt.substring(0,200)}`);
      }
      toast({ title: "وضعیت راننده بروزرسانی شد" });
      load();
    } catch (err) {
      console.error(err);
      toast({ title: "خطا هنگام تغییر وضعیت راننده", description: String(err) });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">رانندگان</h3>
        <div className="text-sm text-foreground/60">مدیریت رانندگان فعال</div>
      </div>

      <Card>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-foreground/70 text-left">
                      <th className="pb-2">#</th>
                      <th className="pb-2">نام</th>
                      <th className="pb-2">شماره</th>
                      <th className="pb-2">فعال</th>
                      <th className="pb-2">عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-foreground/60">
                          در حال بارگذاری...
                        </td>
                      </tr>
                    ) : drivers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-foreground/60">
                          راننده‌ای یافت نشد
                        </td>
                      </tr>
                    ) : (
                      drivers.map((d) => (
                        <tr key={d.id} className="border-t">
                          <td className="py-2">{d.id}</td>
                          <td className="py-2">{d.name}</td>
                          <td className="py-2">{d.phone || "—"}</td>
                          <td className="py-2">{d.active ? "بله" : "خیر"}</td>
                          <td className="py-2 flex gap-2">
                            <Button size="sm" onClick={() => toggleActive(d.id, !d.active)}>
                              {d.active ? "غیرفعال" : "فعال"}
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <div className="font-bold mb-2">افزودن راننده</div>
              <div className="grid gap-2">
                <Input placeholder="نام" value={name} onChange={(e) => setName(e.target.value)} />
                <Input placeholder="شماره" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <Button onClick={addDriver}>افزودن</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
