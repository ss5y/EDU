'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CourseCard } from '@/components/course-card';
import { courses as allCourses } from '@/lib/placeholder-data';
import { Search } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

// التخصصات المسموح بها في التصفّح
const allowedSpecializations = [
  'تكنولوجيا المعلومات',
  'إدارة الأعمال',
  'الهندسة',
  'السنة التأسيسية',
];

export default function BrowseCoursesPage() {
  const { t } = useLanguage();

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    popularity: 'all',      // all | most_popular | standard
    newness: 'all',         // all | new | old
    specialization: 'all',  // all | one of allowedSpecializations
    free: 'all',            // all | free
  });

  // نقيّد الكورسات بالتخصصات المطلوبة فقط
  const courses = allCourses.filter(course =>
    allowedSpecializations.includes(course.specialization)
  );

  // قائمة التخصصات في الفلتر (من نفس المصفوفة أعلاه)
  const specializations = allowedSpecializations;

  const handleFilterChange =
    (filterName: keyof typeof filters) =>
    (value: string) => {
      setFilters(prev => ({ ...prev, [filterName]: value }));
    };

  const filteredCourses = courses.filter(course => {
    const search = searchTerm.trim().toLowerCase();

    const searchMatch =
      search.length === 0 ||
      course.title.toLowerCase().includes(search) ||
      course.code.toLowerCase().includes(search);

    const popularityMatch =
      filters.popularity === 'all' ||
      course.popularity === filters.popularity;

    const newnessMatch =
      filters.newness === 'all' ||
      course.newness === filters.newness;

    const specializationMatch =
      filters.specialization === 'all' ||
      course.specialization === filters.specialization;

    const freeMatch =
      filters.free === 'all' ||
      (filters.free === 'free' && course.price === null);

    return (
      searchMatch &&
      popularityMatch &&
      newnessMatch &&
      specializationMatch &&
      freeMatch
    );
  });

  return (
    <div>
      <h1 className="mb-6 font-headline text-3xl font-bold">
        {t.discoverCourses}
      </h1>

      {/* فلاتر البحث */}
      <div className="mb-8 rounded-lg border bg-card p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* البحث */}
          <div className="relative lg:col-span-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t.searchByNameOrCode}
              className="pl-10"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          {/* فلتر التخصص */}
          <Select
            onValueChange={handleFilterChange('specialization')}
            defaultValue="all"
          >
            <SelectTrigger>
              <SelectValue placeholder={t.filterBySpecialization} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allSpecializations}</SelectItem>
              {specializations.map(spec => (
                <SelectItem key={spec} value={spec}>
                  {spec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* فلتر الشعبية */}
          <Select
            onValueChange={handleFilterChange('popularity')}
            defaultValue="all"
          >
            <SelectTrigger>
              <SelectValue placeholder={t.mostPopular} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.all}</SelectItem>
              <SelectItem value="most_popular">{t.mostPopular}</SelectItem>
              <SelectItem value="standard">باقي الكورسات</SelectItem>
            </SelectContent>
          </Select>

          {/* فلتر الجديد / القديم */}
          <Select
            onValueChange={handleFilterChange('newness')}
            defaultValue="all"
          >
            <SelectTrigger>
              <SelectValue placeholder={t.newest} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.all}</SelectItem>
              <SelectItem value="new">{t.newest}</SelectItem>
              <SelectItem value="old">الأقدم</SelectItem>

            </SelectContent>
          </Select>

          {/* فلتر المجاني */}
          <Select
            onValueChange={handleFilterChange('free')}
            defaultValue="all"
          >
            <SelectTrigger>
              <SelectValue placeholder={t.free} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.all}</SelectItem>
              <SelectItem value="free">{t.free}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* شبكة الكورسات */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredCourses.length > 0 ? (
  filteredCourses.map((course: any) => (
    <CourseCard key={course.id} course={course as any} />
  ))
) : (
  <p className="col-span-full text-center text-muted-foreground">
    لا توجد كورسات مطابقة للبحث حالياً.
  </p>
)}

      </div>
    </div>
  );
}
