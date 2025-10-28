import React, { useReducer, useCallback, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AddressPicker from "../components/shared/AddressPicker";
import { useToast } from "../hooks/use-toast";
import { calculateOrderPrice, createOrder } from "../services/order";
import type { CreateOrderRequestDto, HeavyItemDto } from "../types/order";

const initialState = {
  step: 0,
  submitting: false,
  originFloor: 1,
  originElevator: "no",
  destFloor: 1,
  destElevator: "no",
  heavy: {} as Record<string, number>,
  walk: 0,
  workers: 4,
  originAddress: null as { label: string; lat: number; lon: number } | null,
  destAddress: null as { label: string; lat: number; lon: number } | null,
  priceDetails: null as { amount: number; breakdown: any[] } | null,
};

type State = typeof initialState;
type Action = { type: "SET_FIELD"; field: keyof State; value: any } | { type: "NEXT_STEP" } | { type: "PREV_STEP" };

function orderReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_FIELD": return { ...state, [action.field]: action.value };
    case "NEXT_STEP": return { ...state, step: state.step + 1 };
    case "PREV_STEP": return { ...state, step: state.step - 1 };
    default: return state;
  }
}

function Counter({ value, onChange, min = 0, max = 99 }) {
    return (
      <div className="inline-flex items-center rounded-md border bg-background">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))}>−</button>
        <span>{value}</span>
        <button type="button" onClick={() => onChange(Math.min(max, value + 1))}>+</button>
      </div>
    );
}

const HEAVY_ITEMS_CONFIG = [{ id: "fridge", title: "یخچال" }, { id: "sofa", title: "مبل" }];

export default function Order() {
  const [state, dispatch] = useReducer(orderReducer, initialState);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { step, submitting, originAddress, destAddress, ...formData } = state;
  const setField = (field: keyof State, value: any) => dispatch({ type: "SET_FIELD", field, value });

  const mapStateToDto = useCallback((): CreateOrderRequestDto | null => {
    if (!originAddress || !destAddress) return null;
    const heavyItems: HeavyItemDto[] = Object.entries(formData.heavy).filter(([, qty]) => qty > 0).map(([itemId, quantity]) => ({ itemId, quantity }));
    return {
      origin: { latitude: originAddress.lat, longitude: originAddress.lon, fullAddress: originAddress.label },
      destination: { latitude: destAddress.lat, longitude: destAddress.lon, fullAddress: destAddress.label },
      originFloor: formData.originFloor,
      originElevator: formData.originElevator === "yes",
      destFloor: formData.destFloor,
      destElevator: formData.destElevator === "yes",
      workers: formData.workers,
      walkDistance: formData.walk,
      heavyItems,
    };
  }, [originAddress, destAddress, formData]);

  const handleCalculatePrice = useCallback(async () => {
    const orderDetails = mapStateToDto();
    if (!orderDetails) return;
    try {
      const data = await calculateOrderPrice(orderDetails);
      setField("priceDetails", { amount: data.totalPrice, breakdown: data.priceFactors });
    } catch (error) { toast({ title: "خطا در محاسبه قیمت", variant: "destructive" }); }
  }, [mapStateToDto, toast]);

  const handleSubmitOrder = async () => {
    const orderDetails = mapStateToDto();
    if (!orderDetails) return toast({ title: "اطلاعات سفارش ناقص است", variant: "destructive" });
    setField("submitting", true);
    try {
      const data = await createOrder(orderDetails);
      toast({ title: "سفارش ثبت شد", description: `کد رهگیری: ${data.trackingCode}` });
      navigate("/dashboard/customer");
    } catch (error) { toast({ title: "خطا در ثبت سفارش", variant: "destructive" });
    } finally { setField("submitting", false); }
  };

  useEffect(() => {
    if (step === 3) handleCalculatePrice(); // Recalculate on final step
  }, [step, handleCalculatePrice]);

  return (
    <div className="container py-6">
      <div className="grid lg:grid-cols-[1fr,420px] gap-6 mt-4">
        <Card><CardContent className="p-6">
          <AnimatePresence mode="wait">
            {step === 0 && <motion.div key="s0">...</motion.div>}
            {step === 1 && <motion.div key="s1">...</motion.div>}
            {step === 2 && <motion.div key="s2">...</motion.div>}
            {step === 3 && <motion.div key="s3">...</motion.div>}
          </AnimatePresence>
          <div className="mt-6 flex justify-between">
            <Button onClick={() => dispatch({ type: "PREV_STEP" })} disabled={step === 0}>قبل</Button>
            {step < 3 ? <Button onClick={() => dispatch({ type: "NEXT_STEP" })}>بعد</Button> : <Button onClick={handleSubmitOrder} disabled={submitting}>ثبت</Button>}
          </div>
        </CardContent></Card>
        <Card className="h-max sticky top-24"><CardContent className="p-6">
          <div className="font-bold">جمع کل</div>
          <div>{(state.priceDetails?.amount || 0).toLocaleString()} تومان</div>
        </CardContent></Card>
      </div>
    </div>
  );
}
