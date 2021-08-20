import React from 'react'
import HtmlWrapper from './HtmlWrapper'

// Volontary information
const CommunicationWithTeachers = ({ memoData, labels }) =>
  !memoData.communicationDuringCourse || (
    <>
      <h3>{labels.communicationWithTeachersTitle}</h3>
      <HtmlWrapper html={memoData.communicationDuringCourse} />
    </>
  )

// Mandatory information
const CourseCoordinator = ({ memoData, labels }) =>
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
const Teacher = ({ memoData, labels }) =>
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
const TeacherAssistants = ({ memoData, labels }) =>
  !memoData.teacherAssistants || (
    <>
      <h3>{labels.teacherAssistantsTitle}</h3>
      <HtmlWrapper id="links-teacher-assistants" html={memoData.teacherAssistants} />
    </>
  )

// Mandatory information
const Examiner = ({ memoData, labels }) =>
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
const OtherContacts = ({ memoData, labels }) =>
  !memoData.otherContacts || (
    <>
      <h3>{labels.otherContactsTitle}</h3>
      <HtmlWrapper id="links-other-contacts" html={memoData.otherContacts} />
    </>
  )

const CourseContacts = ({ styleId = null, memoData = {}, labels = {} }) => {
  const { visibleInMemo = {} } = memoData
  const {
    communicationDuringCourse: isCommunicationWTVisible,
    otherContacts: isOtherContactsVisible,
    teacherAssistants: isTeacherAssistantsVisible,
  } = visibleInMemo
  return (
    <section id={styleId} aria-labelledby="memo-contacts">
      <h2 id="memo-contacts" className="info">
        {labels.courseContactsTitle}
      </h2>
      <div className="info-box text-break">
        {isCommunicationWTVisible && <CommunicationWithTeachers memoData={memoData} labels={labels} />}
        <CourseCoordinator memoData={memoData} labels={labels} />
        <Teacher memoData={memoData} labels={labels} />
        {isTeacherAssistantsVisible && <TeacherAssistants memoData={memoData} labels={labels} />}
        <Examiner memoData={memoData} labels={labels} />
        {isOtherContactsVisible && <OtherContacts memoData={memoData} labels={labels} />}
      </div>
    </section>
  )
}

export default CourseContacts
