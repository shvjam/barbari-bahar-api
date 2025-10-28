import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useToast } from "../hooks/use-toast";

type Driver = {
  id: number;
  firstName: string;
  lastName: string;
  nationalCode: string;
  status?: "PendingApproval" | "Active" | "Inactive" | "Suspended";
};

function apiFetch(path: string, opts: RequestInit = {}) {
  const token = localStorage.getItem("authToken");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return fetch(path, { ...opts, headers });
}

export default function AdminDrivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/api/admin/Drivers`);
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Error ${res.status}: ${txt.substring(0, 200)}`);
      }
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        const data = await res.json();
        setDrivers(data || []);
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

  const updateStatus = async (
    id: number,
    status: "PendingApproval" | "Active" | "Inactive" | "Suspended",
  ) => {
    try {
      const res = await apiFetch(`/api/admin/Drivers/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Error ${res.status}: ${txt.substring(0, 200)}`);
      }
      toast({ title: "وضعیت راننده بروزرسانی شد" });
      load();
    } catch (err) {
      console.error(err);
      toast({
        title: "خطا هنگام تغییر وضعیت راننده",
        description: String(err),
      });
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
                      <th className="pb-2">کد ملی</th>
                      <th className="pb-2">وضعیت</th>
                      <th className="pb-2">عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-6 text-center text-foreground/60"
                        >
                          در حال بارگذاری...
                        </td>
                      </tr>
                    ) : drivers.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-6 text-center text-foreground/60"
                        >
                          راننده‌ای یافت نشد
                        </td>
                      </tr>
                    ) : (
                      drivers.map((d) => (
                        <tr key={d.id} className="border-t">
                          <td className="py-2">{d.id}</td>
                          <td className="py-2">
                            {d.firstName} {d.lastName}
                          </td>
                          <td className="py-2">{d.nationalCode || "—"}</td>
                          <td className="py-2">{d.status || "—"}</td>
                          <td className="py-2 flex gap-2">
                            <select
                              value={d.status}
                              onChange={(e) =>
                                updateStatus(
                                  d.id,
                                  e.target.value as
                                    | "PendingApproval"
                                    | "Active"
                                    | "Inactive"
                                    | "Suspended",
                                )
                              }
                            >
                              <option value="PendingApproval">
                                در انتظار تایید
                              </option>
                              <option value="Active">فعال</option>
                              <option value="Inactive">غیرفعال</option>
                              <option value="Suspended">معلق</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
