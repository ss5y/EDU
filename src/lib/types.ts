import type { ImagePlaceholder } from './placeholder-images';

// ==========================================================
//                       التقييمات
// ==========================================================
export type Review = {
  rating: number;
  comment: string;
  courseTitle?: string;
};

// ==========================================================
//                       محتوى الكورس
// ==========================================================

export type CourseContentItem = {
  id?: number;
  title: string;
  type?: string;       // video | article | quiz | pdf
  duration?: string;   // 12:30 أو 10 أسئلة
  url?: string;
  isPaid?: boolean;
};

export type PdfSummary = {
  title: string;
  url: string;
  size?: string;
};

export type CourseChapter = {
  id?: number;
  title: string;
  description?: string;
  type?: string; // "chapter"
  lessons: CourseContentItem[];
  quizzes?: CourseContentItem[];
  assignments?: CourseContentItem[];
  additionalMaterials?: CourseContentItem[];
  pdfSummaries?: PdfSummary[]; // ✅ أضفناها لدعم ملخصات PDF
};

export type CourseContent = {
  chapters: CourseChapter[];
};

// ==========================================================
//                       الكورسات
// ==========================================================
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
  content: CourseContent;
  department?: string; // ✅ أضفنا هذا السطر
};

// ==========================================================
//                   الكورسات المسجلة للطالب
// ==========================================================
export type EnrolledCourse = Course & {
  status: 'active' | 'trial' | 'completed';
  progress: number;
};

// ==========================================================
//                        المعلم
// ==========================================================
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

// ==========================================================
//                        الطالب
// ==========================================================
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
