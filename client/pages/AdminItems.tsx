import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type Item = {
  id: string;
  productId?: string | null;
  name: string;
  quantity?: number;
  price?: number;
};

type Product = { id: string; title: string };

function apiFetch(path: string, opts: RequestInit = {}) {
  const token = localStorage.getItem("authToken");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return fetch(path, { ...opts, headers });
}

export default function AdminItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [productId, setProductId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const [resItems, resProds] = await Promise.all([
        apiFetch(`/api/admin/items`),
        apiFetch(`/api/admin/products`),
      ]);
      if (!resItems.ok) throw new Error(`Error ${resItems.status}`);
      if (!resProds.ok) throw new Error(`Error ${resProds.status}`);
      const ct1 = resItems.headers.get("content-type") || "";
      const ct2 = resProds.headers.get("content-type") || "";
      if (
        !ct1.includes("application/json") ||
        !ct2.includes("application/json")
      )
        throw new Error("Expected JSON responses");
      const dataItems = await resItems.json();
      const dataProds = await resProds.json();
      setItems(dataItems.items || dataItems);
      setProducts(
        (dataProds.products || dataProds).map((p: any) => ({
          id: p.id,
          title: p.title,
        })),
      );
    } catch (err) {
      console.error(err);
      toast({ title: "خطا در بارگیری آیتم‌ها", description: String(err) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const addItem = async () => {
    if (!name || name.trim() === "")
      return toast({ title: "نام آیتم را وارد کنید" });
    setSubmitting(true);
    try {
      const res = await apiFetch(`/api/admin/items`, {
        method: "POST",
        body: JSON.stringify({
          name,
          productId,
          quantity: Number(quantity) || 0,
          price: Number(price) || 0,
        }),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Error ${res.status}: ${txt.substring(0, 200)}`);
      }
      toast({ title: "آیتم افزوده شد" });
      setName("");
      setProductId(null);
      setQuantity("");
      setPrice("");
      await load();
    } catch (err) {
      console.error(err);
      toast({ title: "خطا هنگام افزودن آیتم", description: String(err) });
    } finally {
      setSubmitting(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("آیا مطمئن هستید؟")) return;
    try {
      const res = await apiFetch(`/api/admin/items/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Error ${res.status}: ${txt.substring(0, 200)}`);
      }
      toast({ title: "آیتم حذف شد" });
      await load();
    } catch (err) {
      console.error(err);
      toast({ title: "خطا هنگام حذف آیتم", description: String(err) });
    }
  };

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState("");
  const [editPrice, setEditPrice] = useState("");

  const startEdit = (it: Item) => {
    setEditingId(it.id);
    setEditName(it.name);
    setEditProductId(it.productId || null);
    setEditQuantity(String(it.quantity || 0));
    setEditPrice(String(it.price || 0));
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      const res = await apiFetch(`/api/admin/items/${editingId}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: editName,
          productId: editProductId,
          quantity: Number(editQuantity) || 0,
          price: Number(editPrice) || 0,
        }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      toast({ title: "آیتم بروز شد" });
      setEditingId(null);
      await load();
    } catch (err) {
      console.error(err);
      toast({ title: "خطا هنگام ذخیره آیتم", description: String(err) });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">آیتم‌ها</h3>
        <div className="text-sm text-foreground/60">
          مدیریت آیتم‌ها و موجودی
        </div>
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
                      <th className="pb-2">محصول</th>
                      <th className="pb-2">تعداد</th>
                      <th className="pb-2">قیمت</th>
                      <th className="pb-2">عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-6 text-center text-foreground/60"
                        >
                          در حال بارگذاری...
                        </td>
                      </tr>
                    ) : items.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-6 text-center text-foreground/60"
                        >
                          آیتمی یافت نشد
                        </td>
                      </tr>
                    ) : (
                      items.map((it) => (
                        <tr key={it.id} className="border-t">
                          <td className="py-2">{it.id}</td>
                          <td className="py-2">
                            {editingId === it.id ? (
                              <Input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                              />
                            ) : (
                              it.name
                            )}
                          </td>
                          <td className="py-2">
                            {products.find((p) => p.id === it.productId)
                              ?.title || "—"}
                          </td>
                          <td className="py-2">{it.quantity ?? 0}</td>
                          <td className="py-2">
                            {it.price
                              ? `${it.price.toLocaleString()} تومان`
                              : "—"}
                          </td>
                          <td className="py-2 flex gap-2">
                            {editingId === it.id ? (
                              <>
                                <Button size="sm" onClick={saveEdit}>
                                  ذخیره
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setEditingId(null)}
                                >
                                  لغو
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button size="sm" onClick={() => startEdit(it)}>
                                  ویرایش
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => deleteItem(it.id)}
                                >
                                  حذف
                                </Button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <div className="font-bold mb-2">افزودن آیتم</div>
              <div className="grid gap-2">
                <Input
                  placeholder="نام آیتم"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <select
                  className="px-3 py-2 border rounded"
                  value={productId || ""}
                  onChange={(e) => setProductId(e.target.value || null)}
                >
                  <option value="">انتخاب محصول (اختیاری)</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
                <Input
                  placeholder="تعداد"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <Input
                  placeholder="قیمت"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <Button onClick={addItem} disabled={submitting}>
                  {submitting ? "در حال ارسال..." : "افزودن"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
