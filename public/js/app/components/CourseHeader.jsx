import React from 'react'

import { adminLink } from '../util/links'
import { Row, Col } from 'reactstrap'

const CourseHeader = ({ courseMemoName, courseTitle, courseCode, labels = {}, language }) => {
  const { adminLinkLabel } = labels
  return (
    <>
      <Row>
        <Col>
          <h1 id="memo-title" className="course-header-title">
            {courseMemoName}
            <span className="sr-only">{courseTitle}</span>
          </h1>
        </Col>
      </Row>
      <Row className="pb-3">
        <Col className="text-left" xs="12" lg="6">
          <p className="secondTitle">{courseTitle}</p>
        </Col>
        <Col className="text-lg-right" xs="12" lg="6">
          <a
            id="admin-link"
            className="course-header-admin-link"
            title={adminLinkLabel}
            href={adminLink(courseCode, language)}
          >
            {adminLinkLabel}
          </a>
        </Col>
      </Row>
    </>
  )
}

export default CourseHeader
