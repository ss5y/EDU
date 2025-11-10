"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Presentation } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { branches } from "@/lib/placeholder-data";
import { departments } from "@/lib/departments-data";

export default function LoginPage() {
  const { t } = useLanguage();
  const router = useRouter();

  const [role, setRole] = useState<"student" | "teacher">("student");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>("");

  // 🧩 عند اختيار قسم، يتم تحديث قائمة التخصصات
  const specializations = useMemo(() => {
    if (!selectedDepartment) return [];
    const dep = departments.find((d) => d.id === selectedDepartment);
    return dep ? dep.specializations.map((s) => s.name.ar) : [];
  }, [selectedDepartment]);

  // 📦 تحميل البيانات السابقة إن وجدت
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("eduSmartUser");
    if (stored) {
      const parsed = JSON.parse(stored);
      setSelectedDepartment(parsed.department || "");
      setSelectedSpecialization(parsed.specialization || "");
      setRole(parsed.role || "student");
    }
  }, []);

  // 🧠 تسجيل الدخول
  const handleLogin = () => {
    const emailInput = document.getElementById("email") as HTMLInputElement | null;
    const passwordInput = document.getElementById("password") as HTMLInputElement | null;
    const email = emailInput?.value?.trim() || "";
    const password = passwordInput?.value?.trim() || "";

    if (!email || !password) {
      alert("يرجى إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    if (!selectedDepartment || !selectedSpecialization) {
      alert("يرجى اختيار القسم والتخصص قبل تسجيل الدخول");
      return;
    }

    const user = {
      email,
      role,
      department: selectedDepartment,
      specialization: selectedSpecialization,
      name: email.split("@")[0], // اسم افتراضي من الإيميل
    };

    try {
      localStorage.setItem("eduSmartUser", JSON.stringify(user));
    } catch (err) {
      console.warn("Failed to save user to localStorage", err);
    }

    const path = role === "student" ? "/student/dashboard" : "/teacher/dashboard";
    router.push(path);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="mx-auto w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">{t.login}</CardTitle>
            <CardDescription>تسجيل الدخول إلى حسابك</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {/* اختيار الدور */}
              <div className="space-y-2">
                <Label>أنا</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={role === "student" ? "default" : "outline"}
                    onClick={() => setRole("student")}
                    className="w-full"
                  >
                    <GraduationCap className="ml-2 h-4 w-4" />
                    {t.student}
                  </Button>

                  <Button
                    type="button"
                    variant={role === "teacher" ? "default" : "outline"}
                    onClick={() => setRole("teacher")}
                    className="w-full"
                  >
                    <Presentation className="ml-2 h-4 w-4" />
                    {t.teacher}
                  </Button>
                </div>
              </div>

              {/* البريد الإلكتروني */}
              <div className="space-y-2">
                <Label htmlFor="email">{t.email}</Label>
                <Input id="email" type="email" placeholder="email@example.com" />
              </div>

              {/* كلمة المرور */}
              <div className="space-y-2">
                <Label htmlFor="password">{t.password}</Label>
                <Input id="password" type="password" placeholder="********" />
              </div>

              {/* اختيار فرع الجامعة */}
              <div className="space-y-2">
                <Label htmlFor="branch">{t.selectBranch}</Label>
                <Select>
                  <SelectTrigger id="branch">
                    <SelectValue placeholder={t.selectBranch} />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch} value={branch}>
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* اختيار القسم */}
              <div className="space-y-2">
                <Label>اختر القسم</Label>
                <Select
                  onValueChange={setSelectedDepartment}
                  value={selectedDepartment}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر القسم" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dep) => (
                      <SelectItem key={dep.id} value={dep.id}>
                        {dep.name.ar}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* اختيار التخصص */}
              <div className="space-y-2">
                <Label>اختر التخصص</Label>
                <Select
                  onValueChange={setSelectedSpecialization}
                  value={selectedSpecialization}
                  disabled={!selectedDepartment}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر التخصص" />
                  </SelectTrigger>
                  <SelectContent>
                    {specializations.length > 0 ? (
                      specializations.map((spec) => (
                        <SelectItem key={spec} value={spec}>
                          {spec}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        اختر القسم أولاً
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* زر تسجيل الدخول */}
              <div className="pt-2">
                <Button className="w-full" onClick={handleLogin}>
                  {t.login}
                </Button>
              </div>

              {/* إنشاء حساب جديد */}
              <div className="mt-4 text-center text-sm">
                ليس لديك حساب؟{" "}
                <Link href="/signup" className="underline">
                  {t.createNewAccount}
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
