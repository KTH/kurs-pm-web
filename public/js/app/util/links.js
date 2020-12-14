function courseLinks(language) {
  const languagePath = language === 'en' ? 'en/' : ''
  return {
    beforeAndDuringACourse: `https://www.kth.se/${languagePath}student/kurs/infor-och-under-en-kurs`,
    contactPersonsAndStudentCounselling: `https://www.kth.se/${languagePath}student/studievagledning-kontakt`,
    rightsAndResponsibilities: `https://www.kth.se/${languagePath}student/studentliv/studentratt`
  }
}

const sideMenuBackLink = {
  en: '/student/kurser/kurser-inom-program?l=en',
  sv: '/student/kurser/kurser-inom-program'
}

function aboutCourseLink(courseCode, language) {
  if (!courseCode) return ''
  const languageParameter = language === 'en' ? '?l=en' : ''
  return `/student/kurser/kurs/${courseCode}${languageParameter}`
}

function aboutCourseMemoLink(courseCode) {
  return `/kurs-pm/${courseCode}/om-kurs-pm`
}

function adminLink(courseCode, language) {
  return `/kursinfoadmin/kurser/kurs/${courseCode}?l=${language}`
}

function linkToSchool(name) {
  return name ? `https://www.kth.se/${name.toLowerCase().split('/')[0]}` : 'https://www.kth.se/'
}

function linkToArchive(courseCode, language) {
  const languageParameter = language === 'en' ? '?l=en' : ''
  return `/kursutveckling/${courseCode ? courseCode + '/arkiv' : ''}${languageParameter}`
}

function linkToCourseDevelopment(courseCode, language) {
  const languageParameter = language === 'en' ? '?l=en' : ''
  return `/kursutveckling/${courseCode}${languageParameter}`
}

function linkToPublishedMemo(courseCode, memoEndPoint) {
  return `/kurs-pm/${courseCode}/${memoEndPoint}`
}

function linkToPublishedMemoPdf(memoEndPoint, documentName) {
  return `/kurs-pm/memo/pdf/${memoEndPoint}?documentName=${documentName}&status=published`
}

function linkToSyllabus(courseCode, validFromTerm, language) {
  // const languageParameter = language === 'en' ? '?lang=en' : ''
  // return `https://www.kth.se/student/kurser/kurs/kursplan/${courseCode}-${validFromTerm}.pdf${languageParameter}`
  return `/kurs-pm/syllabus/pdf/${courseCode}/${validFromTerm}/${
    language === 0 ? 'en' : 'sv'
  }?documentName=${courseCode}-${validFromTerm}`
}

module.exports = {
  courseLinks,
  sideMenuBackLink,
  aboutCourseLink,
  aboutCourseMemoLink,
  adminLink,
  linkToSchool,
  linkToArchive,
  linkToCourseDevelopment,
  linkToPublishedMemo,
  linkToPublishedMemoPdf,
  linkToSyllabus
}
