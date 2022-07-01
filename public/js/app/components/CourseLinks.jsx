import React from 'react'

import { courseLinks } from '../util/links'

const CourseLinks = ({ language, labels }) => (
  <aside className="info-box text-break" aria-labelledby="student-links">
    <h2 id="student-links">{labels.linkHeaderTitle}</h2>
    {['rightsAndResponsibilities', 'courseAndExamination', 'administrateYouStudy'].map(linkTitle => (
      <p key={`paragraph-for-link-{linkTitle}`}>
        <a id={`link-{linkTitle}`} title={labels[linkTitle]} href={courseLinks(language)[linkTitle]}>
          {labels[linkTitle]}
        </a>
      </p>
    ))}
  </aside>
)

export default CourseLinks
