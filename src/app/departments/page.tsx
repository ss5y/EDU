"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { departments } from "@/lib/departments-data"
import { useLanguage } from "@/hooks/use-language"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DepartmentsPage() {
  const { dir } = useLanguage()
  const isAr = dir === "rtl"

  const title = isAr ? "الأقسام" : "Departments"
  const subtitle = isAr
    ? "اختر القسم المناسب لتظهر لك التخصصات والفصول الدراسية والمواد المرتبطة به."
    : "Choose the department to view its specializations, semesters and materials."

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="w-full py-8 md:py-12 lg:py-16">
          <div className="container mx-auto px-4 md:px-6 space-y-8">
            {/* العنوان */}
            <div className="text-center space-y-2">
              <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary">
                {title}
              </h1>
              <p className="text-foreground/80">{subtitle}</p>
            </div>

            {/* كروت الأقسام */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {departments.map((dept) => {
                // عدد التخصصات مع استثناء "السنة الأولى" في جميع الأقسام
                // ما عدا السنة التأسيسية
                const specializationsCount =
                  dept.id === "foundation"
                    ? dept.specializations.length
                    : dept.specializations.filter(
                        (spec) => !spec.id.endsWith("first-year")
                      ).length

                const name = isAr ? dept.name.ar : dept.name.en
                const desc = isAr
                  ? `يحتوي على ${specializationsCount} تخصصات`
                  : `Contains ${specializationsCount} specializations`

                return (
                  <Card
                    key={dept.id}
                    className="bg-card/60 backdrop-blur border-border/60 hover:border-primary/60 transition-all duration-200"
                  >
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-center">
                        {name}
                      </CardTitle>
                      <CardDescription className="text-center">
                        {desc}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                      <Link href={`/departments/${dept.id}`}>
                        <Button>{isAr ? "عرض التخصصات" : "View specializations"}</Button>
                      </Link>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
