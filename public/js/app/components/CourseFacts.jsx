/* eslint-disable react/no-danger */
import React from 'react'
import i18n from '../../../../i18n'

const englishTranslations = i18n.messages[0].messages
const swedishTranslations = i18n.messages[1].messages

const linkToSchool = (name = '') => `https://www.kth.se/${name.toLowerCase().split('/')[0]}`

const formatVersion = (language = 'sv', version) => {
  const unixTime = Date.parse(version)
  if (unixTime) {
    const locale = language === 'sv' ? 'sv-SE' : 'en-US'
    return new Date(unixTime).toLocaleString(locale)
  }
  return null
}

const version = (language, memoVersion) =>
  memoVersion ? (
    <div>
      <h3>{language === 'sv' ? swedishTranslations.versionTitle : englishTranslations.versionTitle}</h3>
      <p>{formatVersion(language, memoVersion)}</p>
    </div>
  ) : (
    <div>
      <h3>{language === 'sv' ? swedishTranslations.versionTitle : englishTranslations.versionTitle}</h3>
      <p>{language === 'sv' ? swedishTranslations.mandatoryFieldMissing : englishTranslations.mandatoryFieldMissing}</p>
    </div>
  )

const offeredBy = (language, department) =>
  department.name ? (
    <div>
      <h3>{language === 'sv' ? swedishTranslations.offeredByTitle : englishTranslations.offeredByTitle}</h3>
      <p>
        <a href={linkToSchool(department.name)}>{department.name}</a>
      </p>
    </div>
  ) : (
    <div>
      <h3>{language === 'sv' ? swedishTranslations.versionTitle : englishTranslations.versionTitle}</h3>
      <p>{language === 'sv' ? swedishTranslations.mandatoryFieldMissing : englishTranslations.mandatoryFieldMissing}</p>
    </div>
  )

const languageOfInstruction = (language, memoLanguageOfInstructions) =>
  memoLanguageOfInstructions ? (
    <div>
      <h3>
        {language === 'sv'
          ? swedishTranslations.languageOfInstructionTitle
          : englishTranslations.languageOfInstructionTitle}
      </h3>
      <p>{memoLanguageOfInstructions}</p>
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

const CourseFacts = ({ language = 'sv', department = {}, memoData = {} }) => (
  <div className="text-break" style={{ backgroundColor: '#f4f4f4' }}>
    {version(language, memoData.lastChangeDate)}
    {offeredBy(language, department)}
    {languageOfInstruction(language, memoData.languageOfInstructions)}
  </div>
)

export default CourseFacts
