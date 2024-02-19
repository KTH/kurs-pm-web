import React from 'react'
import i18n from '../../../../i18n'
import { context } from '../util/fieldsByType'
import { ContentHead, SubSectionHeaderMessage } from './ContentHead'
import HtmlWrapper from './HtmlWrapper'

const Section = ({ contentId, menuId, visibleInMemo, html, memoLangIndex = 0 /* en */ }) => {
  const { noInfoYet, insertedSubSection } = i18n.messages[memoLangIndex].sourceInfo
  const fromSyllabus = {
    is: context[contentId].source === '(s)',
    subHeader: contentId === 'examination' || contentId === 'ethicalApproach',
  }
  const isAddedSubSection = context[contentId].hasParentTitle && contentId !== 'permanentDisabilitySubSection'
  return (
    <article id={menuId} key={contentId} aria-labelledby={isAddedSubSection ? null : contentId}>
      {isAddedSubSection ? (
        <SubSectionHeaderMessage message={insertedSubSection} />
      ) : (
        <ContentHead contentId={contentId} memoLangIndex={memoLangIndex} fromSyllabus={fromSyllabus} />
      )}
      {visibleInMemo && <HtmlWrapper mode="inline" html={html || `<p><i>${noInfoYet}</i></p>`} />}
    </article>
  )
}

export default Section
