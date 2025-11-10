
"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookCopy,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  Search,
  Package
} from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Header } from '@/components/header';
import { useLanguage } from '@/hooks/use-language';
import { Logo } from '@/components/logo';
import { studentData } from '@/lib/placeholder-data';

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const navItems = [
    { href: '/student/dashboard', label: t.dashboard, icon: LayoutDashboard },
    { href: '/student/my-courses', label: t.myCourses_sidebar, icon: BookCopy },
    { href: '/student/browse-courses', label: t.browseCourses_sidebar, icon: Search },
    { href: '/student/browse-teachers', label: t.browseTeachers_sidebar, icon: Users },
    { href: '/student/subscription', label: 'الاشتراك', icon: Package },
    { href: '/student/profile', label: t.editProfile_sidebar, icon: Settings },
  ];

  return (
    <SidebarProvider defaultOpen={false}>
      <Sidebar>
        <SidebarHeader className="border-b p-4">
          <Logo />
        </SidebarHeader>
        <SidebarContent className="p-4">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.label}
                    className="h-11"
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
          <SidebarMenu>
            <SidebarMenuItem>
                <Link href="/">
                    <SidebarMenuButton tooltip={t.logout} variant="outline" className="h-11">
                        <LogOut />
                        <span>{t.logout}</span>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <Header loggedIn={true} user={studentData}>
            <SidebarTrigger />
        </Header>
        <main className="p-4 md:p-6 bg-background/80 flex-1">{children}</main>
        <footer className="p-4 border-t text-center text-sm text-muted-foreground">
            {t.copyright}
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
