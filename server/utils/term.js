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

function getLastYearsTerm(overrideDate) {
  const { currentYear, currentSemester } = getCurrentTermAndTermId(overrideDate)
  const lastYear = currentYear - 1

  return `${lastYear}${currentSemester}`
}

module.exports = {
  getCurrentTerm,
  getLastYearsTerm,
}
