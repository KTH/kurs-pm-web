import React from 'react'

import { adminLink } from '../util/links'
import { Row, Col } from 'reactstrap'

const CourseHeader = ({ courseMemoName, courseTitle, courseCode, labels = {}, language }) => {
  const { adminLinkLabel } = labels
  return (
    <Row>
      <header className="pageTitle col">
        <span role="heading" aria-level="1">
          <span className="t1" id="memo-title">
            {courseMemoName}
          </span>
          <span className="t4" id="memo-subtitle">
            {courseTitle}
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

export default CourseHeader
