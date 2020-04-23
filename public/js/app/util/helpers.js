const seasonStr = (translate, semesterCode = '') =>
  `${translate.season[semesterCode.toString()[4]]}${semesterCode.toString().slice(0, 4)}`

module.exports = {
  seasonStr
}
