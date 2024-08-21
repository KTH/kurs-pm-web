import React from 'react'
import i18n from '../../../../i18n'
import { ExtraHeaderHead } from './ContentHead'
import HtmlWrapper from './HtmlWrapper'

function ContentFromNewSectionEditor({ htmlContent = '', title = '', memoLanguageIndex = 0 /* en */ }) {
  const { noInfoYet } = i18n.messages[memoLanguageIndex].sourceInfo

  return (
    <article aria-label={title}>
      <ExtraHeaderHead header={title} />
      <HtmlWrapper html={htmlContent || `<p><i>${noInfoYet}</i></p>`} />
    </article>
  )
}
export default ContentFromNewSectionEditor
