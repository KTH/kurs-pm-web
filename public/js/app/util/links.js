const courseLinks = {
  beforeAndDuringACourse: 'https://www.kth.se/student/kurs/infor-och-under-en-kurs',
  contactPersonsAndStudentCounselling: 'https://www.kth.se/student/studievagledning-kontakt',
  rightsAndResponsibilities: {
    en: 'https://www.kth.se/en/student/studentliv/studentratt',
    sv: 'https://www.kth.se/student/studentliv/studentratt'
  }
}

const breadcrumbLinks = {
  university: { en: 'https://www.kth.se/en', sv: 'https://www.kth.se/' },
  student: { en: 'https://www.kth.se/en/student', sv: 'https://www.kth.se/student' },
  directory: {
    en: 'https://www.kth.se/student/kurser/kurser-inom-program?l=en',
    sv: 'https://www.kth.se/student/kurser/kurser-inom-program'
  }
}

const sideMenuBackLink = {
  en: 'https://www.kth.se/student/kurser/kurser-inom-program?l=en',
  sv: 'https://www.kth.se/student/kurser/kurser-inom-program'
}

function aboutCourseLink(courseCode, language) {
  const languageParameter = language === 'en' ? '?l=en' : ''
  return `https://www.kth.se/student/kurser/kurs/${courseCode}${languageParameter}`
}

function adminLink(courseCode, language) {
  return `/kursinfoadmin/kurser/kurs/${courseCode}?l=${language}`
}

function linkToSchool(name) {
  return name ? `https://www.kth.se/${name.toLowerCase().split('/')[0]}` : 'https://www.kth.se/'
}

module.exports = {
  courseLinks,
  breadcrumbLinks,
  sideMenuBackLink,
  aboutCourseLink,
  adminLink,
  linkToSchool
}
