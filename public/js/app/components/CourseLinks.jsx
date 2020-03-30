/* eslint-disable react/no-danger */
import React from 'react'
import { IconContext } from 'react-icons'
import { MdLaunch } from 'react-icons/md'

import i18n from '../../../../i18n'
import { courseLinks } from '../util/links'

const englishTranslations = i18n.messages[0].messages
const swedishTranslations = i18n.messages[1].messages

const CourseLinks = ({ language }) => (
  <div className="text-break" style={{ backgroundColor: '#f4f4f4' }}>
    <IconContext.Provider value={{ size: '1.8em' }}>
      <MdLaunch />
    </IconContext.Provider>
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
    <p>
      <a
        title={englishTranslations.manageMyStudies}
        href={courseLinks.manageMyStudies}
        target="_blank"
        rel="noopener noreferrer"
      >
        {language === 'en' ? englishTranslations.manageMyStudies : swedishTranslations.manageMyStudies}
      </a>
    </p>
  </div>
)

export default CourseLinks
