"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { courses, studentData } from "@/lib/placeholder-data";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Star,
  Users,
  PlayCircle,
  HelpCircle,
  FileText,
  Download,
} from "lucide-react";
import type { Course } from "@/lib/types";

type LocalEnrollment = {
  courseId: number;
  status: "active" | "trial" | "completed";
  progress: number;
  enrolledAt: string;
};

export default function CourseDetailPage() {
  const params = useParams();
  const idParam =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : "";

  const { t } = useLanguage();
  const { toast } = useToast();

// نخليها any عشان نوقف صداع TypeScript هنا
const course = (courses as any[]).find(
  (c) => String(c.id) === String(idParam)
);


  // لو الكورس غير موجود
  if (!course) {
    return (
      <div className="py-12">
        <h1 className="font-headline text-2xl font-bold mb-2">
          {t.courseNotFound || "لم يتم العثور على هذا الكورس"}
        </h1>
        <p className="text-muted-foreground">
          {t.courseNotFoundDesc || "ربما تم حذفه أو تغيير رابطه."}
        </p>
      </div>
    );
  }

  const enrollmentFromSeed = studentData.enrolledCourses.find(
    (ec) => ec.id === course.id
  );

  const [isEnrolled, setIsEnrolled] = useState<boolean>(!!enrollmentFromSeed);
  const [isCompleted, setIsCompleted] = useState<boolean>(
    enrollmentFromSeed?.status === "completed"
  );
  const [progress, setProgress] = useState<number>(
    enrollmentFromSeed?.progress ?? 0
  );

  // نقرأ التسجيل من localStorage
  useEffect(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem("studentEnrollments")
          : null;

      if (!raw) return;

      const parsed = JSON.parse(raw) as LocalEnrollment[];
      const found = parsed.find((e) => e.courseId === course.id);
      if (found) {
        setIsEnrolled(true);
        setProgress(found.progress ?? 0);
        if (found.status === "completed") {
          setIsCompleted(true);
        }
      }
    } catch (error) {
      console.warn("Failed to read studentEnrollments", error);
    }
  }, [course.id]);

  const handleRegister = () => {
    try {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem("studentEnrollments")
          : null;
      let enrollments: LocalEnrollment[] = raw ? JSON.parse(raw) : [];

      const existing = enrollments.find((e) => e.courseId === course.id);
      if (!existing) {
        enrollments.push({
          courseId: course.id,
          status: course.isFreeTrial ? "trial" : "active",
          progress: 0,
          enrolledAt: new Date().toISOString(),
        });
        localStorage.setItem(
          "studentEnrollments",
          JSON.stringify(enrollments)
        );
      }

      setIsEnrolled(true);
      setIsCompleted(false);
      setProgress(0);

      toast({
        title: t.registeredSuccess,
        description: `${t.registeredCourse} "${course.title}".`,
      });
    } catch (error) {
      console.warn("Failed to save enrollment", error);
      toast({
        title: t.error,
        description: t.somethingWentWrong,
        variant: "destructive",
      });
    }
  };

  // محتوى الكورس (فصول + دروس + ملخصات)
  const content = (course as any).content;
  const chapters: any[] = content?.chapters || [];

  return (
    <div className="space-y-8">
      {/* الهيدر الرئيسي للكورس */}
      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl bg-muted text-4xl">
              {course.image ? (
                <img
                  src={course.image.imageUrl}
                  alt={course.image.description || course.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{course.emoji}</span>
              )}
            </div>
            <div>
              <CardTitle className="font-headline text-2xl">
                {course.title}
              </CardTitle>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline">{course.code}</Badge>
                <span>• {course.teacher}</span>
                <span>• {course.specialization}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start gap-2 md:items-end">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-amber-400 text-amber-500" />
              <span className="font-bold text-amber-500">
                {course.rating.toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground">
                ({course.enrolledStudents} {t.student})
              </span>
            </div>

            <div>
              {course.price !== null ? (
                <p className="text-lg font-bold text-primary">
                  {course.price} {t.omr}
                </p>
              ) : (
                <Badge variant="secondary">{t.free}</Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {course.description}
          </p>

          {isEnrolled && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{t.learningProgress || "مدى التقدم"}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>
              {course.enrolledStudents} {t.student}
            </span>
          </div>

          {!isEnrolled ? (
            <Button onClick={handleRegister}>{t.enrollNow}</Button>
          ) : isCompleted ? (
            <Badge variant="outline" className="border-green-500 text-green-600">
              {t.statusCompleted}
            </Badge>
          ) : (
            <Badge variant="outline" className="border-blue-500 text-blue-600">
              {t.statusActive}
            </Badge>
          )}
        </CardFooter>
      </Card>

      {/* 👇 محتوى الكورس: فيديوات / شروحات / اختبارات / ملخصات PDF */}
      {chapters.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t.courseContent || "محتوى الكورس"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {chapters.map((chap, idx) => (
              <div
                key={idx}
                className="rounded-lg border p-4 space-y-3 bg-card"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold">
                    {chap.title || `${t.chapter || "الوحدة"} ${idx + 1}`}
                  </h3>
                  <Badge variant="outline">
                    {(chap.type as string) || (t.chapter || "وحدة")}
                  </Badge>
                </div>
                {chap.description && (
                  <p className="text-sm text-muted-foreground">
                    {chap.description}
                  </p>
                )}

                {/* الدروس (فيديو / مقال / اختبار) */}
                {Array.isArray(chap.lessons) && chap.lessons.length > 0 && (
                  <div className="space-y-2">
                    {chap.lessons.map((lesson: any, i: number) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-md bg-muted/60 px-3 py-2 text-sm"
                      >
                        <div className="flex items-center gap-2">
                          {lesson.type === "quiz" ? (
                            <HelpCircle className="h-4 w-4 text-amber-500" />
                          ) : lesson.type === "article" ? (
                            <FileText className="h-4 w-4 text-blue-500" />
                          ) : (
                            <PlayCircle className="h-4 w-4 text-primary" />
                          )}
                          <span>{lesson.title || t.lesson || "درس"}</span>

                        </div>
                        {lesson.duration && (
                          <span className="text-xs text-muted-foreground">
                            {lesson.duration}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* ملخصات PDF القابلة للتنزيل */}
                {Array.isArray(chap.pdfSummaries) &&
                  chap.pdfSummaries.length > 0 && (
                    <div className="space-y-2 pt-3 mt-2 border-t">
                      <p className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        ملخصات PDF للوحدة
                      </p>
                      {chap.pdfSummaries.map((pdf: any, j: number) => (
                        <a
                          key={j}
                          href={pdf.url}
                          download
                          className="flex items-center justify-between rounded-md border bg-background px-3 py-2 text-sm hover:bg-muted/70"
                        >
                          <span className="flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            {pdf.title ||
                              `ملخص الوحدة ${idx + 1} - ${j + 1}`}
                          </span>
                          {pdf.size && (
                            <span className="text-xs text-muted-foreground">
                              {pdf.size}
                            </span>
                          )}
                        </a>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
