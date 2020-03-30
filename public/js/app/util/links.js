const courseLinks = {
  beforeAndDuringACourse: 'https://www.kth.se/student/kurs/infor-och-under-en-kurs',
  contactPersonsAndStudentCounselling: 'https://www.kth.se/student/studievagledning-kontakt',
  manageMyStudies: 'https://www.student.ladok.se/student/#/aktuell'
}

function adminLink(courseCode, language) {
  return `/kursinfoadmin/kurser/kurs/${courseCode}?l=${language}`
}

module.exports = {
  courseLinks,
  adminLink
}
