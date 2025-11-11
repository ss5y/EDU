
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { studentData } from '@/lib/placeholder-data';
import { Button } from '@/components/ui/button';
import { Calendar, Award, Star, Check, Package } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';


export default function SubscriptionPage() {
    const { t } = useLanguage();
    const { toast } = useToast();
    const { subscription, points } = studentData;

    const plans = [
        {
          name: "باقة شهر واحد",
          price: '10',
          features: ["اختر 3 كورسات", "الكورس الإضافي = 1.499 ريال", "دعم عبر البريد الإلكتروني"],
          isPopular: false,
          isCurrent: subscription.planName === 'باقة شهر واحد',
        },
        {
          name: "باقة 3 أشهر",
          price: '19.99',
          features: ["اختر 5 كورسات", "الكورس الإضافي = 1.199 ريال", "نقاط يمكن استبدالها بكورس إضافي", "تجربة مجانية 7 أيام"],
          isPopular: true,
          isCurrent: subscription.planName === 'باقة 3 أشهر',
        },
        {
          name: "باقة سنوية",
          price: '40',
          features: ["وصول غير محدود للكورسات", "مساعد AI شخصي", "جلسات شهرية مع المعلمين", "دعم ذو أولوية"],
          isPopular: false,
          isCurrent: subscription.planName === 'باقة سنوية',
        }
    ];

    const handleSubscriptionAction = (planName: string) => {
        if(planName === subscription.planName) {
            toast({ title: 'تم تجديد الاشتراك بنجاح!' });
        } else {
            toast({ title: `تمت الترقية إلى ${planName} بنجاح!` });
        }
    }


    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-headline text-3xl font-bold">إدارة الاشتراك</h1>
                <p className="text-muted-foreground">تحكم في باقتك الحالية وقم بترقيتها بسهولة.</p>
            </div>

            <Card className="border-primary border-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="w-6 h-6 text-primary" />
                        باقتك الحالية
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-1">
                        <p className="text-sm font-semibold text-muted-foreground">الباقة</p>
                        <p className="font-bold text-lg text-primary">{subscription.planName}</p>
                    </div>
                     <div className="space-y-1">
                        <p className="text-sm font-semibold text-muted-foreground">تاريخ الانتهاء</p>
                        <p className="font-bold text-lg flex items-center gap-1"><Calendar className="w-5 h-5" /> {subscription.endDate}</p>
                    </div>
                     <div className="space-y-1">
                        <p className="text-sm font-semibold text-muted-foreground">الكورسات المختارة</p>
                        <div className='flex items-center gap-2'>
                            <Progress value={(subscription.selectedCourses / subscription.totalCourses) * 100} className="w-24 h-2" />
                            <span className='font-bold text-lg'>{subscription.selectedCourses}/{subscription.totalCourses}</span>
                        </div>
                    </div>
                     <div className="space-y-1">
                        <p className="text-sm font-semibold text-muted-foreground">النقاط المكتسبة</p>
                        <p className="font-bold text-lg text-amber-500 flex items-center gap-1"><Award className="w-5 h-5" /> {points}</p>
                    </div>
                </CardContent>
            </Card>

            <div>
                <h2 className="font-headline text-2xl font-bold mb-4">ترقية الباقة</h2>
                <div className="grid gap-8 md:grid-cols-3">
                    {plans.map((plan) => (
                        <Card key={plan.name} className={`flex flex-col relative overflow-hidden ${plan.isPopular ? 'border-primary border-2 shadow-lg' : 'border'} ${plan.isCurrent ? 'bg-muted/30' : ''}`}>
                            {plan.isPopular && (
                                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold py-1 px-3 rounded-bl-lg flex items-center gap-1">
                                    <Star className="w-3 h-3" /> الأكثر قيمة
                                </div>
                            )}
                            <CardHeader className="items-center text-center">
                                <CardTitle className="font-headline text-2xl">{plan.name}</CardTitle>
                                <p className="text-4xl font-bold">{plan.price} <span className="text-lg font-normal text-muted-foreground">{t.planPriceSuffix}</span></p>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col">
                                <ul className="space-y-3 text-right text-foreground/80">
                                    {plan.features.map(feat => (
                                        <li key={feat} className="flex items-start gap-2">
                                            <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                            <span>{feat}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" onClick={() => handleSubscriptionAction(plan.name)} disabled={plan.isCurrent && plan.name !== 'باقة شهر واحد'}>
                                    {plan.isCurrent ? (plan.name === 'باقة شهر واحد' ? 'تجديد الاشتراك' : 'الباقة الحالية') : 'الترقية الآن'}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
             <div className="text-center">
                <Button variant="destructive" className="w-full max-w-sm mx-auto">إلغاء الاشتراك</Button>
                <p className="text-xs text-muted-foreground mt-2">سيتم إلغاء التجديد التلقائي عند نهاية الفترة الحالية.</p>
            </div>
        </div>
    );
}