import React from 'react'

import { Row } from 'reactstrap'
import { adminLink } from '../util/links'
import { formatCredits } from '../util/helpers'

const AboutHeader = ({
  courseCode = '',
  title = '',
  credits = '',
  creditUnitAbbr = '',
  labels = {},
  language = 'sv',
}) => {
  const { adminLinkLabel } = labels
  const subHeadingText = `${courseCode} ${title} ${formatCredits(credits, creditUnitAbbr, language)}`
  return (
    <Row>
      <header className="col memo-header">
        <h1 id="page-heading" aria-labelledby="page-heading page-sub-heading">
          {labels.memoLabel}
        </h1>
        <div id="page-sub-heading-wrapper">
          <p id="page-sub-heading" aria-hidden="true">
            {subHeadingText}
          </p>
          <p id="page-sub-heading-admin-link" className="d-print-none">
            <a title={adminLinkLabel} href={adminLink(courseCode, language)}>
              {adminLinkLabel}
            </a>
          </p>
        </div>
      </header>
    </Row>
  )
}

export default AboutHeader
