
'use client';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Users, Star, BookCopy, UserCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { Teacher } from '@/lib/types';

type TeacherCardProps = {
  teacher: Teacher;
};

export function TeacherCard({ teacher }: TeacherCardProps) {
  const { t } = useLanguage();

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
        <Link href={`/student/teacher/${teacher.id}`} className='flex-1 flex flex-col'>
            <CardHeader className="items-center text-center p-4">
                <Avatar className="w-20 h-20 mb-3 border-2 border-primary">
                    <AvatarFallback className="bg-primary/20 text-primary">
                        <UserCircle className="h-10 w-10" />
                    </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl font-headline">{teacher.name}</CardTitle>
                <CardDescription>{teacher.specialization}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-4 pt-0">
                <div className="flex justify-around text-center text-sm p-3 bg-muted rounded-md">
                    <div>
                        <Users className="mx-auto h-5 w-5 text-muted-foreground" />
                        <p className="font-bold">{teacher.totalStudents}</p>
                        <p className="text-xs">{t.student}</p>
                    </div>
                    <div>
                        <Star className="mx-auto h-5 w-5 text-muted-foreground" />
                        <p className="font-bold">{teacher.averageRating.toFixed(1)}</p>
                        <p className="text-xs">{t.rating}</p>
                    </div>
                     <div>
                        <BookCopy className="mx-auto h-5 w-5 text-muted-foreground" />
                        <p className="font-bold">{teacher.courses.length}</p>
                        <p className="text-xs">{t.courses}</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-4">
                <Button className="w-full" variant="outline">{t.viewProfile}</Button>
            </CardFooter>
        </Link>
    </Card>
  );
}
