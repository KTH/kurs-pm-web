import i18n from '../../../../i18n'

export const seasonStr = (translate, semesterCode = '') =>
  semesterCode ? `${translate.season[semesterCode.toString()[4]]}${semesterCode.toString().slice(0, 4)}` : undefined

export const aboutCourseStr = (translate, courseCode = '') => `${translate.aboutCourse} ${courseCode}`

export const getDateFormat = (date, language) => {
  const pattern = /\d{2}[/]\d{2}[/]\d{4}/
  if (language === 1 || language === 'Svenska' || language === 'Swedish' || language === 'sv') {
    return date
  }

  if (pattern.test(date)) {
    const parts = date.split('/')
    var parsedDate = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10))
  } else {
    const timestamp = Date.parse(date)
    var parsedDate = new Date(timestamp)
  }
  const options = { day: 'numeric', month: 'short', year: 'numeric' }
  return parsedDate.toLocaleDateString('en-GB', options)
}

export const concatMemoName = (semester, applicationCodes = [], langAbbr = 'sv') => {
  const langIndex = langAbbr === 'en' ? 0 : 1
  const { memoLabel } = i18n.messages[langIndex].messages
  if (applicationCodes.length === 0) {
    return `${memoLabel} ${seasonStr(i18n.messages[langIndex].extraInfo, semester)}-${''}`
  }
  return `${memoLabel} ${seasonStr(i18n.messages[langIndex].extraInfo, semester)}-${
    applicationCodes.length > 1 ? `${applicationCodes[0]}...` : applicationCodes[0]
  }`
}

export const concatMemoNameShort = (semester, applicationCodes = [], langAbbr = 'sv') => {
  const langIndex = langAbbr === 'en' ? 0 : 1
  return `${seasonStr(i18n.messages[langIndex].extraInfo, semester)}-${applicationCodes.map(code => code).join('-')}`
}

export const memoNameWithoutApplicationCode = (semester, langAbbr = 'sv') => {
  const langIndex = langAbbr === 'en' ? 0 : 1
  const { memoLabel } = i18n.messages[langIndex].messages
  return `${memoLabel} ${seasonStr(i18n.messages[langIndex].extraInfo, semester)}`
}

export const memoNameWithCourseCode = (courseCode, semester, applicationCodes = [], langAbbr = 'sv') => {
  const langIndex = langAbbr === 'en' ? 0 : 1
  const { memoLabel } = i18n.messages[langIndex].messages

  return `${memoLabel} ${courseCode} ${seasonStr(i18n.messages[langIndex].extraInfo, semester)}-${
    applicationCodes.length > 1 ? `${applicationCodes[0]}...` : applicationCodes[0]
  }`
}
export const removeDuplicates = elements => {
  return elements.filter((term, index) => elements.indexOf(term) === index)
}
export const roundShortNameWithStartdate = (round, langAbbr = 'sv') => {
  const langIndex = langAbbr === 'en' ? 0 : 1
  const { startdate } = i18n.messages[langIndex].aboutMemoLabels
  const roundStartDate = getDateFormat(round.firstTuitionDate, langIndex)
  const pattern = /[a-zA-Z]\w*\s\d{4}[-]\d{1}/
  const { memoName: memoNames } = round

  if ('memoName' in round) return `${memoNames} (${startdate} ${roundStartDate})`

  if ('shortName' in round && round.shortName !== '') {
    let shortMemoNames = ''
    if (pattern.test(round.shortName)) {
      shortMemoNames = `${seasonStr(i18n.messages[langIndex].extraInfo, round.term || round.semester)}`
    } else {
      shortMemoNames = round.shortName.replace(/ m.fl./g, '')
    }
    return `${shortMemoNames} (${startdate} ${roundStartDate})`
  }
  return `${seasonStr(
    i18n.messages[langIndex].extraInfo,
    round.term || round.semester
  )} (${startdate} ${roundStartDate})`
}

export const doubleSortOnAnArrayOfObjects = (arr, par1, par2, langIndex) => {
  const arrWithSortedMemoNames = [...arr].map(round => {
    const regEx = /\s*\(.*?\)\s*/g
    const pattern = /[a-zA-Z]\w*\s\d{4}[-]\d{1}/
    if ('memoName' in round) {
      const memoNames = round.memoName.replace(regEx, '').replace(/ m.fl./g, '')
      const memoNamesArray = memoNames.split(', ').map(item => {
        if (pattern.test(item)) {
          return `${seasonStr(i18n.messages[langIndex].extraInfo, round.term || round.semester)}`
        }
        return item
      })

      const uniqueMemoNamesArray = removeDuplicates(memoNamesArray)
      const sortedMemoNamesArray = uniqueMemoNamesArray.sort()

      return {
        ...round,
        memoName: sortedMemoNamesArray.join(', '),
        shortName: sortedMemoNamesArray[0],
      }
    }

    return round
  })

  let sortedArray = arrWithSortedMemoNames.sort((a, b) => {
    if (Number(a[par1]) == Number(b[par1])) {
      if (a[par2] === b[par2]) return 0
      return a[par2] < b[par2] ? -1 : 1
    } else {
      return Number(a[par1]) < Number(b[par1]) ? -1 : 1
    }
  })

  return sortedArray
}

const memoNameWithoutCourseCode = (semester, applicationCodes = [], langIndex) => {
  const { memoLabel, prepositionFor } = i18n.messages[langIndex].messages

  let constructedMemoName = `${memoLabel} ${prepositionFor} ${seasonStr(i18n.messages[langIndex].extraInfo, semester)}`

  constructedMemoName += createApplicationCodeSuffix(applicationCodes)
  return constructedMemoName
}

const createApplicationCodeSuffix = applicationCodes => {
  let applicationCodeSuffix = ''
  if (applicationCodes.length > 0) {
    applicationCodeSuffix += `-${applicationCodes.join('-')}`
  }
  return applicationCodeSuffix
}

const memoNameWithoutApplicationCodes = (courseCode, langIndex) => {
  const { memoLabel, prepositionFor } = i18n.messages[langIndex].messages
  return `${memoLabel} ${prepositionFor} ${courseCode}`
}

export const createMemoName = (semester, applicationCodes = [], langAbbr = 'sv', courseCode) => {
  const langIndex = getLangIndex(langAbbr)

  if (!applicationCodes.length) {
    return memoNameWithoutApplicationCodes(courseCode, langIndex)
  }

  return memoNameWithoutCourseCode(semester, applicationCodes, langIndex)
}

export const getLangIndex = langAbbr => {
  return langAbbr === 'en' ? 0 : 1
}
