"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { GraduationCap, Presentation } from "lucide-react";

import { useLanguage } from "@/hooks/use-language";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { branches } from "@/lib/placeholder-data";

export default function SignupPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [role, setRole] = useState<"student" | "teacher">("student");

  const handleSignup = () => {
    const nameInput = document.getElementById("name") as HTMLInputElement | null;
    const emailInput = document.getElementById("email") as HTMLInputElement | null;

    const name = nameInput?.value?.trim() || "";
    const email = emailInput?.value?.trim() || "";

    const user = {
      name,
      email,
      role,
    };

    try {
      localStorage.setItem("eduSmartUser", JSON.stringify(user));
    } catch (err) {
      console.warn("Failed to save user to localStorage", err);
    }

    const path =
      role === "student" ? "/student/dashboard" : "/teacher/dashboard";
    router.push(path);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="mx-auto w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">
              {t.createNewAccount}
            </CardTitle>
            <CardDescription>{t.signupDescription}</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {/* اختيار الدور */}
              <div className="space-y-2">
                <Label>{t.iAmA}</Label>
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

              {/* الاسم الكامل */}
              <div className="space-y-2">
                <Label htmlFor="name">{t.fullName}</Label>
                <Input id="name" placeholder="e.g., Ahmed Al Farsi" />
              </div>

              {/* البريد الإلكتروني */}
              <div className="space-y-2">
                <Label htmlFor="email">{t.email}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  autoComplete="email"
                />
              </div>

              {/* كلمة المرور */}
              <div className="space-y-2">
                <Label htmlFor="password">{t.password}</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                />
              </div>

              {/* فرع الجامعة */}
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

              {/* زر إنشاء الحساب */}
              <div className="pt-2">
                <Button className="w-full" onClick={handleSignup}>
                  {t.createNewAccount}
                </Button>
              </div>

              {/* عندك حساب مسبقاً؟ */}
              <div className="mt-4 text-center text-sm">
                {t.alreadyHaveAccount}{" "}
                <Link href="/login" className="underline">
                  {t.login}
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
