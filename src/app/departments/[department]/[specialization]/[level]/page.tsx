"use client"

import { use } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { departments } from "@/lib/departments-data"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/hooks/use-language"

type Props = {
  params: Promise<{ department: string; specialization: string; level: string }>
}

export default function LevelSemestersPage({ params }: Props) {
  const { department, specialization, level } = use(params)
  const { dir } = useLanguage()
  const isAr = dir === "rtl"

  const dept = departments.find((d) => d.id === department)
  const spec = dept?.specializations.find((s) => s.id === specialization)
  const levelObj = spec?.levels.find((l) => l.id === level)

  if (!dept || !spec || !levelObj) return notFound()

  const title = isAr
    ? `${spec.name.ar} - ${levelObj.name.ar}`
    : `${spec.name.en} - ${levelObj.name.en}`
  const backText = isAr ? "الرجوع إلى المستويات" : "Back to levels"
  const chooseSemester = isAr
    ? "اختر الفصل للاطّلاع على المواد."
    : "Choose a semester to view materials."
  const viewMaterials = isAr ? "عرض المواد" : "View materials"

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="w-full py-8 md:py-12 lg:py-16">
          <div className="container mx-auto px-4 md:px-6 space-y-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary">
                  {title}
                </h1>
                <p className="text-foreground/80 mt-2">{chooseSemester}</p>
              </div>
              <Link href={`/departments/${dept.id}/${spec.id}`}>
                <Button variant="outline">{backText}</Button>
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {levelObj.semesters.map((sem) => (
                <Card
                  key={sem.id}
                  className="bg-card/60 backdrop-blur border-border/60 hover:border-primary/60 transition-all duration-200"
                >
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-foreground">
                      {isAr ? sem.name.ar : sem.name.en}
                    </CardTitle>
                    <CardDescription className="text-foreground/70">
                      {isAr
                        ? `عدد المواد: ${sem.materials.length}`
                        : `Materials: ${sem.materials.length}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-between items-center">
                    <span className="text-sm text-foreground/70">
                      {isAr ? `سمستر ${sem.id}` : `Semester ${sem.id}`}
                    </span>
                    <Link
                      href={`/departments/${dept.id}/${spec.id}/${levelObj.id}/${sem.id}`}
                    >
                      <Button size="sm">{viewMaterials}</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
