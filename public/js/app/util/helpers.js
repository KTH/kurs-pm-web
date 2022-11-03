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
    const regEx2 = /[-]\d/
    const pattern = /[a-zA-Z]\w*\s\d{4}[-]\d{1}/

    let shortMemoNames = ''

    if ('shortName' in round && round.shortName !== '') {
      shortMemoNames = round.shortName
    } else {
      const memoNames = round.memoName.replace(regEx, '').replace(/ m.fl./g, '')

      if (pattern.test(memoNames.split(', ')[0])) {
        shortMemoNames = `${seasonStr(i18n.messages[langIndex].extraInfo, round.term || round.semester)}`
      } else {
        shortMemoNames = memoNames
      }
    }

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
  )} (${startdate} ${roundStartDate})`
}

export const doubleSortOnAnArrayOfObjects = (arr, par1, par2) => {
  let sortedArray = [...arr].sort((a, b) => {
    if (Number(a[par1]) == Number(b[par1])) {
      if (a[par2] === b[par2]) return 0
      return a[par2] < b[par2] ? -1 : 1
    } else {
      return Number(a[par1]) < Number(b[par1]) ? -1 : 1
    }
  })
  return sortedArray
}

export const memoNameWithoutCourseCode = (semester, ladokRoundIds, langAbbr = 'sv') => {
  const langIndex = langAbbr === 'en' ? 0 : 1
  const { memoLabel, prepositionFor } = i18n.messages[langIndex].messages
  return `${memoLabel} ${prepositionFor} ${seasonStr(
    i18n.messages[langIndex].extraInfo,
    semester
  )}-${ladokRoundIds.join('-')}`
}
