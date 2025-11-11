import { courses as placeholderCourses } from "@/lib/placeholder-data";
import { departments } from "@/lib/departments-data";

// نستخدم any عشان ما نتقيّد كثير بأنواع تايب سكربت
export type CatalogCourse = any;

export function getCatalogCourses(): CatalogCourse[] {
  const baseCourses = (placeholderCourses as any[]).map((c) => ({ ...c }));

  const deptCourses: CatalogCourse[] = [];
  let nextId = 10000; // أرقام عالية عشان ما تتصادم مع الكورسات الأساسية

  (departments as any[]).forEach((dep: any) => {
    const depNameAr = dep?.name?.ar ?? dep?.name ?? "";

    (dep?.specializations ?? []).forEach((spec: any) => {
      const specNameAr = spec?.name?.ar ?? spec?.name ?? "";
      const specNameEn = spec?.name?.en ?? "";
      const specializationLabel =
        specNameAr || specNameEn || depNameAr || "تخصص";

      (spec?.levels ?? []).forEach((lvl: any) => {
        (lvl?.semesters ?? []).forEach((sem: any) => {
          (sem?.materials ?? []).forEach((mat: any) => {
            const title =
              mat?.name?.ar ??
              mat?.name?.en ??
              mat?.title ??
              mat?.code ??
              "مقرر بدون اسم";

            const code = mat?.code ?? `MAT${nextId}`;
            const description =
              mat?.description ??
              `مقرر ${title} ضمن تخصص ${specializationLabel}`;
            const hours = mat?.hours ?? 3;

            deptCourses.push({
              id: nextId++,
              code,
              title,
              teacher: "هيئة التدريس",
              description,
              emoji: "📘",
              price: null,
              isFreeTrial: true,
              specialization: specializationLabel,
              hours,
              image: {
                id: code,
                imageUrl: "/course-placeholder.png",
                imageHint: title,
                description: title,
              },
              rating: 4.5,
              content: {
                chapters: [
                  {
                    id: 1,
                    title: "الوحدة الأولى",
                    description: "مقدمة عن المقرر وأهدافه.",
                    lessons: [
                      {
                        id: 1,
                        title: "مقدمة عن المقرر",
                        type: "video",
                        duration: "10m",
                        isPaid: false,
                      },
                      {
                        id: 2,
                        title: "ملخص PDF",
                        type: "pdf",
                        duration: "5m",
                        isPaid: false,
                      },
                    ],
                    pdfSummaries: [],
                  },
                ],
              },
            });
          });
        });
      });
    });
  });

  // دمج الكورسات الأساسية + كروسات الأقسام مع إزالة التكرار بالكود
  const map = new Map<string, CatalogCourse>();

  [...baseCourses, ...deptCourses].forEach((course: any) => {
    const code = course.code ?? `C${course.id}`;
    if (!map.has(code)) {
      map.set(code, course);
    }
  });

  return Array.from(map.values());
}
