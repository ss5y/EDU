"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type PlanId = "monthly" | "quarter" | "annual";

export interface FakePaymentProps {
  planId: PlanId;
  price: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function FakePayment({
  planId,
  price,
  open,
  onOpenChange,
  onSuccess,
}: FakePaymentProps) {
  const router = useRouter();

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [brand, setBrand] = useState<"visa" | "mastercard">("visa");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePay = () => {
    if (!cardName || !cardNumber || !expiry || !cvc) {
      alert("يرجى تعبئة جميع بيانات البطاقة (أي بيانات تجريبية مقبولة).");
      return;
    }

    setIsSubmitting(true);

    const subscription = {
      planId,
      price,
      brand,
      activatedAt: new Date().toISOString(),
      status: "active",
    };

    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("edu_subscription", JSON.stringify(subscription));
      }
    } catch (err) {
      console.warn("Failed to save subscription", err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      onOpenChange(false);

      if (onSuccess) {
        onSuccess();
      } else {
        // بعد الدفع ينتقل لاختيار الكورسات
        router.push("/student/select-courses");
      }
    }, 600);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl font-semibold">
            إتمام الدفع لباقتك
          </DialogTitle>
          <DialogDescription className="text-sm">
            هذا نموذج دفع تجريبي، يمكنك إدخال أي بيانات (لا يتم خصم أي مبلغ
            حقيقي).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-center justify-between rounded-lg border bg-muted px-3 py-2 text-sm">
            <span>الخطة المختارة</span>
            <span className="font-semibold">
              {planId === "monthly"
                ? "باقة شهر واحد"
                : planId === "quarter"
                ? "باقة 3 أشهر"
                : "باقة سنوية"}{" "}
              — {price} ر.ع
            </span>
          </div>

          <div className="flex gap-2 text-xs">
            <button
              type="button"
              onClick={() => setBrand("visa")}
              className={`flex-1 rounded-md border px-3 py-2 text-center ${
                brand === "visa"
                  ? "border-primary bg-primary/5"
                  : "border-border"
              }`}
            >
              Visa
            </button>
            <button
              type="button"
              onClick={() => setBrand("mastercard")}
              className={`flex-1 rounded-md border px-3 py-2 text-center ${
                brand === "mastercard"
                  ? "border-primary bg-primary/5"
                  : "border-border"
              }`}
            >
              MasterCard
            </button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardName">اسم صاحب البطاقة</Label>
            <Input
              id="cardName"
              placeholder="مثال: Ahmed Ali"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardNumber">رقم البطاقة</Label>
            <Input
              id="cardNumber"
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="expiry">تاريخ الانتهاء</Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                placeholder="123"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            إلغاء
          </Button>
          <Button type="button" onClick={handlePay} disabled={isSubmitting}>
            {isSubmitting ? "جارٍ الإتمام..." : "إتمام الدفع والدخول للكورسات"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
