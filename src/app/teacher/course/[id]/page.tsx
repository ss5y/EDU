'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import { courses, teacherData } from '@/lib/placeholder-data';
import { departments } from '@/lib/departments-data';
import type { Course } from '@/lib/types';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Star, BookOpen, FileText, Video, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

type StoredMedia = {
  name: string;
  type: string;
  size: number;
  dataUrl?: string;
};

type ExtendedCourse = Course & {
  media?: StoredMedia[];
  department?: string;      // id القسم من departments-data
  specialization?: string;  // اسم التخصص
  videoUrl?: string;        // رابط فيديو خارجي (YouTube / Vimeo)
};

export default function TeacherCoursePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { t, language } = useLanguage();

  const [course, setCourse] = useState<ExtendedCourse | null>(null);
  const [isCustom, setIsCustom] = useState(false); // هل الكورس من localStorage؟
  const [loading, setLoading] = useState(true);

  const courseId = Number(params.id);

  // 🔹 تحميل بيانات الكورس: من localStorage ثم من البيانات الأساسية
  useEffect(() => {
    if (!courseId || Number.isNaN(courseId)) {
      setLoading(false);
      return;
    }

    try {
      let stored: ExtendedCourse[] = [];

      // نقرأ من المفتاح الجديد
      if (typeof window !== 'undefined') {
        const rawNew = localStorage.getItem('teacherCourses');
        if (rawNew) {
          const parsed = JSON.parse(rawNew) as ExtendedCourse[];
          if (Array.isArray(parsed)) {
            stored = parsed;
          }
        }

        // دعم الاسم القديم teacherCustomCourses لو كان موجود
        const rawOld = localStorage.getItem('teacherCustomCourses');
        if (rawOld) {
          const parsedOld = JSON.parse(rawOld) as ExtendedCourse[];
          if (Array.isArray(parsedOld)) {
            stored = [...stored, ...parsedOld];
          }
        }
      }

      const customCourse = stored.find((c) => c.id === courseId);

      // من بيانات المعلم الأساسية
      const baseTeacherCourse = (teacherData.courses as Course[]).find(
        (c) => c.id === courseId
      ) as ExtendedCourse | undefined;

      // من جميع الكورسات الأساسية
      const baseGlobalCourse = courses.find(
        (c) => c.id === courseId
      ) as ExtendedCourse | undefined;

      const finalCourse =
        customCourse || baseTeacherCourse || baseGlobalCourse || null;

      if (!finalCourse) {
        setCourse(null);
        setIsCustom(false);
      } else {
        setCourse(finalCourse);
        setIsCustom(!!customCourse);
      }
    } catch (err) {
      console.error('Failed to load teacher course page', err);
      setCourse(null);
      setIsCustom(false);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  // 🔹 معلومات القسم (من id المخزّن في department)
  const departmentLabel = useMemo(() => {
    if (!course?.department) return '';
    const dep = departments.find((d) => d.id === course.department);
    if (!dep) return '';
    return language === 'ar' ? dep.name.ar : dep.name.en;
  }, [course, language]);

  // 🔹 تجهيز الميديا: صورة الغلاف / الفيديو / ملفات PDF
  const { coverImage, coverVideo, pdfFiles } = useMemo(() => {
    if (!course) return { coverImage: null, coverVideo: null, pdfFiles: [] as StoredMedia[] };

    let coverImage: string | null = null;
    let coverVideo: string | null = null;

    // صورة من placeholder
    if (course.image?.imageUrl) {
      coverImage = course.image.imageUrl;
    }

    // ميديا محفوظة في localStorage
    if (course.media && course.media.length > 0) {
      if (!coverImage) {
        const img = course.media.find(
          (m) => m.type.startsWith('image/') && m.dataUrl
        );
        if (img?.dataUrl) coverImage = img.dataUrl;
      }
      if (!coverVideo) {
        const vid = course.media.find(
          (m) => m.type.startsWith('video/') && m.dataUrl
        );
        if (vid?.dataUrl) coverVideo = vid.dataUrl;
      }
    }

    // لو فيه رابط فيديو خارجي
    if (course.videoUrl) {
      coverVideo = course.videoUrl;
    }

    const pdfFiles =
      course.media?.filter((m) => m.type === 'application/pdf') ?? [];

    return { coverImage, coverVideo, pdfFiles };
  }, [course]);

  // 🔹 الشباتر (الهيكل قد يختلف، فنستخدم any)
  const chapters: any[] = useMemo(() => {
    if (!course) return [];
    const anyContent = (course as any).content;
    if (!anyContent || !Array.isArray(anyContent.chapters)) return [];
    return anyContent.chapters;
  }, [course]);

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">
        جاري تحميل بيانات الكورس...
      </p>
    );
  }

  if (!course) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {t.courseNotFound || 'لم يتم العثور على هذا الكورس.'}
        </p>
        <Button variant="outline" onClick={() => router.push('/teacher/my-courses')}>
          <ArrowLeft className="ms-2 h-4 w-4" />
          العودة إلى كورساتي
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* الهيدر الرئيسي للكورس */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <Badge variant="outline" className="text-xs">
            لوحة تحكم المعلّم
          </Badge>
          <h1 className="font-headline text-3xl font-bold">{course.title}</h1>

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              الكود: {course.code}
            </span>

            {departmentLabel && (
              <span className="flex items-center gap-1">
                <Badge variant="secondary">{departmentLabel}</Badge>
              </span>
            )}

            {course.specialization && (
              <span className="flex items-center gap-1">
                <Badge variant="outline">{course.specialization}</Badge>
              </span>
            )}

            <span>المعلّم: {course.teacher}</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
              {course.rating.toFixed(1)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {course.enrolledStudents} {t.student || 'طالب'}
            </span>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            {course.description ||
              'هنا يمكنك إدارة محتوى الكورس، متابعة الطلاب، وإضافة ملفات وفيديوهات.'}
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={`/teacher/course/${course.id}/content`}>
              <Button size="sm">إدارة محتوى الكورس</Button>
            </Link>

            <Link href={`/teacher/course/${course.id}/edit`}>
              <Button size="sm" variant="outline">
                تعديل بيانات الكورس
              </Button>
            </Link>

            <Link href={`/teacher/course/${course.id}/students`}>
              <Button size="sm" variant="outline">
                عرض الطلاب المسجّلين
              </Button>
            </Link>
          </div>
        </div>

        {/* الميديا في الهيدر */}
        <Card className="w-full max-w-md overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-video bg-muted flex items-center justify-center">
              {coverVideo ? (
                <video
                  src={coverVideo}
                  controls
                  className="h-full w-full object-cover"
                />
              ) : coverImage ? (
                <Image
                  src={coverImage}
                  alt={course.title}
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

      {/* ملفات PDF إن وجدت */}
      {pdfFiles.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-headline text-xl font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            ملفات PDF المرفقة بالكورس
          </h2>
          <Card>
            <CardContent className="divide-y p-0">
              {pdfFiles.map((file) => (
                <div
                  key={file.name}
                  className="flex items-center justify-between gap-2 p-3 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{file.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(file.size / 1024)} KB
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      )}

      {/* لو في رابط فيديو خاص للكورس */}
      {course.videoUrl && (
        <section className="space-y-3">
          <h2 className="font-headline text-xl font-semibold flex items-center gap-2">
            <Video className="h-5 w-5" />
            فيديو تعريفي
          </h2>
          <Card>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                يمكن للطلاب مشاهدة هذا الفيديو من صفحة الكورس الخاصة بهم.
              </p>
              <video
                src={course.videoUrl}
                controls
                className="w-full max-h-80 rounded-md border"
              />
              <p className="text-xs text-muted-foreground break-all">
                {course.videoUrl}
              </p>
            </CardContent>
          </Card>
        </section>
      )}

      {/* قائمة الشباتر/الوحدات (لو موجودة) */}
      {chapters.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-headline text-xl font-semibold">
            وحدات الكورس (للمعلّم)
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {chapters.map((chapter, index) => (
              <Card key={chapter.id ?? index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base">
                    <span>{chapter.title ?? `الوحدة ${index + 1}`}</span>
                    {Array.isArray(chapter.lessons) && (
                      <Badge variant="outline">
                        {chapter.lessons.length} درس
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    {chapter.description ??
                      'يمكنك تعديل محتوى هذه الوحدة من صفحة إدارة المحتوى.'}
                  </p>
                  <Link
                    href={`/teacher/course/${course.id}/content?chapter=${index}`}
                  >
                    <Button size="sm" variant="outline">
                      إدارة هذه الوحدة
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* ملاحظة للكورسات الافتراضية */}
      {!isCustom && (
        <p className="text-xs text-muted-foreground">
          ملاحظة: هذا الكورس من البيانات التجريبية الافتراضية. التعديلات الدائمة
          تكون على الكورسات التي تقوم بإضافتها من صفحة &quot;إضافة كورس جديد&quot;.
        </p>
      )}
    </div>
  );
}
