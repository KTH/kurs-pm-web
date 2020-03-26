/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/no-danger */
import React from 'react'
import i18n from '../../../../i18n'
import Contact from './Contact'

const englishTranslations = i18n.messages[0].messages
const swedishTranslations = i18n.messages[1].messages

const communicationWithTeachers = (language, memoData) =>
  !memoData.communicationDuringCourse || (
    <div>
      <h3>
        {language === 'sv'
          ? swedishTranslations.communicationWithTeachersTitle
          : englishTranslations.communicationWithTeachersTitle}
      </h3>
      <div dangerouslySetInnerHTML={{ __html: memoData.communicationDuringCourse }} />
    </div>
  )

const courseCoordinator = (language, memoData) =>
  memoData.courseCoordinator ? (
    <div>
      <h3>
        {language === 'sv' ? swedishTranslations.courseCoordinatorTitle : englishTranslations.courseCoordinatorTitle}
      </h3>
      <div dangerouslySetInnerHTML={{ __html: memoData.courseCoordinator }} />
    </div>
  ) : (
    <div>
      <h3>
        {language === 'sv' ? swedishTranslations.courseCoordinatorTitle : englishTranslations.courseCoordinatorTitle}
      </h3>
      <p>{language === 'sv' ? swedishTranslations.mandatoryFieldMissing : englishTranslations.mandatoryFieldMissing}</p>
    </div>
  )

const CourseContacts = ({ language = 'sv', examiners = [], memoData = {} }) => (
  <div>
    <h2 style={{ marginTop: '0' }}>
      {language === 'sv' ? swedishTranslations.courseContactsTitle : englishTranslations.courseContactsTitle}
    </h2>
    <div style={{ backgroundColor: '#f4f4f4' }}>
      {communicationWithTeachers(language, memoData)}
      {courseCoordinator(language, memoData)}
      <div>
        <h3>
          {language === 'sv'
            ? swedishTranslations.courseContactsExaminerTitle
            : englishTranslations.courseContactsExaminerTitle}
        </h3>
        {examiners.map((e) => (
          <Contact key={e.username} username={e.username} givenName={e.givenName} lastName={e.lastName} />
        ))}
      </div>
    </div>
  </div>
)

export default CourseContacts
