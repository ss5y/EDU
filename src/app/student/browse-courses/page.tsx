"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

import { useLanguage } from "@/hooks/use-language";
import {
  buildCoursesForStudentSpecialization,
  CatalogCourse,
} from "@/lib/build-courses-from-departments";

type SubscriptionInfo = {
  planId: "monthly" | "quarter" | "annual";
  planName: string;
  maxCourses: number;
};

const PROGRAM_LABELS: Record<string, string> = {
  diploma: "دبلوم",
  higher_diploma: "دبلوم عالي",
  bachelor: "بكالوريوس",
  foundation: "السنة الأولى",
};

export default function BrowseCoursesPage() {
  const { t } = useLanguage();
  const router = useRouter();

  const [specialization, setSpecialization] = useState<string>("");
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(
    null
  );

  const [allCourses, setAllCourses] = useState<CatalogCourse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // فلاتر إضافية
  const [specFilter, setSpecFilter] = useState<string>("all");
  const [programFilter, setProgramFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [semesterFilter, setSemesterFilter] = useState<string>("all");

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // تحميل التخصص والاشتراك
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const rawUser = localStorage.getItem("eduSmartUser");
      if (rawUser) {
        const user = JSON.parse(rawUser);
        setSpecialization(user?.specialization || "");
      }

      const rawSub = localStorage.getItem("edu_subscription");
      if (rawSub) {
        const sub = JSON.parse(rawSub) as SubscriptionInfo;
        setSubscription(sub);
      }
    } catch (err) {
      console.warn("failed to read user/subscription from localStorage", err);
    }
  }, []);

  // بناء الكورسات من ملف الأقسام حسب التخصص
  useEffect(() => {
    if (!specialization) return;
    const generated = buildCoursesForStudentSpecialization(specialization);
    setAllCourses(generated);
  }, [specialization]);

  const maxCourses = subscription?.maxCourses ?? 5;

  // خيارات الفلاتر من البيانات نفسها
  const specializationOptions = useMemo(
    () =>
      Array.from(
        new Set(allCourses.map((c) => c.specialization).filter(Boolean))
      ),
    [allCourses]
  );

  const levelOptions = useMemo(
    () =>
      Array.from(new Set(allCourses.map((c) => c.levelLabel).filter(Boolean))),
    [allCourses]
  );

  const semesterOptions = useMemo(
    () =>
      Array.from(
        new Set(allCourses.map((c) => c.semesterLabel).filter(Boolean))
      ),
    [allCourses]
  );

  const programOptions = useMemo(
    () =>
      Array.from(
        new Set(allCourses.map((c) => c.programType).filter(Boolean))
      ),
    [allCourses]
  );

  // الفلترة النهائية
  const filteredCourses = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return allCourses.filter((c) => {
      const searchOk =
        !search ||
        c.title.toLowerCase().includes(search) ||
        c.code.toLowerCase().includes(search);

      const specOk =
        specFilter === "all" || c.specialization === specFilter;

      const progOk =
        programFilter === "all" ||
        c.programType === programFilter;

      const levelOk =
        levelFilter === "all" ||
        c.levelLabel === levelFilter;

      const semOk =
        semesterFilter === "all" ||
        c.semesterLabel === semesterFilter;

      return searchOk && specOk && progOk && levelOk && semOk;
    });
  }, [
    allCourses,
    searchTerm,
    specFilter,
    programFilter,
    levelFilter,
    semesterFilter,
  ]);

  const selectedCount = selectedIds.size;
  const remaining = Math.max(0, maxCourses - selectedCount);

  const toggleCourse = (course: CatalogCourse) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(course.id)) {
        next.delete(course.id);
      } else {
        if (next.size >= maxCourses) {
          alert(`لا يمكنك اختيار أكثر من ${maxCourses} كورسات في هذه الباقة`);
          return prev;
        }
        next.add(course.id);
      }
      return next;
    });
  };

  const handleFinalizeSelection = () => {
    if (typeof window === "undefined") return;

    if (selectedIds.size === 0) {
      alert("اختر على الأقل كورس واحد قبل الإكمال");
      return;
    }

    const selectedCourses = allCourses.filter((c) => selectedIds.has(c.id));

    const enrolled = selectedCourses.map((c) => ({
      ...c,
      status: "active" as const,
      progress: 0,
      rating: 4.5,
    }));

    localStorage.setItem(
      "student_enrolled_courses",
      JSON.stringify(enrolled)
    );

    localStorage.removeItem("studentEnrollments");
    localStorage.removeItem("studentSelectedCourses");

    alert("تم حفظ الكورسات المختارة في حسابك ✅");
    router.push("/student/dashboard");
  };

  return (
    <div className="space-y-8">
      {/* العنوان العلوي */}
      <section className="space-y-2 text-center">
        <h1 className="font-headline text-3xl font-bold sm:text-4xl">
          اكتشف الكورسات
        </h1>
        <p className="text-muted-foreground">
          تخصّصك:{" "}
          <span className="font-semibold">
            {specialization || "غير محدد"}
          </span>
        </p>
        <p className="text-sm text-muted-foreground">
          يمكنك اختيار{" "}
          <span className="font-semibold">{maxCourses}</span> كورسات في هذه
          الباقة – المختار:{" "}
          <span className="font-semibold">{selectedCount}</span> – المتبقي:{" "}
          <span className="font-semibold">{remaining}</span>
        </p>
      </section>

      {/* فلاتر البحث */}
      <section className="rounded-lg border bg-card p-4 space-y-4">
        {/* بحث بالاسم / الكود */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="البحث بالاسم أو الكود..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* سطر 4 فلاتر كما بالصورة */}
        <div className="grid gap-4 md:grid-cols-4">
          {/* التخصص */}
          <Select
            value={specFilter}
            onValueChange={setSpecFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="كل التخصصات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل التخصصات</SelectItem>
              {specializationOptions.map((spec) => (
                <SelectItem key={spec} value={spec}>
                  {spec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* نوع البرنامج: دبلوم / دبلوم عالي / بكالوريوس / السنة الأولى */}
          <Select
            value={programFilter}
            onValueChange={setProgramFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="الكل" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              {programOptions.map((p) => (
                <SelectItem key={p as string} value={p as string}>
                  {PROGRAM_LABELS[p as string] ?? p}
                </SelectItem>
              ))}
              {/* لو حبيت تثبتهم دائماً حتى لو ما طلعوا من البيانات */}
              <SelectItem value="diploma">دبلوم</SelectItem>
              <SelectItem value="higher_diploma">دبلوم عالي</SelectItem>
              <SelectItem value="bachelor">بكالوريوس</SelectItem>
              <SelectItem value="foundation">السنة الأولى</SelectItem>
            </SelectContent>
          </Select>

          {/* المستوى (المستوى الأول / الثاني ...الخ) */}
          <Select
            value={levelFilter}
            onValueChange={setLevelFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="الكل" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل المستويات</SelectItem>
              {levelOptions.map((lvl) => (
                <SelectItem key={lvl as string} value={lvl as string}>
                  {lvl}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* الفصل (الأول / الثاني) */}
          <Select
            value={semesterFilter}
            onValueChange={setSemesterFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="الكل" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الفصول</SelectItem>
              {semesterOptions.map((sem) => (
                <SelectItem key={sem as string} value={sem as string}>
                  {sem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* شبكة الكورسات */}
      <section className="space-y-4">
        {filteredCourses.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center">
            لا توجد مواد حالياً حسب الفلاتر المحددة.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => {
              const isSelected = selectedIds.has(course.id);
              return (
                <Card
                  key={course.id}
                  className={`flex flex-col justify-between border-2 transition ${
                    isSelected
                      ? "border-primary shadow-lg"
                      : "border-transparent hover:border-primary/40"
                  }`}
                >
                  <CardHeader className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">{course.code}</Badge>
                      <Badge variant="secondary">
                        {course.specialization}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-headline">
                      {course.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {course.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      المحاضر:{" "}
                      <span className="font-semibold">
                        {course.teacher}
                      </span>
                    </p>
                    {course.levelLabel && (
                      <p className="text-xs text-muted-foreground">
                        المستوى:{" "}
                        <span className="font-semibold">
                          {course.levelLabel}
                        </span>
                      </p>
                    )}
                    {course.semesterLabel && (
                      <p className="text-xs text-muted-foreground">
                        الفصل:{" "}
                        <span className="font-semibold">
                          {course.semesterLabel}
                        </span>
                      </p>
                    )}

                    <div className="mt-4 flex justify-center text-6xl">
                      {/* صورة / إيموجي كتاب لكل المواد */}
                      <span>📘</span>
                    </div>

                    <Button
                      className="mt-4 w-full"
                      variant={isSelected ? "secondary" : "default"}
                      onClick={() => toggleCourse(course)}
                    >
                      {isSelected ? "تم الاختيار" : "اختر هذا الكورس"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* زر إكمال الاختيار */}
        <div className="flex justify-center pt-4">
          <Button
            size="lg"
            className="w-full max-w-md"
            onClick={handleFinalizeSelection}
            disabled={selectedIds.size === 0}
          >
            إكمال الاختيار وحفظ الكورسات
          </Button>
        </div>
      </section>
    </div>
  );
}
