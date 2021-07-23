import React from 'react'

import { EMPTY } from '../util/constants'
import HtmlWrapper from './HtmlWrapper'

// Mandatory information
const infoContact = (languageIndex, infoContactName, labels) =>
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
const examinerContacts = (languageIndex, examiners, labels) =>
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
      {infoContact(languageIndex, infoContactName, labels)}
      {examinerContacts(languageIndex, examiners, labels)}
    </div>
  </>
)

export default CourseContacts
