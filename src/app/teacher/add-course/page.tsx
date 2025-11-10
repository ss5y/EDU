'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
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

import { Upload } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';
import { departments } from '@/lib/departments-data';
import { teacherData } from '@/lib/placeholder-data';
import type { Course } from '@/lib/types';

type StoredMedia = {
  name: string;
  type: string;
  size: number;
  dataUrl?: string;
};

type StoredCourse = Course & {
  media?: StoredMedia[];
  department?: string;
  specialization?: string; // هنا نخزّن التخصص حسب القسم
  videoUrl?: string;       // رابط الفيديو (يوتيوب أو ملف مرفوع)
};

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AddCoursePage() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const router = useRouter();

  const [isFreeTrial, setIsFreeTrial] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<'image' | 'video' | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>(''); // رابط يوتيوب/فيميو (اختياري)
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('');

  // التخصصات حسب القسم
  const specializations = useMemo(() => {
    if (!selectedDepartment) return [];
    const dep = departments.find((d) => d.id === selectedDepartment);
    return dep ? dep.specializations.map((s) => s.name.ar) : [];
  }, [selectedDepartment]);

  // معاينة صورة/فيديو الغلاف فقط
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

  // رفع PDF
  const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    setPdfFiles(files);
  };

  // حفظ الكورس
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const title = (formData.get('course-name') as string) || '';
    const code = (formData.get('course-code') as string) || '';
    const shortDescription =
      (formData.get('short-description') as string) || '';
    const fullDetails = (formData.get('full-details') as string) || '';
    const priceRaw = (formData.get('price') as string) || '';
    const price = priceRaw ? parseFloat(priceRaw) : null;

    if (!title || !selectedDepartment || !selectedSpecialization) {
      alert('يرجى تعبئة اسم الكورس + القسم + التخصص');
      return;
    }

    const coverFile = formData.get('cover-media') as File | null;
    const media: StoredMedia[] = [];

    // 🟦 1) غلاف الكورس (صورة أو فيديو) + تخزين dataUrl
    if (coverFile && coverFile.size > 0) {
      try {
        const dataUrl = await readFileAsDataURL(coverFile);
        media.push({
          name: coverFile.name,
          type: coverFile.type,
          size: coverFile.size,
          dataUrl,
        });
      } catch (err) {
        console.warn('Failed to read cover-media as data URL', err);
      }
    }

    // 🟪 2) ملفات PDF المرفوعة – نخزّنها مع dataUrl عشان الطالب يفتحها
    for (const pdf of pdfFiles) {
      try {
        const dataUrl = await readFileAsDataURL(pdf);
        media.push({
          name: pdf.name,
          type: 'application/pdf',
          size: pdf.size,
          dataUrl,
        });
      } catch (err) {
        console.warn('Failed to read PDF as data URL', err);
      }
    }

    // 🎬 3) تحديد الفيديو الرئيسي:
    //   - لو المعلّم كتب رابط يوتيوب/فيميو → نستخدمه
    //   - وإلا لو رفع فيديو في الغلاف → نستخدم أول media من نوع video
    let finalVideoUrl = videoUrl || '';

    if (!finalVideoUrl) {
      const videoMedia = media.find(
        (m) => m.type.startsWith('video/') && m.dataUrl
      );
      if (videoMedia?.dataUrl) {
        finalVideoUrl = videoMedia.dataUrl;
      }
    }

    const newCourse: StoredCourse = {
      id: Date.now(),
      teacherId: teacherData.id,
      title,
      code: code || 'N/A',
      description: fullDetails || shortDescription || '',
      teacher: teacherData.name,
      rating: 0,
      price,
      isFreeTrial,
      image: undefined,
      emoji: '📘',
      specialization: selectedSpecialization,
      popularity: 'medium',
      newness: 'new',
      enrolledStudents: 0,
      reviews: [],
      content: {
        chapters: [],
      } as any,
      department: selectedDepartment,
      videoUrl: finalVideoUrl || undefined,
      media,
    };

    try {
      const existingRaw = localStorage.getItem('teacherCourses');
      const existing: StoredCourse[] = existingRaw ? JSON.parse(existingRaw) : [];
      const updated = [...existing, newCourse];
      localStorage.setItem('teacherCourses', JSON.stringify(updated));

      toast({
        title: t.coursePublished || 'تم نشر الكورس!',
        description: `تم حفظ الكورس "${title}" بنجاح.`,
      });

      router.push('/teacher/my-courses');
    } catch (error) {
      console.error('Failed to save course', error);
      toast({
        title: 'حدث خطأ',
        description: 'حدث خطأ أثناء حفظ الكورس، حاول مرة أخرى.',
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-2xl">إضافة كورس جديد</h1>
        <Button type="submit">
          <Upload className="ml-2 h-4 w-4" /> حفظ الكورس
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* معلومات الكورس */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>معلومات الكورس</CardTitle>
              <CardDescription>
                املأ بيانات الكورس الأساسية
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="course-name">{t.courseName}</Label>
                  <Input
                    id="course-name"
                    name="course-name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="course-code">{t.courseCode}</Label>
                  <Input
                    id="course-code"
                    name="course-code"
                    placeholder="CS101"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="short-description">{t.shortDescription}</Label>
                <Textarea
                  id="short-description"
                  name="short-description"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="full-details">{t.fullDetails}</Label>
                <Textarea
                  id="full-details"
                  name="full-details"
                  rows={5}
                />
              </div>

              {/* القسم والتخصص */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>القسم</Label>
                  <Select onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر القسم" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dep) => (
                        <SelectItem key={dep.id} value={dep.id}>
                          {dep.name.ar}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>التخصص</Label>
                  <Select
                    onValueChange={setSelectedSpecialization}
                    disabled={!selectedDepartment}
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
                />
              </div>
              <div className="flex items-center gap-2 border p-3 rounded-md">
                <Switch
                  id="free-trial"
                  checked={isFreeTrial}
                  onCheckedChange={setIsFreeTrial}
                />
                <Label htmlFor="free-trial">
                  {t.enableFreeTrial}
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ميديا الكورس</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="cover-media">
                  صورة أو فيديو تعريفي
                </Label>
                <Input
                  id="cover-media"
                  name="cover-media"
                  type="file"
                  onChange={handleMediaChange}
                  accept="image/*,video/*"
                />
              </div>

              {previewUrl && previewType === 'image' && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="preview"
                  className="rounded-md border max-h-48 w-full object-cover"
                />
              )}
              {previewUrl && previewType === 'video' && (
                <video
                  src={previewUrl}
                  controls
                  className="rounded-md border max-h-48 w-full"
                />
              )}

              <div>
                <Label>رابط فيديو (YouTube / Vimeo) – اختياري</Label>
                <Input
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
              </div>

              <div>
                <Label>ملفات PDF إضافية (ملخصات / شيتات)</Label>
                <Input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handlePdfUpload}
                />
                {pdfFiles.length > 0 && (
                  <ul className="mt-2 list-disc pl-4 text-xs text-muted-foreground">
                    {pdfFiles.map((file) => (
                      <li key={file.name}>{file.name}</li>
                    ))}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
