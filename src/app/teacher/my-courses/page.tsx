'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

import { Edit, Star, Trash2, Users, FileIcon, BookOpen } from 'lucide-react';
import { teacherData } from '@/lib/placeholder-data';
import type { Course } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';
import { departments } from '@/lib/departments-data';

type StoredMedia = {
  name: string;
  type: string;
  size: number;
  dataUrl?: string;
};

type StoredCourse = Course & {
  media?: StoredMedia[]; // نفس اللي استخدمناه في add-course
  department?: string;   // id من departments-data (foundation / it / engineering / business)
  specialization?: string;
  videoUrl?: string;
};

export default function MyCoursesPage() {
  const { toast } = useToast();
  const { t, language } = useLanguage();

  const [customCourses, setCustomCourses] = useState<StoredCourse[]>([]);

  // 🔹 قراءة الكورسات المضافة من المعلم من localStorage (teacherCourses)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem('teacherCourses');
      if (!raw) {
        setCustomCourses([]);
        return;
      }
      const parsed = JSON.parse(raw) as StoredCourse[];
      if (Array.isArray(parsed)) {
        setCustomCourses(parsed);
      } else {
        setCustomCourses([]);
      }
    } catch (error) {
      console.warn('Failed to read teacherCourses from localStorage', error);
      setCustomCourses([]);
    }
  }, []);

  // 🔹 كورسات النظام لهذا المعلم (من placeholder-data)
  const baseCourses: StoredCourse[] = useMemo(
    () => (teacherData.courses || []) as StoredCourse[],
    []
  );

  // 🔹 IDs الكورسات الأساسية عشان نعرف مين custom
  const baseIds = useMemo(
    () => new Set(baseCourses.map((c) => c.id)),
    [baseCourses]
  );

  const isCustomCourse = (courseId: number) => !baseIds.has(courseId);

  // 🔹 جميع الكورسات = الأساسية + المضافة
  const allCourses: StoredCourse[] = useMemo(
    () => [...baseCourses, ...customCourses],
    [baseCourses, customCourses]
  );

  // 🔹 اسم القسم من departments-data
  const getDepartmentLabel = (course: StoredCourse): string | undefined => {
    const depId = (course as any).department as string | undefined;
    if (!depId) return undefined;
    const dep = departments.find((d) => d.id === depId);
    if (!dep) return undefined;
    return language === 'ar' ? dep.name.ar : dep.name.en;
  };

  // 🔹 صورة / فيديو الكورس
  const getCourseCover = (course: StoredCourse) => {
    // 1) صورة من بيانات الكورس الأساسية
    if (course.image?.imageUrl) {
      return { type: 'image' as const, src: course.image.imageUrl };
    }

    // 2) صورة من الميديا المرفوعة
    const img = course.media?.find(
      (m) => m.type.startsWith('image/') && m.dataUrl
    );
    if (img && img.dataUrl) {
      return { type: 'image' as const, src: img.dataUrl };
    }

    // 3) فيديو تعريفي
    if (course.videoUrl) {
      return { type: 'video' as const, src: course.videoUrl };
    }

    return null;
  };

  // 🔹 حذف كورس مضاف من المعلم
  const handleDelete = (course: StoredCourse) => {
    if (!isCustomCourse(course.id)) {
      // الكورس الأساسي (placeholder) لا يُحذف
      toast({
        title: t.error,
        description:
          t.confirmDeleteDesc ||
          'لا يمكن حذف الكورسات الافتراضية في بيانات التجربة.',
        variant: 'destructive',
      });
      return;
    }

    setCustomCourses((prev) => {
      const updated = prev.filter((c) => c.id !== course.id);
      try {
        localStorage.setItem('teacherCourses', JSON.stringify(updated));
      } catch (error) {
        console.warn('Failed to update teacherCourses in localStorage', error);
      }
      return updated;
    });

    toast({
      title: t.courseDeleted || 'تم الحذف بنجاح',
      description: `تم حذف الكورس "${course.title}" بنجاح.`,
      variant: 'destructive',
    });
  };

  return (
    <div>
      {/* الهيدر */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold">
            {t.myCourses_teacher || 'كورساتي'}
          </h1>
          <p className="text-muted-foreground">
            {t.yourActivityOverview ||
              'من هنا يمكنك إدارة كل الكورسات التي قمت بنشرها أو إنشائها.'}
          </p>
        </div>
        <Link href="/teacher/add-course">
          <Button>
            <BookOpen className="ms-2 h-4 w-4" />
            {t.addCourse_teacher || 'إضافة كورس جديد'}
          </Button>
        </Link>
      </div>

      {allCourses.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {t.noCoursesInCategory ||
            'لا توجد كورسات حتى الآن، قم بإضافة أول كورس لك.'}
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {allCourses.map((course) => {
            const custom = isCustomCourse(course.id);
            const cover = getCourseCover(course);
            const mediaList = course.media || [];
            const departmentLabel = getDepartmentLabel(course);

            return (
              <Card
                key={course.id}
                className="flex flex-col justify-between overflow-hidden"
              >
                {/* الغلاف */}
                {cover && (
                  <div className="relative aspect-video w-full bg-muted">
                    {cover.type === 'image' ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cover.src}
                        alt={course.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <video
                        src={cover.src}
                        controls
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                )}
                {!cover && (
                  <div className="relative aspect-video flex items-center justify-center bg-muted text-5xl">
                    {course.emoji || '📘'}
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <CardTitle className="truncate">{course.title}</CardTitle>
                      <CardDescription>{course.code}</CardDescription>
                    </div>
                    {/* بادجات القسم + التخصص */}
                    <div className="flex flex-col items-end gap-1 text-xs">
                      {departmentLabel && (
                        <Badge variant="secondary">{departmentLabel}</Badge>
                      )}
                      {course.specialization && (
                        <Badge variant="outline">{course.specialization}</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* إحصائيات بسيطة */}
                  <div className="flex justify-around rounded-md bg-muted p-3">
                    <div className="text-center">
                      <Users className="mx-auto h-6 w-6 text-primary" />
                      <p className="text-lg font-bold">
                        {course.enrolledStudents ?? 0}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t.student}
                      </p>
                    </div>
                    <div className="text-center">
                      <Star className="mx-auto h-6 w-6 text-amber-500" />
                      <p className="text-lg font-bold">
                        {course.rating ? course.rating.toFixed(1) : '—'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t.rating}
                      </p>
                    </div>
                  </div>

                  {/* المرفقات (PDF / أخرى) */}
                  {mediaList.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-semibold">
                        مرفقات الكورس (PDF / ملفات أخرى):
                      </p>
                      <ul className="max-h-20 space-y-1 overflow-auto text-xs text-muted-foreground">
                        {mediaList.map((m) => (
                          <li key={m.name} className="flex items-center gap-2">
                            <FileIcon className="h-3 w-3" />
                            <span className="truncate">
                              {m.name} ({Math.round(m.size / 1024)} KB)
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* آخر المراجعات */}
                  <div>
                    <h4 className="mb-2 text-sm font-semibold">
                      {t.latestReviews}
                    </h4>
                    {course.reviews && course.reviews.length > 0 ? (
                      course.reviews.slice(0, 2).map((review, i) => (
                        <div key={i} className="border-b p-2 text-xs">
                          <div className="mb-1 flex items-center">
                            {Array.from({ length: 5 }, (_, starIndex) => (
                              <Star
                                key={starIndex}
                                className={`h-3 w-3 ${
                                  starIndex < review.rating
                                    ? 'fill-amber-400 text-amber-500'
                                    : 'text-muted-foreground'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="italic text-muted-foreground">
                            "{review.comment}"
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        {t.noReviewsYet}
                      </p>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="flex flex-wrap items-center justify-between gap-2">
                  {/* إدارة الكورس (صفحة تفاصيل المعلّم) */}
                  <Link href={`/teacher/course/${course.id}`}>
                    <Button variant="outline" size="sm">
                      {t.courseDetails || 'إدارة الكورس'}
                    </Button>
                  </Link>

                  {/* تعديل الكورس */}
                  <Link href={`/teacher/course/${course.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="ms-1 h-4 w-4" />
                      {t.edit}
                    </Button>
                  </Link>

                  {/* حذف الكورس المضاف فقط */}
                  {custom ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="ms-1 h-4 w-4" />
                          {t.delete}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t.confirmDelete}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t.confirmDeleteDesc}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(course)}
                          >
                            {t.continue}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <span className="ms-auto text-[10px] text-muted-foreground">
                      كورس افتراضي (لا يمكن حذفه)
                    </span>
                  )}

                  {custom && (
                    <Badge className="ms-auto text-[10px]" variant="outline">
                      مضاف من قبلك
                    </Badge>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
