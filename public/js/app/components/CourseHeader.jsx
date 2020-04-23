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
    <>
      <Row className="w-100" style={{ marginLeft: '0', marginRight: '0' }}>
        <Col style={{ paddingLeft: '0' }}>
          <h1 className="course-header-title">{`${headerTitle} ${courseMemo}`}</h1>
        </Col>
      </Row>
      <Row className="w-100" style={{ marginLeft: '0', marginRight: '0' }}>
        <Col className="text-left pb-4" style={{ paddingLeft: '0' }}>
          <b>
            {courseCode} {title} {formatCredits(credits, creditUnitAbbr, language)}
          </b>
        </Col>
        <Col className="text-right pb-4" style={{ paddingRight: '0' }}>
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
    </>
  )
}

export default CourseHeader
