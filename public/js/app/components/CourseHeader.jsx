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
      <header className="col memo-header">
        <h1 id="page-heading" aria-labelledby="page-heading page-sub-heading">
          {courseMemoName}
        </h1>
        <div id="page-sub-heading-wrapper">
          <p id="page-sub-heading" aria-hidden="true">
            {courseTitle || mandatoryFieldMissing}
          </p>
          <p id="page-sub-heading-admin-link" className="d-print-none d-none d-sm-block">
            <a title={adminLinkLabel} href={adminLink(courseCode, language)}>
              {adminLinkLabel}
            </a>
          </p>
        </div>
      </header>
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
