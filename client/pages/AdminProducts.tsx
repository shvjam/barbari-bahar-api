import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type Product = {
  id: string;
  title: string;
  sku?: string | null;
  price?: number;
  active?: boolean;
  description?: string;
  categoryId?: string | null;
  image?: string | null; // data URL or remote URL
};

type Category = { id: string; title: string };

function apiFetch(path: string, opts: RequestInit = {}) {
  const token = localStorage.getItem("authToken");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return fetch(path, { ...opts, headers });
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [catTitle, setCatTitle] = useState("");
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const [resP, resC] = await Promise.all([
        apiFetch(`/api/admin/products`),
        apiFetch(`/api/admin/product-categories`),
      ]);
      if (!resP.ok) throw new Error(`Error ${resP.status}`);
      if (!resC.ok) throw new Error(`Error ${resC.status}`);
      const ct1 = resP.headers.get("content-type") || "";
      const ct2 = resC.headers.get("content-type") || "";
      if (
        !ct1.includes("application/json") ||
        !ct2.includes("application/json")
      )
        throw new Error("Expected JSON responses");
      const dataP = await resP.json();
      const dataC = await resC.json();
      setProducts(dataP.products || dataP);
      setCategories(
        (dataC.categories || dataC).map((c: any) => ({
          id: c.id,
          title: c.title,
        })),
      );
    } catch (err) {
      console.error(err);
      toast({ title: "خطا در بارگیری محصولات", description: String(err) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleImageChange = (f?: File) => {
    if (!f) {
      setImageFile(null);
      setImagePreview(null);
      return;
    }
    setImageFile(f);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(String(reader.result));
    reader.readAsDataURL(f);
  };

  const addCategory = async () => {
    if (!catTitle.trim()) return toast({ title: "عنوان دسته را وارد کنید" });
    try {
      const res = await apiFetch(`/api/admin/product-categories`, {
        method: "POST",
        body: JSON.stringify({ title: catTitle }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      toast({ title: "دسته اضافه شد" });
      setCatTitle("");
      await load();
    } catch (err) {
      console.error(err);
      toast({ title: "خطا هنگام افزودن دسته", description: String(err) });
    }
  };

  const addProduct = async () => {
    if (!title || title.trim() === "")
      return toast({ title: "عنوان را وارد کنید" });
    setSubmitting(true);
    try {
      let imageData: string | null = null;
      if (imageFile) {
        imageData = await new Promise<string | null>((res) => {
          const r = new FileReader();
          r.onload = () => res(String(r.result));
          r.onerror = () => res(null);
          r.readAsDataURL(imageFile as File);
        });
      }
      const res = await apiFetch(`/api/admin/products`, {
        method: "POST",
        body: JSON.stringify({
          title,
          sku: sku || null,
          price: Number(price) || 0,
          description,
          categoryId,
          image: imageData,
        }),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Error ${res.status}: ${txt.substring(0, 200)}`);
      }
      toast({ title: "محصول افزوده شد" });
      setTitle("");
      setSku("");
      setPrice("");
      setDescription("");
      setCategoryId(null);
      handleImageChange();
      await load();
    } catch (err) {
      console.error(err);
      toast({ title: "خطا هنگام افزودن محصول", description: String(err) });
    } finally {
      setSubmitting(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("آیا مطمئن هستید؟")) return;
    try {
      const res = await apiFetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Error ${res.status}: ${txt}`);
      }
      toast({ title: "محصول حذف شد" });
      await load();
    } catch (err) {
      console.error(err);
      toast({ title: "خطا هنگام حذف محصول", description: String(err) });
    }
  };

  const toggleActive = async (id: string, active: boolean) => {
    try {
      const res = await apiFetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ active }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      toast({ title: "وضعیت محصول بروزرسانی شد" });
      await load();
    } catch (err) {
      console.error(err);
      toast({ title: "خطا هنگام تغییر وضعیت", description: String(err) });
    }
  };

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editSku, setEditSku] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setEditTitle(p.title);
    setEditPrice(String(p.price || 0));
    setEditSku(p.sku || "");
    setEditDesc(p.description || "");
    setEditCategoryId(p.categoryId || null);
    setEditImagePreview(p.image || null);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      const res = await apiFetch(`/api/admin/products/${editingId}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: editTitle,
          sku: editSku || null,
          price: Number(editPrice) || 0,
          description: editDesc,
          categoryId: editCategoryId,
          image: editImagePreview || null,
        }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      toast({ title: "محصول بروز شد" });
      setEditingId(null);
      await load();
    } catch (err) {
      console.error(err);
      toast({ title: "خطا هنگام ذخیره محصول", description: String(err) });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">محصولات</h3>
        <div className="text-sm text-foreground/60">مدیریت محصولات و خدمات</div>
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
                      <th className="pb-2">تصویر</th>
                      <th className="pb-2">عنوان</th>
                      <th className="pb-2">قیمت</th>
                      <th className="pb-2">دسته</th>
                      <th className="pb-2">فعال</th>
                      <th className="pb-2">عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-6 text-center text-foreground/60"
                        >
                          در حال بارگذاری...
                        </td>
                      </tr>
                    ) : products.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-6 text-center text-foreground/60"
                        >
                          محصولی یافت نشد
                        </td>
                      </tr>
                    ) : (
                      products.map((p) => (
                        <tr key={p.id} className="border-t">
                          <td className="py-2">{p.id}</td>
                          <td className="py-2 w-24">
                            {p.image ? (
                              <img
                                src={p.image}
                                alt={p.title}
                                className="h-12 w-12 object-cover rounded"
                              />
                            ) : (
                              <div className="h-12 w-12 bg-muted rounded" />
                            )}
                          </td>
                          <td className="py-2">
                            {editingId === p.id ? (
                              <Input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                              />
                            ) : (
                              p.title
                            )}
                          </td>
                          <td className="py-2">
                            {editingId === p.id ? (
                              <Input
                                value={editPrice}
                                onChange={(e) => setEditPrice(e.target.value)}
                              />
                            ) : p.price ? (
                              `${p.price.toLocaleString()} تومان`
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="py-2">
                            {categories.find((c) => c.id === p.categoryId)
                              ?.title || "—"}
                          </td>
                          <td className="py-2">{p.active ? "بله" : "خیر"}</td>
                          <td className="py-2 flex gap-2">
                            {editingId === p.id ? (
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
                                <Button size="sm" onClick={() => startEdit(p)}>
                                  ویرایش
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => toggleActive(p.id, !p.active)}
                                >
                                  {p.active ? "غیرفعال" : "فعال"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => deleteProduct(p.id)}
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
              <div className="font-bold mb-2">افزودن محصول</div>
              <div className="grid gap-2">
                <Input
                  placeholder="عنوان"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Input
                  placeholder="SKU"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                />
                <Input
                  placeholder="قیمت"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <Input
                  placeholder="توضیحات"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <select
                  className="px-3 py-2 border rounded"
                  value={categoryId || ""}
                  onChange={(e) => setCategoryId(e.target.value || null)}
                >
                  <option value="">انتخاب دسته (اختیاری)</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
                <div>
                  <label className="block text-sm mb-1">تصویر محصول</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e.target.files?.[0])}
                  />
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="preview"
                      className="mt-2 h-20 w-full object-cover rounded"
                    />
                  ) : null}
                </div>
                <div className="pt-2">
                  <Button onClick={addProduct} disabled={submitting}>
                    {submitting ? "در حال ارسال..." : "افزودن"}
                  </Button>
                </div>

                <hr className="my-2" />
                <div className="font-bold">دسته‌بندی محصولات</div>
                <div className="flex gap-2">
                  <Input
                    placeholder="عنوان دسته"
                    value={catTitle}
                    onChange={(e) => setCatTitle(e.target.value)}
                  />
                  <Button onClick={addCategory}>افزودن دسته</Button>
                </div>
                <div className="mt-2 text-sm text-foreground/60">
                  {categories.map((c) => (
                    <div key={c.id} className="py-1">
                      {c.title}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
