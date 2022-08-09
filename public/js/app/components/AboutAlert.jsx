import React from 'react'
import { Alert } from 'reactstrap'

import i18n from '../../../../i18n'
import { aboutCourseLink } from '../util/links'
import { memoNameWithCourseCode } from '../util/helpers'
import { aboutMemoLabels } from '../../../../i18n/messages.en'

const Header = ({ courseCode, semester, roundIds, aboutMemoLabels, language }) => (
  <h2 className="t4">
    {`
      ${memoNameWithoutCourseCode(semester, roundIds, language)} ${aboutMemoLabels.notPublished}
    `}
  </h2>
)

const BeforeChoosingCourseLink = ({ courseCode, aboutMemoLabels, language }) => (
  <a href={aboutCourseLink(courseCode, language)}>{aboutMemoLabels.syllabusLink}</a>
)

const CourseInformation = ({ aboutMemoLabels, courseCode, language }) => (
  <p>
    {`${aboutMemoLabels.courseInfo} ${courseCode} ${aboutMemoLabels.onPage} `}
    <BeforeChoosingCourseLink courseCode={courseCode} aboutMemoLabels={aboutMemoLabels} language={language} />
    {'\u002E'}
  </p>
)

const AboutAlert = ({ courseCode, semester, roundIds, language }) => {
  const languageIndex = language === 'en' ? 0 : 1
  const { aboutMemoLabels } = i18n.messages[languageIndex]

  return (
    <Alert className="inline-alert" color="danger">
      <Header
        courseCode={courseCode}
        semester={semester}
        roundIds={roundIds}
        aboutMemoLabels={aboutMemoLabels}
        language={language}
      />
      <p>{aboutMemoLabels.shouldBePublishedText1}</p>
      <p>{aboutMemoLabels.shouldBePublishedText2}</p>
      <CourseInformation aboutMemoLabels={aboutMemoLabels} courseCode={courseCode} language={language} />
    </Alert>
  )
}

export default AboutAlert
