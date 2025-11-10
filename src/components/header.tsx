"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, LogOut } from "lucide-react"
import { Logo } from "./logo"
import { ThemeToggle } from "./theme-toggle"
import { LanguageToggle } from "./language-toggle"
import { useLanguage } from "@/hooks/use-language"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Student, Teacher } from "@/lib/types"

interface HeaderProps {
  children?: React.ReactNode
  loggedIn?: boolean
  user?: Student | Teacher
}

export function Header({ children, loggedIn = false, user }: HeaderProps) {
  const { t, dir } = useLanguage()
  const isAr = dir === "rtl"

  const navLinks = [
    { href: "/", label: t.home },
    { href: "/#plans", label: t.plans },
    { href: "/#how-it-works", label: t.howItWorks },
  ]

  if (loggedIn) {
    navLinks.push({ href: "/student/browse-courses", label: t.courses })
  }

  const getInitials = (name: string) => {
    const names = name.split(" ")
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const isStudent = (user: any): user is Student =>
    user && "enrolledCourses" in user

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          {children}

          <div className="hidden md:flex items-center">
            <Logo />
          </div>

          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-accent"
                prefetch={false}
              >
                {link.label}
              </Link>
            ))}

            {/* رابط الأقسام في الهيدر (يتغير حسب اللغة) */}
            <Link
              href="/departments"
              className="transition-colors hover:text-accent"
              prefetch={false}
            >
              {isAr ? "الأقسام" : "Departments"}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {/* جزء الديسكتوب: أزرار اللغة/الثيم والحساب */}
          <div className="hidden md:flex items-center gap-2">
            {!loggedIn && (
              <Link href="/login">
                <Button variant="ghost">{t.loginSignup}</Button>
              </Link>
            )}
            <LanguageToggle />
            <ThemeToggle />
            {loggedIn && user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isStudent(user) ? (
                    <DropdownMenuItem asChild>
                      <Link href="/student/profile">{t.studentProfile}</Link>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem asChild>
                      <Link href="/teacher/profile">{t.teacherProfile}</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/">
                      <LogOut className="ml-2 h-4 w-4" />
                      {t.logout}
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* منيو الجوال */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side={dir === "rtl" ? "right" : "left"}>
                <div className="flex flex-col gap-6 p-6">
                  <Logo />
                  <nav className="grid gap-4 text-lg font-medium">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="transition-colors hover:text-accent"
                        prefetch={false}
                      >
                        {link.label}
                      </Link>
                    ))}

                    {/* رابط الأقسام في منيو الجوال */}
                    <Link
                      href="/departments"
                      className="transition-colors hover:text-accent"
                      prefetch={false}
                    >
                      {isAr ? "الأقسام" : "Departments"}
                    </Link>

                    {!loggedIn && (
                      <Link
                        href="/login"
                        className="transition-colors hover:text-accent"
                        prefetch={false}
                      >
                        {t.loginSignup}
                      </Link>
                    )}
                  </nav>
                  <div className="flex items-center justify-center gap-4">
                    <LanguageToggle />
                    <ThemeToggle />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}