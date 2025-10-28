import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type Step = "phone" | "otp";

function apiFetch(path: string, opts: RequestInit = {}) {
  return fetch(path, {
    ...opts,
    headers: { "Content-Type": "application/json", ...opts.headers },
  });
}

export default function Auth({ onAuthSuccess }: { onAuthSuccess: () => void }) {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [requestId, setRequestId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const sendOtp = async () => {
    if (!/09\d{9}/.test(phone)) {
      return toast({ title: "شماره موبایل معتبر نیست" });
    }
    setIsSubmitting(true);
    try {
      const res = await apiFetch("/api/Auth/login-send-otp", {
        method: "POST",
        body: JSON.stringify({ phone }),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        if (res.status === 404) {
          // User not found, so we register them
          const regRes = await apiFetch("/api/Auth/register-send-otp", {
            method: "POST",
            body: JSON.stringify({ phone }),
          });
          if (!regRes.ok) {
            const regTxt = await regRes.text().catch(() => "");
            throw new Error(`Register error ${regRes.status}: ${regTxt}`);
          }
          const regData = await regRes.json();
          setRequestId(regData.requestId);
          setStep("otp");
          toast({ title: "کد تایید برای ثبت‌نام ارسال شد" });
          return;
        }
        throw new Error(`Login error ${res.status}: ${txt}`);
      }
      const data = await res.json();
      setRequestId(data.requestId);
      setStep("otp");
      toast({ title: "کد تایید برای ورود ارسال شد" });
    } catch (err) {
      console.error(err);
      toast({ title: "خطا در ارسال کد", description: String(err) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp || !requestId) return;
    setIsSubmitting(true);
    try {
      // We try verifying for login, and if it fails, we try for register
      let token = null;
      const loginRes = await apiFetch("/api/Auth/login-verify-otp", {
        method: "POST",
        body: JSON.stringify({ phone, code: otp, requestId }),
      });

      if (loginRes.ok) {
        const data = await loginRes.json();
        token = data.token;
      } else {
        const regRes = await apiFetch("/api/Auth/register-verify-otp", {
          method: "POST",
          body: JSON.stringify({
            phone,
            code: otp,
            requestId,
            role: "Customer",
          }),
        });
        if (!regRes.ok) {
          const txt = await regRes.text().catch(() => "");
          throw new Error(`Verify error ${regRes.status}: ${txt}`);
        }
        const data = await regRes.json();
        token = data.token;
      }

      if (token) {
        localStorage.setItem("authToken", token);
        toast({ title: "با موفقیت وارد شدید" });
        onAuthSuccess();
      } else {
        throw new Error("No token received");
      }
    } catch (err) {
      console.error(err);
      toast({ title: "خطا در تایید کد", description: String(err) });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {step === "phone" && (
        <div>
          <h3 className="font-bold text-lg mb-2">ورود یا ثبت‌نام</h3>
          <p className="text-sm text-foreground/70 mb-4">
            شماره موبایل خود را وارد کنید
          </p>
          <Input
            type="tel"
            placeholder="0912..."
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            dir="ltr"
          />
          <Button onClick={sendOtp} disabled={isSubmitting} className="mt-4 w-full">
            {isSubmitting ? "در حال ارسال..." : "ارسال کد"}
          </Button>
        </div>
      )}
      {step === "otp" && (
        <div>
          <h3 className="font-bold text-lg mb-2">تایید کد</h3>
          <p className="text-sm text-foreground/70 mb-4">
            کد ۶ رقمی ارسال شده به {phone} را وارد کنید
          </p>
          <Input
            type="text"
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            dir="ltr"
          />
          <Button onClick={verifyOtp} disabled={isSubmitting} className="mt-4 w-full">
            {isSubmitting ? "در حال تایید..." : "تایید و ادامه"}
          </Button>
          <Button variant="link" size="sm" onClick={() => setStep("phone")}>
            تغییر شماره
          </Button>
        </div>
      )}
    </div>
  );
}
