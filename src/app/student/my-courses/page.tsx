"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { courses, studentData } from "@/lib/placeholder-data";
import type { Course, EnrolledCourse as EnrolledCourseType } from "@/lib/types";

type Enrollment = {
  courseId: number;
  status: "active" | "trial" | "completed";
  progress: number;
  enrolledAt?: string;
};

type EnrolledCourse = EnrolledCourseType; // بس عشان الاسم أقصر هنا

function getStatusText(
  status: "active" | "trial" | "completed",
  t: any
) {
  switch (status) {
    case "active":
      return t.statusActive;
    case "trial":
      return t.statusTrial;
    case "completed":
      return t.statusCompleted;
    default:
      return status;
  }
}

export default function StudentMyCoursesPage() {
  const { t } = useLanguage();
  const { toast } = useToast();

  const [localEnrollments, setLocalEnrollments] = useState<Enrollment[]>([]);

  // 📌 نقرأ التسجيلات المحفوظة في المتصفح
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = localStorage.getItem("studentEnrollments");
      if (!raw) {
        setLocalEnrollments([]);
        return;
      }

      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setLocalEnrollments(parsed as Enrollment[]);
      } else {
        setLocalEnrollments([]);
      }
    } catch (error) {
      console.warn("Failed to read studentEnrollments", error);
      setLocalEnrollments([]);
    }
  }, []);

  // 📌 ندمج بيانات الطالب الأساسية مع اللي انحفظت في localStorage
  const allEnrolledCourses: EnrolledCourse[] = useMemo(() => {
    // 1) من studentData.enrolledCourses (البيانات الأساسية)
    const baseEnrolled: EnrolledCourse[] = Array.isArray(
      studentData.enrolledCourses
    )
      ? (studentData.enrolledCourses as any[]).map((c: any) => {
          const baseCoursePart = c as Course;

          const status =
            (c.status as EnrolledCourse["status"]) ?? ("active" as const);

          const progress =
            typeof c.progress === "number" && !Number.isNaN(c.progress)
              ? c.progress
              : 0;

          return {
            ...baseCoursePart,
            status,
            progress,
          } as EnrolledCourse;
        })
      : [];

    // IDs عشان ما نكرر نفس الكورس لو موجود بالأساس
    const baseIds = new Set(baseEnrolled.map((c) => c.id));

    // 2) إضافات من localStorage (studentEnrollments)
    const extraEnrolled: EnrolledCourse[] = Array.isArray(localEnrollments)
      ? localEnrollments
          .filter((e) => !baseIds.has(e.courseId))
          .map((e) => {
            const course = courses.find((c) => c.id === e.courseId);
            if (!course) return null;

            const status =
              (e.status as EnrolledCourse["status"]) ?? ("active" as const);

            const progress =
              typeof e.progress === "number" && !Number.isNaN(e.progress)
                ? e.progress
                : 0;

            return {
              ...course,
              status,
              progress,
            } as EnrolledCourse;
          })
          .filter(
            (c): c is EnrolledCourse =>
              !!c && !!c.title && !!c.code
          )
      : [];

    return [...baseEnrolled, ...extraEnrolled];
  }, [localEnrollments]);

  // ⚠️ نزيل أي كورس ناقص بيانات عشان ما يطلع كرت فاضي
  const visibleCourses = allEnrolledCourses.filter(
    (course) => course && course.title && course.code
  );

  const handleRateCourse = (title: string) => {
    toast({
      title: t.thanksForRating,
      description: `${t.rateCourse} "${title}"`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">{t.myCourses}</h1>
        <p className="text-muted-foreground">{t.enrolledCourses}</p>
      </div>

      {visibleCourses.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {t.noCoursesInCategory}
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleCourses.map((course, index) => (
            <Card key={`${course.id}-${index}`} className="flex flex-col">
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
                      <span className="text-6xl">{course.emoji}</span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-4 flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <Badge
                      variant={
                        course.status === "completed" ? "default" : "secondary"
                      }
                    >
                      {getStatusText(course.status, t)}
                    </Badge>
                    <Badge variant="outline">{course.code}</Badge>
                  </div>

                  <h3 className="font-semibold text-lg">{course.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {course.teacher}
                  </p>

                  <div className="mt-4">
                    <Progress value={course.progress} />
                    <p className="mt-1 text-right text-xs text-muted-foreground">
                      {course.progress}%
                    </p>
                  </div>
                </CardContent>
              </Link>

              <CardFooter className="p-4">
                {course.status === "completed" ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleRateCourse(course.title)}
                  >
                    <Star className="ml-2 h-4 w-4" /> {t.rateCourse}
                  </Button>
                ) : (
                  <Link
                    href={`/student/course/${course.id}`}
                    className="w-full"
                  >
                    <Button className="w-full">{t.continueCourse}</Button>
                  </Link>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
