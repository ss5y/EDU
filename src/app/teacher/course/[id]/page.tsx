import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { courses } from "@/lib/placeholder-data";
import type { Course } from "@/lib/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Star, BookOpen } from "lucide-react";

type PageParams = {
  id: string;
};

export default function TeacherCoursePage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  // ✅ الطريقة الجديدة في Next 15: params عبارة عن Promise
  const { id } = use(params);

  const courseId = Number(id);
  const course = courses.find((c) => c.id === courseId) as unknown as Course | undefined;

  if (!course) {
    notFound();
  }

  const anyCourse = course as any;
  const chapters = anyCourse.chapters ?? anyCourse.sections ?? [];

  return (
    <div className="space-y-8">
      {/* الهيدر الرئيسي للكورس */}
      <div className="grid gap-8 lg:grid-cols-[2fr,1fr] items-start">
        <div className="space-y-4">
          <Badge variant="outline" className="text-sm">
            لوحة تحكم المعلّم
          </Badge>

          <h1 className="font-headline text-3xl font-bold">
            {course.title}
          </h1>

          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              الكود: {course.code}
            </span>
            {course.category && (
  <span className="flex items-center gap-1">
    <Badge variant="secondary">{course.category}</Badge>
  </span>
            )}
            <span>المعلّم: {anyCourse.teacher ?? anyCourse.instructor}</span>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              {course.rating.toFixed(1)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {course.enrolledStudents} طالب
            </span>
          </div>

          <p className="text-sm text-muted-foreground">
            {anyCourse.shortDescription ??
              "هنا يمكنك إدارة محتوى الكورس، متابعة تقدم الطلاب، وإضافة الدروس والاختبارات."}
          </p>

          <div className="flex flex-wrap gap-3">
            <Link href={`/teacher/course/${course.id}/content`}>
              <Button>إدارة محتوى الكورس</Button>
            </Link>
            <Link href={`/teacher/course/${course.id}/students`}>
              <Button variant="outline">عرض الطلاب المسجّلين</Button>
            </Link>
          </div>
        </div>

        {/* صورة الكورس */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
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
          </CardContent>
        </Card>
      </div>

      {/* قائمة الشباتر/الوحدات لو موجودة في البيانات */}
      {Array.isArray(chapters) && chapters.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-headline text-2xl font-semibold">
            وحدات الكورس (للمعلّم)
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {chapters.map((chapter: any, index: number) => (
              <Card key={chapter.id ?? index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{chapter.title ?? `الوحدة ${index + 1}`}</span>
                    {chapter.lessons && (
                      <Badge variant="outline">
                        {chapter.lessons.length} درس
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    {chapter.description ??
                      "يمكنك تعديل محتوى هذه الوحدة من صفحة إدارة المحتوى."}
                  </p>
                  <Link
                    href={`/teacher/course/${course.id}/content?chapter=${index}`}
                  >
                    <Button variant="outline" size="sm">
                      إدارة هذه الوحدة
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
