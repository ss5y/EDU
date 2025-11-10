"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import type { Course } from "@/lib/types";

type CourseCardProps = {
  course: Course;
};

type Enrollment = {
  courseId: number;
  status: "active" | "trial" | "completed";
  progress: number;
  enrolledAt: string;
};

export function CourseCard({ course }: CourseCardProps) {
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleRegister = () => {
    try {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem("studentEnrollments")
          : null;
      let enrollments: Enrollment[] = raw ? JSON.parse(raw) : [];

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

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col">
      <div className="flex-1 flex flex-col">
        <Link href={`/student/course/${course.id}`} className="block">
          <CardHeader className="p-0">
            <div className="relative aspect-video bg-muted flex items-center justify-center">
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
        </Link>

        <CardContent className="p-4 flex-1">
          <div className="flex justify-between items-start mb-2">
            <Link
              href={`/student/course/${course.id}`}
              className="hover:underline flex-1"
            >
              <h3 className="font-semibold text-lg truncate pr-2">
                {course.title}
              </h3>
            </Link>
            <Badge variant="outline">{course.code}</Badge>
          </div>

          <p className="text-sm text-muted-foreground">
            {course.teacher}
          </p>

          <div className="flex items-center justify-between text-sm text-muted-foreground mt-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span className="font-bold text-amber-500">
                {course.rating.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{course.enrolledStudents}</span>
            </div>
          </div>
        </CardContent>
      </div>

      <CardFooter className="p-4 flex justify-between items-center bg-muted/30">
        <div>
          {course.isFreeTrial ? (
            <Badge
              variant="outline"
              className="border-green-500 text-green-600"
            >
              {t.freeTrial}
            </Badge>
          ) : course.price !== null ? (
            <p className="font-bold text-lg text-primary">
              {course.price} {t.omr}
            </p>
          ) : (
            <Badge variant="secondary">{t.free}</Badge>
          )}
        </div>
        <Button onClick={handleRegister}>{t.enrollNow}</Button>
      </CardFooter>
    </Card>
  );
}
