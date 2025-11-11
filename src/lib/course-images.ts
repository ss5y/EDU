// src/lib/course-images.ts
type AnyCourse = {
  code: string
  specialization?: string
  image?: { imageUrl?: string | null }
}

export function getCourseImageSrc(course: AnyCourse): string {
  // لو في صورة مخصّصة في الداتا نستخدمها أولاً
  if (course.image?.imageUrl) {
    return course.image.imageUrl
  }

  const code = (course.code || '').toUpperCase()

  // حسب كود الكورس
  if (code.startsWith('BUS')) return '/images/courses/business.jpg'        // إدارة الأعمال
  if (code.startsWith('DS'))  return '/images/courses/data-science.jpg'    // علم البيانات
  if (code.startsWith('EE'))  return '/images/courses/electrical.jpg'      // هندسة كهربائية
  if (code.startsWith('ART')) return '/images/courses/graphic-design.jpg'  // تصميم جرافيكي
  if (code.startsWith('CS'))  return '/images/courses/web-dev.jpg'         // تطوير ويب

  // fallback لو ما طابق أي شيء
  return '/images/courses/web-dev.jpg'
}
