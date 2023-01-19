import React from 'react'

import { Row, Alert } from 'reactstrap'
import { adminLink, aboutCourseMemoLink } from '../util/links'

const CourseHeader = ({
  courseMemoName,
  courseTitle,
  courseCode,
  labels = {},
  language,
  oldMemo,
  outdatedMemo,
  latestMemoLabel,
  latestMemoUrl,
  courseImageUrl,
}) => {
  const {
    adminLinkLabel,
    notLatestMemo,
    laterMemos,
    show,
    latestVersionLabel,
    aboutCourseMemo,
    mandatoryFieldMissing,
  } = labels
  return (
    <Row>
      <div className="top-holder">
        <p id="page-sub-heading-admin-link" className="d-print-none d-none d-sm-block">
          <a title={adminLinkLabel} href={adminLink(courseCode, language)}>
            {adminLinkLabel}
          </a>
        </p>
        <header
          className="col memo-header"
          style={{ backgroundImage: `url(${courseImageUrl})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}
        >
          <div id="page-sub-heading-wrapper">
            <h1 id="page-heading" aria-labelledby="page-heading page-sub-heading" style={{ backgroundColor: 'white' }}>
              {courseMemoName}
            </h1>
            <p id="page-sub-heading" aria-hidden="true">
              {courseTitle || mandatoryFieldMissing}
            </p>
          </div>
        </header>
      </div>
      {oldMemo && (
        <div className="col-like">
          <Alert color="info">
            {`${notLatestMemo} ${show} `}
            {latestMemoUrl ? <a href={latestMemoUrl}>{latestMemoLabel}</a> : null}
            {` ${latestVersionLabel}.`}
          </Alert>
        </div>
      )}
      {outdatedMemo && (
        <div className="col-like">
          <Alert color="info">
            {`${laterMemos} `}
            <a href={aboutCourseMemoLink(courseCode)}>{aboutCourseMemo}</a>
            {'\u002E'}
          </Alert>
        </div>
      )}
    </Row>
  )
}

export default CourseHeader
