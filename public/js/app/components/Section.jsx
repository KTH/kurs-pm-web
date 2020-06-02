/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-danger */
import React from 'react'
import { ContentHead, SubSectionHeaderMessage } from './ContentHead'
import i18n from '../../../../i18n'
import { context } from '../util/fieldsByType'

const Section = ({ contentId, menuId, visibleInMemo, html, memoLangIndex }) => {
  const { nothingFetched, addedSubSection } = i18n.messages[memoLangIndex].sourceInfo
  const fromSyllabus = {
    main: context[contentId].source === '(s)' && contentId !== 'examination' && contentId !== 'ethicalApproach',
    subHeader: contentId === 'examination' || contentId === 'permanentDisability' || contentId === 'ethicalApproach'
  }
  const isAddedSubSection = context[contentId].hasParentTitle
  return (
    <span id={menuId} key={contentId}>
      {isAddedSubSection ? (
        <SubSectionHeaderMessage message={addedSubSection} />
      ) : (
        <ContentHead contentId={contentId} memoLangIndex={memoLangIndex} fromSyllabus={fromSyllabus} />
      )}
      <span
        style={visibleInMemo ? {} : { display: 'none' }}
        dangerouslySetInnerHTML={{
          __html: html || `<p><i>${nothingFetched[context[contentId].type]}</i></p>`
        }}
      />
    </span>
  )
}

export default Section
