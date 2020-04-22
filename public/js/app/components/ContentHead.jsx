import React from 'react'
import i18n from '../../../../i18n'

export const ContentHead = ({ contentId, memoLangIndex }) => {
  const { memoTitlesByMemoLang } = i18n.messages[memoLangIndex]
  return (
    <h3>
      {memoTitlesByMemoLang[contentId]}
      <sup />
    </h3>
  )
}

export const ExtraHeaderHead = ({ header }) => (
  <h3>
    {header}
    <sup />
  </h3>
)
