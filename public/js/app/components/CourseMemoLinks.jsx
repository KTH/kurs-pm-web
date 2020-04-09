/* eslint-disable react/no-danger */
import React from 'react'
import { FaRegFilePdf } from 'react-icons/fa'

import { seasonStr } from '../util/helpers'
import { linkToArchive, linkToMemoPdf, linkToSyllabus } from '../util/links'

const formatVersion = (language = 'sv', version) => {
  const unixTime = Date.parse(version)
  if (unixTime) {
    const locale = language === 'sv' ? 'sv-SE' : 'en-US'
    return new Date(unixTime).toLocaleString(locale)
  }
  return null
}

const version = (language, labels, memoVersion) =>
  memoVersion ? (
    <div>
      <h4>{labels.versionTitle}</h4>
      <p>{`${labels.latest} ${formatVersion(language, memoVersion)}`}</p>
    </div>
  ) : (
    <div>
      <h4>{labels.versionTitle}</h4>
      <p>{labels.mandatoryFieldMissing}</p>
    </div>
  )

const archiveLink = (language, labels, courseCode) => (
  <p>
    <a
      title={labels.courseMemoArchiveLabel}
      href={linkToArchive(courseCode, language)}
      target="_blank"
      rel="noopener noreferrer"
    >
      {labels.courseMemoArchiveLabel}
    </a>
  </p>
)

const pdfLink = (labels, courseCode, memoEndPoint) => (
  <div>
    <h4>{labels.courseMemoPdf}</h4>
    <p>
      <a title={memoEndPoint} href={linkToMemoPdf(courseCode, memoEndPoint)} target="_blank" rel="noopener noreferrer">
        {memoEndPoint}
      </a>
      &nbsp;
      <FaRegFilePdf />
    </p>
  </div>
)

const syllabusLink = (language, labels, extraInfo, courseCode, validFromTerm) => {
  const syllabusLinkLabel = `${labels.syllabusLinkStart}${seasonStr(extraInfo, validFromTerm)}${labels.syllabusLinkEnd}`
  return (
    <div>
      <h4>{labels.syllabus}</h4>
      <p>
        {labels.syllabusInformation}
        <br />
        <a
          title={syllabusLinkLabel}
          href={linkToSyllabus(courseCode, validFromTerm, language)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {syllabusLinkLabel}
        </a>
        &nbsp;
        <FaRegFilePdf />
      </p>
    </div>
  )
}

const CourseMemoLinks = ({ language = 'sv', labels = {}, extraInfo = {}, memoData = {}, validFromTerm = {} }) => (
  <div className="text-break" style={{ backgroundColor: '#f4f4f4' }}>
    {version(language, labels, memoData.lastChangeDate)}
    {archiveLink(language, labels, memoData.courseCode)}
    {pdfLink(labels, memoData.courseCode, memoData.memoEndPoint)}
    {syllabusLink(language, labels, extraInfo, memoData.courseCode, validFromTerm.term)}
  </div>
)

export default CourseMemoLinks
