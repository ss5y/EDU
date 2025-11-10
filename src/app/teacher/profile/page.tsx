
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
import { allTeachers, branches, specializations } from '@/lib/placeholder-data';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Teacher } from '@/lib/types';


const getTeacherById = (id: number): Teacher | undefined => {
    return allTeachers.find(teacher => teacher.id === id);
}


export default function TeacherProfilePage() {
    const { t } = useLanguage();
    const { toast } = useToast();
    const ownProfileId = 1; 

    const initialProfile = getTeacherById(ownProfileId);
    
    const [profile, setProfile] = useState(initialProfile);
    
    if (!profile) {
        return <div className="text-center py-10">{t.teacherNotFound}</div>
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile(prev => prev ? ({...prev, [name]: value}) : undefined);
    }

    const handleSelectChange = (name: string) => (value: string) => {
         setProfile(prev => prev ? ({...prev, [name]: value}) : undefined);
    }

    const handleSaveChanges = () => {
        toast({
            title: "Profile Updated",
            description: "Your profile has been saved successfully.",
        })
    }

  return (
    <div className="container mx-auto py-6">
        <div className="flex items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold font-headline">{t.editProfile}</h1>
        </div>
        
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl">{t.editProfile}</CardTitle>
                <CardDescription>{t.editProfile_sidebar}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                    <Avatar className="w-24 h-24">
                        <AvatarFallback className="text-4xl"><UserCircle/></AvatarFallback>
                    </Avatar>
                    <div className='flex-1'>
                        <Label htmlFor="picture">{t.uploadNewPhoto}</Label>
                        <Input id="picture" type="file" />
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
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="bio">{t.bio}</Label>
                    <Textarea id="bio" name="bio" placeholder="A brief bio about your expertise and teaching philosophy" value={profile.bio} onChange={handleInputChange} rows={4} />
                </div>
            </CardContent>
             <CardFooter className="border-t pt-6">
                <Button onClick={handleSaveChanges}>{t.saveChanges}</Button>
            </CardFooter>
        </Card>
    </div>
  );
}

    