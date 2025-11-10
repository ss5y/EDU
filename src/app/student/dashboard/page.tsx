"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock } from "lucide-react";

import { departments } from "@/lib/departments-data";
import type { Course } from "@/lib/types";
import { useLanguage } from "@/hooks/use-language";

type EnrolledCourse = Course & {
  progress: number;
  status: "active" | "trial" | "completed";
};

export default function StudentDashboardPage() {
  const { t } = useLanguage();
  const [displayName, setDisplayName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [department, setDepartment] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("eduSmartUser");
    if (stored) {
      const parsed = JSON.parse(stored);
      setDisplayName(parsed?.name || "");
      setSpecialization(parsed?.specialization || "");
      setDepartment(parsed?.department || "");
    }
  }, []);

  // 🧠 البحث عن القسم والتخصص من بيانات departments-data.ts
  const specializationData = useMemo(() => {
    const dep = departments.find((d) => d.id === department);
    if (!dep) return null;
    return dep.specializations.find(
      (s) => s.name.ar === specialization || s.name.en === specialization
    );
  }, [department, specialization]);

  // 🎓 استخراج المواد من المستويات والفصول الدراسية
  const specializationMaterials = useMemo(() => {
    if (!specializationData) return [];
    return specializationData.levels.flatMap((lvl) =>
      lvl.semesters.flatMap((sem) => sem.materials.slice(0, 3)) // نأخذ فقط أول 3 مواد من كل فصل
    );
  }, [specializationData]);

  // 🧩 توليد كورسات من المواد المستخرجة
  const generatedCourses: Course[] = useMemo(() => {
    return specializationMaterials.map((mat, idx) => ({
      id: 1000 + idx,
      teacherId: 1,
      title: mat.name.ar,
      code: mat.code,
      description: `مقرر ${mat.name.ar} لتخصص ${specialization}`,
      teacher: "هيئة التدريس",
      rating: 4.5,
      price: null,
      isFreeTrial: true,
      emoji: "📘",
      specialization,
      popularity: "medium",
      newness: "recent",
      enrolledStudents: 25,
      reviews: [],
      content: {
        chapters: [
          {
            id: 1,
            title: "الوحدة الأولى",
            lessons: [
              { id: 1, title: "مقدمة", isPaid: false },
              { id: 2, title: "شرح المحتوى", isPaid: false },
            ],
            quizzes: [],
            assignments: [],
            additionalMaterials: [],
          },
        ],
      },
    }));
  }, [specialization, specializationMaterials]);

  // 📊 إضافة حالة التقدم لكل كورس
  const enrolledCourses: EnrolledCourse[] = useMemo(() => {
    return generatedCourses.map((c) => ({
      ...c,
      progress: Math.floor(Math.random() * 100),
      status: "active",
    }));
  }, [generatedCourses]);

  // ⏱️ حساب الوقت التقريبي للدراسة
  const totalStudyHours = useMemo(() => {
    const totalProgress = enrolledCourses.reduce((acc, c) => acc + c.progress, 0);
    return Math.max(1, Math.round(totalProgress / 10));
  }, [enrolledCourses]);

  return (
    <div className="space-y-8">
      {/* 👋 الترحيب بالطالب */}
      <div>
        <h1 className="font-headline text-3xl font-bold">
          مرحباً بالطالب {displayName || "الطالب"}!
        </h1>
        <p className="text-muted-foreground mt-1">
          تخصصك الحالي:{" "}
          <span className="font-semibold">{specialization || "غير محدد"}</span>
        </p>
        {department && (
          <p className="text-sm text-muted-foreground">
            القسم: <span className="font-semibold">{department}</span>
          </p>
        )}
      </div>

      {/* 🧾 إحصائيات */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">عدد المواد</CardTitle>
            <BookOpen className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{generatedCourses.length}</div>
            <p className="text-xs text-muted-foreground">عدد المواد في تخصصك.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">الساعات الدراسية</CardTitle>
            <Clock className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudyHours}</div>
            <p className="text-xs text-muted-foreground">
              تقدير تقريبي لوقت التعلم المنجز.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 📚 عرض المواد */}
      <section className="space-y-4">
        <h2 className="font-headline text-2xl font-semibold">
          المواد في تخصصك
        </h2>

        {generatedCourses.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            لا توجد مواد حالياً لهذا التخصص.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map((course) => (
              <Card key={course.id} className="flex flex-col">
                <CardHeader className="p-0">
                  <div className="relative aspect-video bg-muted flex items-center justify-center rounded-t-lg overflow-hidden">
                    <span className="text-5xl">{course.emoji}</span>
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
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
