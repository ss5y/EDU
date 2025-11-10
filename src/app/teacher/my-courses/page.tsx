'use client';

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

import { Edit, Star, Trash2, Users, FileIcon } from 'lucide-react';
import { teacherData } from '@/lib/placeholder-data';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useLanguage } from '@/hooks/use-language';
import type { Course } from '@/lib/types';
import { useEffect, useState } from 'react';

type StoredMedia = {
  name: string;
  type: string;
  size: number;
  dataUrl?: string;
};

type StoredCourse = Course & {
  media?: StoredMedia;
};

export default function MyCoursesPage() {
  const { toast } = useToast();
  const { t } = useLanguage();

  const [customCourses, setCustomCourses] = useState<StoredCourse[]>([]);

  // قراءة الكورسات المحفوظة من localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('teacherCustomCourses');
      if (raw) {
        const parsed = JSON.parse(raw) as StoredCourse[];
        setCustomCourses(parsed);
      }
    } catch (error) {
      console.warn('Failed to read courses from localStorage', error);
    }
  }, []);

  const allCourses: StoredCourse[] = [
    ...customCourses,
    ...(teacherData.courses as any),
  ];

  const handleDelete = (courseId: number) => {
    // نحذف فقط من الكورسات المخصصة (المحفوظة)؛ كورسات placeholder تبقى كما هي
    setCustomCourses(prev => {
      const updated = prev.filter(c => c.id !== courseId);
      try {
        localStorage.setItem('teacherCustomCourses', JSON.stringify(updated));
      } catch (error) {
        console.warn('Failed to update localStorage', error);
      }
      return updated;
    });

    const deletedCourse = allCourses.find(c => c.id === courseId);
    toast({
      title: t.courseDeleted,
      description: deletedCourse
        ? `تم حذف الكورس "${deletedCourse.title}" بنجاح.`
        : 'تم حذف الكورس بنجاح.',
      variant: 'destructive',
    });
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold">
          {t.myCourses_teacher}
        </h1>
        <Link href="/teacher/add-course">
          <Button>{t.addCourse_teacher}</Button>
        </Link>
      </div>

      {allCourses.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {t.noCoursesInCategory}
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {allCourses.map(course => {
            const isCustom = customCourses.some(c => c.id === course.id);
            const media = (course as StoredCourse).media;

            return (
              <Card key={course.id} className="flex flex-col justify-between">
                <CardHeader>
                  <CardTitle className="truncate">{course.title}</CardTitle>
                  <CardDescription>{course.code}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* عرض الميديا لو موجودة */}
                  {media && (
                    <div className="overflow-hidden rounded-md border">
                      {media.dataUrl && media.type.startsWith('image/') && (
                        <img
                          src={media.dataUrl}
                          alt={media.name}
                          className="h-40 w-full object-cover"
                        />
                      )}
                      {media.dataUrl && media.type.startsWith('video/') && (
                        <video
                          src={media.dataUrl}
                          controls
                          className="h-40 w-full object-cover"
                        />
                      )}
                      {!media.dataUrl && (
                        <div className="flex items-center gap-2 p-3 text-xs text-muted-foreground">
                          <FileIcon className="h-4 w-4" />
                          <span className="truncate">
                            {media.name} ({Math.round(media.size / 1024)} KB)
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* إحصائيات بسيطة */}
                  <div className="flex justify-around rounded-md bg-muted p-3">
                    <div className="text-center">
                      <Users className="mx-auto h-6 w-6 text-primary" />
                      <p className="text-lg font-bold">
                        {course.enrolledStudents}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t.student}
                      </p>
                    </div>
                    <div className="text-center">
                      <Star className="mx-auto h-6 w-6 text-amber-500" />
                      <p className="text-lg font-bold">
                        {course.rating.toFixed(1)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t.rating}
                      </p>
                    </div>
                  </div>

                  {/* آخر المراجعات */}
                  <div>
                    <h4 className="mb-2 font-semibold">{t.latestReviews}</h4>
                    {course.reviews && course.reviews.length > 0 ? (
                      course.reviews.slice(0, 2).map((review, i) => (
                        <div key={i} className="border-b p-2 text-sm">
                          <div className="flex items-center">
                            {Array.from({ length: 5 }, (_, starIndex) => (
                              <Star
                                key={starIndex}
                                className={`h-4 w-4 ${
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

                <CardFooter className="flex items-center justify-between">
                  <Button variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    {t.edit}
                  </Button>

                  {isCustom ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
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
                            onClick={() => handleDelete(course.id)}
                          >
                            {t.continue}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <div className="text-xs text-muted-foreground">
                      كورس افتراضي (من بيانات التجربة)
                    </div>
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
