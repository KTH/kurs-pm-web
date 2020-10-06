import i18n from '../../../../i18n'

export const seasonStr = (translate, semesterCode = '') =>
  `${translate.season[semesterCode.toString()[4]]}${semesterCode.toString().slice(0, 4)}`

export const aboutCourseStr = (translate, courseCode = '') => `${translate.aboutCourse} ${courseCode}`

export const concatMemoName = (semester, ladokRoundIds, langAbbr = 'sv') => {
  const langIndex = langAbbr === 'en' ? 0 : 1
  const { memoLabel } = i18n.messages[langIndex].messages
  return `${memoLabel} ${seasonStr(i18n.messages[langIndex].extraInfo, semester)}-${ladokRoundIds.join('-')}`
}

export const memoNameWithCourseCode = (courseCode, semester, ladokRoundIds, langAbbr = 'sv') => {
  const langIndex = langAbbr === 'en' ? 0 : 1
  const { memoLabel } = i18n.messages[langIndex].messages
  return `${memoLabel} ${courseCode} ${seasonStr(i18n.messages[langIndex].extraInfo, semester)}-${ladokRoundIds.join(
    '-'
  )}`
}
