import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useToast } from "../hooks/use-toast";

type User = {
  id: string;
  name: string;
  email?: string;
  active?: boolean;
};

function apiFetch(path: string, opts: RequestInit = {}) {
  const token = localStorage.getItem("authToken");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return fetch(path, { ...opts, headers });
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const url = query ? `/api/admin/users?search=${encodeURIComponent(query)}` : "/api/admin/users";
      const res = await apiFetch(url);
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Error ${res.status}: ${txt.substring(0,200)}`);
      }
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        const data = await res.json().catch(async () => {
          const txt = await res.text().catch(() => "");
          throw new Error(`Invalid JSON response: ${txt.substring(0,200)}`);
        });
        setUsers(data.users || data);
      } else {
        const txt = await res.text().catch(() => "");
        throw new Error(`Expected JSON but received: ${txt.substring(0,200)}`);
      }
    } catch (err) {
      console.error(err);
      toast({ title: "خطا در بارگیری کاربران", description: String(err) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleActive = async (id: string, active: boolean) => {
    try {
      const res = await apiFetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ active }),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Error ${res.status}: ${txt.substring(0,200)}`);
      }
      toast({ title: "وضعیت کاربر بروزرسانی شد" });
      load();
    } catch (err) {
      console.error(err);
      toast({ title: "خطا هنگام تغییر وضعیت کاربر", description: String(err) });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">کاربران</h3>
        <div className="flex items-center gap-2">
          <Input placeholder="جستجو" value={query} onChange={(e) => setQuery(e.target.value)} />
          <Button onClick={load}>جستجو</Button>
        </div>
      </div>

      <Card>
        <CardContent>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-foreground/70 text-left">
                  <th className="pb-2">#</th>
                  <th className="pb-2">نام</th>
                  <th className="pb-2">ایمیل</th>
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
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-foreground/60">
                      کاربری یافت نشد
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="border-t">
                      <td className="py-2">{u.id}</td>
                      <td className="py-2">{u.name}</td>
                      <td className="py-2">{u.email || "���"}</td>
                      <td className="py-2">{u.active ? "بله" : "خیر"}</td>
                      <td className="py-2 flex gap-2">
                        <Button size="sm" onClick={() => toggleActive(u.id, !u.active)}>
                          {u.active ? "غیرفعال" : "فعال"}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
