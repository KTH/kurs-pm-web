import React from 'react'

import { linkToSchool } from '../util/links'

const formatRounds = (rounds) => {
  // Split rounds with look behind, so only comma after end parentheses matches
  const splitRounds = rounds.split(/(?<=\)), /g)
  return (
    <>
      {splitRounds.map((round) => (
        <span key={round}>
          {round}
          <br />
        </span>
      ))}
    </>
  )
}

const offeredBy = (language, labels, departmentName) =>
  departmentName ? (
    <>
      <h4>{labels.offeredByTitle}</h4>
      <p>
        <a
          id="link-department-name"
          title={departmentName}
          href={linkToSchool(departmentName)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {departmentName}
        </a>
      </p>
    </>
  ) : (
    <>
      <h4>{labels.offeredByTitle}</h4>
      <p>{labels.mandatoryFieldMissing}</p>
    </>
  )

const languageOfInstruction = (labels, memoLanguageOfInstructions) =>
  memoLanguageOfInstructions ? (
    <>
      <h4>{labels.languageOfInstructionTitle}</h4>
      <p>{memoLanguageOfInstructions}</p>
    </>
  ) : (
    <>
      <h4>{labels.languageOfInstructionTitle}</h4>
      <p>{labels.mandatoryFieldMissing}</p>
    </>
  )

const rounds = (labels, memoName) =>
  memoName ? (
    <>
      <h4>{labels.roundsTitle}</h4>
      <p>{formatRounds(memoName)}</p>
    </>
  ) : (
    <>
      <h4>{labels.roundsTitle}</h4>
      <p>{labels.mandatoryFieldMissing}</p>
    </>
  )

const CourseFacts = ({ language, labels, memoData = {} }) => (
  <div className="info-box text-break">
    {offeredBy(language, labels, memoData.departmentName)}
    {languageOfInstruction(labels, memoData.languageOfInstructions)}
    {rounds(labels, memoData.memoName)}
  </div>
)

export default CourseFacts
