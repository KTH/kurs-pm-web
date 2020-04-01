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

function courseMemoLink(courseCode) {
  return `/kurs-pm/${courseCode}/`
}

function adminLink(courseCode, language) {
  return `/kursinfoadmin/kurser/kurs/${courseCode}?l=${language}`
}

module.exports = {
  courseLinks,
  breadcrumbLinks,
  courseMemoLink,
  adminLink
}
