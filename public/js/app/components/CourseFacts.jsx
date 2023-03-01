import React from 'react'
import i18n from '../../../../i18n'

import { linkToSchool } from '../util/links'
import { getDateFormat, seasonStr } from '../util/helpers'

const formatRoundsShort = (language, memoData) => {
  // Split rounds with comma after end parentheses and then add '),' in display
  const langIndex = language === 'en' ? 0 : 1
  const { memoName } = memoData
  const splitRounds = memoName.split('),')

  return (
    <>
      {splitRounds.map((round, thisIndex) => {
        const shortName = round.split('(')[0].trim().replaceAll('m.fl.', '')
        // memoName:"CINTE1  (Startdatum 2023-10-30, Svenska), CINTE2  (Startdatum 2023-10-30, Svenska)"
        return (
          <ul key={round}>
            <li>{`${shortName} ${seasonStr(i18n.messages[langIndex].extraInfo, memoData.semester)}-${
              memoData.applicationCodes[thisIndex]
            }`}</li>
          </ul>
        )
      })}
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

const Rounds = ({ language, labels, memoData }) =>
  memoData.memoName ? (
    <>
      <h3>{labels.roundsTitle}</h3>
      <div>{formatRoundsShort(language, memoData)}</div>
    </>
  ) : (
    <>
      <h3>{labels.roundsTitle}</h3>
      <p>{labels.mandatoryFieldMissing}</p>
    </>
  )

const StartDate = ({ language, labels, startDate }) =>
  startDate ? (
    <>
      <h3>{labels.startDate}</h3>
      <p>{getDateFormat(startDate, language)}</p>
    </>
  ) : (
    <>
      <h3>{labels.startDate}</h3>
      <p>{labels.mandatoryFieldMissing}</p>
    </>
  )

const CourseFacts = ({ language, labels, memoData = {} }) => (
  <section aria-labelledby="memo-facts">
    <h2 id="memo-facts" className="d-none">
      {labels.roundFacts}
    </h2>
    <div className="info-box text-break">
      <StartDate language={language} labels={labels} startDate={memoData.startDate} />
      <Rounds language={language} labels={labels} memoData={memoData} />
      <LanguageOfInstruction labels={labels} memoLanguageOfInstructions={memoData.languageOfInstructions} />
      <OfferedBy labels={labels} departmentName={memoData.departmentName} />
    </div>
  </section>
)

export default CourseFacts
