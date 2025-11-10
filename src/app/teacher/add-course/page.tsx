'use client';

import React, { useState } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';
import { useRouter } from 'next/navigation';
import { teacherData } from '@/lib/placeholder-data';
import type { Course } from '@/lib/types';

type StoredMedia = {
  name: string;
  type: string;
  size: number;
  dataUrl?: string; // نستخدمها للمعاينة (صورة/فيديو)
};

type StoredCourse = Course & {
  media?: StoredMedia;
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

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPreviewUrl(null);
      setPreviewType(null);
      return;
    }

    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setPreviewType('image');
    } else if (file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setPreviewType('video');
    } else {
      setPreviewUrl(null);
      setPreviewType(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const courseName = (formData.get('course-name') as string) || '';
    const courseCode = (formData.get('course-code') as string) || '';
    const shortDescription =
      (formData.get('short-description') as string) || '';
    const fullDetails = (formData.get('full-details') as string) || '';
    const priceRaw = (formData.get('price') as string) || '';

    const price = priceRaw ? parseFloat(priceRaw) : null;

    const mediaFile = formData.get('cover-media') as File | null;

    let media: StoredMedia | undefined;
    if (mediaFile && mediaFile.size > 0) {
      media = {
        name: mediaFile.name,
        type: mediaFile.type,
        size: mediaFile.size,
      };

      // لو كانت صورة أو فيديو نخزن نسخة base64 عشان نقدر نعرضها لاحقاً من localStorage
      if (
        mediaFile.type.startsWith('image/') ||
        mediaFile.type.startsWith('video/')
      ) {
        try {
          const dataUrl = await readFileAsDataURL(mediaFile);
          media.dataUrl = dataUrl;
        } catch (err) {
          console.warn('Failed to read media as data URL', err);
        }
      }
    }

    const newCourse: StoredCourse = {
      id: Date.now(),
      teacherId: teacherData.id,
      title: courseName,
      code: courseCode || 'N/A',
      description: shortDescription || fullDetails || '',
      teacher: teacherData.name,
      rating: 0,
      price,
      isFreeTrial,
      image: undefined,
      emoji: '📘',
      specialization: teacherData.specialization,
      popularity: 'new',
      newness: 'new',
      enrolledStudents: 0,
      reviews: [],
      content: {
        chapters: [],
      },
      media,
    };

    try {
      const existingRaw = localStorage.getItem('teacherCustomCourses');
      let existing: StoredCourse[] = [];
      if (existingRaw) {
        existing = JSON.parse(existingRaw) as StoredCourse[];
      }

      existing.push(newCourse);
      localStorage.setItem('teacherCustomCourses', JSON.stringify(existing));

      toast({
        title: t.coursePublished,
        description: `${t.coursePublished} "${courseName}"`,
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
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-2xl">{t.addCourse}</h1>
          <p className="text-muted-foreground">{t.fillDetailsToPublish}</p>
        </div>
        <Button type="submit">{t.publishCourse}</Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* معلومات الكورس */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
              <CardDescription>املأ المعلومات الأساسية عن الكورس.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="course-name">{t.courseName}</Label>
                  <Input
                    id="course-name"
                    name="course-name"
                    placeholder="e.g. Introduction to AI"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="course-code">{t.courseCode}</Label>
                  <Input
                    id="course-code"
                    name="course-code"
                    placeholder="e.g. AI101"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="short-description">
                  {t.shortDescription}
                </Label>
                <Textarea
                  id="short-description"
                  name="short-description"
                  placeholder="A brief and engaging description of the course"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="full-details">{t.fullDetails}</Label>
                <Textarea
                  id="full-details"
                  name="full-details"
                  rows={6}
                  placeholder="Explain the course objectives, content, and target audience."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* التسعير والخيارات + الميديا */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pricing &amp; Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="price">{t.priceUSD}</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="Leave blank for free"
                />
              </div>
              <div className="flex items-center gap-2 rounded-md border p-4 rtl:space-x-reverse">
                <Switch
                  id="free-trial"
                  checked={isFreeTrial}
                  onCheckedChange={setIsFreeTrial}
                />
                <Label htmlFor="free-trial">{t.enableFreeTrial}</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="cover-media">{t.coverMedia}</Label>
                <Input
                  id="cover-media"
                  name="cover-media"
                  type="file"
                  onChange={handleMediaChange}
                />
              </div>

              {previewUrl && (
                <div className="rounded-md border p-2">
                  <p className="mb-2 text-xs text-muted-foreground">
                    معاينة الميديا:
                  </p>
                  {previewType === 'image' && (
                    <img
                      src={previewUrl}
                      alt="Course media preview"
                      className="max-h-48 w-full rounded-md object-cover"
                    />
                  )}
                  {previewType === 'video' && (
                    <video
                      src={previewUrl}
                      controls
                      className="max-h-48 w-full rounded-md"
                    />
                  )}
                </div>
              )}

              {!previewUrl && (
                <p className="text-xs text-muted-foreground">
                  يمكنك رفع صورة أو فيديو تعريفي للكورس. سيتم حفظه في المتصفح فقط
                  (localStorage) لأغراض التجربة.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
