"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

type EnrolledCourse = {
  id: number;
  code: string;
  title: string;
  description?: string;
  teacher?: string;
  specialization?: string;
  emoji?: string;
  imageUrl?: string;
  rating?: number;
  hours?: number;
  status: "active" | "trial" | "completed";
  progress: number;
};

export default function StudentMyCoursesPage() {
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
      if (Array.isArray(parsed)) {
        setCourses(parsed);
      } else {
        setCourses([]);
      }
    } catch (err) {
      console.warn("failed to read student_enrolled_courses", err);
      setCourses([]);
    }
  }, []);

  const getStatusText = (status: EnrolledCourse["status"]) => {
    if (status === "completed") return t.statusCompleted ?? "مكتمل";
    if (status === "trial") return t.statusTrial ?? "تجربة";
    return t.statusActive ?? "نشط";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">
          {t.myCourses ?? "كورساتي"}
        </h1>
        <p className="text-muted-foreground">
          {t.enrolledCourses ?? "الكورسات المسجلة."}
        </p>
      </div>

      {courses.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          لا توجد كورسات مسجلة حالياً. اذهب إلى صفحة "اكتشف الكورسات" واختر
          موادك.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, index) => (
            <Card
              key={`${course.id}-${index}`}
              className="flex flex-col overflow-hidden"
            >
              <Link
                href={`/student/course/${course.id}`}
                className="flex flex-col flex-1"
              >
                <CardHeader className="p-0">
                  <div className="relative aspect-video bg-muted flex items-center justify-center">
                    {course.imageUrl ? (
                      <Image
                        src={course.imageUrl}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-6xl">📘</span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-4 flex-1 space-y-2">
                  <div className="flex justify-between items-start mb-1">
                    <Badge
                      variant={
                        course.status === "completed" ? "default" : "secondary"
                      }
                    >
                      {getStatusText(course.status)}
                    </Badge>
                    <Badge variant="outline">{course.code}</Badge>
                  </div>

                  <h3 className="font-semibold text-lg">{course.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {course.teacher || "هيئة التدريس"}
                  </p>

                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>مدى التقدم</span>
                      <span>{course.progress ?? 0}%</span>
                    </div>
                    <Progress value={course.progress ?? 0} />
                  </div>
                </CardContent>
              </Link>

              <CardFooter className="p-4">
                <Link href={`/student/course/${course.id}`} className="w-full">
                  <Button className="w-full">
                    {t.continueCourse ?? "متابعة الكورس"}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
