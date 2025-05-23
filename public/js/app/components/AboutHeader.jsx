import React from 'react'

import { adminLink } from '../util/links'

const AboutHeader = ({ courseCode = '', title = '', creditsLabel = '', labels = {}, language = 'sv' }) => {
  const { adminLinkLabel } = labels
  const subHeadingText = `${courseCode} ${title} ${creditsLabel}`
  return (
    <header>
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
  )
}

export default AboutHeader
