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
  params: Promise<{ department: string }>
}

export default function DepartmentSpecializationsPage({ params }: Props) {
  const { department } = use(params)
  const { dir } = useLanguage()
  const isAr = dir === "rtl"

  const dept = departments.find((d) => d.id === department)
  if (!dept) return notFound()

  const title = isAr ? dept.name.ar : dept.name.en
  const backText = isAr ? "الرجوع إلى الأقسام" : "Back to departments"
  const chooseSpec = isAr
    ? "اختر نوع التخصص للاطّلاع على مستوى الدراسة والفصول الدراسية والمواد."
    : "Choose a specialization to view levels, semesters, and materials."

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
                <p className="text-foreground/80 mt-2">{chooseSpec}</p>
              </div>
              <Link href="/departments">
                <Button variant="outline">{backText}</Button>
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {dept.specializations.map((spec) => (
                <Card
                  key={spec.id}
                  className="bg-card/60 backdrop-blur border-border/60 hover:border-primary/60 transition-all duration-200"
                >
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-foreground text-center">
                      {isAr ? spec.name.ar : spec.name.en}
                    </CardTitle>
                    <CardDescription className="text-foreground/70 text-center">
                      {isAr
                        ? `يحتوي على ${spec.levels.length} مستويات`
                        : `Has ${spec.levels.length} levels`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <Link href={`/departments/${dept.id}/${spec.id}`}>
                      <Button size="sm">
                        {isAr ? "عرض المستويات" : "View levels"}
                      </Button>
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
