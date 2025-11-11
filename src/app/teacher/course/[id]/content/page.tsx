'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { courses } from '@/lib/placeholder-data';
import type { Course } from '@/lib/types';

import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

import {
  ArrowLeft,
  PlusCircle,
  Save,
  Trash2,
  Video,
  FileText,
  ListChecks,
  FilePenLine,
} from 'lucide-react';

type PageParams = { id: string };
type PageProps = { params: Promise<PageParams> };

type LessonType = 'video' | 'pdf' | 'quiz' | 'assignment';

// مرفق خاص لكل درس (مثلاً PDF)
type LessonAttachment = {
  name: string;
  size: number;
  dataUrl?: string; // base64 – الطالب يقدر يفتحه
};

type EditableLesson = {
  id: number;
  title: string;
  type: LessonType;
  url?: string;
  isPaid?: boolean;
  attachment?: LessonAttachment;
};

type EditableChapter = {
  id: number;
  title: string;
  description?: string;
  lessons: EditableLesson[];
};

type StoredCourse = Course & {
  media?: any[];
  department?: string;
  specialization?: string;
  videoUrl?: string;
};

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function CourseContentPage({ params }: PageProps) {
  const { id } = use(params); // Next 15: params Promise
  const courseId = Number(id);

  const { t } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();

  const [course, setCourse] = useState<StoredCourse | null>(null);
  const [chapters, setChapters] = useState<EditableChapter[]>([]);
  const [isCustom, setIsCustom] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 🔹 تحميل الكورس (placeholder + teacherCourses من localStorage)
  useEffect(() => {
    const baseCourse = courses.find(
      (c) => c.id === courseId
    ) as StoredCourse | undefined;

    let customCourses: StoredCourse[] = [];
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('teacherCourses');
        if (raw) {
          const parsed = JSON.parse(raw) as StoredCourse[];
          if (Array.isArray(parsed)) customCourses = parsed;
        }
      } catch (err) {
        console.warn('Failed to read teacherCourses', err);
      }
    }

    const customCourse = customCourses.find((c) => c.id === courseId);
    const finalCourse = customCourse ?? baseCourse ?? null;

    setCourse(finalCourse);
    setIsCustom(!!customCourse);

    if (!finalCourse) {
      setChapters([]);
      return;
    }

    const anyCourse = finalCourse as any;
    let rawChapters: any[] =
      anyCourse.content?.chapters ?? anyCourse.chapters ?? [];

    if (!Array.isArray(rawChapters)) rawChapters = [];

    const normalized: EditableChapter[] = rawChapters.map(
      (ch: any, index: number) => ({
        id: ch.id ?? index + 1,
        title: ch.title ?? `الوحدة ${index + 1}`,
        description: ch.description ?? '',
        lessons: Array.isArray(ch.lessons)
          ? ch.lessons.map((l: any, li: number) => ({
              id: l.id ?? li + 1,
              title: l.title ?? `درس ${li + 1}`,
              type: (l.type as LessonType) ?? ('video' as LessonType),
              url: l.url,
              isPaid: !!l.isPaid,
              attachment: l.attachment, // نحافظ على أي مرفق قديم
            }))
          : [],
      })
    );

    if (normalized.length === 0) {
      normalized.push({
        id: 1,
        title: 'الوحدة 1',
        description: '',
        lessons: [],
      });
    }

    setChapters(normalized);
  }, [courseId]);

  // 🔹 إضافة وحدة جديدة
  const addChapter = () => {
    if (!isCustom) {
      toast({
        title: t.error || 'غير مسموح',
        description:
          'لا يمكن تعديل محتوى الكورسات التجريبية الافتراضية، فقط الكورسات التي تضيفها أنت.',
        variant: 'destructive',
      });
      return;
    }

    setChapters((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: `وحدة جديدة ${prev.length + 1}`,
        description: '',
        lessons: [],
      },
    ]);
  };

  // 🔹 تعديل عنوان/وصف وحدة
  const updateChapterField = (
    chapterId: number,
    field: 'title' | 'description',
    value: string
  ) => {
    setChapters((prev) =>
      prev.map((ch) =>
        ch.id === chapterId ? { ...ch, [field]: value } : ch
      )
    );
  };

  // 🔹 حذف وحدة
  const deleteChapter = (chapterId: number) => {
    if (!isCustom) return;
    setChapters((prev) => prev.filter((ch) => ch.id !== chapterId));
  };

  // 🔹 إضافة درس
  const addLesson = (chapterId: number, type: LessonType) => {
    if (!isCustom) {
      toast({
        title: t.error || 'غير مسموح',
        description:
          'لا يمكن إضافة دروس إلى كورسات افتراضية، فقط للكورسات التي أضفتها.',
        variant: 'destructive',
      });
      return;
    }

    setChapters((prev) =>
      prev.map((ch) =>
        ch.id === chapterId
          ? {
              ...ch,
              lessons: [
                ...ch.lessons,
                {
                  id: Date.now(),
                  title:
                    type === 'video'
                      ? 'فيديو جديد'
                      : type === 'pdf'
                      ? 'ملف PDF جديد'
                      : type === 'quiz'
                      ? 'اختبار جديد'
                      : 'تمرين جديد',
                  type,
                  url: '',
                  isPaid: false,
                },
              ],
            }
          : ch
      )
    );
  };

  // 🔹 تعديل حقل درس
  const updateLessonField = (
    chapterId: number,
    lessonId: number,
    field: 'title' | 'url' | 'type' | 'isPaid',
    value: string | boolean
  ) => {
    setChapters((prev) =>
      prev.map((ch) =>
        ch.id === chapterId
          ? {
              ...ch,
              lessons: ch.lessons.map((l) =>
                l.id === lessonId
                  ? {
                      ...l,
                      [field]: field === 'isPaid' ? !!value : value,
                    }
                  : l
              ),
            }
          : ch
      )
    );
  };

  // 🔹 رفع PDF خاص لدرس معيّن
  const handleLessonFileChange = async (
    chapterId: number,
    lessonId: number,
    file: File | null
  ) => {
    if (!isCustom || !file) return;
    if (!file.type.startsWith('application/pdf')) {
      alert('الملف يجب أن يكون PDF فقط');
      return;
    }

    try {
      const dataUrl = await readFileAsDataURL(file);
      const attachment: LessonAttachment = {
        name: file.name,
        size: file.size,
        dataUrl,
      };

      setChapters((prev) =>
        prev.map((ch) =>
          ch.id === chapterId
            ? {
                ...ch,
                lessons: ch.lessons.map((l) =>
                  l.id === lessonId ? { ...l, attachment } : l
                ),
              }
            : ch
        )
      );
    } catch (err) {
      console.error('Failed to read lesson file', err);
      toast({
        title: t.error || 'خطأ',
        description: 'تعذر قراءة ملف الـ PDF، حاول مرة أخرى.',
        variant: 'destructive',
      });
    }
  };

  // 🔹 حذف درس
  const deleteLesson = (chapterId: number, lessonId: number) => {
    if (!isCustom) return;
    setChapters((prev) =>
      prev.map((ch) =>
        ch.id === chapterId
          ? {
              ...ch,
              lessons: ch.lessons.filter((l) => l.id !== lessonId),
            }
          : ch
      )
    );
  };

  // 🔹 حفظ في localStorage (teacherCourses) بدون أي spread غريب
  const handleSave = () => {
    if (!course) return;

    if (!isCustom) {
      toast({
        title: t.error || 'غير مسموح',
        description:
          'لا يمكن حفظ التعديلات على الكورسات الافتراضية. أنشئ كورس جديد من صفحة المعلّم.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);

    try {
      const raw = localStorage.getItem('teacherCourses');
      const existing: StoredCourse[] = raw ? JSON.parse(raw) : [];

      const updatedCourses = existing.map((c) =>
        c.id === course.id
          ? {
              ...c,
              content: {
                chapters: chapters as any, // هنا نحفظ الشابترات مع المرفقات
              },
            }
          : c
      );

      localStorage.setItem(
        'teacherCourses',
        JSON.stringify(updatedCourses)
      );

      setCourse((prev) =>
        prev
          ? {
              ...prev,
              content: {
                chapters: chapters as any,
              },
            }
          : prev
      );

      toast({
        title: t.saveChanges || 'تم حفظ التعديلات',
        description: 'تم تحديث محتوى الكورس بنجاح.',
      });
    } catch (err) {
      console.error('Failed to save course content', err);
      toast({
        title: t.error || 'خطأ',
        description:
          'حدث خطأ أثناء حفظ المحتوى، حاول مرة أخرى.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!course) {
    return (
      <div className="space-y-4">
        <h1 className="font-headline text-2xl font-bold">
          {t.courseNotFound || 'لم يتم العثور على الكورس'}
        </h1>
        <Button
          variant="outline"
          onClick={() => router.push('/teacher/my-courses')}
        >
          <ArrowLeft className="ms-2 h-4 w-4" />
          الرجوع إلى كورساتي
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* هيدر الصفحة */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-headline text-2xl font-bold">
            إدارة محتوى الكورس
          </h1>
          <p className="text-sm text-muted-foreground">
            {course.title} ({course.code})
          </p>
          {!isCustom && (
            <p className="mt-1 text-xs text-muted-foreground">
              هذا كورس افتراضي (من بيانات التجربة) – يمكنك استعراض
              المحتوى لكن لا يمكنك حفظ تعديلات عليه.
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/teacher/course/${course.id}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="ms-2 h-4 w-4" />
              رجوع لصفحة الكورس
            </Button>
          </Link>
          <Button
            onClick={handleSave}
            disabled={!isCustom || isSaving}
            size="sm"
          >
            <Save className="ms-2 h-4 w-4" />
            {isSaving ? 'جارٍ الحفظ...' : t.saveChanges || 'حفظ التعديلات'}
          </Button>
        </div>
      </div>

      {/* زر إضافة وحدة */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          قم بإنشاء وحدات (شابترات) ثم أضف بداخلها فيديوهات، ملفات PDF،
          اختبارات، وتدريبات. هذه البيانات سيشاهدها الطالب في صفحة الكورس.
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addChapter}
          disabled={!isCustom}
        >
          <PlusCircle className="ms-2 h-4 w-4" />
          إضافة وحدة
        </Button>
      </div>

      {/* الوحدات + الدروس */}
      {chapters.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          لا توجد وحدات حتى الآن. اضغط على &quot;إضافة وحدة&quot; لإنشاء
          أول وحدة.
        </p>
      ) : (
        <div className="space-y-4">
          {chapters.map((chapter, index) => (
            <Card key={chapter.id} className="border-primary/20">
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold">
                      {index + 1}
                    </span>
                    <Input
                      className="h-8 text-sm"
                      value={chapter.title}
                      onChange={(e) =>
                        updateChapterField(
                          chapter.id,
                          'title',
                          e.target.value
                        )
                      }
                      disabled={!isCustom}
                    />
                  </CardTitle>
                  <CardDescription>
                    <Textarea
                      className="mt-1 min-h-[60px] text-xs"
                      placeholder="وصف مختصر للوحدة (اختياري)"
                      value={chapter.description || ''}
                      onChange={(e) =>
                        updateChapterField(
                          chapter.id,
                          'description',
                          e.target.value
                        )
                      }
                      disabled={!isCustom}
                    />
                  </CardDescription>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">
                    عدد الدروس: {chapter.lessons.length}
                  </Badge>
                  {isCustom && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteChapter(chapter.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* أزرار إضافة درس */}
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="text-muted-foreground">
                    إضافة درس:
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => addLesson(chapter.id, 'video')}
                    disabled={!isCustom}
                  >
                    <Video className="ms-1 h-4 w-4" /> فيديو
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => addLesson(chapter.id, 'pdf')}
                    disabled={!isCustom}
                  >
                    <FileText className="ms-1 h-4 w-4" /> PDF
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => addLesson(chapter.id, 'quiz')}
                    disabled={!isCustom}
                  >
                    <ListChecks className="ms-1 h-4 w-4" /> اختبار
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => addLesson(chapter.id, 'assignment')}
                    disabled={!isCustom}
                  >
                    <FilePenLine className="ms-1 h-4 w-4" /> تمرين
                  </Button>
                </div>

                {/* قائمة الدروس */}
                {chapter.lessons.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    لا توجد دروس في هذه الوحدة بعد.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {chapter.lessons.map((lesson) => (
                  <div
                     key={`${chapter.id}-${lesson.id}`}
                        className="space-y-2 rounded-md border p-3 text-xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {lesson.type === 'video'
                                ? 'فيديو'
                                : lesson.type === 'pdf'
                                ? 'PDF'
                                : lesson.type === 'quiz'
                                ? 'اختبار'
                                : 'تمرين'}
                            </Badge>
                            <Input
                              className="h-8 w-48 text-xs"
                              value={lesson.title}
                              onChange={(e) =>
                                updateLessonField(
                                  chapter.id,
                                  lesson.id,
                                  'title',
                                  e.target.value
                                )
                              }
                              disabled={!isCustom}
                            />
                          </div>

                          {isCustom && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                deleteLesson(chapter.id, lesson.id)
                              }
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>

                        {/* رابط + مدفوع/مجاني */}
                        <div className="grid items-center gap-2 md:grid-cols-[2fr,auto]">
                          <Input
                            className="h-8 text-xs"
                            placeholder={
                              lesson.type === 'video'
                                ? 'رابط الفيديو (YouTube / Vimeo / ملف)'
                                : lesson.type === 'pdf'
                                ? 'رابط ملف PDF إن وجد'
                                : 'اختياري: رابط أو ملاحظة'
                            }
                            value={lesson.url || ''}
                            onChange={(e) =>
                              updateLessonField(
                                chapter.id,
                                lesson.id,
                                'url',
                                e.target.value
                              )
                            }
                            disabled={!isCustom}
                          />

                          <div className="flex items-center justify-end gap-2">
                            <Switch
                              id={`paid-${lesson.id}`}
                              checked={!!lesson.isPaid}
                              onCheckedChange={(checked) =>
                                updateLessonField(
                                  chapter.id,
                                  lesson.id,
                                  'isPaid',
                                  checked
                                )
                              }
                              disabled={!isCustom}
                            />
                            <label
                              htmlFor={`paid-${lesson.id}`}
                              className="text-[11px]"
                            >
                              محتوى مدفوع؟
                            </label>
                          </div>
                        </div>

                        {/* رفع PDF لهذا الدرس فقط */}
                        <div className="grid gap-2 md:grid-cols-[2fr,auto] items-center">
                          <div className="text-[11px] text-muted-foreground">
                            يمكنك رفع ملف PDF خاص بهذا الدرس (مثلاً ملخص أو
                            مذكرة).
                            {lesson.attachment && (
                              <div className="mt-1">
                                <span className="font-semibold">
                                  الملف الحالي:
                                </span>{' '}
                                {lesson.attachment.name} (
                                {Math.round(
                                  lesson.attachment.size / 1024
                                )}
                                {' KB'})
                              </div>
                            )}
                          </div>
                          <Input
                            type="file"
                            accept="application/pdf"
                            className="h-8 text-[11px]"
                            disabled={!isCustom}
                            onChange={(e) =>
                              handleLessonFileChange(
                                chapter.id,
                                lesson.id,
                                e.target.files?.[0] || null
                              )
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
