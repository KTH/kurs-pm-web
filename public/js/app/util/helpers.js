const seasonStr = (translate, semesterCode = '') =>
  `${translate.season[semesterCode.toString()[4]]}${semesterCode.toString().slice(0, 4)}`

const aboutCourseStr = (translate, courseCode = '') => `${translate.aboutCourse} ${courseCode}`

module.exports = {
  seasonStr,
  aboutCourseStr
}
