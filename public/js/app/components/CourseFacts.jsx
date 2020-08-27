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
      <h3>{labels.offeredByTitle}</h3>
      <p>
        <a id="link-department-name" title={departmentName} href={linkToSchool(departmentName)}>
          {departmentName}
        </a>
      </p>
    </>
  ) : (
    <>
      <h3>{labels.offeredByTitle}</h3>
      <p>{labels.mandatoryFieldMissing}</p>
    </>
  )

const languageOfInstruction = (labels, memoLanguageOfInstructions) =>
  memoLanguageOfInstructions ? (
    <>
      <h3>{labels.languageOfInstructionTitle}</h3>
      <p>{memoLanguageOfInstructions}</p>
    </>
  ) : (
    <>
      <h3>{labels.languageOfInstructionTitle}</h3>
      <p>{labels.mandatoryFieldMissing}</p>
    </>
  )

const rounds = (labels, memoName) =>
  memoName ? (
    <>
      <h3>{labels.roundsTitle}</h3>
      <p>{formatRounds(memoName)}</p>
    </>
  ) : (
    <>
      <h3>{labels.roundsTitle}</h3>
      <p>{labels.mandatoryFieldMissing}</p>
    </>
  )

const CourseFacts = ({ language, labels, memoData = {} }) => (
  <section aria-labelledby="memo-facts">
    <h2 id="memo-facts" className="d-none">
      {labels.roundFacts}
    </h2>
    <div className="info-box text-break">
      {offeredBy(language, labels, memoData.departmentName)}
      {languageOfInstruction(labels, memoData.languageOfInstructions)}
      {rounds(labels, memoData.memoName)}
    </div>
  </section>
)

export default CourseFacts
