/* eslint-disable react/no-danger */
import React from 'react'

import { linkToSchool } from '../util/links'

const offeredBy = (language, labels, department) =>
  department.name ? (
    <div>
      <h4>{labels.offeredByTitle}</h4>
      <p>
        <a href={linkToSchool(department.name)}>{department.name}</a>
      </p>
    </div>
  ) : (
    <div>
      <h4>{labels.versionTitle}</h4>
      <p>{labels.mandatoryFieldMissing}</p>
    </div>
  )

const languageOfInstruction = (labels, memoLanguageOfInstructions) =>
  memoLanguageOfInstructions ? (
    <div>
      <h4>{labels.languageOfInstructionTitle}</h4>
      <p>{memoLanguageOfInstructions}</p>
    </div>
  ) : (
    <div>
      <h4>{labels.languageOfInstructionTitle}</h4>
      <p>{labels.mandatoryFieldMissing}</p>
    </div>
  )

const CourseFacts = ({ language = 'sv', labels = {}, department = {}, memoData = {} }) => (
  <div className="text-break" style={{ backgroundColor: '#f4f4f4' }}>
    {offeredBy(language, labels, department)}
    {languageOfInstruction(labels, memoData.languageOfInstructions)}
  </div>
)

export default CourseFacts
