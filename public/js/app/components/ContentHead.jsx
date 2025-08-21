import React from 'react'
import { FaAsterisk } from 'react-icons/fa'
import i18n from '../../../../i18n'

export const ContentHead = ({ contentId, memoLangIndex, isFromSyllabus }) => {
  const { memoTitlesByMemoLang } = i18n.messages[memoLangIndex]
  const header = memoTitlesByMemoLang[contentId]
  return header ? (
    <>
      <h3 id={contentId}>
        {memoTitlesByMemoLang[contentId]}
        {isFromSyllabus && (
          <sup>
            <FaAsterisk className="syllabus-marker-icon" />
          </sup>
        )}
      </h3>
    </>
  ) : null
}

export const ExtraHeaderHead = ({ header }) => (header ? <h3>{header}</h3> : null)

export const SubSectionHeaderMessage = ({ message }) => (
  <p className="sub-section-header">
    <i>{message}</i>
  </p>
)
