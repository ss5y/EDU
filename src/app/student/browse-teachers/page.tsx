
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { allTeachers } from '@/lib/placeholder-data';
import { Search, Users } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { TeacherCard } from '@/components/teacher-card';
import { Teacher } from '@/lib/types';


export default function BrowseTeachersPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTeachers = allTeachers.filter((teacher: Teacher) => {
    const term = searchTerm.toLowerCase();
    return teacher.name.toLowerCase().includes(term) || 
           teacher.specialization.toLowerCase().includes(term) ||
           teacher.branch.toLowerCase().includes(term);
  });

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Users className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">{t.browseTeachers_sidebar}</h1>
      </div>
      <div className="mb-8 p-4 rounded-lg bg-card border">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
                placeholder={t.searchByTeacherName}
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredTeachers.length > 0 ? (
            filteredTeachers.map((teacher) => (
                <TeacherCard key={teacher.id} teacher={teacher} />
            ))
        ) : (
            <p className="col-span-full text-center text-muted-foreground">{t.noResults}</p>
        )}
      </div>
    </div>
  );
}
