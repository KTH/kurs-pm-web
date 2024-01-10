import React from 'react'
import { Button } from 'reactstrap'

const printDialog = () => window.print()

const formatVersion = (languageIndex = 1, lastChangeDate) => {
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

const PrintDialogLink = ({ labels }) => (
  <>
    <h3>{labels.courseMemoPrint}</h3>
    <Button id="print-link" className="print-link" color="link" onClick={printDialog}>
      <svg className="print-icon" />
      {labels.printDialog}
    </Button>
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
