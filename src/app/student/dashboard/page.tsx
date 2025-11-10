"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Star, Users, BookOpen, Clock } from "lucide-react";

import { useLanguage } from "@/hooks/use-language";
import { courses, studentData } from "@/lib/placeholder-data";
import type { Course } from "@/lib/types";

type EnrolledCourse = Course & {
  progress: number;
  status: "active" | "trial" | "completed";
};

export default function StudentDashboardPage() {
  const { t } = useLanguage();

  // اسم الطالب للعرض في الترحيب
  const [displayName, setDisplayName] = useState(studentData.name);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("studentName");
    if (stored && stored.trim()) {
      setDisplayName(stored.trim());
    }
  }, []);

  // ندمج كورسات الطالب مع قائمة الكورسات الأساسية
  const enrolledCourses: EnrolledCourse[] = useMemo(() => {
    return (studentData.enrolledCourses as any[])
      .map((ec: any) => {
        const course = courses.find((c) => c.id === ec.id);
        if (!course) return null;
        return {
  ...course,
  progress: ec.progress ?? 0,
  status: (ec.status || "active") as "active" | "trial" | "completed",
} as unknown as EnrolledCourse;

      })
      .filter(
        (c): c is EnrolledCourse =>
          !!c && !!c.title && !!c.code // نتأكد ما نعرض كروت فاضية
      );
  }, []);

  const activeCourses = enrolledCourses.filter(
    (c) => c.status !== "completed"
  );
  const completedCourses = enrolledCourses.filter(
    (c) => c.status === "completed"
  );

  const recommendedCourses = useMemo(() => courses.slice(0, 4), []);

  const totalStudyHours = useMemo(() => {
    const totalProgress = enrolledCourses.reduce(
      (acc, c) => acc + (c.progress || 0),
      0
    );
    return Math.max(1, Math.round(totalProgress / 10));
  }, [enrolledCourses]);

  return (
    <div className="space-y-8">
      {/* هيدر الترحيب */}
      <div className="flex flex-col gap-2">
        <h1 className="font-headline text-3xl font-bold">
          مرحباً بالطالب {displayName}!
        </h1>
        <p className="text-muted-foreground">
          هذا هو ملخص نشاطك الأكاديمي.
        </p>
      </div>

      {/* كروت الإحصائيات */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              {t.activeCourses || "الكورسات النشطة"}
            </CardTitle>
            <BookOpen className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCourses.length}</div>
            <p className="text-xs text-muted-foreground">
              الكورسات التي تتابعها حالياً.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              {t.completedCourses || "كورسات مكتملة"}
            </CardTitle>
            <Star className="h-5 w-5 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedCourses.length}
            </div>
            <p className="text-xs text-muted-foreground">
              عدد الكورسات التي أنهيتها بنجاح.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              {t.totalStudents || "إجمالي الساعات الدراسية"}
            </CardTitle>
            <Clock className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudyHours}</div>
            <p className="text-xs text-muted-foreground">
              تقدير تقريبي لوقت التعلم الذي أنجزته.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* كورساتي الحالية */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-headline text-2xl font-semibold">
            {t.myCourses || "كورساتي"}
          </h2>
          <Link href="/student/my-courses">
            <Button variant="outline" size="sm">
              عرض كل الكورسات
            </Button>
          </Link>
        </div>

        {enrolledCourses.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            لم تسجل في أي كورس حتى الآن. ابدأ من صفحة{" "}
            <Link
              href="/student/browse-courses"
              className="text-primary underline"
            >
              اكتشف الكورسات
            </Link>
            .
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map((course) => (
              <Card key={course.id} className="flex flex-col">
                <Link
                  href={`/student/course/${course.id}`}
                  className="flex flex-col flex-1"
                >
                  <CardHeader className="p-0">
                    <div className="relative aspect-video bg-muted flex items-center justify-center rounded-t-lg overflow-hidden">
                      {course.image?.imageUrl ? (
                        <Image
                          src={course.image.imageUrl}
                          alt={course.image.description || course.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-5xl">{course.emoji}</span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg truncate pr-2">
                        {course.title}
                      </h3>
                      <Badge variant="outline">{course.code}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {course.teacher}
                    </p>
                    <div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>مدى التقدّم</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} />
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* كورسات مقترحة */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-headline text-2xl font-semibold">
            {t.discoverCourses || "كورسات مقترحة لك"}
          </h2>
          <Link href="/student/browse-courses">
            <Button variant="outline" size="sm">
              تصفح المزيد
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {recommendedCourses.map((course) => (
            <Card key={course.id} className="flex flex-col">
              <Link
                href={`/student/course/${course.id}`}
                className="flex flex-col flex-1"
              >
                <CardHeader className="p-0">
                  <div className="relative aspect-video bg-muted flex items-center justify-center rounded-t-lg overflow-hidden">
                    {course.image?.imageUrl ? (
                      <Image
                        src={course.image.imageUrl}
                        alt={course.image.description || course.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-5xl">{course.emoji}</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-base truncate pr-2">
                      {course.title}
                    </h3>
                    <Badge variant="outline">{course.code}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {course.teacher}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                      {course.rating.toFixed(1)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {course.enrolledStudents}
                    </span>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
