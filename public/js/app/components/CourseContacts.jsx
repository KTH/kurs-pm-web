/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/no-danger */
import React from 'react'
import i18n from '../../../../i18n'
import Contact from './Contact'

const englishTranslations = i18n.messages[0].messages
const swedishTranslations = i18n.messages[1].messages

// Volontary information
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

// Mandatory information
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

// Mandatory information
const teacher = (language, memoData) =>
  memoData.teacher ? (
    <div>
      <h3>{language === 'sv' ? swedishTranslations.teacherTitle : englishTranslations.teacherTitle}</h3>
      <div dangerouslySetInnerHTML={{ __html: memoData.teacher }} />
    </div>
  ) : (
    <div>
      <h3>{language === 'sv' ? swedishTranslations.teacherTitle : englishTranslations.teacherTitle}</h3>
      <p>{language === 'sv' ? swedishTranslations.mandatoryFieldMissing : englishTranslations.mandatoryFieldMissing}</p>
    </div>
  )

// Volontary information
const teacherAssistants = (language, memoData) =>
  !memoData.teacherAssistants || (
    <div>
      <h3>
        {language === 'sv' ? swedishTranslations.teacherAssistantsTitle : englishTranslations.teacherAssistantsTitle}
      </h3>
      <div dangerouslySetInnerHTML={{ __html: memoData.teacherAssistants }} />
    </div>
  )

// Mandatory information
const examiner = (language, memoData) =>
  memoData.examiner ? (
    <div>
      <h3>{language === 'sv' ? swedishTranslations.examinerTitle : englishTranslations.examinerTitle}</h3>
      <div dangerouslySetInnerHTML={{ __html: memoData.examiner }} />
    </div>
  ) : (
    <div>
      <h3>{language === 'sv' ? swedishTranslations.examinerTitle : englishTranslations.examinerTitle}</h3>
      <p>{language === 'sv' ? swedishTranslations.mandatoryFieldMissing : englishTranslations.mandatoryFieldMissing}</p>
    </div>
  )

const CourseContacts = ({ language = 'sv', /* examiners = [] ,*/ memoData = {} }) => (
  <div>
    <h2 style={{ marginTop: '0' }}>
      {language === 'sv' ? swedishTranslations.courseContactsTitle : englishTranslations.courseContactsTitle}
    </h2>
    <div style={{ backgroundColor: '#f4f4f4' }}>
      {communicationWithTeachers(language, memoData)}
      {courseCoordinator(language, memoData)}
      {teacher(language, memoData)}
      {teacherAssistants(language, memoData)}
      {examiner(language, memoData)}
      {/* <div>
        <h3>
          {language === 'sv'
            ? swedishTranslations.courseContactsExaminerTitle
            : englishTranslations.courseContactsExaminerTitle}
        </h3>
        {examiners.map((e) => (
          <Contact key={e.username} username={e.username} givenName={e.givenName} lastName={e.lastName} />
        ))}
      </div> */}
    </div>
  </div>
)

export default CourseContacts
