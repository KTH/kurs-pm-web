import React from 'react'

const { sv, en } = require('date-fns/locale')
const { utcToZonedTime, format } = require('date-fns-tz')

const locales = { sv, en }

const formatVersionDate = (language = 'sv', version) => {
  const unixTime = Date.parse(version)
  if (unixTime) {
    const timeZone = 'Europe/Berlin'
    const zonedDate = utcToZonedTime(new Date(unixTime), timeZone)
    return format(zonedDate, 'Ppp', { locale: locales[language] })
  }
  return null
}

const formatVersion = (version, language, lastChangeDate) =>
  `Version ${version} — ${formatVersionDate(language, lastChangeDate)}`

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

const CoverPage = ({
  labels,
  language,
  courseTitle,
  memoName,
  version,
  lastChangeDate,
  rounds,
  departmentName,
  languageOfInstruction
}) => (
  <section className="cover-page">
    <h1>{courseTitle}</h1>
    <p className="memo-subtitle">{memoName}</p>
    <p>{formatVersion(version, language, lastChangeDate)}</p>
    <h2>{labels.roundsTitle}</h2>
    <p>{formatRounds(rounds || '')}</p>
    <h2>{labels.languageOfInstructionTitle}</h2>
    <p>{languageOfInstruction}</p>
    <h2>{labels.offeredByTitle}</h2>
    <p>{departmentName}</p>
  </section>
)

export default CoverPage
