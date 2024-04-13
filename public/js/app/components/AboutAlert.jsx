import React from 'react'
import Alert from '../components-shared/Alert'

import i18n from '../../../../i18n'
import { aboutCourseLink } from '../util/links'
import { createMemoName, getLangIndex } from '../util/helpers'

const AboutAlert = ({ courseCode, semester, applicationCodes, language, courseMemosExist = false }) => {
  const languageIndex = getLangIndex(language)
  const { aboutMemoLabels } = i18n.messages[languageIndex]

  const headerText = getHeaderText(courseCode, language, applicationCodes, semester, courseMemosExist)

  return (
    <Alert className="inline-alert" color="warning" header={headerText}>
      <p>{aboutMemoLabels.shouldBePublished}</p>
      <CourseInformation aboutMemoLabels={aboutMemoLabels} courseCode={courseCode} language={language} />
    </Alert>
  )
}

const getHeaderText = (courseCode, language, applicationCodes, semester, courseMemosExist) => {
  if (!courseMemosExist) {
    return getNoMemoHeader(courseCode, language)
  } else {
    return getMemoHeader(courseCode, applicationCodes, semester, language)
  }
}

const getNoMemoHeader = (courseCode, langAbbr) => {
  const langIndex = getLangIndex(langAbbr)
  const { prepositionFor } = i18n.messages[langIndex].messages
  const { nonePublished } = i18n.messages[langIndex].aboutMemoLabels

  return `${nonePublished} ${prepositionFor} ${courseCode}`
}

const getMemoHeader = (courseCode, applicationCodes, semester, langAbbr) => {
  const langIndex = getLangIndex(langAbbr)
  const { aboutMemoLabels } = i18n.messages[langIndex]

  const memoName = createMemoName(semester, applicationCodes, langAbbr, courseCode)
  return `${memoName} ${aboutMemoLabels.notPublished}`
}

const CourseInformation = ({ aboutMemoLabels, courseCode, language }) => (
  <p>
    {`${aboutMemoLabels.courseInfo} ${aboutMemoLabels.onPage} `}
    <BeforeChoosingCourseLink courseCode={courseCode} aboutMemoLabels={aboutMemoLabels} language={language} />
    {'\u002E'}
  </p>
)

const BeforeChoosingCourseLink = ({ courseCode, aboutMemoLabels, language }) => (
  <a href={aboutCourseLink(courseCode, language)}>{aboutMemoLabels.syllabusLink}</a>
)

export default AboutAlert
