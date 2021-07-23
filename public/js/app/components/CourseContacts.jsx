import React from 'react'
import HtmlWrapper from './HtmlWrapper'

// Volontary information
const communicationWithTeachers = (language, memoData, labels) =>
  !memoData.communicationDuringCourse || (
    <>
      <h3>{labels.communicationWithTeachersTitle}</h3>
      <HtmlWrapper html={memoData.communicationDuringCourse} />
    </>
  )

// Mandatory information
const courseCoordinator = (language, memoData, labels) =>
  memoData.courseCoordinator ? (
    <>
      <h3>{labels.courseCoordinatorTitle}</h3>
      <HtmlWrapper id="links-course-coordinator" html={memoData.courseCoordinator} />
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
      <HtmlWrapper id="links-teacher" html={memoData.teacher} />
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
      <HtmlWrapper id="links-teacher-assistants" html={memoData.teacherAssistants} />
    </>
  )

// Mandatory information
const examiner = (language, memoData, labels) =>
  memoData.examiner ? (
    <>
      <h3>{labels.examinerTitle}</h3>
      <HtmlWrapper id="links-examiner" html={memoData.examiner} />
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
      <HtmlWrapper id="links-other-contacts" html={memoData.otherContacts} />
    </>
  )

const CourseContacts = ({ styleId = null, language, memoData = {}, labels = {} }) => (
  <section id={styleId} aria-labelledby="memo-contacts">
    <h2 id="memo-contacts" className="info">
      {labels.courseContactsTitle}
    </h2>
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
