/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/no-danger */
import React from 'react'
import i18n from '../../../../i18n'
import Contact from './Contact'

const englishTranslations = i18n.messages[0].messages
const swedishTranslations = i18n.messages[1].messages

const CourseContacts = ({ language = 'sv', examiners = [] }) => (
  <div>
    <h2 style={{ marginTop: '0' }}>
      {language === 'sv' ? swedishTranslations.courseContactsTitle : englishTranslations.courseContactsTitle}
    </h2>
    <div>
      <h3>
        {language === 'sv'
          ? swedishTranslations.courseContactsExaminerTitle
          : englishTranslations.courseContactsExaminerTitle}
      </h3>
      {examiners.map(e => (
        <Contact key={e.username} username={e.username} givenName={e.givenName} lastName={e.lastName} />
      ))}
    </div>
  </div>
)

export default CourseContacts
