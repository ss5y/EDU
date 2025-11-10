'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CheckCircle2, Star, Check } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { courses } from '@/lib/placeholder-data';
import Link from 'next/link';
import { useLanguage } from '@/hooks/use-language';
import { CourseCard } from '@/components/course-card';

export default function Home() {
  const { t } = useLanguage();

  const features = [
    {
      title: t.featureTrial,
      description: t.featureTrialDesc,
      icon: <CheckCircle2 className="h-8 w-8 text-accent" />,
    },
    {
      title: t.featureAssessments,
      description: t.featureAssessmentsDesc,
      icon: <CheckCircle2 className="h-8 w-8 text-accent" />,
    },
    {
      title: t.featureTheme,
      description: t.featureThemeDesc,
      icon: <CheckCircle2 className="h-8 w-8 text-accent" />,
    },
    {
      title: t.featureMultiLanguage,
      description: t.featureMultiLanguageDesc,
      icon: <CheckCircle2 className="h-8 w-8 text-accent" />,
    },
    {
      title: t.featurePoints,
      description: t.featurePointsDesc,
      icon: <CheckCircle2 className="h-8 w-8 text-accent" />,
    },
    {
      title: t.featureDashboards,
      description: t.featureDashboardsDesc,
      icon: <CheckCircle2 className="h-8 w-8 text-accent" />,
    },
  ];

  const howItWorks = [
    { title: t.step1Title, description: t.step1Desc, icon: '👤' },
    { title: t.step2Title, description: t.step2Desc, icon: '📚' },
    { title: t.step3Title, description: t.step3Desc, icon: '🚀' },
  ];

  const plans = [
    {
      name: 'باقة شهر واحد',
      price: '10',
      features: ['اختر 3 كورسات', 'الكورس الإضافي = 1.499 ريال', 'دعم عبر البريد الإلكتروني'],
      isPopular: false,
    },
    {
      name: 'باقة 3 أشهر',
      price: '19.99',
      features: [
        'اختر 5 كورسات',
        'الكورس الإضافي = 1.199 ريال',
        'نقاط يمكن استبدالها بكورس إضافي',
        'تجربة مجانية 7 أيام',
      ],
      isPopular: true,
    },
    {
      name: 'باقة سنوية',
      price: '40',
      features: ['وصول غير محدود للكورسات', 'مساعد AI شخصي', 'جلسات شهرية مع المعلمين', 'دعم ذو أولوية'],
      isPopular: false,
    },
  ];

  // ✅ نأخذ أول 4 كورسات ونعاملها كـ any عشان نرتاح من TypeScript هنا
  const latestCourses = courses.slice(0, 4) as any[];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">

        {/* ====== صوره ====== */}
        <div className="relative w-full h-[500px]">
          <Image
            src="/edu.png" 
            alt="University Lecture Hall"
            fill
            style={{ objectFit: 'cover' }}
            priority
            className="shadow-2xl"
          />
        </div>

        {/* زر الأقسام والمواد تحت الصورة مباشرة */}
        <section className="w-full py-6">
          <div className="container mx-auto px-4 md:px-6 flex justify-center">
            <Link href="/departments">
              <Button size="lg" variant="outline">
                استكشف الأقسام والمواد
              </Button>
            </Link>
          </div>
        </section>

        {/* ====== قسم الكورسات ====== */}
        <section id="latest-courses" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
                {t.latestCourses}
              </h2>
              <p className="max-w-[900px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t.featuresSubtitle}
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {latestCourses.map((course) => (
                <CourseCard key={course.id} course={course as any} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/student/browse-courses">
                <Button variant="outline">{t.viewAll}</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ====== كيف يعمل ====== */}
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
                {t.howItWorksTitle}
              </h2>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {howItWorks.map((step) => (
                <div key={step.title} className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl mb-4">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====== الميزات ====== */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
                  {t.featuresTitle}
                </h2>
                <p className="max-w-[900px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {t.featuresSubtitle}
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-12">
              {features.map((feature, index) => (
                <Card key={index} className="transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                  <CardHeader className="flex flex-row items-center gap-4">
                    {feature.icon}
                    <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/80">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ====== الباقات ====== */}
        <section id="plans" className="w-full bg-card py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
                {t.plansTitle}
              </h2>
            </div>
            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
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
                    <p className="text-4xl font-bold">
                      {plan.price}{' '}
                      <span className="text-lg font-normal text-muted-foreground">{t.planPriceSuffix}</span>
                    </p>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <ul className="space-y-3 text-center text-foreground/80">
                      {plan.features.map((feat) => (
                        <li key={feat} className="flex items-center gap-2">
                          <Check className="w-5 h-5 text-green-500" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2">
                    {plan.isPopular && <Button className="w-full" variant="outline">{t.freeTrial}</Button>}
                    <Button className="w-full">{t.subscribeNow}</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ====== دعوة للتسجيل ====== */}
        <section id="cta" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center bg-primary text-primary-foreground p-12 rounded-lg">
              <h2 className="font-headline text-3xl font-bold">{t.ctaTitle}</h2>
              <Link href="/signup">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  {t.createNewAccount}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
