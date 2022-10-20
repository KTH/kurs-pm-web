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
export const roundShortNameWithStartdate = (round, langAbbr = 'sv') => {
  const langIndex = langAbbr === 'en' ? 0 : 1
  const { startdate } = i18n.messages[langIndex].aboutMemoLabels
  const roundShortNameArray = round.shortName.split(' ')
  const roundShortName = roundShortNameArray[0]
  const roundStartDate = round.firstTuitionDate

  if ('memoName' in round) {
    const regEx = /\s*\(.*?\)\s*/g
    const shortMemoNames = round.memoName.replace(regEx, '').replace(/ m.fl./g, '')

    if (round.ladokRoundIds.length > 1) {
      return `${shortMemoNames} (${startdate} ${roundStartDate})`
    }
  }

  if (round.shortName !== '') {
    return `${roundShortName} (${startdate} ${roundStartDate})`
  }
  return `${seasonStr(
    i18n.messages[langIndex].extraInfo,
    round.term || round.semester
  )}(${startdate} ${roundStartDate})`
}

export const memoNameWithoutCourseCode = (semester, ladokRoundIds, langAbbr = 'sv') => {
  const langIndex = langAbbr === 'en' ? 0 : 1
  const { memoLabel, prepositionFor } = i18n.messages[langIndex].messages
  return `${memoLabel} ${prepositionFor} ${seasonStr(
    i18n.messages[langIndex].extraInfo,
    semester
  )}-${ladokRoundIds.join('-')}`
}
