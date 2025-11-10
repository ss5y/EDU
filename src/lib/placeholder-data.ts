
import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';
import { Course, Teacher, Student } from './types';

export const placeholderImages: ImagePlaceholder[] = PlaceHolderImages;

export const branches = [
  'مسقط',
  'صلالة',
  'نزوى',
  'صحار',
  'عبري',
  'صور',
  'شناص',
  'المصنعة',
  'إبراء',
  'الرستاق',
  'بدية'
];

export const specializations = [
    'تكنولوجيا المعلومات',
    'إدارة الأعمال',
    'الهندسة',
    'الفنون والتصميم',
    'الآداب والعلوم الإنسانية',
    'العلوم التطبيقية'
];

export const academicYears = [
    'السنة الأولى',
    'السنة الثانية',
    'السنة الثالثة',
    'السنة الرابعة',
    'دراسات عليا'
];


// محتوى مشترك لكل الكورسات (نفس شكل مقدمة في تطوير الويب)
const sharedCourseContent = {
  chapters: [
    {
      title: "الوحدة 1: أساسيات HTML و CSS",
      description:
        "نتعرف في هذه الوحدة على بنية صفحات الويب وكيفية تنسيقها باستخدام HTML و CSS.",
      type: "chapter",
      lessons: [
        {
          title: "فيديو: ما هو HTML؟",
          type: "video",
          duration: "12:30",
        },
        {
          title: "فيديو: أساسيات CSS",
          type: "video",
          duration: "14:10",
        },
        {
          title: "اختبار قصير على HTML و CSS",
          type: "quiz",
          duration: "10 أسئلة",
        },
      ],
      pdfSummaries: [
        {
          title: "ملخص الوحدة الأولى (HTML & CSS)",
          url: "/pdfs/cs101-ch1-summary.pdf",
          size: "1.2 MB",
        },
      ],
    },
    {
      title: "الوحدة 2: تخطيط الصفحات و Flexbox",
      description:
        "تتعلم في هذه الوحدة كيفية بناء صفحات متجاوبة باستخدام Flexbox وتخطيط العناصر.",
      type: "chapter",
      lessons: [
        {
          title: "فيديو: مقدمة عن Flexbox",
          type: "video",
          duration: "11:05",
        },
        {
          title: "مقال: أفضل الممارسات في تصميم الواجهات",
          type: "article",
          duration: "5 دقائق قراءة",
        },
        {
          title: "اختبار على تخطيط الصفحات",
          type: "quiz",
          duration: "8 أسئلة",
        },
      ],
      pdfSummaries: [
        {
          title: "ملخص الوحدة الثانية (Flexbox)",
          url: "/pdfs/cs101-ch2-summary.pdf",
          size: "980 KB",
        },
      ],
    },
  ],
};

// محتوى عام بنفس الهيكل (شباتر + دروس + PDF) لكل كورس،
// لكن سنكتب محتوى مختلف داخل كل كورس أدناه.
export const courses = [
  {
    id: 1,
    teacherId: 1,
    code: "CS101",
    title: "مقدمة في تطوير الويب",
    description:
      "تتعلم في هذا الكورس أساسيات HTML و CSS وبناء واجهات أمامية تفاعلية مناسبة للمبتدئين.",
    teacher: "د. أحمد المحروقي",
    rating: 4.5,
    price: null,
    isFreeTrial: true,
    image: {
  id: "cs101-image",
  imageUrl: "/images/courses/web-dev.jpg",
  imageHint: "غلاف لكورس مقدمة في تطوير الويب",
  description: "صورة تمثيلية لكورس مقدمة في تطوير الويب",
},




    emoji: "💻",
    specialization: "تكنولوجيا المعلومات",
    popularity: "most_popular",
    newness: "new",
    enrolledStudents: 152,
    reviews: [
      { rating: 5, comment: "دورة ممتازة وواضحة جدًا للمبتدئين." },
      { rating: 4, comment: "شرح جميل مع أمثلة عملية." },
    ],
    content: {
      chapters: [
        {
          title: "الوحدة 1: أساسيات HTML و CSS",
          description:
            "نتعرف في هذه الوحدة على بنية صفحات الويب وكيفية تنسيقها باستخدام HTML و CSS.",
          type: "chapter",
          lessons: [
            {
              title: "فيديو: ما هو HTML؟",
              type: "video",
              duration: "12:30",
            },
            {
              title: "فيديو: أساسيات CSS",
              type: "video",
              duration: "14:10",
            },
            {
              title: "اختبار قصير على HTML و CSS",
              type: "quiz",
              duration: "10 أسئلة",
            },
          ],
          pdfSummaries: [
            {
              title: "ملخص الوحدة الأولى (HTML & CSS)",
              url: "/pdfs/cs101-ch1-summary.pdf",
              size: "1.2 MB",
            },
          ],
        },
        {
          title: "الوحدة 2: تخطيط الصفحات و Flexbox",
          description:
            "تتعلم في هذه الوحدة كيفية بناء صفحات متجاوبة باستخدام Flexbox وتخطيط العناصر.",
          type: "chapter",
          lessons: [
            {
              title: "فيديو: مقدمة عن Flexbox",
              type: "video",
              duration: "11:05",
            },
            {
              title: "مقال: أفضل الممارسات في تصميم الواجهات",
              type: "article",
              duration: "5 دقائق قراءة",
            },
            {
              title: "اختبار على تخطيط الصفحات",
              type: "quiz",
              duration: "8 أسئلة",
            },
          ],
          pdfSummaries: [
            {
              title: "ملخص الوحدة الثانية (Flexbox)",
              url: "/pdfs/cs101-ch2-summary.pdf",
              size: "980 KB",
            },
          ],
        },
      ],
    },
  },

  {
    id: 2,
    teacherId: 1,
    code: "DS202",
    title: "أساسيات علم البيانات",
    description:
      "مقدمة عملية لعلم البيانات تشمل Python، تنظيف البيانات، والتحليل الاستكشافي باستخدام المكتبات الشائعة.",
    teacher: "د. أحمد المحروقي",
    rating: 4.8,
    price: 49,
    isFreeTrial: false,
   image: {
  id: "ds202-image",
  imageUrl: "/images/courses/data-science.jpg",
  imageHint: "غلاف لكورس أساسيات علم البيانات",
  description: "صورة تمثيلية لكورس أساسيات علم البيانات",
},





    emoji: "📊",
    specialization: "تكنولوجيا المعلومات",
    popularity: "most_popular",
    newness: "new",
    enrolledStudents: 98,
    reviews: [
      {
        rating: 5,
        comment: "محتوى غني، وتطبيقات عملية على Python و Jupyter Notebook.",
      },
    ],
    content: {
      chapters: [
        {
          title: "الوحدة 1: مقدمة في علم البيانات و Python",
          description:
            "مفهوم علم البيانات، دورة حياة المشروع، وتجهيز بيئة العمل باستخدام Python و Jupyter.",
          type: "chapter",
          lessons: [
            {
              title: "فيديو: ما هو علم البيانات؟",
              type: "video",
              duration: "9:45",
            },
            {
              title: "فيديو: تثبيت Python و Jupyter Notebook",
              type: "video",
              duration: "13:20",
            },
            {
              title: "اختبار: مفاهيم أساسية في علم البيانات",
              type: "quiz",
              duration: "8 أسئلة",
            },
          ],
          pdfSummaries: [
            {
              title: "ملخص الوحدة الأولى (مقدمة علم البيانات)",
              url: "/pdfs/ds202-ch1-summary.pdf",
              size: "1.0 MB",
            },
          ],
        },
        {
          title: "الوحدة 2: استكشاف البيانات وتحليلها",
          description:
            "التعامل مع البيانات باستخدام pandas، والتحليل الاستكشافي، والرسوم البيانية.",
          type: "chapter",
          lessons: [
            {
              title: "فيديو: قراءة البيانات باستخدام pandas",
              type: "video",
              duration: "15:10",
            },
            {
              title: "فيديو: التحليل الاستكشافي للبيانات (EDA)",
              type: "video",
              duration: "14:05",
            },
            {
              title: "اختبار: تحليل بيانات حقيقية",
              type: "quiz",
              duration: "10 أسئلة",
            },
          ],
          pdfSummaries: [
            {
              title: "ملخص الوحدة الثانية (تحليل البيانات)",
              url: "/pdfs/ds202-ch2-summary.pdf",
              size: "1.3 MB",
            },
          ],
        },
      ],
    },
  },

  {
    id: 3,
    teacherId: 2,
    code: "BUS301",
    title: "إدارة الأعمال الحديثة",
    description:
      "نظرة شاملة على مبادئ الإدارة الحديثة، التخطيط الاستراتيجي، والتنظيم والقيادة في بيئة الأعمال الحالية.",
    teacher: "أ. فاطمة الشبيبية",
    rating: 4.2,
    price: 39,
    isFreeTrial: false,
   image: {
  id: "bus301-image",
  imageUrl: "/images/courses/business.jpg",
  imageHint: "غلاف لكورس إدارة الأعمال الحديثة",
  description: "صورة تمثيلية لكورس إدارة الأعمال الحديثة",
},



    emoji: "📈",
    specialization: "إدارة الأعمال",
    popularity: "standard",
    newness: "new",
    enrolledStudents: 110,
    reviews: [
      {
        rating: 4,
        comment: "شرح واضح وأمثلة قريبة من سوق العمل العماني.",
      },
    ],
    content: {
      chapters: [
        {
          title: "الوحدة 1: مبادئ الإدارة الحديثة",
          description:
            "نتعرف على وظائف الإدارة الأساسية: التخطيط، التنظيم، التوجيه، والرقابة.",
          type: "chapter",
          lessons: [
            {
              title: "فيديو: ما هي الإدارة؟",
              type: "video",
              duration: "10:15",
            },
            {
              title: "مقال: تطور الفكر الإداري",
              type: "article",
              duration: "7 دقائق قراءة",
            },
            {
              title: "اختبار: مبادئ الإدارة",
              type: "quiz",
              duration: "10 أسئلة",
            },
          ],
          pdfSummaries: [
            {
              title: "ملخص الوحدة الأولى (مبادئ الإدارة)",
              url: "/pdfs/bus301-ch1-summary.pdf",
              size: "850 KB",
            },
          ],
        },
        {
          title: "الوحدة 2: التخطيط الاستراتيجي",
          description:
            "مفاهيم الرؤية والرسالة والأهداف، وتحليل البيئة الداخلية والخارجية.",
          type: "chapter",
          lessons: [
            {
              title: "فيديو: مدخل إلى التخطيط الاستراتيجي",
              type: "video",
              duration: "12:40",
            },
            {
              title: "فيديو: تحليل SWOT",
              type: "video",
              duration: "11:05",
            },
            {
              title: "اختبار: حالة دراسية في التخطيط",
              type: "quiz",
              duration: "6 أسئلة",
            },
          ],
          pdfSummaries: [
            {
              title: "ملخص الوحدة الثانية (التخطيط الاستراتيجي)",
              url: "/pdfs/bus301-ch2-summary.pdf",
              size: "1.1 MB",
            },
          ],
        },
      ],
    },
  },

  {
    id: 4,
    teacherId: 3,
    code: "EE250",
    title: "مبادئ الهندسة الكهربائية",
    description:
      "التعرف على أساسيات الدوائر الكهربائية، قانون أوم، وطرق تحليل الدوائر البسيطة.",
    teacher: "أ. مريم الحوسنية",
    rating: 4.6,
    price: 59,
    isFreeTrial: false,
    image: {
  id: "ee250-image",
  imageUrl: "/images/courses/electrical.jpg",
  imageHint: "غلاف لكورس مبادئ الهندسة الكهربائية",
  description: "صورة تمثيلية لكورس مبادئ الهندسة الكهربائية",
},




    emoji: "⚡",
    specialization: "الهندسة",
    popularity: "standard",
    newness: "old",
    enrolledStudents: 75,
    reviews: [],
    content: {
      chapters: [
        {
          title: "الوحدة 1: الكميات الكهربائية الأساسية",
          description:
            "التعرّف على الجهد والتيار والمقاومة وقانون أوم والعلاقة بينها.",
          type: "chapter",
          lessons: [
            {
              title: "فيديو: مفهوم الجهد والتيار",
              type: "video",
              duration: "9:20",
            },
            {
              title: "فيديو: قانون أوم والتطبيقات",
              type: "video",
              duration: "13:05",
            },
            {
              title: "اختبار: مسائل بسيطة على قانون أوم",
              type: "quiz",
              duration: "8 أسئلة",
            },
          ],
          pdfSummaries: [
            {
              title: "ملخص الوحدة الأولى (قانون أوم)",
              url: "/pdfs/ee250-ch1-summary.pdf",
              size: "900 KB",
            },
          ],
        },
        {
          title: "الوحدة 2: تحليل الدوائر البسيطة",
          description:
            "تحليل دوائر المقاومات على التوالي والتوازي، وتطبيق قوانين كيرشوف.",
          type: "chapter",
          lessons: [
            {
              title: "فيديو: دوائر التوالي والتوازي",
              type: "video",
              duration: "14:30",
            },
            {
              title: "فيديو: قوانين كيرشوف للتيار والجهد",
              type: "video",
              duration: "12:10",
            },
            {
              title: "اختبار: تحليل الدوائر",
              type: "quiz",
              duration: "10 أسئلة",
            },
          ],
          pdfSummaries: [
            {
              title: "ملخص الوحدة الثانية (تحليل الدوائر)",
              url: "/pdfs/ee250-ch2-summary.pdf",
              size: "1.0 MB",
            },
          ],
        },
      ],
    },
  },

  {
    id: 5,
    teacherId: 4,
    code: "ART110",
    title: "فن التصميم الجرافيكي",
    description:
      "مقدمة في مبادئ التصميم الجرافيكي، نظرية الألوان، والتكوين البصري باستخدام أدوات رقمية.",
    teacher: "د. سليم الوهيبي",
    rating: 4.9,
    price: null,
    isFreeTrial: true,
   image: {
  id: "art110-image",
  imageUrl: "/images/courses/graphic-design.jpg",
  imageHint: "غلاف لكورس فن التصميم الجرافيكي",
  description: "صورة تمثيلية لكورس فن التصميم الجرافيكي",
},



    emoji: "🎨",
    specialization: "الفنون والتصميم",
    popularity: "most_popular",
    newness: "new",
    enrolledStudents: 130,
    reviews: [],
    content: {
      chapters: [
        {
          title: "الوحدة 1: مبادئ التصميم",
          description:
            "نتعرف على عناصر التصميم (الخط، الشكل، اللون) ومبادئ التوازن والتكرار والتركيز.",
          type: "chapter",
          lessons: [
            {
              title: "فيديو: عناصر التصميم الجرافيكي",
              type: "video",
              duration: "11:10",
            },
            {
              title: "مقال: مبادئ التكوين الجيد",
              type: "article",
              duration: "6 دقائق قراءة",
            },
            {
              title: "اختبار: عناصر ومبادئ التصميم",
              type: "quiz",
              duration: "7 أسئلة",
            },
          ],
          pdfSummaries: [
            {
              title: "ملخص الوحدة الأولى (مبادئ التصميم)",
              url: "/pdfs/art110-ch1-summary.pdf",
              size: "780 KB",
            },
          ],
        },
        {
          title: "الوحدة 2: اللون والخط في التصميم",
          description:
            "نظرية الألوان، اختيار لوحات الألوان، واستخدام الخطوط المناسبة للهوية البصرية.",
          type: "chapter",
          lessons: [
            {
              title: "فيديو: نظرية الألوان للمصممين",
              type: "video",
              duration: "12:50",
            },
            {
              title: "فيديو: اختيار الخطوط (Typography)",
              type: "video",
              duration: "10:35",
            },
            {
              title: "اختبار: الألوان والخطوط",
              type: "quiz",
              duration: "8 أسئلة",
            },
          ],
          pdfSummaries: [
            {
              title: "ملخص الوحدة الثانية (الألوان والخطوط)",
              url: "/pdfs/art110-ch2-summary.pdf",
              size: "930 KB",
            },
          ],
        },
      ],
    },
  },
];




export const studentData: Student = {
  name: 'علي بن محمد',
  email: 'ali.mohamed@email.com',
  branch: 'مسقط',
  specialization: 'تكنولوجيا المعلومات',
  academicYear: 'السنة الثالثة',
  bio: 'طالب شغوف بتعلم تقنيات الويب الجديدة وتطوير التطبيقات.',
  points: 1250,
  subscription: {
    planName: 'باقة 3 أشهر',
    endDate: '2025-10-11',
    selectedCourses: 3,
    totalCourses: 5,
  },
  enrolledCourses: [
    { ...courses[0], status: 'active', progress: 75 },
    { ...courses[2], status: 'trial', progress: 20 },
    { ...courses[4], status: 'completed', progress: 100 },
    { ...courses[3], status: 'active', progress: 40 },
    { ...courses[5], status: 'trial', progress: 10 },
  ],
};

const teacher1Courses = courses.filter(c => c.teacherId === 1);
const teacher1TotalStudents = teacher1Courses.reduce((sum, course) => sum + course.enrolledStudents, 0);
const teacher1TotalRatingsCount = teacher1Courses.flatMap(c => c.reviews).length;
const teacher1TotalRatingsSum = teacher1Courses.flatMap(c => c.reviews).reduce((sum, review) => sum + review.rating, 0);


export const teacherData: Teacher = {
  id: 1,
  name: 'د. أحمد المحروقي',
  email: 'ahmed.mahrouqi@email.com',
  branch: 'مسقط',
  specialization: 'تكنولوجيا المعلومات',
  bio: 'أستاذ جامعي متخصص في علوم الحاسب وتطوير الويب، أؤمن بأهمية التعليم التفاعلي والمشاريع العملية.',
  avatar: placeholderImages.find(p => p.id === 'teacher-avatar')?.imageUrl,
  totalCourses: teacher1Courses.length,
  totalStudents: teacher1TotalStudents,
  averageRating: teacher1TotalRatingsCount > 0 ? (teacher1TotalRatingsSum / teacher1TotalRatingsCount) : 0,
  courses: teacher1Courses,
};

const allTeachersData = [
  {
    id: 1,
    name: 'د. أحمد المحروقي',
    email: 'ahmed.mahrouqi@email.com',
    branch: 'مسقط',
    specialization: 'تكنولوجيا المعلومات',
    bio: 'أستاذ جامعي متخصص في علوم الحاسب وتطوير الويب، أؤمن بأهمية التعليم التفاعلي والمشاريع العملية.',
    avatar: 'https://i.ibb.co/CVDp04L/teacher-male.png',
  },
  {
    id: 2,
    name: 'أ. فاطمة الشيذانية',
    email: 'fatima.shidhani@email.com',
    branch: 'صحار',
    specialization: 'إدارة الأعمال',
    bio: 'خبيرة في ريادة الأعمال واستراتيجيات التسويق الحديثة.',
    avatar: 'https://i.ibb.co/3sS5Xw4/teacher-female.png',
  },
  {
    id: 3,
    name: 'د. سالم الوهيبي',
    email: 'salim.wuhaibi@email.com',
    branch: 'نزوى',
    specialization: 'الفنون والتصميم',
    bio: 'مصمم جرافيك عالمي بخبرة تمتد لعقدين في مجال الهوية البصرية.',
    avatar: "https://i.ibb.co/CVDp04L/teacher-male.png",
  },
  {
    id: 4,
    name: 'أ. مريم الحوسنية',
    email: 'maryam.housni@email.com',
    branch: 'صلالة',
    specialization: 'الهندسة',
    bio: 'مهندسة كهربائية متخصصة في أنظمة الطاقة المتجددة.',
    avatar: "https://i.ibb.co/3sS5Xw4/teacher-female.png",
  },
  {
    id: 5,
    name: 'د. يوسف العامري',
    email: 'yousuf.amri@email.com',
    branch: 'مسقط',
    specialization: 'الآداب والعلوم الإنسانية',
    bio: 'باحث وناقد أدبي، متخصص في الأدب العربي المعاصر.',
     avatar: "https://i.ibb.co/CVDp04L/teacher-male.png",
  }
];

export const allTeachers: Teacher[] = allTeachersData.map(teacher => {
    const teacherCourses = courses.filter(c => c.teacherId === teacher.id);
    const totalStudents = teacherCourses.reduce((sum, course) => sum + course.enrolledStudents, 0);
    const allReviews = teacherCourses.flatMap(c => c.reviews);
    const averageRating = allReviews.length > 0
        ? allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length
        : 0;

    return {
        ...teacher,
        totalCourses: teacherCourses.length,
        totalStudents,
        averageRating,
        courses: teacherCourses,
    };
});
