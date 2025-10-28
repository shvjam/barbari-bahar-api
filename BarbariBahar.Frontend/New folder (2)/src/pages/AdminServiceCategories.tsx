import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useToast } from "../hooks/use-toast";

type ServiceCategory = {
  id: number;
  name: string;
};

function apiFetch(path: string, opts: RequestInit = {}) {
  const token = localStorage.getItem("authToken");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return fetch(path, { ...opts, headers });
}

export default function AdminServiceCategories() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(
    null,
  );
  const { toast } = useToast();

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/admin/ServiceCategories");
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setCategories(data || []);
    } catch (err) {
      console.error(err);
      toast({
        title: "خطا در بارگیری دسته‌بندی‌ها",
        description: String(err),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSave = async (category: ServiceCategory) => {
    try {
      const method = category.id ? "PUT" : "POST";
      const url = category.id
        ? `/api/admin/ServiceCategories/${category.id}`
        : "/api/admin/ServiceCategories";

      const res = await apiFetch(url, {
        method,
        body: JSON.stringify({ name: category.name }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Error ${res.status}: ${txt}`);
      }

      toast({ title: "دسته‌بندی ذخیره شد" });
      setEditingCategory(null);
      loadCategories();
    } catch (err) {
      console.error(err);
      toast({ title: "خطا در ذخیره‌سازی", description: String(err) });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("آیا از حذف این مورد اطمینان دارید؟")) return;
    try {
      const res = await apiFetch(`/api/admin/ServiceCategories/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      toast({ title: "دسته‌بندی حذف شد" });
      loadCategories();
    } catch (err) {
      console.error(err);
      toast({ title: "خطا در حذف", description: String(err) });
    }
  };

  const startNew = () => {
    setEditingCategory({ id: 0, name: "" });
  };

  if (editingCategory) {
    return (
      <Card>
        <CardContent>
          <h3 className="text-lg font-bold mb-4">
            {editingCategory.id ? "ویرایش" : "ایجاد"} دسته‌بندی خدمات
          </h3>
          <Input
            placeholder="نام دسته‌بندی"
            value={editingCategory.name}
            onChange={(e) =>
              setEditingCategory({ ...editingCategory, name: e.target.value })
            }
          />
          <div className="flex gap-2 mt-4">
            <Button onClick={() => handleSave(editingCategory)}>ذخیره</Button>
            <Button variant="outline" onClick={() => setEditingCategory(null)}>
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
        <h3 className="text-lg font-bold">دسته‌بندی خدمات</h3>
        <Button onClick={startNew}>ایجاد دسته‌بندی جدید</Button>
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
                  <th className="pb-2 text-right">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} className="border-t">
                    <td className="py-2">{cat.name}</td>
                    <td className="py-2 flex gap-2">
                      <Button size="sm" onClick={() => setEditingCategory(cat)}>
                        ویرایش
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(cat.id)}
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
