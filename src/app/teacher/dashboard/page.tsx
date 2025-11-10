"use client";

import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { teacherData } from "@/lib/placeholder-data";
import { useLanguage } from "@/hooks/use-language";

import Link from "next/link";
import { Star, Users, BookCopy, Edit, Trash2 } from "lucide-react";

export default function TeacherDashboardPage() {
  const { t } = useLanguage();

  // الاسم الذي سيظهر في الترحيب
  const [displayName, setDisplayName] = useState<string>(teacherData.name);

  // قراءة اسم المستخدم من localStorage إذا كان موجود
  useEffect(() => {
    try {
      const raw = localStorage.getItem("eduSmartUser");
      if (raw) {
        const user = JSON.parse(raw);
        if (user?.name && typeof user.name === "string") {
          setDisplayName(user.name);
        }
      }
    } catch (err) {
      console.warn("Failed to read teacher from localStorage", err);
    }
  }, []);

  // تقدير بسيط لعدد آخر الدورات لعرضها
  const latestCourses = teacherData.courses.slice(0, 3);

  return (
    <div className="container mx-auto space-y-8 py-8">
      {/* العنوان الرئيسي */}
      <section className="space-y-2">
        <h1 className="font-headline text-3xl font-bold">
          {t.welcome} {displayName || teacherData.name}!
        </h1>
        <p className="text-muted-foreground">{t.teacherDashboardIntro}</p>
      </section>

      {/* كروت الإحصائيات */}
      <section className="grid gap-6 md:grid-cols-3">
        <Card className="flex items-center gap-4 p-4">
          <Star className="h-8 w-8" />
          <div>
            <h3 className="text-sm text-muted-foreground">
              {t.averageRating}
            </h3>
            <p className="text-2xl font-bold">
              {teacherData.averageRating.toFixed(1)}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-4">
          <Users className="h-8 w-8" />
          <div>
            <h3 className="text-sm text-muted-foreground">
              {t.totalStudents}
            </h3>
            <p className="text-2xl font-bold">{teacherData.totalStudents}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-4">
          <BookCopy className="h-8 w-8" />
          <div>
            <h3 className="text-sm text-muted-foreground">
              {t.publishedCourses}
            </h3>
            <p className="text-2xl font-bold">{teacherData.totalCourses}</p>
          </div>
        </Card>
      </section>

      {/* آخر الدورات */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-headline text-2xl font-bold">
            {t.latestCourses}
          </h2>
          <Link href="/teacher/courses">
            <Button variant="outline">{t.viewAllCourses}</Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {latestCourses.map((course) => (
            <Card key={course.id} className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="font-headline text-lg">
                  {course.title}
                </CardTitle>
                <CardDescription>
                  {course.code} • {course.specialization}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>{course.description}</p>
                <p>
                  {t.enrolledStudents}: {course.enrolledStudents}
                </p>
                <p className="flex items-center gap-1">
                  <Star className="h-4 w-4" /> {course.rating.toFixed(1)}
                </p>
              </CardContent>

              <CardFooter className="grid grid-cols-2 gap-2">
                <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  {t.edit}
                </Button>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t.delete}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
