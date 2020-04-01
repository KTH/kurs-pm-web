/* eslint-disable react/no-danger */
import React from 'react'

import i18n from '../../../../i18n'
import { courseLinks } from '../util/links'

const englishTranslations = i18n.messages[0].messages
const swedishTranslations = i18n.messages[1].messages

const CourseLinks = ({ language }) => (
  <div className="text-break" style={{ backgroundColor: '#f4f4f4' }}>
    <h3>{language === 'sv' ? swedishTranslations.linkHeaderTitle : englishTranslations.linkHeaderTitle}</h3>
    <p>
      <a
        title={englishTranslations.beforeAndDuringACourse}
        href={courseLinks.beforeAndDuringACourse}
        target="_blank"
        rel="noopener noreferrer"
      >
        {language === 'en' ? englishTranslations.beforeAndDuringACourse : swedishTranslations.beforeAndDuringACourse}
      </a>
    </p>
    <p>
      <a
        title={englishTranslations.contactPersonsAndStudentCounselling}
        href={courseLinks.contactPersonsAndStudentCounselling}
        target="_blank"
        rel="noopener noreferrer"
      >
        {language === 'en'
          ? englishTranslations.contactPersonsAndStudentCounselling
          : swedishTranslations.contactPersonsAndStudentCounselling}
      </a>
    </p>
  </div>
)

export default CourseLinks
