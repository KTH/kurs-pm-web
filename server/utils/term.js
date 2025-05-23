// eslint-disable-next-line import/prefer-default-export
const JULY = 6
const SPRING = 1
const FALL = 2

function getCurrentTermAndTermId(overrideDate) {
  const currentDate = overrideDate || new Date()
  const currentYear = currentDate.getFullYear()

  const currentMonth = currentDate.getMonth()
  const currentSemester = currentMonth < JULY ? SPRING : FALL
  return { currentYear, currentSemester }
}

function getCurrentTerm(overrideDate) {
  const { currentYear, currentSemester } = getCurrentTermAndTermId(overrideDate)

  return `${currentYear * 10 + currentSemester}`
}

function getLastYearsLadokPeriod() {
  const { currentYear, currentSemester } = getCurrentTermAndTermId()
  const lastYear = currentYear - 1

  return `${currentSemester === '2' ? 'HT' : 'VT'}${lastYear}`
}

function convertTermToLadokPeriod(term) {
  const year = term.slice(0, 4)
  const semester = term.slice(4, 5)
  return `${semester === '2' ? 'HT' : 'VT'}${year}`
}

module.exports = {
  getCurrentTerm,
  getLastYearsLadokPeriod,
  convertTermToLadokPeriod,
}
