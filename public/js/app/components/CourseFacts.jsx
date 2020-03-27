/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/no-danger */
import React from 'react'
import i18n from '../../../../i18n'

const englishTranslations = i18n.messages[0].messages
const swedishTranslations = i18n.messages[1].messages

const version = (language, memoData) =>
  memoData.version ? (
    <div>
      <h3>{language === 'sv' ? swedishTranslations.versionTitle : englishTranslations.versionTitle}</h3>
      <div dangerouslySetInnerHTML={{ __html: memoData.version }} />
    </div>
  ) : (
    <div>
      <h3>{language === 'sv' ? swedishTranslations.versionTitle : englishTranslations.versionTitle}</h3>
      <p>{language === 'sv' ? swedishTranslations.mandatoryFieldMissing : englishTranslations.mandatoryFieldMissing}</p>
    </div>
  )

const languageOfInstruction = (language, memoData) =>
  memoData.languageOfInstructions ? (
    <div>
      <h3>
        {language === 'sv'
          ? swedishTranslations.languageOfInstructionTitle
          : englishTranslations.languageOfInstructionTitle}
      </h3>
      <div dangerouslySetInnerHTML={{ __html: memoData.languageOfInstructions }} />
    </div>
  ) : (
    <div>
      <h3>
        {language === 'sv'
          ? swedishTranslations.languageOfInstructionTitle
          : englishTranslations.languageOfInstructionTitle}
      </h3>
      <p>{language === 'sv' ? swedishTranslations.mandatoryFieldMissing : englishTranslations.mandatoryFieldMissing}</p>
    </div>
  )

const CourseFacts = ({ language = 'sv', memoData = {} }) => (
  <div>
    <div className="text-break" style={{ backgroundColor: '#f4f4f4' }}>
      {version(language, memoData)}
      {languageOfInstruction(language, memoData)}
    </div>
  </div>
)

export default CourseFacts
