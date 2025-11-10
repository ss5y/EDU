
'use client';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { studentData, branches, specializations, academicYears } from '@/lib/placeholder-data';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Package, Calendar, Book, Award, UserCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

export default function StudentProfilePage() {
    const { t } = useLanguage();
    const { toast } = useToast();

    const [profile, setProfile] = useState(studentData);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({...prev, [name]: value}));
    }

    const handleSelectChange = (name: string) => (value: string) => {
         setProfile(prev => ({...prev, [name]: value}));
    }

    const handleSaveChanges = () => {
        toast({
            title: "Profile Updated",
            description: "Your profile has been saved successfully.",
        })
    }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">{t.editProfile}</CardTitle>
                    <CardDescription>{t.editProfile_sidebar}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                        <Avatar className="w-24 h-24">
                            <AvatarFallback className="text-4xl"><UserCircle /></AvatarFallback>
                        </Avatar>
                        <div className='flex-1'>
                            <Label htmlFor="picture">{t.uploadNewPhoto}</Label>
                            <div className="flex gap-2 mt-2">
                                <Input id="picture" type="file" className="flex-1" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">{t.fullName}</Label>
                            <Input id="name" name="name" value={profile.name} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">{t.email}</Label>
                            <Input id="email" name="email" type="email" value={profile.email} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="branch">{t.selectBranch}</Label>
                            <Select value={profile.branch} onValueChange={handleSelectChange('branch')}>
                                <SelectTrigger id="branch">
                                    <SelectValue placeholder={t.selectYourBranch} />
                                </SelectTrigger>
                                <SelectContent>
                                    {branches.map(branch => (
                                        <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="specialization">{t.specialization}</Label>
                            <Select value={profile.specialization} onValueChange={handleSelectChange('specialization')}>
                                <SelectTrigger id="specialization">
                                    <SelectValue placeholder={t.selectSpecialization} />
                                </SelectTrigger>
                                <SelectContent>
                                    {specializations.map(spec => (
                                        <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="academicYear">{t.academicYear}</Label>
                            <Select value={profile.academicYear} onValueChange={handleSelectChange('academicYear')}>
                                <SelectTrigger id="academicYear">
                                    <SelectValue placeholder={t.selectAcademicYear} />
                                </SelectTrigger>
                                <SelectContent>
                                    {academicYears.map(year => (
                                        <SelectItem key={year} value={year}>{year}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bio">{t.bio}</Label>
                        <Textarea id="bio" name="bio" placeholder="Tell us a little about yourself" value={profile.bio} onChange={handleInputChange} rows={4} />
                    </div>
                </CardContent>
                <CardFooter className="border-t pt-6">
                    <Button onClick={handleSaveChanges}>{t.saveChanges}</Button>
                </CardFooter>
            </Card>
        </div>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="w-6 h-6 text-primary" />
                        تفاصيل الاشتراك
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="font-semibold">الباقة الحالية:</span>
                        <span className="font-bold text-primary">{profile.subscription.planName}</span>
                    </div>
                     <div className="flex items-center justify-between">
                        <span className="font-semibold">تاريخ الانتهاء:</span>
                        <span className="text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {profile.subscription.endDate}
                        </span>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold">الكورسات المختارة:</span>
                            <span className="text-sm text-muted-foreground">{profile.subscription.selectedCourses}/{profile.subscription.totalCourses}</span>
                        </div>
                        <Progress value={(profile.subscription.selectedCourses / profile.subscription.totalCourses) * 100} />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="font-semibold">النقاط المكتسبة:</span>
                        <span className="font-bold text-amber-500 flex items-center gap-1">
                             <Award className="w-4 h-4" />
                            {profile.points}
                        </span>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                        <Link href="/student/subscription">إدارة الاشتراك</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    </div>
  );
}
