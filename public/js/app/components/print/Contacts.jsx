/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/no-danger */
import React from 'react'

// Volontary information
const communicationWithTeachers = (language, memoData, labels) =>
  !memoData.communicationDuringCourse || (
    <>
      <h3>{labels.communicationWithTeachersTitle}</h3>
      <div
        id="print-communication-with-teachers"
        dangerouslySetInnerHTML={{ __html: memoData.communicationDuringCourse }}
      />
    </>
  )

// Mandatory information
const courseCoordinator = (language, memoData, labels) =>
  memoData.courseCoordinator ? (
    <>
      <h3>{labels.courseCoordinatorTitle}</h3>
      <div id="print-links-course-coordinator" dangerouslySetInnerHTML={{ __html: memoData.courseCoordinator }} />
    </>
  ) : (
    <>
      <h3>{labels.courseCoordinatorTitle}</h3>
      <p>{labels.mandatoryFieldMissing}</p>
    </>
  )

// Mandatory information
const teacher = (language, memoData, labels) =>
  memoData.teacher ? (
    <>
      <h3>{labels.teacherTitle}</h3>
      <div id="print-links-teacher" dangerouslySetInnerHTML={{ __html: memoData.teacher }} />
    </>
  ) : (
    <>
      <h3>{labels.teacherTitle}</h3>
      <p>{labels.mandatoryFieldMissing}</p>
    </>
  )

// Volontary information
const teacherAssistants = (language, memoData, labels) =>
  !memoData.teacherAssistants || (
    <>
      <h3>{labels.teacherAssistantsTitle}</h3>
      <div id="print-links-teacher-assistants" dangerouslySetInnerHTML={{ __html: memoData.teacherAssistants }} />
    </>
  )

// Mandatory information
const examiner = (language, memoData, labels) =>
  memoData.examiner ? (
    <>
      <h3>{labels.examinerTitle}</h3>
      <div id="print-links-examiner" dangerouslySetInnerHTML={{ __html: memoData.examiner }} />
    </>
  ) : (
    <>
      <h3>{labels.examinerTitle}</h3>
      <p>{labels.mandatoryFieldMissing}</p>
    </>
  )

// Volontary information
const otherContacts = (language, memoData, labels) =>
  !memoData.otherContacts || (
    <>
      <h3>{labels.otherContactsTitle}</h3>
      <div id="print-links-other-contacts" dangerouslySetInnerHTML={{ __html: memoData.otherContacts }} />
    </>
  )

const Contacts = ({ language, memoData = {}, labels = {} }) => (
  <section className="d-none d-print-block" aria-labelledby="print-memo-contacts">
    <h2 id="print-memo-contacts" className="info">
      {labels.courseContactsTitle}
    </h2>
    <div className="text-break">
      {communicationWithTeachers(language, memoData, labels)}
      {courseCoordinator(language, memoData, labels)}
      {teacher(language, memoData, labels)}
      {teacherAssistants(language, memoData, labels)}
      {examiner(language, memoData, labels)}
      {otherContacts(language, memoData, labels)}
    </div>
  </section>
)

export default Contacts
