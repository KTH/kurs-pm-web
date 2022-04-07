import React from 'react'
import i18n from '../../../../i18n'
import { ExtraHeaderHead } from './ContentHead'
import HtmlWrapper from './HtmlWrapper'
import { useWebContext } from '../context/WebContext'

function ContentFromNewSectionEditor(props) {
  const [webContext] = useWebContext()
  const { userLanguageIndex = 1 } = webContext
  const {
    initialValue: contentFromEditor = '',
    initialTitle: contentForTitle = '',
    isEmptyNew = false,
    visibleInMemo,
  } = props

  const { sourceInfo } = i18n.messages[userLanguageIndex]

  return (
    <article className="Add--New--Title--And--Info" aria-label={contentForTitle}>
      {!isEmptyNew && <ExtraHeaderHead header={contentForTitle} />}

      {!isEmptyNew &&
        /* is included in memo, preview text without editor */
        ((visibleInMemo && (
          <HtmlWrapper
            html={(contentFromEditor !== '' && contentFromEditor) || `<p><i>${sourceInfo.noInfoYet}</i></p>`}
          />
        )) ||
          /* editor has content but is not yet included in pm */
          (contentFromEditor !== '' && (
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
