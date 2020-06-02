import React from 'react'
import { FaAsterisk } from 'react-icons/fa'
import i18n from '../../../../i18n'

export const ContentHead = ({ contentId, memoLangIndex, fromSyllabus }) => {
  const { memoTitlesByMemoLang, subHeaderLabel } = i18n.messages[memoLangIndex]
  const header = memoTitlesByMemoLang[contentId]
  const { main, subHeader } = fromSyllabus
  return header ? (
    <>
      <h3 className={subHeader ? 'with-subheader' : ''}>
        {memoTitlesByMemoLang[contentId]}
        {main && (
          <sup>
            <FaAsterisk className="syllabus-marker-icon" />
          </sup>
        )}
      </h3>
      {subHeader && (
        <p className="subheader">
          (
          <FaAsterisk className="syllabus-marker-icon-small" />
          {subHeaderLabel.fromSyllabus})
        </p>
      )}
    </>
  ) : null
}

export const ExtraHeaderHead = ({ header }) => (header ? <h3>{header}</h3> : null)

export const SubSectionHeaderMessage = ({ message }) => <p className="sub-section-header">{message}</p>
