'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Course {
  id: number;
  title: string;
}

export default function CoursesPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // ✅ تحقق من وجود اشتراك في localStorage (المفتاح الجديد)
    const subscriptionPlan = localStorage.getItem('edu_subscription_plan');

    if (!subscriptionPlan) {
      // ما عنده اشتراك → يرجع لصفحة لوحة الطالب (اللي فيها اختيار الباقة)
      router.push('/student/dashboard');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) {
    return (
      <main style={{ padding: 40, direction: 'rtl', fontFamily: 'sans-serif' }}>
        <p>جارٍ التحقق من الاشتراك...</p>
      </main>
    );
  }

  const courses: Course[] = [
    { id: 1, title: 'مقدمة في البرمجة' },
    { id: 2, title: 'تصميم واجهات المستخدم' },
    { id: 3, title: 'تعلم الآلة للمبتدئين' },
  ];

  return (
    <main style={{ padding: 40, direction: 'rtl', fontFamily: 'sans-serif' }}>
      <h1>صفحة الكورسات</h1>
      <p>مرحباً! هذه قائمة الكورسات المتاحة بعد الاشتراك.</p>
      <ul>
        {courses.map((c: Course) => (
          <li key={c.id} style={{ margin: 10 }}>
            {c.title}
          </li>
        ))}
      </ul>
    </main>
  );
}
