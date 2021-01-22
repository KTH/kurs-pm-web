import React from 'react'
import { Alert } from 'reactstrap'

import i18n from '../../../../i18n'
import { aboutCourseLink } from '../util/links'
import { memoNameWithCourseCode } from '../util/helpers'

const header = (courseCode, semester, roundIds, aboutMemoLabels, language) => (
  <h2 className="t4">
    {`
      ${memoNameWithCourseCode(courseCode, semester, roundIds, language)} ${aboutMemoLabels.notPublished}
    `}
  </h2>
)

const beforeChoosingCourseLink = (courseCode, aboutMemoLabels, language) => (
  <a href={aboutCourseLink(courseCode, language)}>{aboutMemoLabels.syllabusLink}</a>
)

const courseInformation = (aboutMemoLabels, courseCode, language) => (
  <p>
    {`${aboutMemoLabels.courseInfo} ${courseCode} ${aboutMemoLabels.onPage} `}
    {beforeChoosingCourseLink(courseCode, aboutMemoLabels, language)}
    {'.'}
  </p>
)

const AboutAlert = ({ courseCode, semester, roundIds, language }) => {
  const languageIndex = language === 'en' ? 0 : 1
  const { aboutMemoLabels } = i18n.messages[languageIndex]

  return (
    <Alert className="inline-alert" color="danger">
      {header(courseCode, semester, roundIds, aboutMemoLabels, language)}
      <p>{aboutMemoLabels.shouldBePublished}</p>
      {courseInformation(aboutMemoLabels, courseCode, language)}
    </Alert>
  )
}

export default AboutAlert
