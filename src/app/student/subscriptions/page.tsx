'use client';

import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Check } from 'lucide-react';

import { useLanguage } from '@/hooks/use-language';
import { FakePayment, type PlanId } from '@/components/FakePayment';

interface Plan {
  id: PlanId;
  name: string;
  price: number;
  maxCourses: number;
  features: string[];
  isPopular: boolean;
}

const plans: Plan[] = [
  {
    id: 'monthly',
    name: 'باقة شهر واحد',
    price: 10,
    maxCourses: 3,
    features: ['اختر 3 كورسات', 'الكورس الإضافي = 1.499 ريال', 'دعم عبر البريد الإلكتروني'],
    isPopular: false,
  },
  {
    id: 'quarter',
    name: 'باقة 3 أشهر',
    price: 19.99,
    maxCourses: 5,
    features: [
      'اختر 5 كورسات',
      'الكورس الإضافي = 1.199 ريال',
      'نقاط يمكن استبدالها بكورس إضافي',
      'تجربة مجانية 7 أيام',
    ],
    isPopular: true,
  },
  {
    id: 'annual',
    name: 'باقة سنوية',
    price: 40,
    maxCourses: 999,
    features: ['وصول غير محدود للكورسات', 'مساعد AI شخصي', 'جلسات شهرية مع المعلمين', 'دعم ذو أولوية'],
    isPopular: false,
  },
];

export default function StudentSubscriptionsPage() {
  const { t } = useLanguage();

  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const handleChoosePlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsPaymentOpen(true);

    // نحفظ بيانات الخطة (خصوصاً maxCourses) عشان صفحة اختيار الكورسات تستخدمها
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          'edu_subscription_plan',
          JSON.stringify({
            planId: plan.id,
            maxCourses: plan.maxCourses,
            price: plan.price,
          })
        );
      } catch (err) {
        console.warn('Failed to save edu_subscription_plan', err);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="font-headline text-3xl font-bold">{t.plansTitle}</h1>
        <p className="text-sm text-muted-foreground">
          اختر الباقة المناسبة لك ثم أكمل الدفع التجريبي، وبعدها يمكنك اختيار الكورسات من تخصصك.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3 max-w-5xl">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`flex flex-col relative overflow-hidden ${
              plan.isPopular ? 'border-primary border-2 shadow-lg' : 'border'
            }`}
          >
            {plan.isPopular && (
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold py-1 px-3 rounded-bl-lg flex items-center gap-1">
                <Star className="w-3 h-3" /> الأكثر قيمة
              </div>
            )}

            <CardHeader className="items-center text-center">
              <CardTitle className="font-headline text-2xl">{plan.name}</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                حتى {plan.maxCourses === 999 ? 'كل الكورسات' : `${plan.maxCourses} كورسات`} في خطتك
              </p>
              <p className="mt-3 text-4xl font-bold">
                {plan.price}{' '}
                <span className="text-lg font-normal text-muted-foreground">
                  {t.planPriceSuffix}
                </span>
              </p>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col">
              <ul className="space-y-3 text-center text-foreground/80">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-center justify-center gap-2 text-sm">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="flex flex-col gap-2">
              {plan.isPopular && (
                <Badge className="mx-auto mb-1" variant="outline">
                  {t.freeTrial}
                </Badge>
              )}
              <Button className="w-full" onClick={() => handleChoosePlan(plan)}>
                {t.subscribeNow}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-4 max-w-xl">
        {selectedPlan ? (
          <p className="text-sm text-muted-foreground">
            تم اختيار:{' '}
            <span className="font-semibold text-primary">{selectedPlan.name}</span>. بعد إكمال الدفع، سيتم نقلك
            لاختيار الكورسات من تخصصك.
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            اختر إحدى الباقات أعلاه لعرض بوابة الدفع التجريبية.
          </p>
        )}
      </div>

      {/* مودال بوابة الدفع الوهمية */}
      {selectedPlan && (
        <FakePayment
          planId={selectedPlan.id}
          price={selectedPlan.price}
          open={isPaymentOpen}
          onOpenChange={setIsPaymentOpen}
        />
      )}
    </div>
  );
}
