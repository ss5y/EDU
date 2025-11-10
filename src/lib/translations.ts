export type Language = "en" | "ar";

export type Translation = {
  // General
  appName: string;
  startNow: string;
  login: string;
  logout: string;
  signup: string;
  createNewAccount: string;
  omr: string;
  open: string;
  chapter: string;
  noContentYet: string;
  paidContent: string;
  enrollToAccess: string;
  enrollToUnlock: string;
  viewProfile: string;
  teacherNotFound: string;
  courseNotFound: string;
  courseNotFoundDesc: string;
  error: string;
  somethingWentWrong: string;
  learningProgress: string;
  lesson: string;
  thanksForRating: string;
  teacherDashboardIntro: string;
  viewAllCourses: string;
  enrolledStudents: string;
  specializationLabel: string;
  selectSpecialization: string;

  // Header
  home: string;
  plans: string;
  howItWorks: string;
  courses: string;
  loginSignup: string;
  myAccount: string;
  studentProfile: string;
  teacherProfile: string;

  // Footer
  importantLinks: string;
  privacyPolicy: string;
  contactUs: string;
  followUs: string;
  newsletter: string;
  newsletterPrompt: string;
  copyright: string;

  // Home Page
  heroTitle: string;
  heroSubtitle: string;
  howItWorksTitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  featuresTitle: string;
  featuresSubtitle: string;
  featureTrial: string;
  featureTrialDesc: string;
  featureAssessments: string;
  featureAssessmentsDesc: string;
  featureTheme: string;
  featureThemeDesc: string;
  featureMultiLanguage: string;
  featureMultiLanguageDesc: string;
  featurePoints: string;
  featurePointsDesc: string;
  featureDashboards: string;
  featureDashboardsDesc: string;
  plansTitle: string;
  planBasic: string;
  planPro: string;
  planPremium: string;
  planPriceSuffix: string;
  planFeature5Courses: string;
  planFeatureEmailSupport: string;
  planFeatureUnlimitedCourses: string;
  planFeaturePrioritySupport: string;
  planFeatureCertificates: string;
  planFeatureAllPro: string;
  planFeatureAIAssistant: string;
  planFeatureSessions: string;
  subscribeNow: string;
  ctaTitle: string;

  // Auth Pages
  loginDescription: string;
  loginAsStudent: string;
  loginAsTeacher: string;
  email: string;
  password: string;
  selectBranch: string;
  noAccount: string;
  signupDescription: string;
  iAmA: string;
  student: string;
  teacher: string;
  fullName: string;
  confirmPassword: string;
  alreadyHaveAccount: string;

  // Student Dashboard
  welcomeBack: string;
  welcomeStudent: string;
  academicSummary: string;
  pointsEarned: string;
  activeCourses: string;
  completedCourses: string;
  activeAndTrialCourses: string;
  noCoursesInCategory: string;
  discoverMoreCourses: string;
  myCourses: string;
  status: string;
  statusActive: string;
  statusTrial: string;
  statusCompleted: string;
  continueCourse: string;
  rateCourse: string;
  myProfile: string;
  enrolledCourses: string;
  editAccount: string;
  browseCourses: string;

  // Teacher Dashboard
  welcome: string;
  yourActivityOverview: string;
  totalStudents: string;
  averageRating: string;
  publishedCourses: string;
  latestCourses: string;
  viewAll: string;
  rating: string;
  edit: string;
  delete: string;
  coursesBy: string;
  contactTeacher: string;
  contact: string;
  contactTeacherDesc: string;
  aboutTeacher: string;
  qualifications: string;
  qualificationsDesc: string;
  experience: string;
  experienceDesc: string;
  studentReviews: string;

  // Course Pages
  discoverCourses: string;
  searchByNameOrCode: string;
  searchByTeacherName: string;
  filterByPopularity: string;
  all: string;
  mostPopular: string;
  filterByNewness: string;
  newest: string;
  filterBySpecialization: string;
  allSpecializations: string;
  noResults: string;
  freeTrial: string;
  free: string;
  registerNow: string;
  courseDetails: string;
  price: string;
  enrollNow: string;
  courseContent: string;
  lessons: string;
  quizzes: string;
  activities: string;
  additionalMaterials: string;
  watchVideo: string;
  startQuiz: string;
  submitAssignment: string;
  yourProgress: string;
  completed: string;
  backToMyCourses: string;
  askTheTeacher: string;
  askTheTeacherPlaceholder: string;
  sendMessage: string;
  rateTheCourse: string;
  submitRating: string;

  // Teacher Course Management
  addCourse: string;
  fillDetailsToPublish: string;
  courseName: string;
  courseCode: string;
  shortDescription: string;
  fullDetails: string;
  priceUSD: string;
  enableFreeTrial: string;
  coverMedia: string;
  publishCourse: string;
  myCourses_teacher: string;
  addCourse_teacher: string;
  latestReviews: string;
  noReviewsYet: string;
  confirmDelete: string;
  confirmDeleteDesc: string;
  cancel: string;
  continue: string;

  // Profile Editing
  editProfile: string;
  saveChanges: string;
  uploadNewPhoto: string;
  academicYear: string;
  specialization: string;
  bio: string;
  selectAcademicYear: string;
  selectYourBranch: string;

  // Toasts
  registeredSuccess: string;
  registeredCourse: string;
  ratingSuccess: string;
  ratingThanks: string;
  coursePublished: string;
  courseDeleted: string;
  messageSent: string;
  messageSentDesc: string;

  // Sidebar
  dashboard: string;
  myCourses_sidebar: string;
  browseCourses_sidebar: string;
  browseTeachers_sidebar: string;
  editProfile_sidebar: string;
  addCourse_sidebar: string;
  reports_sidebar: string;
  subscription_sidebar: string;
};

const en: Translation = {
  appName: "EDU Smart",
  startNow: "Start Now",
  login: "Login",
  logout: "Logout",
  signup: "Sign Up",
  createNewAccount: "Create new account",
  omr: "OMR",
  open: "Open",
  chapter: "Chapter",
  noContentYet: "No content available in this chapter yet.",
  paidContent: "Paid Content",
  enrollToAccess: "Enroll in this course to access all paid content.",
  enrollToUnlock: "Enroll to Unlock",
  viewProfile: "View Profile",
  teacherNotFound: "Teacher not found.",
  error: "Error",
  somethingWentWrong: "Something went wrong, please try again.",
  courseNotFound: "Course not found",
  courseNotFoundDesc: "It might have been deleted or its link changed.",
  learningProgress: "Learning progress",
  lesson: "Lesson",
  thanksForRating: "Thanks for your rating!",
  teacherDashboardIntro:
    "Here you can manage your courses, track your students, and review your performance as a teacher.",
  viewAllCourses: "View all courses",
  enrolledStudents: "Enrolled students",
  specializationLabel: "Specialization",
  selectSpecialization: "Select specialization",

  // Header
  home: "Home",
  plans: "Plans",
  howItWorks: "How It Works",
  courses: "Courses",
  loginSignup: "Login / Sign Up",
  myAccount: "My Account",
  studentProfile: "Student Profile",
  teacherProfile: "Teacher Profile",

  // Footer
  importantLinks: "Important Links",
  privacyPolicy: "Privacy Policy",
  contactUs: "Contact Us",
  followUs: "Follow Us",
  newsletter: "Newsletter",
  newsletterPrompt: "Subscribe for latest updates and offers.",
  copyright: `© ${new Date().getFullYear()} EDU Smart. All rights reserved.`,

  // Home Page
  heroTitle: "EDU Smart – Your Smart Learning Platform for University Students",
  heroSubtitle: "Learn from the best instructors with a 7-day free trial.",
  howItWorksTitle: "How It Works",
  step1Title: "1. Sign Up",
  step1Desc: "Create your account as a student or teacher in simple steps.",
  step2Title: "2. Choose a Course",
  step2Desc: "Browse the course library and choose what interests you.",
  step3Title: "3. Start Learning",
  step3Desc:
    "Begin your educational journey or add your own courses as a teacher.",
  featuresTitle: "Features that Change Your Learning Experience",
  featuresSubtitle:
    "Discover how our platform makes your academic journey easier and more effective.",
  featureTrial: "Free Trial",
  featureTrialDesc: "Explore our platform with a 7-day free trial for all courses.",
  featureAssessments: "Smart Assessments",
  featureAssessmentsDesc:
    "Get instant feedback and personalized recommendations to improve your learning path.",
  featureTheme: "Dark/Light Mode",
  featureThemeDesc: "Choose the theme that suits you for a comfortable reading experience.",
  featureMultiLanguage: "Multi-language Support",
  featureMultiLanguageDesc: "Easily switch between Arabic and English.",
  featurePoints: "Points and Rewards",
  featurePointsDesc:
    "Earn points upon completing courses and redeem them for exclusive rewards.",
  featureDashboards: "Custom Pages",
  featureDashboardsDesc:
    "Specialized dashboards for students and teachers for a unique experience.",
  plansTitle: "Choose the Plan That Suits You",
  planBasic: "Basic",
  planPro: "Professional",
  planPremium: "Premium",
  planPriceSuffix: "OMR/month",
  planFeature5Courses: "Access to 5 courses per month",
  planFeatureEmailSupport: "Email support",
  planFeatureUnlimitedCourses: "Unlimited access to courses",
  planFeaturePrioritySupport: "Priority support",
  planFeatureCertificates: "Completion certificates",
  planFeatureAllPro: "All features of Professional",
  planFeatureAIAssistant: "Personal AI assistant",
  planFeatureSessions: "Monthly sessions with teachers",
  subscribeNow: "Subscribe Now",
  ctaTitle: "Start Your Learning Journey Now!",

  // Auth Pages
  loginDescription: "Choose your role to access your dashboard.",
  loginAsStudent: "Login as Student",
  loginAsTeacher: "Login as Teacher",
  email: "Email Address",
  password: "Password",
  selectBranch: "Select University Branch",
  noAccount: "Don't have an account?",
  signupDescription: "Choose your role and fill in the details to join.",
  iAmA: "I am a:",
  student: "Student",
  teacher: "Teacher",
  fullName: "Full Name",
  confirmPassword: "Confirm Password",
  alreadyHaveAccount: "Already have an account?",

  // Student Dashboard
  welcomeBack: "Welcome back,",
  welcomeStudent: "Welcome Student",
  academicSummary: "This is a summary of your academic activity.",
  pointsEarned: "Points Earned",
  activeCourses: "Active Courses",
  completedCourses: "Completed Courses",
  activeAndTrialCourses: "Active and Trial Courses",
  noCoursesInCategory: "No courses in this category currently.",
  discoverMoreCourses: "Discover More Courses",
  myCourses: "My Courses",
  status: "Status",
  statusActive: "Active",
  statusTrial: "Trial",
  statusCompleted: "Completed",
  continueCourse: "Continue Course",
  rateCourse: "Rate Course",
  myProfile: "My Profile",
  enrolledCourses: "Enrolled Courses",
  editAccount: "Edit Account",
  browseCourses: "Browse Courses",

  // Teacher Dashboard
  welcome: "Welcome,",
  yourActivityOverview: "Here is an overview of your teaching activity.",
  totalStudents: "Total Students",
  averageRating: "Average Rating",
  publishedCourses: "Published Courses",
  latestCourses: "Latest Courses",
  viewAll: "View All",
  rating: "Rating",
  edit: "Edit",
  delete: "Delete",
  coursesBy: "Courses by",
  contactTeacher: "Contact Teacher",
  contact: "Contact",
  contactTeacherDesc:
    "To contact the teacher, please enroll in one of their courses and use the messaging feature on the course page.",
  aboutTeacher: "About Teacher",
  qualifications: "Qualifications",
  qualificationsDesc: "PhD in Computer Science from Sultan Qaboos University.",
  experience: "Experience",
  experienceDesc: "10+ years of experience in teaching and software development.",
  studentReviews: "Student Reviews",

  // Course Pages
  discoverCourses: "Discover Courses",
  searchByNameOrCode: "Search by name or code...",
  searchByTeacherName: "Search by teacher name or specialization...",
  filterByPopularity: "By Popularity",
  all: "All",
  mostPopular: "Most Popular",
  filterByNewness: "By Newness",
  newest: "Newest",
  filterBySpecialization: "By Specialization",
  allSpecializations: "All Specializations",
  noResults: "No results match your search.",
  freeTrial: "Free Trial",
  free: "Free",
  registerNow: "Register Now",
  courseDetails: "About the Course",
  price: "Price",
  enrollNow: "Enroll Now",
  courseContent: "Course Content",
  lessons: "Lessons",
  quizzes: "Quizzes",
  activities: "Activities",
  additionalMaterials: "Additional Materials",
  watchVideo: "Watch Video",
  startQuiz: "Start Quiz",
  submitAssignment: "Submit Assignment",
  yourProgress: "Your Progress",
  completed: "Completed",
  backToMyCourses: "Back to My Courses",
  askTheTeacher: "Ask the Teacher",
  askTheTeacherPlaceholder: "Type your question here...",
  sendMessage: "Send Message",
  rateTheCourse: "Rate this course",
  submitRating: "Submit Rating",

  // Teacher Course Management
  addCourse: "Add New Course",
  fillDetailsToPublish: "Fill in the following details to publish your course.",
  courseName: "Course Name",
  courseCode: "Course Code",
  shortDescription: "Short Description",
  fullDetails: "Full Details",
  priceUSD: "Price (OMR)",
  enableFreeTrial: "Enable Free Trial (7 days)",
  coverMedia: "Cover Image or Video",
  publishCourse: "Publish Course",
  myCourses_teacher: "My Courses",
  addCourse_teacher: "Add New Course",
  latestReviews: "Latest Reviews:",
  noReviewsYet: "No reviews yet.",
  confirmDelete: "Are you absolutely sure?",
  confirmDeleteDesc:
    "This action cannot be undone. This will permanently delete the course and all its data.",
  cancel: "Cancel",
  continue: "Continue",

  // Profile Editing
  editProfile: "Edit Profile",
  saveChanges: "Save Changes",
  uploadNewPhoto: "Upload new photo",
  academicYear: "Academic Year",
  specialization: "Specialization",
  bio: "Bio",
  selectAcademicYear: "Select your academic year",
  selectYourBranch: "Select your branch",

  // Toasts
  registeredSuccess: "Registered Successfully!",
  registeredCourse: "You have been enrolled in",
  ratingSuccess: "Rated Successfully!",
  ratingThanks: "Thank you for rating the course",
  coursePublished: "Course Published!",
  courseDeleted: "Deleted Successfully",
  messageSent: "Message Sent!",
  messageSentDesc: "Your question has been sent to the teacher.",

  // Sidebar
  dashboard: "Dashboard",
  myCourses_sidebar: "My Courses",
  browseCourses_sidebar: "Browse Courses",
  browseTeachers_sidebar: "Browse Teachers",
  editProfile_sidebar: "Edit Profile",
  addCourse_sidebar: "Add Course",
  reports_sidebar: "Performance Reports",
  subscription_sidebar: "Subscription",
};

const ar: Translation = {
  appName: "EDU Smart",
  startNow: "ابدأ الآن",
  login: "تسجيل الدخول",
  logout: "تسجيل خروج",
  signup: "إنشاء حساب",
  createNewAccount: "إنشاء حساب جديد",
  omr: "ر.ع.",
  open: "افتح",
  chapter: "شابتر",
  noContentYet: "لا يوجد محتوى في هذا الشابتر بعد.",
  paidContent: "محتوى مدفوع",
  enrollToAccess: "سجل في هذا الكورس للوصول إلى جميع المحتويات المدفوعة.",
  enrollToUnlock: "سجل لفتح المحتوى",
  viewProfile: "عرض الملف الشخصي",
  teacherNotFound: "المعلم غير موجود.",
  error: "خطأ",
  somethingWentWrong: "حدث خطأ ما، حاول مرة أخرى.",
  courseNotFound: "لم يتم العثور على هذا الكورس",
  courseNotFoundDesc: "ربما تم حذفه أو تغيير رابطه.",
  learningProgress: "مدى التقدم",
  lesson: "درس",
  thanksForRating: "شكرًا لتقييمك!",
  teacherDashboardIntro:
    "هنا يمكنك إدارة مقرراتك، متابعة طلابك، ومراجعة أدائك كمعلم.",
  viewAllCourses: "عرض كل المقررات",
  enrolledStudents: "عدد الطلاب المسجلين",
  specializationLabel: "التخصص",
  selectSpecialization: "اختر التخصص",

  // Header
  home: "الرئيسية",
  plans: "الباقات",
  howItWorks: "كيف تعمل",
  courses: "الكورسات",
  loginSignup: "تسجيل / دخول",
  myAccount: "حسابي",
  studentProfile: "ملفي الشخصي (طالب)",
  teacherProfile: "ملفي الشخصي (معلم)",

  // Footer
  importantLinks: "روابط مهمة",
  privacyPolicy: "سياسة الخصوصية",
  contactUs: "تواصل معنا",
  followUs: "تابعنا",
  newsletter: "النشرة الإخبارية",
  newsletterPrompt: "اشترك للحصول على آخر التحديثات والعروض.",
  copyright: `© ${new Date().getFullYear()} EDU Smart. جميع الحقوق محفوظة.`,

  // Home Page
  heroTitle: "EDU Smart – منصتك التعليمية الذكية لطلاب الجامعات",
  heroSubtitle: "تعلم من أفضل المعلمين مع تجربة مجانية 7 أيام.",
  howItWorksTitle: "كيف تعمل المنصة",
  step1Title: "1. تسجيل الدخول",
  step1Desc: "أنشئ حسابك كطالب أو معلم في خطوات بسيطة.",
  step2Title: "2. اختيار الكورس",
  step2Desc: "تصفح مكتبة الكورسات واختر ما يناسب اهتماماتك.",
  step3Title: "3. ابدأ التعلم",
  step3Desc: "ابدأ رحلتك التعليمية أو قم بإضافة كورساتك الخاصة كمعلم.",
  featuresTitle: "مميزات تغير تجربتك التعليمية",
  featuresSubtitle:
    "اكتشف كيف تجعل منصتنا رحلتك الأكاديمية أكثر سهولة وفعالية.",
  featureTrial: "تجربة مجانية",
  featureTrialDesc: "استكشف منصتنا مع تجربة مجانية لمدة 7 أيام لجميع الكورسات.",
  featureAssessments: "تقييمات ذكية",
  featureAssessmentsDesc:
    "احصل على تقييمات فورية وتوصيات مخصصة لتحسين مسارك التعليمي.",
  featureTheme: "الوضع الغامق/الفاتح",
  featureThemeDesc: "اختر المظهر الذي يناسبك لتجربة قراءة مريحة.",
  featureMultiLanguage: "دعم متعدد اللغات",
  featureMultiLanguageDesc: "تنقل بسهولة بين اللغتين العربية والإنجليزية.",
  featurePoints: "نقاط ومكافآت",
  featurePointsDesc:
    "اكتسب نقاطًا عند إكمال الدورات واستبدلها بمكافآت حصرية.",
  featureDashboards: "صفحات مخصصة",
  featureDashboardsDesc:
    "لوحات تحكم خاصة بالطلاب والمعلمين لتجربة فريدة.",
  plansTitle: "اختر الباقة التي تناسبك",
  planBasic: "الأساسية",
  planPro: "الاحترافية",
  planPremium: "المميزة",
  planPriceSuffix: "ريال/شهر",
  planFeature5Courses: "وصول لـ 5 كورسات شهريًا",
  planFeatureEmailSupport: "دعم عبر البريد الإلكتروني",
  planFeatureUnlimitedCourses: "وصول غير محدود للكورسات",
  planFeaturePrioritySupport: "دعم ذو أولوية",
  planFeatureCertificates: "شهادات إتمام",
  planFeatureAllPro: "كل مزايا الاحترافية",
  planFeatureAIAssistant: "مساعد AI شخصي",
  planFeatureSessions: "جلسات شهرية مع المعلمين",
  subscribeNow: "اشترك الآن",
  ctaTitle: "ابدأ رحلتك التعليمية الآن!",

  // Auth Pages
  loginDescription: "اختر دورك للوصول إلى لوحة التحكم الخاصة بك.",
  loginAsStudent: "تسجيل كطالب",
  loginAsTeacher: "تسجيل كمعلم",
  email: "البريد الإلكتروني",
  password: "كلمة المرور",
  selectBranch: "اختر فرع الجامعة",
  noAccount: "ليس لديك حساب؟",
  signupDescription: "اختر دورك واملأ التفاصيل للانضمام.",
  iAmA: "أنا:",
  student: "طالب",
  teacher: "معلم",
  fullName: "الاسم الكامل",
  confirmPassword: "تأكيد كلمة المرور",
  alreadyHaveAccount: "لديك حساب بالفعل؟",

  // Student Dashboard
  welcomeBack: "مرحبًا بعودتك،",
  welcomeStudent: "مرحباً بالطالب",
  academicSummary: "هذا هو ملخص نشاطك الأكاديمي.",
  pointsEarned: "النقاط المكتسبة",
  activeCourses: "الكورسات النشطة",
  completedCourses: "الكورسات المكتملة",
  activeAndTrialCourses: "كورسات نشطة وتحت التجربة",
  noCoursesInCategory: "لا توجد كورسات في هذه الفئة حاليًا.",
  discoverMoreCourses: "اكتشف المزيد من الكورسات",
  myCourses: "كورساتي",
  status: "الحالة",
  statusActive: "نشط",
  statusTrial: "تحت التجربة",
  statusCompleted: "مكتمل",
  continueCourse: "متابعة الكورس",
  rateCourse: "تقييم الكورس",
  myProfile: "ملفي الشخصي",
  enrolledCourses: "الكورسات المسجلة",
  editAccount: "تعديل الحساب",
  browseCourses: "تصفح الكورسات",

  // Teacher Dashboard
  welcome: "مرحبًا بك،",
  yourActivityOverview: "إليك نظرة عامة على نشاطك التعليمي.",
  totalStudents: "إجمالي الطلاب",
  averageRating: "متوسط التقييم",
  publishedCourses: "الكورسات المنشورة",
  latestCourses: "أحدث الكورسات",
  viewAll: "عرض الكل",
  rating: "تقييم",
  edit: "تعديل",
  delete: "حذف",
  coursesBy: "كورسات من قبل",
  contactTeacher: "تواصل مع المعلم",
  contact: "تواصل",
  contactTeacherDesc:
    "للتواصل مع المعلم، يرجى التسجيل في أحد كورساته واستخدام ميزة المراسلة في صفحة الكورس.",
  aboutTeacher: "عن المعلم",
  qualifications: "المؤهلات العلمية",
  qualificationsDesc: "دكتوراة في علوم الحاسب من جامعة السلطان قابوس.",
  experience: "الخبرة العملية",
  experienceDesc: "خبرة أكثر من 10 سنوات في التدريس وتطوير البرمجيات.",
  studentReviews: "آراء الطلاب",

  // Course Pages
  discoverCourses: "اكتشف الكورسات",
  searchByNameOrCode: "البحث بالاسم أو الكود...",
  searchByTeacherName: "البحث باسم المعلم أو التخصص...",
  filterByPopularity: "حسب الشهرة",
  all: "الكل",
  mostPopular: "الأكثر شيوعًا",
  filterByNewness: "حسب الحداثة",
  newest: "الجديد",
  filterBySpecialization: "حسب التخصص",
  allSpecializations: "كل التخصصات",
  noResults: "لا توجد نتائج تطابق بحثك.",
  freeTrial: "تجربة مجانية",
  free: "مجاني",
  registerNow: "سجل الآن",
  courseDetails: "عن الكورس",
  price: "السعر",
  enrollNow: "سجل الآن",
  courseContent: "محتوى الكورس",
  lessons: "الدروس",
  quizzes: "الاختبارات",
  activities: "الأنشطة",
  additionalMaterials: "مواد إضافية",
  watchVideo: "شاهد الفيديو",
  startQuiz: "ابدأ الاختبار",
  submitAssignment: "تسليم الواجب",
  yourProgress: "تقدمك",
  completed: "مكتمل",
  backToMyCourses: "العودة إلى كورساتي",
  askTheTeacher: "اسأل المعلم",
  askTheTeacherPlaceholder: "اكتب سؤالك هنا...",
  sendMessage: "إرسال الرسالة",
  rateTheCourse: "قيّم هذا الكورس",
  submitRating: "إرسال التقييم",

  // Teacher Course Management
  addCourse: "إضافة كورس جديد",
  fillDetailsToPublish: "املأ التفاصيل التالية لنشر الكورس الخاص بك.",
  courseName: "اسم الكورس",
  courseCode: "كود الكورس",
  shortDescription: "وصف مختصر",
  fullDetails: "تفاصيل شاملة",
  priceUSD: "السعر (ريال عماني)",
  enableFreeTrial: "تفعيل التجربة المجانية (7 أيام)",
  coverMedia: "صورة أو فيديو تعريفي",
  publishCourse: "نشر الكورس",
  myCourses_teacher: "كورساتي",
  addCourse_teacher: "إضافة كورس جديد",
  latestReviews: "أحدث التقييمات:",
  noReviewsYet: "لا توجد تقييمات بعد.",
  confirmDelete: "هل أنت متأكد تمامًا؟",
  confirmDeleteDesc:
    "هذا الإجراء لا يمكن التراجع عنه. سيؤدي هذا إلى حذف الكورس وجميع بياناته بشكل دائم.",
  cancel: "إلغاء",
  continue: "متابعة",

  // Profile Editing
  editProfile: "تعديل الملف الشخصي",
  saveChanges: "حفظ التغييرات",
  uploadNewPhoto: "تحميل صورة جديدة",
  academicYear: "السنة الدراسية",
  specialization: "التخصص",
  bio: "نبذة تعريفية",
  selectAcademicYear: "اختر سنتك الدراسية",
  selectYourBranch: "اختر فرعك",

  // Toasts
  registeredSuccess: "تم التسجيل بنجاح!",
  registeredCourse: "لقد تم تسجيلك في كورس",
  ratingSuccess: "تم التقييم بنجاح!",
  ratingThanks: "شكرًا لتقييمك كورس",
  coursePublished: "تم نشر الكورس!",
  courseDeleted: "تم الحذف بنجاح",
  messageSent: "تم إرسال الرسالة!",
  messageSentDesc: "لقد تم إرسال سؤالك إلى المعلم.",

  // Sidebar
  dashboard: "لوحة التحكم",
  myCourses_sidebar: "كورساتي",
  browseCourses_sidebar: "تصفح الكورسات",
  browseTeachers_sidebar: "تصفح المعلمين",
  editProfile_sidebar: "تعديل الملف الشخصي",
  addCourse_sidebar: "إضافة كورس جديد",
  reports_sidebar: "تقارير الأداء",
  subscription_sidebar: "الاشتراك",
};

export const translations: Record<Language, Translation> = {
  en,
  ar,
};
