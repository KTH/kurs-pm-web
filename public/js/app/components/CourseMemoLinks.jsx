import React from 'react'
import { FaRegFilePdf, FaAsterisk } from 'react-icons/fa'

import { linkToArchive, linkToPublishedMemoPdf, linkToSyllabus } from '../util/links'

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
    <>
      <h3>{labels.versionTitle}</h3>
      <p>{`${labels.latest} ${formatVersion(language, memoVersion)}`}</p>
    </>
  ) : (
    <>
      <h3>{labels.versionTitle}</h3>
      <p>{labels.mandatoryFieldMissing}</p>
    </>
  )

const archiveLink = (language, labels, courseCode) => (
  <p>
    <a id="archive-link" title={labels.courseMemoArchiveLabel} href={linkToArchive(courseCode, language)}>
      {labels.courseMemoArchiveLabel}
    </a>
  </p>
)

const pdfLink = (labels, memoEndPoint, courseMemoName) => (
  <>
    <h3>{labels.courseMemoPdf}</h3>
    <p>
      {/* <a
        id="pdf-link"
        title={courseMemoName}
        href={linkToPublishedMemoPdf(memoEndPoint, courseMemoName)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {courseMemoName}
        <FaRegFilePdf className="pdf-icon" />
      </a> */}
      <i>{labels.inDevelopment}</i>
    </p>
  </>
)

const syllabusLink = (language, labels, extraInfo, courseCode, syllabusValid) => {
  return (
    <>
      <h3>{labels.syllabus}</h3>
      {syllabusValid ? (
        <p>
          <FaAsterisk className="syllabus-marker-icon" />
          {labels.syllabusInformation}
          <br />
          <a
            id="syllabus-link"
            title={`${labels.syllabusLinkStart}${syllabusValid.textFromTo}${labels.syllabusLinkEnd}`}
            href={linkToSyllabus(courseCode, syllabusValid.validFromTerm, language)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {`${labels.syllabusLinkStart}${syllabusValid.textFromTo}${labels.syllabusLinkEnd}`}
            <FaRegFilePdf className="pdf-icon" />
          </a>
        </p>
      ) : (
        <p>{labels.mandatoryFieldMissing}</p>
      )}
    </>
  )
}

const CourseMemoLinks = ({ language, labels, extraInfo, memoData = {}, courseMemoName }) => (
  <aside aria-labelledby="memo-documents">
    <h2 id="memo-documents" className="d-none">
      {labels.documents}
    </h2>
    <div className="info-box text-break">
      {version(memoData.memoLanguage, labels, memoData.lastChangeDate)}
      {archiveLink(language, labels, memoData.courseCode)}
      {pdfLink(labels, memoData.memoEndPoint, courseMemoName)}
      {syllabusLink(language, labels, extraInfo, memoData.courseCode, memoData.syllabusValid)}
    </div>
  </aside>
)

export default CourseMemoLinks
