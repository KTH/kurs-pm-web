import React from 'react'

import { EMPTY } from '../util/constants'
import HtmlWrapper from './HtmlWrapper'

// Mandatory information
const InfoContact = ({ languageIndex, infoContactName, labels }) =>
  infoContactName ? (
    <>
      <h3 className="t4">{labels.infoContactName}</h3>
      <HtmlWrapper id="links-info-contact-name" html={infoContactName} />
    </>
  ) : (
    <>
      <h3 className="t4">{labels.infoContactName}</h3>
      <p>
        <i>{EMPTY[languageIndex]}</i>
      </p>
    </>
  )

// Mandatory information
const ExaminerContacts = ({ languageIndex, examiners, labels }) =>
  examiners ? (
    <>
      <h3 className="t4">{labels.examinerTitle}</h3>
      <HtmlWrapper id="links-examiner" html={examiners} />
    </>
  ) : (
    <>
      <h3 className="t4">{labels.examinerTitle}</h3>
      <p>
        <i>{EMPTY[languageIndex]}</i>
      </p>
    </>
  )

const CourseContacts = ({ languageIndex, infoContactName = '', examiners = '', labels = {} }) => (
  <>
    <div className="info-box text-break">
      <InfoContact languageIndex={languageIndex} infoContactName={infoContactName} labels={labels} />
      <ExaminerContacts languageIndex={languageIndex} examiners={examiners} labels={labels} />
    </div>
  </>
)

export default CourseContacts
