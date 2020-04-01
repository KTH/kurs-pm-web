const courseLinks = {
  beforeAndDuringACourse: 'https://www.kth.se/student/kurs/infor-och-under-en-kurs',
  contactPersonsAndStudentCounselling: 'https://www.kth.se/student/studievagledning-kontakt',
  manageMyStudies: 'https://www.student.ladok.se/student/#/aktuell'
}

const breadcrumbLinks = {
  university: { en: 'https://www.kth.se/en', sv: 'https://www.kth.se/' },
  student: { en: 'https://www.kth.se/en/student', sv: 'https://www.kth.se/student' },
  directory: {
    en: 'https://www.kth.se/student/kurser/kurser-inom-program?l=en',
    sv: 'https://www.kth.se/student/kurser/kurser-inom-program'
  }
}

function aboutCourseLink(courseCode, language) {
  const languageParameter = language === 'en' ? '?l=en' : ''
  return `https://www.kth.se/student/kurser/kurs/${courseCode}${languageParameter}`
}

function adminLink(courseCode, language) {
  return `/kursinfoadmin/kurser/kurs/${courseCode}?l=${language}`
}

module.exports = {
  courseLinks,
  breadcrumbLinks,
  aboutCourseLink,
  adminLink
}
