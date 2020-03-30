/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/no-danger */
import React from 'react'
import { Row, Col } from 'reactstrap'

import i18n from '../../../../i18n'
import { adminLink } from '../util/links'

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
    <div className="w-100">
      <Row className="w-100">
        <h1 className="course-header-title">{`${headerTitle} ${courseMemo}`}</h1>
      </Row>
      <Row className="w-100">
        <Col className="text-left px-0 pb-4">
          <b>
            {courseCode} {title} {formatCredits(credits, creditUnitAbbr, language)}
          </b>
        </Col>
        <Col className="text-right px-0 pb-4">
          <a
            title={language === 'en' ? englishTranslations.adminLinkLabel : swedishTranslations.adminLinkLabel}
            href={adminLink(courseCode, language)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {language === 'en' ? englishTranslations.adminLinkLabel : swedishTranslations.adminLinkLabel}
          </a>
        </Col>
      </Row>
    </div>
  )
}

export default CourseHeader
