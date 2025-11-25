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

const SyllabusLabel = ({ labels, language, syllabusValid, courseCode }) => {
  const { syllabusInformation, syllabusLinkStart, syllabusLinkMiddle, syllabusLinkEnd } = labels
  if (!syllabusValid.textFromTo) {
    return <>{`* ${syllabusInformation} N/A`}</>
  }
  console.log(`syllabusValid.textFromTo: ${syllabusValid.textFromTo}`)
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

const MemoSourceLabel = ({ labels, url }) => {
  const memoLink = <a href={url}>{url}</a>
  return (
    <>
      {`${labels.memoSource}: `}
      {memoLink}
    </>
  )
}

/**
 * CoverPage is rendered as the front page of the printable PDF version of the course memo
 * @param {*} param0
 * @returns
 */
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
  url,
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
      <li>
        <SyllabusLabel labels={labels} language={language} syllabusValid={syllabusValid} courseCode={courseCode} />
      </li>
      <li>
        <MemoSourceLabel labels={labels} url={url} />
      </li>
    </ul>
  </section>
)

export default CoverPage
