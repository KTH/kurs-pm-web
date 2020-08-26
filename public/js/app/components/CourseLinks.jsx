/* eslint-disable react/no-danger */
import React from 'react'

import { courseLinks } from '../util/links'

const CourseLinks = ({ language, labels }) => (
  <aside className="info-box text-break">
    <h4>{labels.linkHeaderTitle}</h4>
    <p>
      <a
        id="link-before-and-during-course"
        title={labels.beforeAndDuringACourse}
        href={courseLinks(language).beforeAndDuringACourse}
        target="_blank"
        rel="noopener noreferrer"
      >
        {labels.beforeAndDuringACourse}
      </a>
    </p>
    <p>
      <a
        id="link-contact-persons-and-student-counceling"
        title={labels.contactPersonsAndStudentCounselling}
        href={courseLinks(language).contactPersonsAndStudentCounselling}
        target="_blank"
        rel="noopener noreferrer"
      >
        {labels.contactPersonsAndStudentCounselling}
      </a>
    </p>
    <p>
      <a
        id="link-rights-and-responsibilities"
        title={labels.rightsAndResponsibilities}
        href={courseLinks(language).rightsAndResponsibilities}
        target="_blank"
        rel="noopener noreferrer"
      >
        {labels.rightsAndResponsibilities}
      </a>
    </p>
  </aside>
)

export default CourseLinks
