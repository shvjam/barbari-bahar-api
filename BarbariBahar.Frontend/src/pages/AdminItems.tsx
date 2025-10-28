import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useToast } from "../hooks/use-toast";
import { Checkbox } from "../components/ui/checkbox";

type PricingFactor = {
  id: number;
  name: string;
  price: number;
  unit: string;
  serviceCategoryId: number;
  isActive: boolean;
};

function apiFetch(path: string, opts: RequestInit = {}) {
  const token = localStorage.getItem("authToken");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return fetch(path, { ...opts, headers });
}

export default function AdminItems() {
  const [factors, setFactors] = useState<PricingFactor[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingFactor, setEditingFactor] = useState<PricingFactor | null>(null);
  const { toast } = useToast();

  const loadFactors = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/admin/PricingFactors");
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setFactors(data || []);
    } catch (err) {
      console.error(err);
      toast({ title: "خطا در بارگیری عوامل قیمت‌گذاری", description: String(err) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFactors();
  }, []);

  const handleSave = async (factor: PricingFactor) => {
    try {
      const method = factor.id ? "PUT" : "POST";
      const url = factor.id
        ? `/api/admin/PricingFactors/${factor.id}`
        : "/api/admin/PricingFactors";

      const res = await apiFetch(url, {
        method,
        body: JSON.stringify(factor),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Error ${res.status}: ${txt}`);
      }

      toast({ title: "عامل قیمت‌گذاری ذخیره شد" });
      setEditingFactor(null);
      loadFactors();
    } catch (err) {
      console.error(err);
      toast({ title: "خطا در ذخیره‌سازی", description: String(err) });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("آیا از حذف این مورد اطمینان دارید؟")) return;
    try {
      const res = await apiFetch(`/api/admin/PricingFactors/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      toast({ title: "عامل قیمت‌گذاری حذف شد" });
      loadFactors();
    } catch (err) {
      console.error(err);
      toast({ title: "خطا در حذف", description: String(err) });
    }
  };

  const startNew = () => {
    setEditingFactor({
      id: 0,
      name: "",
      price: 0,
      unit: "",
      serviceCategoryId: 1, // Default or fetch from API
      isActive: true,
    });
  };

  if (editingFactor) {
    return (
      <Card>
        <CardContent>
          <h3 className="text-lg font-bold mb-4">
            {editingFactor.id ? "ویرایش" : "ایجاد"} عامل قیمت‌گذاری
          </h3>
          <div className="grid gap-4">
            <Input
              placeholder="نام"
              value={editingFactor.name}
              onChange={(e) =>
                setEditingFactor({ ...editingFactor, name: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="قیمت"
              value={editingFactor.price}
              onChange={(e) =>
                setEditingFactor({ ...editingFactor, price: Number(e.target.value) })
              }
            />
            <Input
              placeholder="واحد (مثلا: عدد، متر)"
              value={editingFactor.unit}
              onChange={(e) =>
                setEditingFactor({ ...editingFactor, unit: e.target.value })
              }
            />
            {/* You might want a dropdown for serviceCategoryId */}
            <Input
              type="number"
              placeholder="شناسه دسته‌بندی خدمات"
              value={editingFactor.serviceCategoryId}
              onChange={(e) =>
                setEditingFactor({ ...editingFactor, serviceCategoryId: Number(e.target.value) })
              }
            />
            <div className="flex items-center gap-2">
               <Checkbox
                checked={editingFactor.isActive}
                onCheckedChange={(checked) =>
                  setEditingFactor({ ...editingFactor, isActive: !!checked })
                }
              />
              <label>فعال</label>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={() => handleSave(editingFactor)}>ذخیره</Button>
            <Button variant="outline" onClick={() => setEditingFactor(null)}>
              لغو
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">عوامل قیمت‌گذاری</h3>
        <Button onClick={startNew}>ایجاد مورد جدید</Button>
      </div>
      <Card>
        <CardContent>
          {loading ? (
            <div className="py-6 text-center">در حال بارگیری...</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="pb-2 text-right">نام</th>
                  <th className="pb-2 text-right">قیمت</th>
                  <th className="pb-2 text-right">واحد</th>
                  <th className="pb-2 text-right">فعال</th>
                  <th className="pb-2 text-right">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {factors.map((factor) => (
                  <tr key={factor.id} className="border-t">
                    <td className="py-2">{factor.name}</td>
                    <td className="py-2">{factor.price.toLocaleString()}</td>
                    <td className="py-2">{factor.unit}</td>
                    <td className="py-2">{factor.isActive ? "بله" : "خیر"}</td>
                    <td className="py-2 flex gap-2">
                      <Button size="sm" onClick={() => setEditingFactor(factor)}>
                        ویرایش
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(factor.id)}
                      >
                        حذف
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
