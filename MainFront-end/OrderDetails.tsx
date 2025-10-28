import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

type Order = {
  id: string;
  customerName?: string;
  origin?: string;
  destination?: string;
  status?: string;
  price?: number;
  createdAt?: string;
};

export default function OrderDetails({
  id,
  open,
  onOpenChange,
}: {
  id: string | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    if (!open || !id) return;
    setLoading(true);
    (async () => {
      try {
        const res = await fetch(`/api/admin/orders/${id}`);
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`Error ${res.status}: ${txt.substring(0, 200)}`);
        }
        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("application/json")) {
          const txt = await res.text().catch(() => "");
          throw new Error(
            `Expected JSON but received: ${txt.substring(0, 200)}`,
          );
        }
        const data = await res.json();
        if (!mounted) return;
        setOrder(data);
      } catch (err) {
        console.error(err);
        toast({
          title: "خطا در بارگیری جزئیات سفارش",
          description: String(err),
        });
        onOpenChange(false);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogTitle className="text-lg font-semibold">
          جزئیات سفارش
        </DialogTitle>
        <Card>
          <CardContent>
            {loading ? (
              <div className="py-6 text-center text-foreground/60">
                در حال بارگذاری...
              </div>
            ) : order ? (
              <div className="grid gap-3">
                <div className="text-sm text-foreground/70">شماره</div>
                <div className="font-bold">{order.id}</div>

                <div className="text-sm text-foreground/70">مشتری</div>
                <div>{order.customerName || "—"}</div>

                <div className="text-sm text-foreground/70">مبدا</div>
                <div>{order.origin || "—"}</div>

                <div className="text-sm text-foreground/70">مقصد</div>
                <div>{order.destination || "—"}</div>

                <div className="text-sm text-foreground/70">قیمت</div>
                <div>
                  {order.price ? `${order.price.toLocaleString()} تومان` : "—"}
                </div>

                <div className="text-sm text-foreground/70">وضعیت</div>
                <div>{order.status || "—"}</div>

                <div className="pt-3 flex gap-2">
                  <Button onClick={() => onOpenChange(false)}>بستن</Button>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-foreground/60">
                سفارشی برای نمایش موجود نیست
              </div>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
