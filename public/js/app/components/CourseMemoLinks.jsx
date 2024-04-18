import React from 'react'
import { FaRegFilePdf, FaAsterisk } from 'react-icons/fa'

import { linkToArchive, linkToSyllabus } from '../util/links'

const printDialog = () => window.print()

const formatVersion = (languageIndex = 1, lastChangeDate) => {
  const locale = ['en-GB', 'sv-SE']
  const unixTime = Date.parse(lastChangeDate)

  const options = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }

  if (unixTime && languageIndex === 1) {
    return new Date(unixTime).toLocaleString('sv-SE')
  }
  return new Date(unixTime).toLocaleString('en-GB', options)
}

const Version = ({ language, labels, lastChangeDate, version, archived }) => {
  const versionText = `${archived ? `${labels.version} ${version} – ` : labels.latest} ${formatVersion(
    language,
    lastChangeDate
  )}`
  return lastChangeDate ? (
    <>
      <h3>{labels.versionTitle}</h3>
      <p>{versionText}</p>
    </>
  ) : (
    <>
      <h3>{labels.versionTitle}</h3>
      <p>{labels.mandatoryFieldMissing}</p>
    </>
  )
}

const ArchiveLink = ({ language, labels, courseCode }) => (
  <p>
    <a id="archive-link" title={labels.courseMemoArchiveLabel} href={linkToArchive(courseCode, language)}>
      {labels.courseMemoArchiveLabel}
    </a>
  </p>
)

const PrintDialogLink = ({ labels }) => (
  <>
    <h3>{labels.courseMemoPrint}</h3>
    <button id="print-link" className="print-link" color="link" onClick={printDialog}>
      {labels.printDialog}
    </button>
  </>
)

const SyllabusLink = ({ language, labels, courseCode, syllabusValid }) => (
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

const CourseMemoLinks = ({ language, labels, memoData = {}, courseMemoName, archivedMemo }) => (
  <aside aria-labelledby="memo-documents">
    <h2 id="memo-documents" className="d-none">
      {labels.documents}
    </h2>
    <div className="info-box text-break">
      <Version
        language={language}
        labels={labels}
        lastChangeDate={memoData.lastChangeDate}
        version={memoData.version}
        archived={archivedMemo}
      />
      <PrintDialogLink labels={labels} courseMemoName={courseMemoName} />
    </div>
  </aside>
)

export default CourseMemoLinks
