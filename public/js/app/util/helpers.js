import i18n from '../../../../i18n'

const seasonStr = (translate, semesterCode = '') =>
  `${translate.season[semesterCode.toString()[4]]}${semesterCode.toString().slice(0, 4)}`

const aboutCourseStr = (translate, courseCode = '') => `${translate.aboutCourse} ${courseCode}`

const concatMemoName = (semester, ladokRoundIds, langAbbr = 'sv') => {
  const langIndex = langAbbr === 'en' ? 0 : 1
  const { memoLabel } = i18n.messages[langIndex].messages
  return `${memoLabel} ${seasonStr(i18n.messages[langIndex].extraInfo, semester)}-${ladokRoundIds.join('-')}`
}

module.exports = {
  seasonStr,
  aboutCourseStr,
  concatMemoName
}
