import React, { useCallback, useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Checkbox } from "../components/ui/checkbox";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import AddressPicker from "../components/AddressPicker";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/use-toast";

type PackagingType = "none" | "all" | "large" | "small";

const HEAVY_ITEMS = [
  { id: "fridge", title: "یخچال ساید/دوقلو/قد > 175cm", price: 750_000 },
  { id: "sofa", title: "مبل/کاناپه تختخواب‌شو یا سه‌نفره", price: 350_000 },
  { id: "dining", title: "میز ناهارخوری ۶ نفره به بالا", price: 300_000 },
  { id: "closet", title: "کمد/بوف��/کتابخانه قد > 185cm", price: 375_000 },
  { id: "treadmill", title: "تردمیل/دوچرخه/الپتیکال", price: 500_000 },
  { id: "glass", title: "شیشه ۴ میل به بالا و > ۱m", price: 280_000 },
  { id: "aquarium", title: "آکواریوم/صندلی ماساژ/…", price: 450_000 },
  { id: "piano", title: "پیانو", price: 750_000 },
  { id: "safe_light", title: "گاوصندوق ≤ 120kg", price: 400_000 },
  { id: "safe_heavy", title: "گاوصندوق 120–250kg", price: 400_000 },
];

const PACKING_SMALLS = [
  { id: "clothes", title: "لباس، کیف و کفش" },
  { id: "kitchen_small", title: "ظروف و لو��زم برقی کوچک آشپزخانه" },
  { id: "supplies", title: "مواد غذایی، شوینده و بهداشتی" },
  { id: "books", title: "کتا��" },
  { id: "other", title: "سایر" },
];

function Counter({
  value,
  onChange,
  min = 0,
  max = 99,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="inline-flex items-center rounded-md border bg-background">
      <button
        type="button"
        className="px-2 py-1 text-lg"
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label="کم کردن"
      >
        −
      </button>
      <span className="w-8 text-center text-sm">{value}</span>
      <button
        type="button"
        className="px-2 py-1 text-lg"
        onClick={() => onChange(Math.min(max, value + 1))}
        aria-label="زیاد کردن"
      >
        +
      </button>
    </div>
  );
}

export default function Order() {
  const [sp] = useSearchParams();
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Contact / submission fields
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [city, setCity] = useState("tehran");
  const [packNeeded, setPackNeeded] = useState<"yes" | "no" | "">("");
  const [packType, setPackType] = useState<PackagingType>("none");
  const [packSmalls, setPackSmalls] = useState<
    Record<string, { checked: boolean; qty?: number }>
  >({});
  const [packMen, setPackMen] = useState(0);
  const [packWomen, setPackWomen] = useState(0);
  const [packHours, setPackHours] = useState<number | null>(null);
  const [packMaterials, setPackMaterials] = useState<"yes" | "no" | "">("");

  const [originFloor, setOriginFloor] = useState(1);
  const [originElevator, setOriginElevator] = useState<"yes" | "no" | "">("");
  const [destFloor, setDestFloor] = useState(1);
  const [destElevator, setDestElevator] = useState<"yes" | "no" | "">("");

  const [heavy, setHeavy] = useState<Record<string, number>>({});
  const [walk, setWalk] = useState<0 | 20 | 35 | 40 | 50 | 65 | 200>(0);
  const [workers, setWorkers] = useState(4);

  // Addresses chosen via map/search
  const [originAddress, setOriginAddress] = useState<{
    label: string;
    lat: number;
    lon: number;
  } | null>(null);
  const [destAddress, setDestAddress] = useState<{
    label: string;
    lat: number;
    lon: number;
  } | null>(null);

  const [priceDetails, setPriceDetails] = useState<{
    amount: number;
    breakdown: any[];
  } | null>(null);

  const selectedService = sp.get("service") || "moving-truck";

  const totalSteps = 10;

  const calculatePrice = useCallback(async () => {
    if (!originAddress || !destAddress) return;

    try {
      const res = await fetch("/api/Order/calculate-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin: {
            latitude: originAddress.lat,
            longitude: originAddress.lon,
            fullAddress: originAddress.label,
          },
          destination: {
            latitude: destAddress.lat,
            longitude: destAddress.lon,
            fullAddress: destAddress.label,
          },
          // You can add other factors like heavy items here
        }),
      });
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      setPriceDetails({
        amount: data.totalPrice,
        breakdown: data.priceFactors,
      });
    } catch (error) {
      console.error("Failed to calculate price:", error);
      toast({
        title: "خطا در محاسبه قیمت",
        description: "لطفا دوباره تلاش کنید.",
      });
    }
  }, [originAddress, destAddress, toast]);

  useEffect(() => {
    calculatePrice();
  }, [calculatePrice]);

  const canNext = () => {
    if (step === 0) return Boolean(city);
    if (step === 1) return packNeeded !== "";
    if (step === 2 && packNeeded === "yes") return packType !== "none";
    if (step === 5) return originElevator !== "" && destElevator !== "";
    if (step === 6) return originAddress !== null && destAddress !== null;
    return true;
  };

  const next = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  async function applyCoupon() {
    if (!coupon) return toast({ title: "کد وارد نشده" });
    try {
      const res = await fetch(
        `/api/coupons/validate?code=${encodeURIComponent(coupon)}`,
      );
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Error ${res.status}: ${txt}`);
      }
      const data = await res.json();
      if (data && data.amountOff) {
        setCouponApplied(data.amountOff);
        toast({
          title: "کد اعمال شد",
          description: `${data.amountOff.toLocaleString()} تومان تخفیف`,
        });
      } else {
        toast({ title: "کد نامعتبر" });
      }
    } catch (err) {
      console.error(err);
      toast({ title: "خطا در اعمال کد", description: String(err) });
    }
  }

  async function submitOrder() {
    if (!originAddress || !destAddress || !priceDetails)
      return toast({ title: "آدرس و قیمت نهایی مشخص نشده است" });

    setSubmitting(true);
    try {
      const res = await fetch("/api/Order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin: {
            latitude: originAddress.lat,
            longitude: originAddress.lon,
            fullAddress: originAddress.label,
          },
          destination: {
            latitude: destAddress.lat,
            longitude: destAddress.lon,
            fullAddress: destAddress.label,
          },
          finalPrice: priceDetails.amount,
          // You can add pricingFactorIds and packagingProducts if needed
        }),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Error ${res.status}: ${txt}`);
      }
      const data = await res.json();
      toast({ title: "سفارش ثبت شد", description: `شماره سفارش: ${data.id}` });
      navigate("/dashboard/customer");
    } catch (err) {
      console.error(err);
      toast({ title: "خطا در ث��ت سفارش", description: String(err) });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container py-6">
      <div className="mb-5">
        <div className="text-xs text-foreground/60">سرویس انتخابی</div>
        <div className="font-bold">
          {selectedService === "moving-pickup"
            ? "حمل با وانت/نیسان"
            : "اسباب‌کشی با خاور/کامیون"}
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2 text-sm overflow-x-auto scrollbar-thin py-2">
        {[
          "شهر",
          "بسته‌بندی",
          "نوع بسته‌بن��ی",
          "جزئیات بسته‌بندی",
          "نیروی بسته‌بندی",
          "طبقات/آسانسور",
          "آدرس‌ها",
          "اقلام سنگین",
          "پیاده‌روی",
          "کارگر",
          "جمع‌بندی",
        ].map((t, i) => (
          <div
            key={i}
            className={`px-3 py-1 rounded-full border ${i === step ? "bg-primary text-primary-foreground" : "bg-background"}`}
          >
            {t}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr,420px] gap-6 mt-4">
        <Card>
          <CardContent className="p-4 md:p-6">
            <AnimatePresence mode="popLayout">
              {step === 0 && (
                <motion.div
                  key="step-0"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                >
                  <div className="font-bold text-lg">
                    شهر خود ر�� انتخاب کنید
                  </div>
                  <p className="text-sm text-foreground/70 mt-1">
                    فعلاً تهران فعال است.
                  </p>
                  <div className="grid gap-3 mt-4 max-w-xs">
                    <Label htmlFor="city">شهر</Label>
                    <select
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="h-10 rounded-md border bg-background px-3"
                    >
                      <option value="tehran">ته��ان</option>
                      <option value="karaj">کرج</option>
                      <option value="isfahan">اصفهان</option>
                      <option value="mashhad">مشهد</option>
                      <option value="shiraz">شیراز</option>
                    </select>
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                >
                  <div className="font-bold text-lg">
                    آیا به سرویس بسته‌بندی ��یاز دارید؟
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3 mt-4 max-w-2xl">
                    <label
                      className={`border rounded-xl p-4 cursor-pointer ${packNeeded === "yes" ? "ring-2 ring-primary" : ""}`}
                    >
                      <div className="font-bold">بله</div>
                      <div className="text-sm text-foreground/70">
                        نیروی متخصص + امکانات
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <input
                          type="radio"
                          name="packNeed"
                          checked={packNeeded === "yes"}
                          onChange={() => setPackNeeded("yes")}
                        />
                      </div>
                    </label>
                    <label
                      className={`border rounded-xl p-4 cursor-pointer ${packNeeded === "no" ? "ring-2 ring-primary" : ""}`}
                    >
                      <div className="font-bold">خیر</div>
                      <div className="text-sm text-foreground/70">
                        بدون ب��ته‌بندی ادامه می‌دهم
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <input
                          type="radio"
                          name="packNeed"
                          checked={packNeeded === "no"}
                          onChange={() => setPackNeeded("no")}
                        />
                      </div>
                    </label>
                  </div>
                </motion.div>
              )}

              {step === 2 && packNeeded === "yes" && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                >
                  <div className="font-bold text-lg">
                    سرویس بسته‌بندی موردنظر شما
                  </div>
                  <RadioGroup
                    className="mt-4 grid gap-3 max-w-xl"
                    value={packType}
                    onValueChange={(v) => setPackType(v as PackagingType)}
                  >
                    <label className="flex items-center gap-3 border rounded-xl p-3 cursor-pointer">
                      <RadioGroupItem value="all" id="pack_all" />
                      <div>
                        <div className="font-bold">
                          بسته‌بندی تمام لوازم منزل
                        </div>
                        <div className="text-sm text-foreground/70">
                          ریز و درشت
                        </div>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 border rounded-xl p-3 cursor-pointer">
                      <RadioGroupItem value="large" id="pack_large" />
                      <div>
                        <div className="font-bold">بسته‌بندی لوازم بزرگ</div>
                        <div className="text-sm text-foreground/70">
                          مبلمان، کمد، یخچال و …
                        </div>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 border rounded-xl p-3 cursor-pointer">
                      <RadioGroupItem value="small" id="pack_small" />
                      <div>
                        <div className="font-bold">بسته‌بندی خرده‌ریزها</div>
                        <div className="text-sm text-foreground/70">
                          ظروف، کتاب، لباس و …
                        </div>
                      </div>
                    </label>
                  </RadioGroup>
                </motion.div>
              )}

              {step === 3 && packNeeded === "yes" && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                >
                  <div className="font-bold text-lg">
                    قصد بسته‌بندی کدام موارد را دارید؟
                  </div>
                  <div className="grid gap-3 mt-3 max-w-2xl">
                    {PACKING_SMALLS.map((it) => {
                      const item = packSmalls[it.id] || { checked: false };
                      const showQty =
                        packType === "all" || packType === "large"
                          ? true
                          : it.id === "other";
                      return (
                        <div
                          key={it.id}
                          className="flex items-center justify-between gap-3 border rounded-xl p-3"
                        >
                          <label className="flex items-center gap-2">
                            <Checkbox
                              checked={item.checked}
                              onCheckedChange={(v) =>
                                setPackSmalls((s) => ({
                                  ...s,
                                  [it.id]: {
                                    ...(s[it.id] || {}),
                                    checked: Boolean(v),
                                  },
                                }))
                              }
                            />
                            <span>{it.title}</span>
                          </label>
                          {item.checked && showQty && (
                            <Counter
                              value={item.qty || 1}
                              onChange={(q) =>
                                setPackSmalls((s) => ({
                                  ...s,
                                  [it.id]: {
                                    ...(s[it.id] || {}),
                                    checked: true,
                                    qty: q,
                                  },
                                }))
                              }
                              min={1}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {step === 4 && packNeeded === "yes" && (
                <motion.div
                  key="step-4"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                >
                  <div className="font-bold text-lg">
                    نیروی بسته‌بندی موردنیاز
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 mt-4 max-w-xl">
                    <div className="border rounded-xl p-3">
                      <div className="text-sm mb-2">تعداد آقا</div>
                      <Counter value={packMen} onChange={setPackMen} />
                    </div>
                    <div className="border rounded-xl p-3">
                      <div className="text-sm mb-2">تعداد خانم</div>
                      <Counter value={packWomen} onChange={setPackWomen} />
                    </div>
                  </div>
                  <div className="mt-4 max-w-xl">
                    <div className="text-sm mb-2">مدت زمان مورد انتظار</div>
                    <div className="flex flex-wrap gap-2">
                      {[2, 3, 4, 5, 6].map((h) => (
                        <Button
                          key={h}
                          variant={packHours === h ? "default" : "outline"}
                          onClick={() => setPackHours(h)}
                        >
                          {h} ساعت
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 max-w-xl">
                    <div className="text-sm mb-2">
                      آیا به لوازم بسته‌بندی نیاز دارید؟
                    </div>
                    <div className="flex gap-3">
                      <label
                        className={`border rounded-xl p-3 cursor-pointer ${packMaterials === "yes" ? "ring-2 ring-primary" : ""}`}
                      >
                        <input
                          type="radio"
                          name="pm"
                          checked={packMaterials === "yes"}
                          onChange={() => setPackMaterials("yes")}
                        />{" "}
                        بله
                      </label>
                      <label
                        className={`border rounded-xl p-3 cursor-pointer ${packMaterials === "no" ? "ring-2 ring-primary" : ""}`}
                      >
                        <input
                          type="radio"
                          name="pm"
                          checked={packMaterials === "no"}
                          onChange={() => setPackMaterials("no")}
                        />{" "}
                        خیر
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div
                  key="step-5"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                >
                  <div className="font-bold text-lg">طبقات و آسانسور</div>
                  <div className="grid sm:grid-cols-2 gap-4 mt-4 max-w-2xl">
                    <div className="border rounded-xl p-3">
                      <div className="text-sm mb-2">طبقه مبدا</div>
                      <Input
                        type="number"
                        min={1}
                        max={12}
                        value={originFloor}
                        onChange={(e) =>
                          setOriginFloor(parseInt(e.target.value || "1"))
                        }
                      />
                      <div className="mt-3 text-sm mb-2">آسانسور در مبدا</div>
                      <div className="flex gap-3">
                        <label
                          className={`border rounded-xl p-2 cursor-pointer ${originElevator === "yes" ? "ring-2 ring-primary" : ""}`}
                        >
                          <input
                            type="radio"
                            name="oe"
                            checked={originElevator === "yes"}
                            onChange={() => setOriginElevator("yes")}
                          />{" "}
                          بله
                        </label>
                        <label
                          className={`border rounded-xl p-2 cursor-pointer ${originElevator === "no" ? "ring-2 ring-primary" : ""}`}
                        >
                          <input
                            type="radio"
                            name="oe"
                            checked={originElevator === "no"}
                            onChange={() => setOriginElevator("no")}
                          />{" "}
                          خیر
                        </label>
                      </div>
                    </div>
                    <div className="border rounded-xl p-3">
                      <div className="text-sm mb-2">طبقه مقص��</div>
                      <Input
                        type="number"
                        min={1}
                        max={12}
                        value={destFloor}
                        onChange={(e) =>
                          setDestFloor(parseInt(e.target.value || "1"))
                        }
                      />
                      <div className="mt-3 text-sm mb-2">آسانسور در مقصد</div>
                      <div className="flex gap-3">
                        <label
                          className={`border rounded-xl p-2 cursor-pointer ${destElevator === "yes" ? "ring-2 ring-primary" : ""}`}
                        >
                          <input
                            type="radio"
                            name="de"
                            checked={destElevator === "yes"}
                            onChange={() => setDestElevator("yes")}
                          />{" "}
                          بله
                        </label>
                        <label
                          className={`border rounded-xl p-2 cursor-pointer ${destElevator === "no" ? "ring-2 ring-primary" : ""}`}
                        >
                          <input
                            type="radio"
                            name="de"
                            checked={destElevator === "no"}
                            onChange={() => setDestElevator("no")}
                          />{" "}
                          خیر
                        </label>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 6 && (
                <motion.div
                  key="step-6"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                >
                  <div className="font-bold text-lg">آدرس مبدا و مقصد</div>
                  <div className="mt-3 grid gap-3">
                    <div className="border rounded-xl p-3">
                      <div className="text-sm mb-2">آدرس مبدا</div>
                      <div className="flex items-center gap-2">
                        <Input
                          value={originAddress?.label || ""}
                          placeholder="آدرس مبدا انتخاب نشده"
                          readOnly
                        />
                        <div>
                          <AddressPicker
                            buttonLabel={originAddress ? "ویرایش" : "انتخاب"}
                            onSelect={(a) => setOriginAddress(a)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-xl p-3">
                      <div className="text-sm mb-2">آدرس مقصد</div>
                      <div className="flex items-center gap-2">
                        <Input
                          value={destAddress?.label || ""}
                          placeholder="آدرس مقصد انتخاب نشده"
                          readOnly
                        />
                        <div>
                          <AddressPicker
                            buttonLabel={destAddress ? "ویرایش" : "انتخاب"}
                            onSelect={(a) => setDestAddress(a)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 7 && (
                <motion.div
                  key="step-7"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                >
                  <div className="font-bold text-lg">اقلام سنگین یا حجیم</div>
                  <div className="grid gap-3 mt-3 max-w-2xl">
                    {HEAVY_ITEMS.map((h) => {
                      const qty = heavy[h.id] || 0;
                      return (
                        <div
                          key={h.id}
                          className="flex items-center justify-between gap-3 border rounded-xl p-3"
                        >
                          <div className="text-sm">{h.title}</div>
                          <div className="flex items-center gap-3">
                            <Counter
                              value={qty}
                              onChange={(q) =>
                                setHeavy((s) => ({ ...s, [h.id]: q }))
                              }
                            />
                            <div className="text-xs text-foreground/70">
                              {h.price.toLocaleString()} تومان
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {step === 8 && (
                <motion.div
                  key="step-8"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                >
                  <div className="font-bold text-lg">پیاده‌روی مورد نیاز</div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {[0, 20, 35, 40, 50, 65, 200].map((m) => (
                      <Button
                        key={m}
                        variant={walk === m ? "default" : "outline"}
                        onClick={() => setWalk(m as any)}
                      >
                        {m === 0 ? "ندا��م" : m}
                      </Button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 9 && (
                <motion.div
                  key="step-9"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                >
                  <div className="font-bold text-lg">تعداد کارگر</div>
                  <p className="text-sm text-foreground/70">حداقل �� نفر</p>
                  <div className="mt-3">
                    <Counter
                      value={workers}
                      onChange={setWorkers}
                      min={4}
                      max={12}
                    />
                  </div>
                </motion.div>
              )}

              {step === 10 && (
                <motion.div
                  key="step-10"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                >
                  <div className="font-bold text-lg">پیش‌فاکتور و تأیید</div>
                  <p className="text-sm text-foreground/70 mt-1">
                    قیمت حدودی ب�� اساس انتخاب‌های شما محاسبه شده است. مبلغ
                    نهایی پس از تایید ادمین مشخص م��‌شود.
                  </p>
                  <div className="mt-4 space-y-2">
                    {priceDetails?.breakdown?.map((b: any, i: number) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-sm border rounded-lg p-2"
                      >
                        <div className="text-foreground/80">{b.name}</div>
                        <div className="font-bold">
                          {b.price.toLocaleString()} تومان
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Nav */}
            <div className="mt-6 flex items-center justify-between">
              <Button variant="outline" onClick={prev} disabled={step === 0}>
                مرحله قبل
              </Button>
              {step < totalSteps ? (
                <Button onClick={next} disabled={!canNext()}>
                  ادامه
                </Button>
              ) : (
                <Button onClick={submitOrder} disabled={submitting}>
                  {submitting ? "در حال ارسال..." : "تایید و ادامه"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="h-max sticky top-24">
          <CardContent className="p-4 md:p-6">
            <div className="font-extrabold text-lg">جمع کل حدودی</div>
            <div className="mt-2 text-3xl font-black bg-gradient-to-tr from-primary to-accent text-transparent bg-clip-text">
              {(priceDetails?.amount || 0).toLocaleString()}{" "}
              <span className="text-base font-bold text-foreground/70">
                تومان
              </span>
            </div>
            <div className="mt-3 text-xs text-foreground/60">
              کد تخفیف دارید؟
            </div>
            <div className="mt-2 flex gap-2">
              <Input
                placeholder="کد تخفیف"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <Button variant="outline" onClick={applyCoupon}>
                اعمال
              </Button>
            </div>
            <div className="mt-4 text-xs text-foreground/60">
              درصورت مراجعه ��تخصص و عدم انجام کار بنا به نظر مشتری، ۲۵۰٬۰۰۰
              تومان هزینه کارشناسی دریافت می‌شود.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
