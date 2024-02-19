import React from 'react'
import i18n from '../../../../i18n'
import { useWebContext } from '../context/WebContext'
import { ExtraHeaderHead } from './ContentHead'
import HtmlWrapper from './HtmlWrapper'

function ContentFromNewSectionEditor({ htmlContent = '', title = '', isEmptyNew = false, visibleInMemo }) {
  const [webContext] = useWebContext()
  const { userLanguageIndex = 1 } = webContext

  const { sourceInfo } = i18n.messages[userLanguageIndex]

  return (
    <article aria-label={title}>
      {!isEmptyNew && <ExtraHeaderHead header={title} />}

      {!isEmptyNew &&
        /* is included in memo, preview text without editor */
        ((visibleInMemo && (
          <HtmlWrapper html={(htmlContent !== '' && htmlContent) || `<p><i>${sourceInfo.noInfoYet}</i></p>`} />
        )) ||
          /* editor has content but is not yet included in pm */
          (htmlContent !== '' && (
            <span>
              <p>
                <i>{sourceInfo.noInfoYet}</i>
              </p>
            </span>
          )))}
    </article>
  )
}
export default ContentFromNewSectionEditor
