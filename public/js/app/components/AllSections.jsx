import React from 'react'
import { Alert } from 'reactstrap'

import i18n from '../../../../i18n'
import { context, sections } from '../util/fieldsByType'
import { EMPTY } from '../util/constants'
import { getAllSectionsAndHeadingsToShow, headingAllowedToBeShownEvenIfNoContent } from '../util/AllSectionsUtils'

import Section from './Section'
import ContentFromNewSectionEditor from './ContentFromNewSectionEditor'

function AllSections({ memoData, memoLanguageIndex }) {
  if (!memoData || Object.keys(memoData).length === 0) {
    return <Alert color="info">{i18n.messages[memoLanguageIndex].messages.noPublishedMemo}</Alert>
  }
  const { sectionsLabels } = i18n.messages[memoLanguageIndex]

  const sectionsAndContent = getAllSectionsAndHeadingsToShow({ sections, context, memoData })

  return sectionsAndContent.map(({ id, headings, hasHeadingOrExtraHeading, extraHeaderTitle }) => {
    if (!hasHeadingOrExtraHeading) {
      return <EmptySection key={id} id={id} sectionsLabels={sectionsLabels} memoLanguageIndex={memoLanguageIndex} />
    }

    return (
      <SectionWrapper key={id} id={id} sectionsLabels={sectionsLabels}>
        <Sections headings={headings} id={id} memoData={memoData} memoLanguageIndex={memoLanguageIndex} />

        <ExtraHeaders extraHeaderTitle={extraHeaderTitle} memoData={memoData} />
      </SectionWrapper>
    )
  })
}

export default AllSections

const EmptySection = ({ id, sectionsLabels, memoLanguageIndex }) => (
  <SectionWrapper id={id} sectionsLabels={sectionsLabels}>
    <p>
      <i>{EMPTY[memoLanguageIndex]}</i>
    </p>
  </SectionWrapper>
)

const SectionWrapper = ({ id, sectionsLabels, children }) => (
  <section key={id} aria-labelledby={id}>
    <h2 id={id} key={'header-' + id}>
      {sectionsLabels[id]}
    </h2>
    {children}
  </section>
)

const Sections = ({ headings, id, memoData, memoLanguageIndex }) =>
  headings.map(contentId => {
    const menuId = id + '-' + contentId

    const { isRequired, type } = context[contentId]
    let contentHtml = memoData[contentId]

    if (headingAllowedToBeShownEvenIfNoContent(isRequired, type) && !contentHtml) {
      contentHtml = EMPTY[memoLanguageIndex]
    }

    return (
      <Section
        memoLangIndex={memoLanguageIndex}
        contentId={contentId}
        menuId={menuId}
        key={contentId}
        visibleInMemo={true}
        html={contentHtml}
      />
    )
  })

const ExtraHeaders = ({ extraHeaderTitle, memoData }) => {
  if (!extraHeaderTitle) {
    return null
  }

  return memoData[extraHeaderTitle].map(({ title, htmlContent, visibleInMemo, isEmptyNew, uKey }) => (
    <ContentFromNewSectionEditor
      key={uKey}
      title={title}
      htmlContent={htmlContent}
      isEmptyNew={isEmptyNew}
      visibleInMemo={visibleInMemo}
    />
  ))
}
