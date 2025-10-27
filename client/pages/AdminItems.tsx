import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type Item = {
  id: string;
  productId?: string | null;
  name: string;
  amount?: number;
  unit?: string;
  price?: number;
  categoryId?: string | null;
};

type Product = { id: string; title: string };
type Category = { id: string; title: string };

function apiFetch(path: string, opts: RequestInit = {}) {
  const token = localStorage.getItem("authToken");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return fetch(path, { ...opts, headers });
}

export default function AdminItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [productId, setProductId] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("عدد");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [catTitle, setCatTitle] = useState("");
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const [resItems, resProds, resCats] = await Promise.all([
        apiFetch(`/api/admin/items`),
        apiFetch(`/api/admin/products`),
        apiFetch(`/api/admin/item-categories`),
      ]);
      if (!resItems.ok) throw new Error(`Error ${resItems.status}`);
      if (!resProds.ok) throw new Error(`Error ${resProds.status}`);
      if (!resCats.ok) throw new Error(`Error ${resCats.status}`);
      const dataItems = await resItems.json();
      const dataProds = await resProds.json();
      const dataCats = await resCats.json();
      setItems(dataItems.items || dataItems);
      setProducts((dataProds.products || dataProds).map((p: any) => ({ id: p.id, title: p.title })));
      setCategories((dataCats.categories || dataCats).map((c: any) => ({ id: c.id, title: c.title })));
    } catch (err) {
      console.error(err);
      toast({ title: "خطا در بارگیری آیتم‌ها", description: String(err) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const addCategory = async () => {
    if (!catTitle.trim()) return toast({ title: "عنوان دسته را وارد کنید" });
    try {
      const res = await apiFetch(`/api/admin/item-categories`, { method: "POST", body: JSON.stringify({ title: catTitle }) });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      toast({ title: "دسته اضافه شد" });
      setCatTitle("");
      await load();
    } catch (err) { console.error(err); toast({ title: "خطا هنگام افزودن دسته", description: String(err) }); }
  };

  const addItem = async () => {
    if (!name || name.trim() === "") return toast({ title: "نام آیتم را وارد کنید" });
    setSubmitting(true);
    try {
      const res = await apiFetch(`/api/admin/items`, { method: "POST", body: JSON.stringify({ name, productId, amount: Number(amount) || 0, unit: unit || "عدد", price: Number(price) || 0, categoryId }) });
      if (!res.ok) { const txt = await res.text().catch(() => ""); throw new Error(`Error ${res.status}: ${txt.substring(0,200)}`); }
      toast({ title: "آیتم افزوده شد" });
      setName(""); setProductId(null); setAmount(""); setUnit("عدد"); setPrice(""); setCategoryId(null); await load();
    } catch (err) { console.error(err); toast({ title: "خطا هنگام افزودن آیتم", description: String(err) }); } finally { setSubmitting(false); }
  };

  const deleteItem = async (id: string) => { if (!confirm("آیا مطمئن هستید؟")) return; try { const res = await apiFetch(`/api/admin/items/${id}`, { method: "DELETE" }); if (!res.ok) { const txt = await res.text().catch(() => ""); throw new Error(`Error ${res.status}: ${txt}`); } toast({ title: "آیتم حذف شد" }); await load(); } catch (err) { console.error(err); toast({ title: "خطا هنگام حذف آیتم", description: String(err) }); } };

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editUnit, setEditUnit] = useState("عدد");
  const [editPrice, setEditPrice] = useState("");
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);

  const startEdit = (it: Item) => {
    setEditingId(it.id);
    setEditName(it.name);
    setEditProductId(it.productId || null);
    setEditAmount(String(it.amount || 0));
    setEditUnit(it.unit || "عدد");
    setEditPrice(String(it.price || 0));
    setEditCategoryId(it.categoryId || null);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      const res = await apiFetch(`/api/admin/items/${editingId}`, { method: "PATCH", body: JSON.stringify({ name: editName, productId: editProductId, amount: Number(editAmount) || 0, unit: editUnit, price: Number(editPrice) || 0, categoryId: editCategoryId }) });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      toast({ title: "آیتم بروز شد" });
      setEditingId(null);
      await load();
    } catch (err) { console.error(err); toast({ title: "خطا هنگام ذخیره آیتم", description: String(err) }); }
  };

  const unitOptions = ["عدد", "بسته", "متر", "کیلوگرم", "لیتر", "ساعت", "دست"];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">آیتم‌ها</h3>
        <div className="text-sm text-foreground/60">مدیریت آیتم‌ها و موجودی</div>
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
                      <th className="pb-2">مقدار</th>
                      <th className="pb-2">قیمت</th>
                      <th className="pb-2">دسته</th>
                      <th className="pb-2">عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={7} className="py-6 text-center text-foreground/60">در حال بارگذاری...</td></tr>
                    ) : items.length === 0 ? (
                      <tr><td colSpan={7} className="py-6 text-center text-foreground/60">آیتمی یافت نشد</td></tr>
                    ) : (
                      items.map((it) => (
                        <tr key={it.id} className="border-t">
                          <td className="py-2">{it.id}</td>
                          <td className="py-2">{editingId === it.id ? (<Input value={editName} onChange={(e) => setEditName(e.target.value)} />) : it.name}</td>
                          <td className="py-2">{products.find((p) => p.id === it.productId)?.title || "—"}</td>
                          <td className="py-2">{it.amount ?? 0} {it.unit || ""}</td>
                          <td className="py-2">{it.price ? `${it.price.toLocaleString()} تومان` : "—"}</td>
                          <td className="py-2">{categories.find((c) => c.id === it.categoryId)?.title || "—"}</td>
                          <td className="py-2 flex gap-2">{editingId === it.id ? (<>
                            <Button size="sm" onClick={saveEdit}>ذخیره</Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>لغو</Button>
                          </>) : (<>
                            <Button size="sm" onClick={() => startEdit(it)}>ویرایش</Button>
                            <Button size="sm" variant="destructive" onClick={() => deleteItem(it.id)}>حذف</Button>
                          </>)}</td>
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
                <Input placeholder="نام آیتم" value={name} onChange={(e) => setName(e.target.value)} />
                <select className="px-3 py-2 border rounded" value={productId || ""} onChange={(e) => setProductId(e.target.value || null)}>
                  <option value="">انتخاب محصول (اختیاری)</option>
                  {products.map((p) => (<option key={p.id} value={p.id}>{p.title}</option>))}
                </select>
                <div className="flex gap-2">
                  <Input placeholder="مقدار" value={amount} onChange={(e) => setAmount(e.target.value)} />
                  <select className="px-3 py-2 border rounded" value={unit} onChange={(e) => setUnit(e.target.value)}>
                    {unitOptions.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <Input placeholder="قیمت" value={price} onChange={(e) => setPrice(e.target.value)} />
                <select className="px-3 py-2 border rounded" value={categoryId || ""} onChange={(e) => setCategoryId(e.target.value || null)}>
                  <option value="">انتخاب دسته (اختیاری)</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
                <Button onClick={addItem} disabled={submitting}>{submitting ? "در حال ارسال..." : "افزودن"}</Button>

                <hr className="my-2" />
                <div className="font-bold">دسته‌بندی آیتم‌ها</div>
                <div className="flex gap-2">
                  <Input placeholder="عنوان دسته" value={catTitle} onChange={(e) => setCatTitle(e.target.value)} />
                  <Button onClick={addCategory}>افزودن دسته</Button>
                </div>
                <div className="mt-2 text-sm text-foreground/60">{categories.map(c => (<div key={c.id} className="py-1">{c.title}</div>))}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
