export const headingAllowedToBeShownEvenIfNoContent = (isRequired, type) => {
  const mandatoryTypes = ['mandatory', 'mandatoryAndEditable']
  return isRequired && mandatoryTypes.includes(type)
}

const headingHasContent = contentHtml => contentHtml !== undefined && contentHtml !== ''

export const headingShouldBeShown = ({ isRequired, type, contentHtml, visibleInMemo = true }) => {
  if (headingHasContent(contentHtml) || headingAllowedToBeShownEvenIfNoContent(isRequired, type)) {
    return visibleInMemo
  }

  return false
}

const headingHasAtLeastOneVisibleExtraHeader = (extraHeaderTitle, extraHeaderTitles) => {
  if (extraHeaderTitle && extraHeaderTitles && Array.isArray(extraHeaderTitles)) {
    return extraHeaderTitles.some(({ visibleInMemo }) => visibleInMemo)
  }

  return false
}

const sectionsToSkip = ['contacts']

export const getAllSectionsAndHeadingsToShow = ({ sections, context, memoData }) => {
  const sectionsAndHeadings = []
  sections
    .filter(({ id }) => !sectionsToSkip.includes(id))
    .forEach(({ id, content, extraHeaderTitle }) => {
      sectionsAndHeadings[id] = []
      const headings = []

      content.forEach(contentId => {
        const { isRequired, type } = context[contentId]
        const contentHtml = memoData[contentId]
        const visibleInMemo = memoData.visibleInMemo[contentId]

        if (headingShouldBeShown({ isRequired, type, contentHtml, visibleInMemo })) {
          headings.push(contentId)
        }
      })

      const hasExtraHeading = headingHasAtLeastOneVisibleExtraHeader(extraHeaderTitle, memoData[extraHeaderTitle])

      const hasHeadingOrExtraHeading = headings.length > 0 || hasExtraHeading

      sectionsAndHeadings.push({
        id,
        headings,
        hasHeadingOrExtraHeading,
        extraHeaderTitle: hasExtraHeading ? extraHeaderTitle : undefined,
      })
    })

  return sectionsAndHeadings
}
