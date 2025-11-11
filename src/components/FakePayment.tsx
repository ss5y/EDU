'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2 } from 'lucide-react';

export type PlanId = 'monthly' | 'quarter' | 'annual';

export interface FakePaymentProps {
  planId: PlanId;
  price: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FakePayment({
  planId,
  price,
  open,
  onOpenChange,
}: FakePaymentProps) {
  const router = useRouter();

  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      // نحفظ الاشتراك في localStorage (صوري فقط)
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'edu_subscription',
          JSON.stringify({
            planId,
            price,
            createdAt: new Date().toISOString(),
          })
        );
      }

      onOpenChange(false);

      // 🔁 هنا كان التحويل لـ /student/select-courses (اللي يعطيك 404)
      // نوديك الآن لصفحة تصفّح الكورسات الموجودة فعلاً
      router.push('/student/browse-courses');
    }, 1000);
  };

  const planLabel =
    planId === 'monthly'
      ? 'باقة شهر واحد'
      : planId === 'quarter'
      ? 'باقة 3 أشهر'
      : 'باقة سنوية';

  const maxCourses =
    planId === 'monthly' ? 3 : planId === 'quarter' ? 5 : 'غير محدود';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            بوابة الدفع التجريبية
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground">
            هذه بوابة دفع وهمية لأغراض التجربة فقط، ولا يتم فيها أي دفع حقيقي.
          </DialogDescription>
        </DialogHeader>

        {/* ملخص الباقة */}
        <div className="rounded-lg border bg-muted/40 p-4 mb-4 space-y-1 text-sm">
          <p>
            <span className="font-semibold">الباقة المختارة:</span> {planLabel}
          </p>
          <p>
            <span className="font-semibold">السعر:</span> {price} ريال / شهر
          </p>
          <p>
            <span className="font-semibold">الحد الأقصى للكورسات:</span>{' '}
            {maxCourses} في هذه الباقة.
          </p>
        </div>

        {/* بيانات البطاقة */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border px-4 py-2 text-xs text-muted-foreground mb-2">
            <span>طرق الدفع المدعومة (تجريبياً):</span>
            <div className="flex items-center gap-2 text-base">
              <span className="font-semibold">VISA</span>
              <span className="font-semibold">MasterCard</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardName">اسم صاحب البطاقة</Label>
            <Input
              id="cardName"
              placeholder="مثال: أحمد محمد"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardNumber">رقم البطاقة</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">تاريخ الانتهاء</Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="mt-2 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'جارٍ معالجة الدفع...' : 'إتمام الدفع'}
          </Button>

          <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            يمكنك إدخال أي بيانات هنا، فالدفع تجريبي ولا يتم خصم أي مبلغ.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
