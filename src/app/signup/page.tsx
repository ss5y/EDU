'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Check, Package } from 'lucide-react';

interface PlanConfig {
  id: string;
  name: string;
  price: number;
  months: number;
  maxCourses: number;
}

const PLAN_CONFIGS: PlanConfig[] = [
  {
    id: 'monthly',
    name: 'باقة شهر واحد',
    price: 10,
    months: 1,
    maxCourses: 3,
  },
  {
    id: 'quarter',
    name: 'باقة 3 أشهر',
    price: 19.99,
    months: 3,
    maxCourses: 5,
  },
  {
    id: 'annual',
    name: 'باقة سنوية',
    price: 40,
    months: 12,
    maxCourses: 999,
  },
];

function getConfig(id: string | null): PlanConfig | null {
  return PLAN_CONFIGS.find((p) => p.id === id) ?? null;
}

export default function SubscriptionManagementPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [planId, setPlanId] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [points, setPoints] = useState<number>(0);
  const [usedCourses, setUsedCourses] = useState<number>(0);
  const [maxCourses, setMaxCourses] = useState<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedPlan = localStorage.getItem('edu_subscription_plan');
    if (!storedPlan) {
      router.push('/student/subscriptions');
      return;
    }

    setPlanId(storedPlan);
    setEndDate(localStorage.getItem('edu_subscription_end'));
    setUsedCourses(
      Number(localStorage.getItem('edu_subscription_usedCourses') ?? '0'),
    );
    setMaxCourses(
      Number(localStorage.getItem('edu_subscription_maxCourses') ?? '0'),
    );
    setPoints(
      Number(localStorage.getItem('edu_subscription_points') ?? '0'),
    );

    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <main className="p-8 text-center">
        جارٍ تحميل بيانات الاشتراك...
      </main>
    );
  }

  const currentConfig = getConfig(planId);
  if (!currentConfig) {
    return (
      <main className="p-8 text-center">
        لم يتم العثور على اشتراك، سيتم تحويلك لصفحة الباقات...
      </main>
    );
  }

  const endDateFormatted = endDate
    ? new Date(endDate).toISOString().split('T')[0]
    : '-';

  function handleCancel() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('edu_subscription_plan');
      localStorage.removeItem('edu_subscription_name');
      localStorage.removeItem('edu_subscription_price');
      localStorage.removeItem('edu_subscription_start');
      localStorage.removeItem('edu_subscription_end');
      localStorage.removeItem('edu_subscription_maxCourses');
      localStorage.removeItem('edu_subscription_usedCourses');
      localStorage.removeItem('edu_subscription_points');
    }
    router.push('/student/subscriptions');
  }

  function handleChangePlan(newPlanId: string) {
    if (newPlanId === planId) return;
    const cfg = getConfig(newPlanId);
    if (!cfg) return;

    const start = new Date();
    const end = new Date(start);
    end.setMonth(end.getMonth() + cfg.months);

    if (typeof window !== 'undefined') {
      localStorage.setItem('edu_subscription_plan', cfg.id);
      localStorage.setItem('edu_subscription_name', cfg.name);
      localStorage.setItem('edu_subscription_price', String(cfg.price));
      localStorage.setItem('edu_subscription_start', start.toISOString());
      localStorage.setItem('edu_subscription_end', end.toISOString());
      localStorage.setItem(
        'edu_subscription_maxCourses',
        String(cfg.maxCourses),
      );
      localStorage.setItem('edu_subscription_usedCourses', '0');
      localStorage.setItem('edu_subscription_points', '0');
    }

    setPlanId(cfg.id);
    setEndDate(end.toISOString());
    setUsedCourses(0);
    setMaxCourses(cfg.maxCourses);
    setPoints(0);
  }

  return (
    <main className="w-full bg-card py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        {/* عنوان إدارة الاشتراك */}
        <div className="flex flex-col items-start md:items-end mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            إدارة الاشتراك
          </h1>
          <p className="text-sm text-muted-foreground">
            تحكم في باقتك الحالية وقم بترقيتها أو إلغائها بسهولة.
          </p>
        </div>

        {/* بطاقة الباقة الحالية */}
        <Card className="mb-10">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">
                باقتك الحالية
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                يمكنك تغيير أو ترقية الباقة في أي وقت.
              </p>
            </div>
            <Package className="w-8 h-8 text-primary" />
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3 text-sm md:text-base">
            <div className="flex flex-col items-start md:items-end">
              <span className="text-muted-foreground">الباقة</span>
              <span className="font-semibold">{currentConfig.name}</span>
            </div>
            <div className="flex flex-col items-start md:items-end">
              <span className="text-muted-foreground">تاريخ الانتهاء</span>
              <span className="font-semibold">{endDateFormatted}</span>
            </div>
            <div className="flex flex-col items-start md:items-end">
              <span className="text-muted-foreground">النقاط المكتسبة</span>
              <span className="font-semibold">{points} 🏅</span>
            </div>
            <div className="flex flex-col items-start md:items-end">
              <span className="text-muted-foreground">الكورسات المختارة</span>
              <span className="font-semibold">
                {usedCourses}/{maxCourses}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* ترقية الباقة */}
        <h2 className="text-xl font-semibold mb-4">ترقية الباقة</h2>
        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mb-10">
          {PLAN_CONFIGS.map((plan) => (
            <Card
              key={plan.id}
              className={`flex flex-col relative overflow-hidden ${
                plan.id === planId
                  ? 'border-primary border-2 shadow-lg'
                  : 'border'
              }`}
            >
              <CardHeader className="items-center text-center">
                <CardTitle className="font-headline text-2xl">
                  {plan.name}
                </CardTitle>
                <p className="text-3xl font-bold">
                  {plan.price}{' '}
                  <span className="text-sm text-muted-foreground">
                    ريال/شهر
                  </span>
                </p>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  variant={plan.id === planId ? 'outline' : 'default'}
                  disabled={plan.id === planId}
                  onClick={() => handleChangePlan(plan.id)}
                >
                  {plan.id === planId ? 'الباقة الحالية' : 'ترقية إلى هذه الباقة'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* إلغاء الاشتراك */}
        <div className="flex justify-end">
          <Button variant="destructive" onClick={handleCancel}>
            إلغاء الاشتراك
          </Button>
        </div>
      </div>
    </main>
  );
}
