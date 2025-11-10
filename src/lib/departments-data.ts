// src/lib/departments-data.ts

type LocalizedText = {
  ar: string
  en: string
}

export type Material = {
  code: string
  name: LocalizedText
  link?: string
}

export type Semester = {
  id: string
  name: LocalizedText
  materials: Material[]
}

export type Level = {
  id: string
  name: LocalizedText
  semesters: Semester[]
}

export type Specialization = {
  id: string
  name: LocalizedText
  levels: Level[]
}

export type Department = {
  id: string
  name: LocalizedText
  specializations: Specialization[]
}

/**
 * فصلين (١ و٢) – نستخدمه في التخصصات العادية
 */
const makeTwoSemesters = (
  prefixCode: string,
  names: { ar: string; en: string }[]
): Semester[] => [
  {
    id: "1",
    name: { ar: "الفصل الأول", en: "Semester 1" },
    materials: names.slice(0, 5).map((n, idx) => ({
      code: `${prefixCode}10${idx + 1}`,
      name: n,
    })),
  },
  {
    id: "2",
    name: { ar: "الفصل الثاني", en: "Semester 2" },
    materials: names.slice(5, 10).map((n, idx) => ({
      code: `${prefixCode}20${idx + 1}`,
      name: n,
    })),
  },
]

/**
 * فصل واحد فقط – نستخدمه في السنة التأسيسية
 */
const makeOneSemester = (
  prefixCode: string,
  names: { ar: string; en: string }[]
): Semester[] => [
  {
    id: "1",
    name: { ar: "الفصل الأول", en: "Semester 1" },
    materials: names.map((n, idx) => ({
      code: `${prefixCode}10${idx + 1}`,
      name: n,
    })),
  },
]

/**
 * ثلاثة مستويات (دبلوم / دبلوم عالي / بكالوريوس)
 * للتخصصات العادية
 */
const makeThreeLevels = (
  prefixRoot: string,
  names: { ar: string; en: string }[]
): Level[] => [
  {
    id: "diploma",
    name: { ar: "دبلوم", en: "Diploma" },
    semesters: makeTwoSemesters(`${prefixRoot}D`, names),
  },
  {
    id: "higher-diploma",
    name: { ar: "دبلوم عالي", en: "Higher Diploma" },
    semesters: makeTwoSemesters(`${prefixRoot}H`, names),
  },
  {
    id: "bachelor",
    name: { ar: "بكالوريوس", en: "Bachelor" },
    semesters: makeTwoSemesters(`${prefixRoot}B`, names),
  },
]

/**
 * مستويين فقط (سرتفكيت 1 و سرتفكيت 2) بفصل واحد
 * نستخدمه في السنة الأولى لجميع الأقسام (ما عدا التأسيسية)
 */
const makeCertificateLevels = (
  prefixRoot: string,
  names: { ar: string; en: string }[]
): Level[] => [
  {
    id: "cert1",
    name: { ar: "سرتفكيت 1", en: "Certificate 1" },
    semesters: makeOneSemester(`${prefixRoot}C1`, names),
  },
  {
    id: "cert2",
    name: { ar: "سرتفكيت 2", en: "Certificate 2" },
    semesters: makeOneSemester(`${prefixRoot}C2`, names),
  },
]

// ========================================================
//                     الأقسام
// ========================================================

export const departments: Department[] = [
  // 🔹 السنة التأسيسية (تبقى كما هي)
  {
    id: "foundation",
    name: { ar: "السنة التأسيسية", en: "Foundation Year" },
    specializations: [
      // English – 3 مستويات وكل واحد فصل واحد
      {
        id: "english",
        name: { ar: "اللغة الإنجليزية", en: "English" },
        levels: [
          {
            id: "level1",
            name: { ar: "Level 1", en: "Level 1" },
            semesters: makeOneSemester("EN1", [
              { ar: "قراءة 1", en: "Reading 1" },
              { ar: "استماع 1", en: "Listening 1" },
              { ar: "كتابة 1", en: "Writing 1" },
              { ar: "مفردات 1", en: "Vocabulary 1" },
              { ar: "قواعد 1", en: "Grammar 1" },
            ]),
          },
          {
            id: "level2",
            name: { ar: "Level 2", en: "Level 2" },
            semesters: makeOneSemester("EN2", [
              { ar: "قراءة 2", en: "Reading 2" },
              { ar: "استماع 2", en: "Listening 2" },
              { ar: "كتابة 2", en: "Writing 2" },
              { ar: "مفردات 2", en: "Vocabulary 2" },
              { ar: "قواعد 2", en: "Grammar 2" },
            ]),
          },
          {
            id: "level3",
            name: { ar: "Level 3", en: "Level 3" },
            semesters: makeOneSemester("EN3", [
              { ar: "قراءة 3", en: "Reading 3" },
              { ar: "استماع 3", en: "Listening 3" },
              { ar: "كتابة 3", en: "Writing 3" },
              { ar: "مفردات 3", en: "Vocabulary 3" },
              { ar: "قواعد 3", en: "Grammar 3" },
            ]),
          },
        ],
      },

      // Math – Basic & Pure (فصل واحد)
      {
        id: "math",
        name: { ar: "الرياضيات", en: "Math" },
        levels: [
          {
            id: "basic",
            name: { ar: "Basic", en: "Basic" },
            semesters: makeOneSemester("MFB", [
              { ar: "الجبر الأساسي", en: "Basic Algebra" },
              { ar: "أساسيات الهندسة", en: "Basic Geometry" },
              { ar: "النسب والتناسب", en: "Ratios & Proportions" },
              { ar: "الكسور", en: "Fractions" },
              { ar: "الاحتمالات الأساسية", en: "Basic Probability" },
            ]),
          },
          {
            id: "pure",
            name: { ar: "Pure", en: "Pure" },
            semesters: makeOneSemester("MFP", [
              { ar: "الجبر المتقدم", en: "Advanced Algebra" },
              { ar: "حساب المثلثات", en: "Trigonometry" },
              { ar: "التفاضل", en: "Differentiation" },
              { ar: "التكامل", en: "Integration" },
              { ar: "متتاليات و متسلسلات", en: "Sequences & Series" },
            ]),
          },
        ],
      },

      // IT – مستوى واحد IT (فصل واحد)
      {
        id: "it-foundation",
        name: { ar: "تقنية المعلومات", en: "IT" },
        levels: [
          {
            id: "it",
            name: { ar: "IT", en: "IT" },
            semesters: makeOneSemester("FIT", [
              { ar: "مقدمة في الحاسب", en: "Intro to Computers" },
              { ar: "تطبيقات مكتبية", en: "Office Applications" },
              { ar: "أساسيات الإنترنت", en: "Internet Basics" },
              { ar: "مفاهيم البرمجة", en: "Programming Concepts" },
              { ar: "أساسيات قواعد البيانات", en: "Database Basics" },
            ]),
          },
        ],
      },
    ],
  },

  // 🔹 قسم تقنية المعلومات
  {
    id: "it",
    name: { ar: "قسم تقنية المعلومات", en: "Information Technology" },
    specializations: [
      // السنة الأولى – مستويين سرتفكيت 1 و 2 (فصل واحد لكل مستوى)
      {
        id: "it-first-year",
        name: { ar: "السنة الأولى", en: "First Year" },
        levels: makeCertificateLevels("IFY", [
          { ar: "مهارات الحاسب", en: "Computer Skills" },
          { ar: "أساسيات البرمجة", en: "Programming Basics" },
          { ar: "مقدمة في قواعد البيانات", en: "Intro to Databases" },
          { ar: "مهارات التعلم", en: "Study Skills" },
          { ar: "مهارات التواصل", en: "Communication Skills" },
        ]),
      },

      // أمن / حوسبة / شبكات
      {
        id: "it-security-networks",
        name: { ar: "أمن / حوسبة / شبكات", en: "Security & Networks" },
        levels: makeThreeLevels("ITSEC", [
          { ar: "مقدمة في الأمن السيبراني", en: "Intro to Cybersecurity" },
          { ar: "أساسيات الشبكات", en: "Networking Basics" },
          { ar: "أنظمة التشغيل", en: "Operating Systems" },
          { ar: "أساسيات الحوسبة", en: "Computing Fundamentals" },
          { ar: "مفاهيم التشفير", en: "Cryptography Concepts" },

          { ar: "أمن الشبكات", en: "Network Security" },
          { ar: "إدارة الخوادم", en: "Server Administration" },
          { ar: "مراقبة الأنظمة", en: "Systems Monitoring" },
          { ar: "استجابة للحوادث", en: "Incident Response" },
          { ar: "مشروع الأمن والشبكات", en: "Security & Networks Project" },
        ]),
      },

      // هندسة برمجيات
      {
        id: "it-software",
        name: { ar: "هندسة برمجيات", en: "Software Engineering" },
        levels: makeThreeLevels("ITSE", [
          { ar: "مقدمة في البرمجة", en: "Intro to Programming" },
          { ar: "هياكل البيانات", en: "Data Structures" },
          { ar: "قواعد البيانات", en: "Databases" },
          { ar: "أساسيات هندسة البرمجيات", en: "Software Eng. Basics" },
          { ar: "تحليل نظم", en: "Systems Analysis" },

          { ar: "تصميم البرمجيات", en: "Software Design" },
          { ar: "اختبار البرمجيات", en: "Software Testing" },
          { ar: "إدارة مشاريع برمجية", en: "Software Project Mgmt" },
          { ar: "برمجة ويب متقدمة", en: "Advanced Web Dev" },
          { ar: "مشروع تخرج برمجي", en: "Software Capstone" },
        ]),
      },
    ],
  },

  // 🔹 قسم الهندسة
  {
    id: "engineering",
    name: { ar: "قسم الهندسة", en: "Engineering" },
    specializations: [
      // السنة الأولى هندسة – سرتفكيت 1 و 2
      {
        id: "eng-first-year",
        name: { ar: "السنة الأولى", en: "First Year" },
        levels: makeCertificateLevels("ENGFY", [
          { ar: "رياضيات هندسية", en: "Engineering Math" },
          { ar: "فيزياء هندسية", en: "Engineering Physics" },
          { ar: "رسم هندسي", en: "Engineering Drawing" },
          { ar: "كيمياء هندسية", en: "Engineering Chemistry" },
          { ar: "مهارات الحاسوب", en: "Computer Skills" },
        ]),
      },

      // هندسة مدنية
      {
        id: "civil",
        name: { ar: "هندسة مدنية", en: "Civil Engineering" },
        levels: makeThreeLevels("CIV", [
          { ar: "مقدمة في الهندسة المدنية", en: "Intro to Civil Eng." },
          { ar: "مواد إنشائية", en: "Construction Materials" },
          { ar: "ميكانيكا التربة", en: "Soil Mechanics" },
          { ar: "رسم مدني", en: "Civil Drawing" },
          { ar: "مساحة", en: "Surveying" },

          { ar: "تحليل إنشائي 1", en: "Structural Analysis I" },
          { ar: "هندسة طرق", en: "Highway Engineering" },
          { ar: "هندسة مياه", en: "Water Engineering" },
          { ar: "سلامة موقع", en: "Site Safety" },
          { ar: "مشروع تخرج مدني", en: "Civil Capstone" },
        ]),
      },

      // هندسة كهربائية
      {
        id: "electrical",
        name: { ar: "هندسة كهربائية", en: "Electrical Engineering" },
        levels: makeThreeLevels("ELEC", [
          { ar: "دوائر كهربائية 1", en: "Circuits I" },
          { ar: "إلكترونيات 1", en: "Electronics I" },
          { ar: "قياسات كهربائية", en: "Measurements" },
          { ar: "آلات كهربائية", en: "Electric Machines" },
          { ar: "فيزياء كهربائية", en: "Electrical Physics" },

          { ar: "دوائر كهربائية 2", en: "Circuits II" },
          { ar: "إلكترونيات قدرة", en: "Power Electronics" },
          { ar: "منظومات طاقة", en: "Power Systems" },
          { ar: "تحكم آلي", en: "Control Systems" },
          { ar: "مشروع تخرج كهربائي", en: "Electrical Capstone" },
        ]),
      },

      // هندسة ميكانيكية
      {
        id: "mechanical",
        name: { ar: "هندسة ميكانيكية", en: "Mechanical Engineering" },
        levels: makeThreeLevels("MECH", [
          { ar: "مقدمة في الهندسة الميكانيكية", en: "Intro to Mechanical Eng." },
          { ar: "ميكانيكا 1", en: "Mechanics I" },
          { ar: "ديناميكا", en: "Dynamics" },
          { ar: "علم المواد", en: "Materials Science" },
          { ar: "رسم ميكانيكي", en: "Mechanical Drawing" },

          { ar: "ميكانيكا الموائع", en: "Fluid Mechanics" },
          { ar: "انتقال حرارة", en: "Heat Transfer" },
          { ar: "تصميم عناصر الماكينات", en: "Machine Design" },
          { ar: "هندسة التبريد والتكييف", en: "HVAC" },
          { ar: "مشروع تخرج ميكانيكي", en: "Mechanical Capstone" },
        ]),
      },
    ],
  },

  // 🔹 قسم الأعمال
  {
    id: "business",
    name: { ar: "قسم الأعمال", en: "Business" },
    specializations: [
      // السنة الأولى أعمال – سرتفكيت 1 و 2
      {
        id: "business-first-year",
        name: { ar: "السنة الأولى", en: "First Year" },
        levels: makeCertificateLevels("BUSFY", [
          { ar: "مبادئ إدارة الأعمال", en: "Principles of Management" },
          { ar: "مبادئ المحاسبة", en: "Accounting Principles" },
          { ar: "مبادئ الاقتصاد", en: "Economics Basics" },
          { ar: "سلوك تنظيمي", en: "Organizational Behavior" },
          { ar: "مهارات الاتصال", en: "Communication Skills" },
        ]),
      },

      // موارد بشرية
      {
        id: "hr",
        name: { ar: "موارد بشرية", en: "Human Resources" },
        levels: makeThreeLevels("HRM", [
          { ar: "مبادئ إدارة الموارد البشرية", en: "Intro to HRM" },
          { ar: "التوظيف والاختيار", en: "Recruitment & Selection" },
          { ar: "تدريب وتطوير", en: "Training & Development" },
          { ar: "إدارة الأداء", en: "Performance Management" },
          { ar: "علاقات العمل", en: "Employee Relations" },

          { ar: "تعويضات ومزايا", en: "Compensation & Benefits" },
          { ar: "إدارة المواهب", en: "Talent Management" },
          { ar: "إدارة التغيير", en: "Change Management" },
          { ar: "أخلاقيات العمل", en: "Business Ethics" },
          { ar: "مشروع موارد بشرية", en: "HRM Project" },
        ]),
      },

      // 🔁 بدل تسويق: محاسبة Accounting
      {
        id: "accounting",
        name: { ar: "محاسبة", en: "Accounting" },
        levels: makeThreeLevels("ACC", [
          { ar: "مبادئ المحاسبة المالية", en: "Intro to Financial Accounting" },
          { ar: "محاسبة التكاليف 1", en: "Cost Accounting I" },
          { ar: "محاسبة شركات", en: "Corporate Accounting" },
          { ar: "نظم معلومات محاسبية", en: "Accounting Information Systems" },
          { ar: "رياضيات للأعمال", en: "Business Math" },

          { ar: "محاسبة التكاليف 2", en: "Cost Accounting II" },
          { ar: "محاسبة إدارية", en: "Managerial Accounting" },
          { ar: "تحليل القوائم المالية", en: "Financial Statement Analysis" },
          { ar: "تدقيق ومراجعة", en: "Auditing" },
          { ar: "مشروع تخرج محاسبة", en: "Accounting Capstone" },
        ]),
      },
    ],
  },
]
