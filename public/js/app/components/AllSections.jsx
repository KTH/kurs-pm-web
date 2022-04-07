import React from 'react'
import { Alert } from 'reactstrap'

import i18n from '../../../../i18n'
import { context, sections } from '../util/fieldsByType'
import { EMPTY } from '../util/constants'

import Section from './Section'
import ContentFromNewSectionEditor from './ContentFromNewSectionEditor'

function AllSections({ memoData, memoLanguageIndex }) {
  if (!memoData || Object.keys(memoData).length === 0) {
    return <Alert color="info">{i18n.messages[memoLanguageIndex].messages.noPublishedMemo}</Alert>
  }
  const { sectionsLabels } = i18n.messages[memoLanguageIndex]

  // TODO Refactor logic for visible sections
  const sectionsWithContent = []
  sections.forEach(({ id, content, extraHeaderTitle }) => {
    content.forEach(contentId => {
      const { isRequired, type } = context[contentId]
      let contentHtml = memoData[contentId]
      let visibleInMemo = memoData.visibleInMemo[contentId]
      if (typeof visibleInMemo === 'undefined') {
        visibleInMemo = true
      }

      if (isRequired && (type === 'mandatory' || type === 'mandatoryAndEditable') && !contentHtml) {
        contentHtml = EMPTY[memoLanguageIndex]
      } else if (isRequired && type === 'mandatoryForSome' && !contentHtml) {
        visibleInMemo = false
      } else if (!contentHtml) {
        visibleInMemo = false
      }
      if (visibleInMemo && !sectionsWithContent.includes(id)) {
        sectionsWithContent.push(id)
      }
    })

    if (extraHeaderTitle && Array.isArray(memoData[extraHeaderTitle])) {
      memoData[extraHeaderTitle].forEach(m => {
        if (m.visibleInMemo && !sectionsWithContent.includes(id)) {
          sectionsWithContent.push(id)
        }
      })
    }
  })

  // TODO Refactor logic for visible sections
  return sections.map(({ id, content, extraHeaderTitle }) => {
    if (!sectionsWithContent.includes(id)) {
      return (
        <section key={id} aria-labelledby={id}>
          <h2 id={id} key={'header-' + id}>
            {sectionsLabels[id]}
          </h2>
          <p>
            <i>{EMPTY[memoLanguageIndex]}</i>
          </p>
        </section>
      )
    }

    return (
      id !== 'contacts' && (
        <section key={id} aria-labelledby={id}>
          <h2 id={id} key={'header-' + id}>
            {sectionsLabels[id]}
          </h2>
          {content.map(contentId => {
            const menuId = id + '-' + contentId

            const { isRequired, type } = context[contentId]
            let contentHtml = memoData[contentId]
            let visibleInMemo = memoData.visibleInMemo[contentId]
            if (typeof visibleInMemo === 'undefined') {
              visibleInMemo = true
            }

            if (isRequired && (type === 'mandatory' || type === 'mandatoryAndEditable') && !contentHtml) {
              contentHtml = EMPTY[memoLanguageIndex]
            } else if (isRequired && type === 'mandatoryForSome' && !contentHtml) {
              visibleInMemo = false
            } else if (!contentHtml) {
              visibleInMemo = false
            }

            return (
              visibleInMemo && (
                <Section
                  memoLangIndex={memoLanguageIndex}
                  contentId={contentId}
                  menuId={menuId}
                  key={contentId}
                  visibleInMemo={visibleInMemo}
                  html={contentHtml}
                />
              )
            )
          })}
          {extraHeaderTitle &&
            Array.isArray(memoData[extraHeaderTitle]) &&
            memoData[extraHeaderTitle].map(({ title, htmlContent, visibleInMemo, isEmptyNew, uKey }) => (
              <ContentFromNewSectionEditor
                contentId={extraHeaderTitle}
                key={uKey}
                initialTitle={title}
                initialValue={htmlContent}
                visibleInMemo={visibleInMemo}
                isEmptyNew={isEmptyNew}
                uKey={uKey}
                onEditorChange={() => {}}
                onBlur={() => {}}
                onRemove={() => {}}
              />
            ))}
        </section>
      )
    )
  })
}

export default AllSections
