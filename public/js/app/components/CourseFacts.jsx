import React from 'react'

import { linkToSchool } from '../util/links'

const formatRounds = rounds => {
  // Split rounds with comma after end parentheses and then add '),' in display
  const splitRounds = rounds.split('),')
  const lastIndex = splitRounds.length - 1
  return (
    <>
      {splitRounds.map((round, thisIndex) => (
        <span key={round}>
          {`${round}${thisIndex === lastIndex ? '' : ')'}`}
          <br />
        </span>
      ))}
    </>
  )
}

const OfferedBy = ({ labels, departmentName }) =>
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

const LanguageOfInstruction = ({ labels, memoLanguageOfInstructions }) =>
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

const Rounds = ({ labels, memoName }) =>
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

const CourseFacts = ({ labels, memoData = {} }) => (
  <section aria-labelledby="memo-facts">
    <h2 id="memo-facts" className="d-none">
      {labels.roundFacts}
    </h2>
    <div className="info-box text-break">
      <OfferedBy labels={labels} departmentName={memoData.departmentName} />
      <LanguageOfInstruction labels={labels} memoLanguageOfInstructions={memoData.languageOfInstructions} />
      <Rounds labels={labels} memoName={memoData.memoName} />
    </div>
  </section>
)

export default CourseFacts
