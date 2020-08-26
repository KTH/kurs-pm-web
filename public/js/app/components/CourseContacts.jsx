/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/no-danger */
import React from 'react'

// Volontary information
const communicationWithTeachers = (language, memoData, labels) =>
  !memoData.communicationDuringCourse || (
    <>
      <h4>{labels.communicationWithTeachersTitle}</h4>
      <div dangerouslySetInnerHTML={{ __html: memoData.communicationDuringCourse }} />
    </>
  )

// Mandatory information
const courseCoordinator = (language, memoData, labels) =>
  memoData.courseCoordinator ? (
    <>
      <h4>{labels.courseCoordinatorTitle}</h4>
      <div id="links-course-coordinator" dangerouslySetInnerHTML={{ __html: memoData.courseCoordinator }} />
    </>
  ) : (
    <>
      <h4>{labels.courseCoordinatorTitle}</h4>
      <p>{labels.mandatoryFieldMissing}</p>
    </>
  )

// Mandatory information
const teacher = (language, memoData, labels) =>
  memoData.teacher ? (
    <>
      <h4>{labels.teacherTitle}</h4>
      <div id="links-teacher" dangerouslySetInnerHTML={{ __html: memoData.teacher }} />
    </>
  ) : (
    <>
      <h4>{labels.teacherTitle}</h4>
      <p>{labels.mandatoryFieldMissing}</p>
    </>
  )

// Volontary information
const teacherAssistants = (language, memoData, labels) =>
  !memoData.teacherAssistants || (
    <>
      <h4>{labels.teacherAssistantsTitle}</h4>
      <div id="links-teacher-assistants" dangerouslySetInnerHTML={{ __html: memoData.teacherAssistants }} />
    </>
  )

// Mandatory information
const examiner = (language, memoData, labels) =>
  memoData.examiner ? (
    <>
      <h4>{labels.examinerTitle}</h4>
      <div id="links-examiner" dangerouslySetInnerHTML={{ __html: memoData.examiner }} />
    </>
  ) : (
    <>
      <h4>{labels.examinerTitle}</h4>
      <p>{labels.mandatoryFieldMissing}</p>
    </>
  )

// Volontary information
const otherContacts = (language, memoData, labels) =>
  !memoData.otherContacts || (
    <>
      <h4>{labels.otherContactsTitle}</h4>
      <div id="links-other-contacts" dangerouslySetInnerHTML={{ __html: memoData.otherContacts }} />
    </>
  )

const CourseContacts = ({ language, memoData = {}, labels = {} }) => (
  <section>
    <h2 className="info">{labels.courseContactsTitle}</h2>
    <div className="info-box text-break">
      {communicationWithTeachers(language, memoData, labels)}
      {courseCoordinator(language, memoData, labels)}
      {teacher(language, memoData, labels)}
      {teacherAssistants(language, memoData, labels)}
      {examiner(language, memoData, labels)}
      {otherContacts(language, memoData, labels)}
    </div>
  </section>
)

export default CourseContacts
