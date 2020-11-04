import React from 'react'

import { adminLink } from '../util/links'
import { Row, Alert } from 'reactstrap'

const CourseHeader = ({
  courseMemoName,
  courseTitle,
  courseCode,
  labels = {},
  language,
  oldMemo,
  latestMemoLabel,
  latestMemoUrl
}) => {
  const { adminLinkLabel, notLatestMemo, show, latestVersionLabel, mandatoryFieldMissing } = labels
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
          <p id="page-sub-heading-admin-link" className="d-print-none">
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
    </Row>
  )
}

export default CourseHeader
