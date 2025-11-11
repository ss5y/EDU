// يبني كل كورسات التخصص من ملف الأقسام والتخصصات
// ملاحظة: نستخدم any هنا عشان ما تطلع أخطاء typescript لو ما كانت الحقول معرفة في Material

import { departments } from "./departments-data";

export type CatalogCourse = {
  id: number;
  code: string;
  title: string;
  description: string;
  teacher: string;
  specialization: string;
  departmentId: string;
  emoji: string;
  hours: number;

  // للفلاتر:
  programType?: string;   // "diploma" | "higher_diploma" | "bachelor" | "foundation" ...
  levelLabel?: string;    // مثال: "المستوى الأول"
  semesterLabel?: string; // مثال: "الفصل الأول"
};

export function buildCoursesForStudentSpecialization(
  specializationNameAr: string
): CatalogCourse[] {
  const result: CatalogCourse[] = [];
  let autoId = 10_000; // IDs عالية عشان ما تتعارض مع غيرها

  (departments as any[]).forEach((dep) => {
    (dep.specializations as any[]).forEach((spec) => {
      if (spec?.name?.ar !== specializationNameAr) return;

      const programType =
        spec?.programType ?? spec?.degree ?? "bachelor"; // افتراضي بكالوريوس

      (spec.levels as any[]).forEach((lvl: any) => {
        const levelLabel =
          lvl?.name?.ar ?? lvl?.label ?? lvl?.title ?? "مستوى";

        (lvl.semesters as any[]).forEach((sem: any) => {
          const semesterLabel =
            sem?.name?.ar ?? sem?.label ?? sem?.title ?? "فصل دراسي";

          (sem.materials as any[]).forEach((mat: any) => {
            const title = mat?.name?.ar ?? "مادة بدون اسم";
            const code = mat?.code ?? "";
            const description =
              mat?.description ?? `مقرر ${title} ضمن تخصص ${spec.name?.ar}`;
            const teacher =
              mat?.defaultTeacher ??
              "هيئة التدريس في القسم / التخصص";
            const hours = mat?.hours ?? 3;

            result.push({
              id: autoId++,
              code,
              title,
              description,
              teacher,
              specialization: spec.name?.ar ?? "",
              departmentId: dep.id ?? "",
              emoji: "📘",
              hours,
              programType,
              levelLabel,
              semesterLabel,
            });
          });
        });
      });
    });
  });

  return result;
}
