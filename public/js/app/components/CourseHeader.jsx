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
  latestMemoLabel = '',
  latestMemoUrl = ''
}) => {
  const { adminLinkLabel, notLatestMemo, show, latestVersionLabel } = labels
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
      {oldMemo && (
        <div className="row-like-padding">
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
