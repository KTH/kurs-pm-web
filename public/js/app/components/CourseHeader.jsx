/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/no-danger */
import React from 'react'
import i18n from '../../../../i18n'

const englishTranslations = i18n.messages[0].messages
const swedishTranslations = i18n.messages[1].messages

const formatCredits = (credits, creditUnitAbbr, language) => {
  const localeCredits = language === 'sv' ? credits.toLocaleString('sv-SE') : credits.toLocaleString('en-US')
  const creditUnit = language === 'sv' ? creditUnitAbbr : 'credits'
  return `${localeCredits} ${creditUnit}`
}

const CourseHeader = ({
  courseMemo = '',
  courseCode = '',
  title = '',
  credits = '',
  creditUnitAbbr = '',
  language = 'sv'
}) => {
  const headerTitle = language === 'sv' ? swedishTranslations.courseHeaderTitle : englishTranslations.courseHeaderTitle
  return (
    <div>
      <h1 className="course-header-title">{`${headerTitle} ${courseMemo}`}</h1>
      <p>
        <b>
          {courseCode} {title} {formatCredits(credits, creditUnitAbbr, language)}
        </b>
      </p>
    </div>
  )
}

export default CourseHeader
