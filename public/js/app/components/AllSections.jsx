import React from 'react'
import Alert from '../components-shared/Alert'

import i18n from '../../../../i18n'
import { standardSections } from '../util/sectionAndHeaderUtils'
import { getAllSectionsAndHeadingsToShow, MemoViewMode } from '../util/visibilityUtils'

import Section from './Section'
import ContentFromNewSectionEditor from './ContentFromNewSectionEditor'

function AllSections({ memoData, memoLanguageIndex }) {
  if (!memoData || Object.keys(memoData).length === 0) {
    return <Alert color="info">{i18n.messages[memoLanguageIndex].messages.noPublishedMemo}</Alert>
  }
  const { sectionsLabels } = i18n.messages[memoLanguageIndex]
  const { noInfoYet } = i18n.messages[memoLanguageIndex].sourceInfo

  const sectionsAndContent = getAllSectionsAndHeadingsToShow({
    sections: standardSections,
    memoData,
    mode: MemoViewMode.Published,
  })

  return sectionsAndContent.map(({ id, standardHeadingIds, extraHeaderTitle, extraHeadingIndices, isEmptySection }) => {
    if (isEmptySection) {
      return <EmptySection key={id} id={id} sectionsLabels={sectionsLabels} noInfoYet={noInfoYet} />
    }

    return (
      <SectionWrapper key={id} id={id} sectionsLabels={sectionsLabels}>
        <Sections headings={standardHeadingIds} id={id} memoData={memoData} memoLanguageIndex={memoLanguageIndex} />
        <ExtraHeaders
          headingIndices={extraHeadingIndices}
          extraHeaderTitle={extraHeaderTitle}
          memoData={memoData}
          memoLanguageIndex={memoLanguageIndex}
        />
      </SectionWrapper>
    )
  })
}

export default AllSections

const EmptySection = ({ id, sectionsLabels, noInfoYet }) => (
  <SectionWrapper id={id} sectionsLabels={sectionsLabels}>
    <article>
      <p>
        <i>{noInfoYet}</i>
      </p>
    </article>
  </SectionWrapper>
)

const SectionWrapper = ({ id, sectionsLabels, children }) => (
  <section key={id} aria-labelledby={id} className="section-wrapper">
    <h2 id={id} key={'header-' + id}>
      {sectionsLabels[id]}
    </h2>
    {children}
  </section>
)

const Sections = ({ headings, id, memoData, memoLanguageIndex }) =>
  headings.map(contentId => {
    const menuId = id + '-' + contentId
    const htmlContent = memoData[contentId]
    return (
      <Section
        memoLangIndex={memoLanguageIndex}
        contentId={contentId}
        menuId={menuId}
        key={contentId}
        htmlContent={htmlContent}
      />
    )
  })

const ExtraHeaders = ({ headingIndices, extraHeaderTitle, memoData, memoLanguageIndex }) =>
  headingIndices.map(index => {
    const { uKey, title, htmlContent } = memoData[extraHeaderTitle]?.[index] || {}
    return (
      <ContentFromNewSectionEditor
        key={uKey}
        title={title}
        htmlContent={htmlContent}
        memoLanguageIndex={memoLanguageIndex}
      />
    )
  })
