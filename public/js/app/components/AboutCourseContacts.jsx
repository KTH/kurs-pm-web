import React from 'react'

import { EMPTY } from '../util/constants'
import HtmlWrapper from './HtmlWrapper'

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

const CourseContacts = ({ languageIndex, examiners = '', labels = {} }) => (
  <>
    <div className="info-box text-break">
      <ExaminerContacts languageIndex={languageIndex} examiners={examiners} labels={labels} />
    </div>
  </>
)

export default CourseContacts
