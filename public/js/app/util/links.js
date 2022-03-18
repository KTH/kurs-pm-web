function basicBreadcrumbs(langAbbr) {
  const links = {
    university: { en: '/en', sv: '/' },
    student: { en: '/en/student', sv: '/student' },
    directory: {
      en: '/student/kurser/kurser-inom-program?l=en',
      sv: '/student/kurser/kurser-inom-program',
    },
  }

  const labels = {
    en: {
      university: 'KTH',
      student: 'Student at KTH',
      directory: 'Course and programme directory',
      aboutCourse: '', // must be initiated empty
    },
    sv: {
      university: 'KTH',
      student: 'Student på KTH',
      directory: 'Kurs- och programkatalogen',
      aboutCourse: '', // must be initiated empty
    },
  }
  const orderedTypes = ['university', 'student', 'directory']
  return orderedTypes.map(type => ({ url: links[type][langAbbr], label: labels[langAbbr][type] }))
}

function abooutCourseBreadcrumb(courseCode, langAbbr) {
  const url = `/student/kurser/kurs/${courseCode}?l=${langAbbr}`
  const label = `${langAbbr === 'sv' ? 'Om kursen' : 'About course'} ${courseCode}`
  return { url, label }
}

function courseLinks(language) {
  const languagePath = language === 'en' ? 'en/' : ''
  return {
    beforeAndDuringACourse: `https://www.kth.se/${languagePath}student/kurs/infor-och-under-en-kurs`,
    contactPersonsAndStudentCounselling: `https://www.kth.se/${languagePath}student/studievagledning-kontakt`,
    rightsAndResponsibilities: `https://www.kth.se/${languagePath}student/studentliv/studentratt`,
  }
}

const sideMenuBackLink = {
  en: '/student/kurser/kurser-inom-program?l=en',
  sv: '/student/kurser/kurser-inom-program',
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
  return name ? `/${name.toLowerCase().split('/')[0]}` : '/'
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
  abooutCourseBreadcrumb,
  basicBreadcrumbs,
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
  linkToSyllabus,
}
