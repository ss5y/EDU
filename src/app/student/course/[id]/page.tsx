"use client";

import { use, useEffect, useMemo, useState } from "react";

import { courses } from "@/lib/placeholder-data";
import type { Course } from "@/lib/types";

import { useLanguage } from "@/hooks/use-language";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import {
  BookOpen,
  FileText,
  ListChecks,
  PlayCircle,
  FilePenLine,
  Star,
  MessageCircle,
} from "lucide-react";

import { AiLearningWidget } from "@/components/ai-learning-widget";

/* ========= أنواع الدروس/الوحدات ========= */

type LessonType = "video" | "pdf" | "quiz" | "assignment";

type LessonAttachment = {
  name: string;
  size: number;
  dataUrl?: string;
};

type StudentLesson = {
  id: number;
  title: string;
  type: LessonType;
  url?: string;
  isPaid?: boolean;
  attachment?: LessonAttachment;
};

type StudentChapter = {
  id: number;
  title: string;
  description?: string;
  lessons: StudentLesson[];
};

type StoredMedia = {
  name: string;
  type: string;
  size: number;
  dataUrl?: string;
};

type StoredCourse = Course & {
  media?: StoredMedia[];
  department?: string;
  specialization?: string;
  videoUrl?: string;
};

/* ========= محتوى افتراضي لو الكورس ما فيه وحدات ========= */

function buildDefaultChaptersForCourse(course: StoredCourse): StudentChapter[] {
  return [
    {
      id: 1,
      title: `الوحدة الأولى: مقدمة في ${course.title}`,
      description: course.description ?? "",
      lessons: [
        {
          id: 1,
          title: "المحاضرة التعريفية",
          type: "video",
          url: course.videoUrl, // لو مضاف فيديو للكورس
        },
        {
          id: 2,
          title: "ملخص PDF للوحدة الأولى",
          type: "pdf",
          url: "#", // يمكنك تغييره لرابط PDF حقيقي
        },
        {
          id: 3,
          title: "اختبار قصير 1",
          type: "quiz",
        },
      ],
    },
  ];
}

/* ========= صفحة متابعة الكورس ========= */

export default function StudentCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ✅ Next 15: نفك الـ Promise
  const { id } = use(params);
  const courseId = Number(id);

  const { t, language } = useLanguage();

  const [course, setCourse] = useState<StoredCourse | null>(null);
  const [chapters, setChapters] = useState<StudentChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLessonTitle, setActiveLessonTitle] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    setLoading(true);

    // 1) من placeholder-data
    const baseCourse = courses.find(
      (c) => c.id === courseId
    ) as StoredCourse | undefined;

    // 2) كورسات المُعلّم المحفوظة محلياً (لو موجودة)
    let localCourse: StoredCourse | undefined;
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("teacherCourses");
        if (raw) {
          const parsed = JSON.parse(raw) as StoredCourse[];
          if (Array.isArray(parsed)) {
            localCourse = parsed.find((c) => c.id === courseId);
          }
        }
      } catch (err) {
        console.warn("Failed to read teacherCourses from localStorage", err);
      }
    }

    // 3) تحديد الكورس النهائي أو إنشاء افتراضي
    let finalCourse: StoredCourse | null = null;

    if (baseCourse) {
      finalCourse = baseCourse;
    } else if (localCourse) {
      finalCourse = localCourse;
    } else {
      finalCourse = {
        id: courseId,
        teacherId: 1, // معرّف افتراضي
        code: `CRS${courseId}`,
        title: "مقرر دراسي",
        teacher: "هيئة التدريس",
        description: "هذا الكورس تم إنشاؤه من خطتك الدراسية.",
        emoji: "📘",
        price: null,
        isFreeTrial: true,
        specialization: "",
        rating: 4.5,
        popularity: "standard" as any,
        newness: "recent" as any,
        enrolledStudents: 0,
        reviews: [],
        content: { chapters: [] },
      } as StoredCourse;
    }

    setCourse(finalCourse);

    const anyCourse = finalCourse as any;
    let rawChapters: any[] =
      anyCourse?.content?.chapters ?? anyCourse?.chapters ?? [];

    if (!Array.isArray(rawChapters)) rawChapters = [];

    let normalized: StudentChapter[] = rawChapters.map(
      (ch: any, index: number) => ({
        id: ch.id ?? index + 1,
        title: ch.title ?? `الوحدة ${index + 1}`,
        description: ch.description ?? "",
        lessons: Array.isArray(ch.lessons)
          ? ch.lessons.map((l: any, li: number) => ({
              id: l.id ?? li + 1,
              title: l.title ?? `درس ${li + 1}`,
              type: (l.type as LessonType) ?? ("video" as LessonType),
              url: l.url,
              isPaid: !!l.isPaid,
              attachment: l.attachment,
            }))
          : [],
      })
    );

    // لو ما فيه محتوى، أنشئ محتوى افتراضي
    if (normalized.length === 0) {
      normalized = buildDefaultChaptersForCourse(finalCourse);
    }

    setChapters(normalized);
    setLoading(false);
  }, [courseId]);

  const mainVideoUrl = useMemo(() => {
    if (!course) return undefined;
    if (course.videoUrl) return course.videoUrl;

    const firstVideo = chapters
      .flatMap((ch) => ch.lessons)
      .find((l) => l.type === "video" && l.url);

    return firstVideo?.url;
  }, [course, chapters]);

  if (loading || !course) {
    return <p className="text-sm text-muted-foreground">جارٍ تحميل الكورس...</p>;
  }

  const isAr = language === "ar";

  return (
    <div className="space-y-8">
      {/* الهيدر + الفيديو */}
      <div className="grid items-start gap-6 lg:grid-cols-[3fr,2fr]">
        <div className="space-y-4">
          <h1 className="font-headline text-3xl font-bold">{course.title}</h1>

          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <Badge variant="outline">{course.code}</Badge>
            {course.specialization && (
              <Badge variant="secondary">{course.specialization}</Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground">{course.description}</p>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
              {course.rating ? course.rating.toFixed(1) : "—"}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              {t.teacher || "المحاضر"}: {course.teacher}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() =>
              document.getElementById("ai-section")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            <MessageCircle className="ms-1 h-4 w-4" />
            {isAr ? "مساعد الذكاء الاصطناعي" : "AI study helper"}
          </Button>
        </div>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <PlayCircle className="h-5 w-5 text-primary" />
              {t.watchVideo || "مشاهدة فيديو تعريفي"}
            </CardTitle>
            <CardDescription>
              {t.courseContent || "يمكنك البدء بمشاهدة الفيديو التعريفي إن وجد."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mainVideoUrl ? (
              <div className="aspect-video w-full overflow-hidden rounded-md border bg-black">
                <video src={mainVideoUrl} controls className="h-full w-full object-contain" />
              </div>
            ) : (
              <div className="flex aspect-video w-full items-center justify-center rounded-md border bg-muted text-sm text-muted-foreground">
                لا يوجد فيديو تعريفي مضاف لهذا الكورس حالياً.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* الوحدات والدروس */}
      <section className="space-y-4">
        <h2 className="font-headline text-2xl font-semibold">
          {t.courseContent || "محتوى الكورس"}
        </h2>

        <div className="space-y-4">
          {chapters.map((chapter, index) => (
            <Card key={chapter.id}>
              <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold">
                      {index + 1}
                    </span>
                    {chapter.title}
                  </CardTitle>
                  {chapter.description && (
                    <CardDescription className="mt-1 text-xs">
                      {chapter.description}
                    </CardDescription>
                  )}
                </div>
                <Badge variant="outline" className="text-[10px]">
                  {chapter.lessons.length} {t.lessons || "درس"}
                </Badge>
              </CardHeader>

              <CardContent className="space-y-3">
                {chapter.lessons.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    لا توجد دروس في هذه الوحدة حالياً.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {chapter.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex flex-col gap-2 rounded-md border p-3 text-xs md:flex-row md:items-center md:justify-between"
                      >
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline">
                              {lesson.type === "video"
                                ? t.watchVideo || "فيديو"
                                : lesson.type === "pdf"
                                ? "ملف PDF / ملخص"
                                : lesson.type === "quiz"
                                ? t.quizzes || "اختبار"
                                : t.activities || "تمرين"}
                            </Badge>
                            <span className="font-semibold">{lesson.title}</span>
                            {lesson.isPaid && (
                              <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                                {t.paidContent || "محتوى مدفوع"}
                              </Badge>
                            )}
                          </div>

                          {lesson.url && (
                            <p className="break-all text-[11px] text-muted-foreground">
                              {lesson.type === "video"
                                ? "رابط الفيديو:"
                                : lesson.type === "pdf"
                                ? "رابط الملف:"
                                : "رابط/ملاحظة:"}{" "}
                              <a
                                href={lesson.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-primary underline"
                              >
                                {lesson.url}
                              </a>
                            </p>
                          )}

                          {lesson.attachment && (
                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                              <FileText className="h-3 w-3" />
                              <span>
                                ملخص مرفق: {lesson.attachment.name} (
                                {Math.round(lesson.attachment.size / 1024)} KB)
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 md:justify-end">
                          {lesson.type === "video" && (lesson.url || mainVideoUrl) && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                alert("يمكنك استخدام الفيديو العلوي كمشغّل رئيسي لهذا الدرس.");
                              }}
                            >
                              <PlayCircle className="ms-1 h-4 w-4" />
                              {t.watchVideo || "مشاهدة الفيديو"}
                            </Button>
                          )}

                          {lesson.type === "pdf" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                if (lesson.attachment?.dataUrl) {
                                  const win = window.open();
                                  if (win) {
                                    win.document.write(
                                      `<iframe src="${lesson.attachment.dataUrl}" style="border:0;width:100%;height:100%"></iframe>`
                                    );
                                  }
                                } else if (lesson.url) {
                                  window.open(lesson.url, "_blank", "noopener,noreferrer");
                                } else {
                                  alert("لا يوجد ملف ملخص مرتبط بهذا الدرس حالياً.");
                                }
                              }}
                            >
                              <FileText className="ms-1 h-4 w-4" />
                              {t.open || "فتح الملخص"}
                            </Button>
                          )}

                          {lesson.type === "quiz" && (
                            <Button
                              size="sm"
                              onClick={() => {
                                alert("مكان اختبار الكورس (يمكن لاحقاً ربطه باختبار تفاعلي أو AI Quiz).");
                              }}
                            >
                              <ListChecks className="ms-1 h-4 w-4" />
                              {t.startQuiz || "بدء الاختبار"}
                            </Button>
                          )}

                          {lesson.type === "assignment" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                alert("مكان رفع الحل أو واجبات الطالب (placeholder).");
                              }}
                            >
                              <FilePenLine className="ms-1 h-4 w-4" />
                              {t.submitAssignment || "إرسال التمرين"}
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setActiveLessonTitle(lesson.title)}
                          >
                            <MessageCircle className="ms-1 h-4 w-4" />
                            {isAr ? "اسأل عن هذا الدرس" : "Ask about this lesson"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* مثال تقدّم ثابت حالياً */}
      <section className="space-y-2">
        <h2 className="font-headline text-xl font-semibold">
          {t.yourProgress || "تقدمك في الكورس"}
        </h2>
        <Card>
          <CardContent className="space-y-2 pt-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{t.learningProgress || "نسبة الإنجاز التقديرية"}</span>
              <span>0%</span>
            </div>
            <Progress value={0} />
            <p className="text-[11px] text-muted-foreground">
              (يمكنك لاحقاً ربط التقدم بعدد الدروس التي يفتحها الطالب أو يكمّلها.)
            </p>
          </CardContent>
        </Card>
      </section>

      {/* الذكاء الاصطناعي للكورس */}
      <section id="ai-section" className="space-y-3">
        <h2 className="font-headline text-xl font-semibold">
          {isAr ? "الذكاء التعليمي للكورس" : "AI Learning for this course"}
        </h2>
        <AiLearningWidget courseTitle={course.title} lessonTitle={activeLessonTitle} />
      </section>
    </div>
  );
}
