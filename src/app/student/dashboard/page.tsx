"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Clock } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

type EnrolledCourse = {
  id: number;
  code: string;
  title: string;
  hours?: number;
  progress?: number;
};

export default function StudentDashboardPage() {
  const { t } = useLanguage();
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("student_enrolled_courses");
      if (!raw) {
        setCourses([]);
        return;
      }
      const parsed = JSON.parse(raw) as EnrolledCourse[];
      if (Array.isArray(parsed)) setCourses(parsed);
      else setCourses([]);
    } catch {
      setCourses([]);
    }
  }, []);

  const totalHours = useMemo(
    () =>
      courses.reduce(
        (sum, c) => sum + (typeof c.hours === "number" ? c.hours : 3),
        0
      ),
    [courses]
  );

  const avgProgress = useMemo(() => {
    if (courses.length === 0) return 0;
    const sum = courses.reduce(
      (acc, c) => acc + (typeof c.progress === "number" ? c.progress : 0),
      0
    );
    return Math.round(sum / courses.length);
  }, [courses]);

  return (
    <div className="space-y-8">
      {/* الترحيب البسيط */}
      <section>
        <h1 className="font-headline text-3xl font-bold">
          مرحباً بك في لوحة التحكم 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          هنا تجد نظرة سريعة على موادك المسجلة وتقدّمك فيها.
        </p>
      </section>

      {/* الكروت الإحصائية */}
      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              عدد المواد المسجلة
            </CardTitle>
            <BookOpen className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground">
              إجمالي الكورسات التي قمت باختيارها.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              الساعات الدراسية التقريبية
            </CardTitle>
            <Clock className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours}</div>
            <p className="text-xs text-muted-foreground">
              مجموع الساعات المعتمدة لجميع المواد.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              متوسط التقدم
            </CardTitle>
            <Clock className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgProgress}%</div>
            <p className="text-xs text-muted-foreground">
              نسبة إنجاز تقريبية في كل الكورسات.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
