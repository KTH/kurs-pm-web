/* eslint-disable react/no-danger */
import React from 'react'

import { courseLinks } from '../util/links'

const CourseLinks = ({ language, labels }) => (
  <aside className="info-box text-break" aria-labelledby="student-links">
    <h4 id="student-links">{labels.linkHeaderTitle}</h4>
    <p>
      <a
        id="link-before-and-during-course"
        title={labels.beforeAndDuringACourse}
        href={courseLinks(language).beforeAndDuringACourse}
      >
        {labels.beforeAndDuringACourse}
      </a>
    </p>
    <p>
      <a
        id="link-contact-persons-and-student-counceling"
        title={labels.contactPersonsAndStudentCounselling}
        href={courseLinks(language).contactPersonsAndStudentCounselling}
      >
        {labels.contactPersonsAndStudentCounselling}
      </a>
    </p>
    <p>
      <a
        id="link-rights-and-responsibilities"
        title={labels.rightsAndResponsibilities}
        href={courseLinks(language).rightsAndResponsibilities}
      >
        {labels.rightsAndResponsibilities}
      </a>
    </p>
  </aside>
)

export default CourseLinks
