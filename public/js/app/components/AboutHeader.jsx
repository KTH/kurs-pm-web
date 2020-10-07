/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/no-danger */
import React from 'react'

import { adminLink } from '../util/links'
import { Row, Col } from 'reactstrap'

const formatCredits = (credits, creditUnitAbbr, language) => {
  const localeCredits = language === 'sv' ? credits.toLocaleString('sv-SE') : credits.toLocaleString('en-US')
  const creditUnit = language === 'sv' ? creditUnitAbbr : 'credits'
  return `${localeCredits} ${creditUnit}`
}

const AboutHeader = ({
  courseCode = '',
  title = '',
  credits = '',
  creditUnitAbbr = '',
  labels = {},
  language = 'sv'
}) => {
  const { adminLinkLabel } = labels
  return (
    <Row>
      <header className="pageTitle col">
        <span id="page-course-title" role="heading" aria-level="1">
          <span className="t1">{labels.memoLabel}</span>
          <span className="t4">
            {courseCode} {title} {formatCredits(credits, creditUnitAbbr, language)}
          </span>
        </span>
        <a
          title={adminLinkLabel}
          className="right-link"
          href={adminLink(courseCode, language)}
          style={{ fontSize: '1rem' }}
        >
          {adminLinkLabel}
        </a>
      </header>
    </Row>
  )
}

export default AboutHeader
