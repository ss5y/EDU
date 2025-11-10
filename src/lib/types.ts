
import type { ImagePlaceholder } from './placeholder-images';

export type Review = {
    rating: number;
    comment: string;
    courseTitle?: string;
};

export type Course = {
    id: number;
    teacherId: number;
    title: string;
    code: string;
    description: string;
    teacher: string;
    rating: number;
    price: number | null;
    isFreeTrial: boolean;
    image?: ImagePlaceholder;
    emoji: string;
    specialization: string;
    popularity: string;
    newness: string;
    enrolledStudents: number;
    reviews: Review[];
    category?: string;
    content: {
        chapters: {
            id: number;
            title: string;
            lessons: { id: number; title: string; isPaid: boolean }[];
            quizzes: { id: number; title: string; isPaid: boolean }[];
            assignments: { id: number; title: string; isPaid: boolean }[];
            additionalMaterials: { id: number; title: string; type: string; url?: string; isPaid: boolean }[];
        }[];
    };
};

export type EnrolledCourse = Course & {
    status: 'active' | 'trial' | 'completed';
    progress: number;
};


export type Teacher = {
  id: number;
  name: string;
  email: string;
  branch: string;
  specialization: string;
  bio: string;
  avatar?: string;
  totalCourses: number;
  totalStudents: number;
  averageRating: number;
  courses: Course[];
  reviews?: Review[];
};

export type Student = {
  name: string;
  email: string;
  branch: string;
  specialization: string;
  academicYear: string;
  bio: string;
  points: number;
  subscription: {
    planName: string;
    endDate: string;
    selectedCourses: number;
    totalCourses: number;
  };
  enrolledCourses: EnrolledCourse[];
};
