"use client"

import { use } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { departments } from "@/lib/departments-data"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/hooks/use-language"

type Props = {
  params: Promise<{
    department: string
    specialization: string
    level: string
    semester: string
  }>
}

export default function SemesterMaterialsPage({ params }: Props) {
  const { department, specialization, level, semester } = use(params)
  const { dir } = useLanguage()
  const isAr = dir === "rtl"

  const dept = departments.find((d) => d.id === department)
  const spec = dept?.specializations.find((s) => s.id === specialization)
  const levelObj = spec?.levels.find((l) => l.id === level)
  const semesterObj = levelObj?.semesters.find((s) => s.id === semester)

  if (!dept || !spec || !levelObj || !semesterObj) return notFound()

  const breadcrumbDepartments = isAr ? "الأقسام" : "Departments"
  const materialsTitle = isAr
    ? `مواد ${semesterObj.name.ar}`
    : `Materials – ${semesterObj.name.en}`
  const materialsLabel = isAr ? "المواد" : "Materials"
  const noLink = isAr ? "لا يوجد رابط حاليًا" : "No link yet"
  const open = isAr ? "فتح المادة" : "Open material"
  const courseCode = isAr ? "رمز المادة" : "Course code"

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="w-full py-8 md:py-12 lg:py-16">
          <div className="container mx-auto px-4 md:px-6 space-y-8">
            <div className="space-y-2">
              <p className="text-sm text-foreground/60">
                <Link href="/departments" className="hover:underline">
                  {breadcrumbDepartments}
                </Link>{" "}
                /{" "}
                <Link href={`/departments/${dept.id}`} className="hover:underline">
                  {isAr ? dept.name.ar : dept.name.en}
                </Link>{" "}
                /{" "}
                <Link
                  href={`/departments/${dept.id}/${spec.id}`}
                  className="hover:underline"
                >
                  {isAr ? spec.name.ar : spec.name.en}
                </Link>{" "}
                /{" "}
                <Link
                  href={`/departments/${dept.id}/${spec.id}/${levelObj.id}`}
                  className="hover:underline"
                >
                  {isAr ? levelObj.name.ar : levelObj.name.en}
                </Link>{" "}
                / <span>{isAr ? semesterObj.name.ar : semesterObj.name.en}</span>
              </p>
              <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary">
                {materialsTitle}
              </h1>
            </div>

            <Card className="bg-card/60 backdrop-blur border-border/60">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">
                  {materialsLabel}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {semesterObj.materials.map((m) => (
                  <div
                    key={m.code}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-border/40 pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {isAr ? m.name.ar : m.name.en}
                      </p>
                      <p className="text-xs text-foreground/60 mt-1">
                        {courseCode}: {m.code}
                      </p>
                    </div>

                    {m.link ? (
                      <Link href={m.link} target="_blank">
                        <Button size="sm" variant="outline">
                          {open}
                        </Button>
                      </Link>
                    ) : (
                      <Button size="sm" variant="outline" disabled>
                        {noLink}
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
