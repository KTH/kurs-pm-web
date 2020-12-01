import React from 'react'
import { linkToSyllabus } from '../../util/links'

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
  `Version ${version} – ${formatVersionDate(language, lastChangeDate)}`

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

const syllabusLabel = (labels, language, syllabusValid, courseCode) => {
  if (!syllabusValid.textFromTo) {
    return <>{`* ${syllabusInformation} N/A`}</>
  }
  const { syllabusInformation, syllabusLinkStart, syllabusLinkMiddle, syllabusLinkEnd } = labels
  const syllabusLinkLabel = `${syllabusLinkStart} ${courseCode} ${syllabusLinkMiddle}${syllabusValid.textFromTo}${syllabusLinkEnd}`
  const syllabusLink = (
    <a className="pdf-post-link" href={linkToSyllabus(courseCode, syllabusValid.validFromTerm, language)}>
      {syllabusLinkLabel}
    </a>
  )
  return (
    <>
      {`* ${syllabusInformation} `}
      {syllabusLink}
    </>
  )
}

const memoSourceLabel = (labels, url) => {
  const memoLink = <a href={url}>{url}</a>
  return (
    <>
      {`${labels.memoSource}: `}
      {memoLink}
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
  courseCode,
  languageOfInstruction,
  syllabusValid = {},
  url
}) => (
  <section className="cover-page d-none d-print-block">
    <h1>{courseTitle}</h1>
    <p className="memo-subtitle">{memoName}</p>
    <p>{formatVersion(version, language, lastChangeDate)}</p>
    <h2>{labels.roundsTitle}</h2>
    <p>{formatRounds(rounds || '')}</p>
    <h2>{labels.languageOfInstructionTitle}</h2>
    <p>{languageOfInstruction}</p>
    <h2>{labels.offeredByTitle}</h2>
    <p>{departmentName}</p>
    <ul className="link-list cover-page-links">
      <li>{syllabusLabel(labels, language, syllabusValid, courseCode)}</li>
      <li>{memoSourceLabel(labels, url)}</li>
    </ul>
  </section>
)

export default CoverPage
