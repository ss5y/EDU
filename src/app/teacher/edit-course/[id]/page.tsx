'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { departments } from '@/lib/departments-data';
import { teacherData } from '@/lib/placeholder-data';
import type { Course } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';
import { ArrowLeft, FileText, Upload } from 'lucide-react';

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

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function EditCoursePage() {
  const params = useParams<{ id: string }>();
  const courseId = Number(params.id);
  const router = useRouter();
  const { toast } = useToast();
  const { t, language } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [originalCourse, setOriginalCourse] = useState<StoredCourse | null>(
    null
  );

  // حقول النموذج
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDetails, setFullDetails] = useState('');
  const [price, setPrice] = useState<string>('');
  const [isFreeTrial, setIsFreeTrial] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<'image' | 'video' | null>(
    null
  );

  // 🔹 تخصصات القسم المختار
  const specializations = useMemo(() => {
    if (!selectedDepartment) return [];
    const dep = departments.find((d) => d.id === selectedDepartment);
    if (!dep) return [];
    return dep.specializations.map((s) =>
      language === 'ar' ? s.name.ar : s.name.en
    );
  }, [selectedDepartment, language]);

  // 🔹 تحميل بيانات الكورس (من localStorage أو من teacherData)
  useEffect(() => {
    if (!courseId || Number.isNaN(courseId)) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    try {
      let customCourses: StoredCourse[] = [];
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem('teacherCourses');
        if (raw) {
          const parsed = JSON.parse(raw) as StoredCourse[];
          if (Array.isArray(parsed)) customCourses = parsed;
        }
      }

      const custom = customCourses.find((c) => c.id === courseId);
      const base = (teacherData.courses || []).find(
        (c) => c.id === courseId
      ) as Course | undefined;

      if (!custom && !base) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const course: StoredCourse = custom
        ? custom
        : ({
            ...base!,
            media: [],
            videoUrl: undefined,
          } as StoredCourse);

      setOriginalCourse(course);
      setIsEditable(!!custom); // قابل للتعديل فقط لو هو من teacherCourses

      // تعبئة الحقول
      setTitle(course.title);
      setCode(course.code);
      setShortDescription(course.description);
      setFullDetails(course.description);
      setPrice(course.price != null ? String(course.price) : '');
      setIsFreeTrial(course.isFreeTrial ?? false);
      setSelectedDepartment((course as any).department || '');
      setSelectedSpecialization(course.specialization || '');
      setVideoUrl(course.videoUrl || '');

      // معاينة الغلاف
      if (course.image?.imageUrl) {
        setPreviewUrl(course.image.imageUrl);
        setPreviewType('image');
      } else if (course.media?.length) {
        const img = course.media.find(
          (m) => m.type.startsWith('image/') && m.dataUrl
        );
        if (img && img.dataUrl) {
          setPreviewUrl(img.dataUrl);
          setPreviewType('image');
        }
      } else if (course.videoUrl) {
        setPreviewUrl(course.videoUrl);
        setPreviewType('video');
      }

      setLoading(false);
    } catch (error) {
      console.error('Failed to load course for editing', error);
      setNotFound(true);
      setLoading(false);
    }
  }, [courseId]);

  // 🔹 تغيير الميديا (صورة / فيديو ملف)
  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPreviewUrl(null);
      setPreviewType(null);
      return;
    }
    const url = URL.createObjectURL(file);
    if (file.type.startsWith('image/')) {
      setPreviewType('image');
      setPreviewUrl(url);
    } else if (file.type.startsWith('video/')) {
      setPreviewType('video');
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
      setPreviewType(null);
    }
  };

  // 🔹 رفع ملفات PDF
  const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    setPdfFiles(files);
  };

  // 🔹 حفظ التعديلات
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!originalCourse) return;

    if (!isEditable) {
      toast({
        title: t.error,
        description:
          'هذا الكورس من البيانات الافتراضية، لا يمكن حفظ التعديلات عليه في هذا الديمو. يمكنك إنشاء نسخة خاصة من صفحة إضافة كورس جديد.',
        variant: 'destructive',
      });
      return;
    }

    if (!title || !selectedDepartment || !selectedSpecialization) {
      toast({
        title: t.error,
        description: 'يرجى تعبئة اسم الكورس، القسم، والتخصص.',
        variant: 'destructive',
      });
      return;
    }

    const formData = new FormData(e.currentTarget);
    const priceRaw = (formData.get('price') as string) || '';
    const coverFile = formData.get('cover-media') as File | null;

    const priceValue = priceRaw ? parseFloat(priceRaw) : null;

    const existingMedia = (originalCourse.media || []) as StoredMedia[];
    const newMedia: StoredMedia[] = [];

    // غلاف جديد (صورة / فيديو ملف)
    if (coverFile && coverFile.size > 0) {
      try {
        const dataUrl = await readFileAsDataURL(coverFile);
        newMedia.push({
          name: coverFile.name,
          type: coverFile.type,
          size: coverFile.size,
          dataUrl,
        });
      } catch (err) {
        console.warn('Failed to read cover file', err);
      }
    }

    // ملفات PDF جديدة
    for (const pdf of pdfFiles) {
      newMedia.push({
        name: pdf.name,
        type: 'application/pdf',
        size: pdf.size,
      });
    }

    const updatedCourse: StoredCourse = {
      ...originalCourse,
      title,
      code,
      description: fullDetails || shortDescription || originalCourse.description,
      price: priceValue,
      isFreeTrial,
      specialization: selectedSpecialization,
      department: selectedDepartment,
      videoUrl: videoUrl || undefined,
      media: [...newMedia, ...existingMedia],
    };

    try {
      const raw = localStorage.getItem('teacherCourses');
      let stored: StoredCourse[] = [];
      if (raw) {
        const parsed = JSON.parse(raw) as StoredCourse[];
        if (Array.isArray(parsed)) stored = parsed;
      }

      const index = stored.findIndex((c) => c.id === updatedCourse.id);
      if (index >= 0) {
        stored[index] = updatedCourse;
      } else {
        stored.push(updatedCourse);
      }

      localStorage.setItem('teacherCourses', JSON.stringify(stored));

      toast({
        title: t.saveChanges || 'تم حفظ التعديلات',
        description: `تم حفظ التعديلات على الكورس "${updatedCourse.title}".`,
      });

      router.push('/teacher/my-courses');
    } catch (err) {
      console.error('Failed to save updated course', err);
      toast({
        title: t.error,
        description: t.somethingWentWrong,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground">جاري تحميل بيانات الكورس...</p>;
  }

  if (notFound || !originalCourse) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          لم يتم العثور على هذا الكورس.
        </p>
        <Button variant="outline" onClick={() => router.push('/teacher/my-courses')}>
          <ArrowLeft className="ms-2 h-4 w-4" />
          العودة إلى كورساتي
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* هيدر الصفحة */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-2xl font-bold">
            تعديل الكورس: {originalCourse.title}
          </h1>
          <p className="text-muted-foreground">
            يمكنك هنا تعديل معلومات الكورس، السعر، والمرفقات.
          </p>
          {!isEditable && (
            <p className="mt-2 text-xs text-amber-600">
              هذا الكورس من البيانات الافتراضية (placeholder)، لا يمكن حفظ التعديلات عليه في هذا الديمو.
              لإنشاء كورس قابل للتعديل بالكامل، استخدم صفحة "إضافة كورس جديد".
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/teacher/my-courses')}
          >
            <ArrowLeft className="ms-2 h-4 w-4" />
            العودة إلى كورساتي
          </Button>
          <Button type="submit" disabled={!isEditable}>
            <Upload className="ms-2 h-4 w-4" />
            {t.saveChanges || 'حفظ التعديلات'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* معلومات الكورس */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>معلومات الكورس</CardTitle>
              <CardDescription>قم بتعديل البيانات الأساسية للكورس</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="course-name">{t.courseName}</Label>
                  <Input
                    id="course-name"
                    name="course-name"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    disabled={!isEditable}
                  />
                </div>
                <div>
                  <Label htmlFor="course-code">{t.courseCode}</Label>
                  <Input
                    id="course-code"
                    name="course-code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    disabled={!isEditable}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="short-description">{t.shortDescription}</Label>
                <Textarea
                  id="short-description"
                  name="short-description"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  disabled={!isEditable}
                />
              </div>

              <div>
                <Label htmlFor="full-details">{t.fullDetails}</Label>
                <Textarea
                  id="full-details"
                  name="full-details"
                  rows={5}
                  value={fullDetails}
                  onChange={(e) => setFullDetails(e.target.value)}
                  disabled={!isEditable}
                />
              </div>

              {/* القسم والتخصص */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>القسم</Label>
                  <Select
                    value={selectedDepartment}
                    onValueChange={setSelectedDepartment}
                    disabled={!isEditable}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر القسم" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dep) => (
                        <SelectItem key={dep.id} value={dep.id}>
                          {language === 'ar' ? dep.name.ar : dep.name.en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>التخصص</Label>
                  <Select
                    value={selectedSpecialization}
                    onValueChange={setSelectedSpecialization}
                    disabled={!isEditable || !selectedDepartment}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر التخصص" />
                    </SelectTrigger>
                    <SelectContent>
                      {specializations.length > 0 ? (
                        specializations.map((spec) => (
                          <SelectItem key={spec} value={spec}>
                            {spec}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          اختر القسم أولاً
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* التسعير + الميديا */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>التسعير والخيارات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="price">{t.priceUSD}</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="0 = مجاني"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={!isEditable}
                />
              </div>

              <div className="flex items-center gap-2 rounded-md border p-3">
                <Switch
                  id="free-trial"
                  checked={isFreeTrial}
                  onCheckedChange={setIsFreeTrial}
                  disabled={!isEditable}
                />
                <Label htmlFor="free-trial">{t.enableFreeTrial}</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ميديا الكورس</CardTitle>
              <CardDescription>
                يمكنك تعديل الغلاف وإضافة ملفات PDF.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="cover-media">صورة أو فيديو تعريفي جديد</Label>
                <Input
                  id="cover-media"
                  name="cover-media"
                  type="file"
                  onChange={handleMediaChange}
                  disabled={!isEditable}
                />
              </div>

              {previewUrl && previewType === 'image' && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="preview"
                  className="max-h-48 w-full rounded-md border object-cover"
                />
              )}
              {previewUrl && previewType === 'video' && (
                <video
                  src={previewUrl}
                  controls
                  className="max-h-48 w-full rounded-md border"
                />
              )}

              <div>
                <Label>رابط فيديو (YouTube / Vimeo) (اختياري)</Label>
                <Input
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  disabled={!isEditable}
                />
              </div>

              <div>
                <Label>ملفات PDF إضافية</Label>
                <Input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handlePdfUpload}
                  disabled={!isEditable}
                />
                {pdfFiles.length > 0 && (
                  <ul className="mt-2 list-disc pl-4 text-xs text-muted-foreground">
                    {pdfFiles.map((file) => (
                      <li key={file.name} className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        <span>{file.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {originalCourse.media && originalCourse.media.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-semibold">المرفقات الحالية:</p>
                  <ul className="max-h-24 overflow-auto text-xs text-muted-foreground">
                    {originalCourse.media.map((m) => (
                      <li key={m.name} className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        <span>
                          {m.name} ({Math.round(m.size / 1024)} KB)
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
