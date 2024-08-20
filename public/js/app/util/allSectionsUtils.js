const isMandatory = type => type === 'mandatory' || type === 'mandatoryAndEditable'

const isMandatoryForSome = type => type === 'mandatoryForSome'

const isStoredAsVisibleInDB = (contentId, memoData) => memoData?.visibleInMemo?.[contentId] === true

const htmlHasContent = contentHtml => contentHtml !== undefined && contentHtml !== ''

export const isStandardHeadingVisibleInPublished = (contentId, context, memoData) => {
  const { type } = context[contentId]
  const htmlContent = memoData[contentId]

  const mandatory = isMandatory(type)
  const mandatoryForSomeOrStoredAsVisible = isMandatoryForSome(type) || isStoredAsVisibleInDB(contentId, memoData)

  return mandatory || (htmlHasContent(htmlContent) && mandatoryForSomeOrStoredAsVisible)
}

export const isExtraHeadingVisibleInPublished = (extraHeaderTitle, index, memoData) => {
  const headingObject = memoData[extraHeaderTitle]?.[index]
  const { visibleInMemo, htmlContent } = headingObject
  const storedAsVisible = visibleInMemo === true

  return storedAsVisible && htmlHasContent(htmlContent)
}

const sectionsToSkip = ['contacts']

export const getAllSectionsAndHeadingsToShow = ({ sections, context, memoData }) => {
  const sectionsAndHeadings = []
  sections
    .filter(({ id }) => !sectionsToSkip.includes(id))
    .forEach(({ id, content, extraHeaderTitle }) => {
      sectionsAndHeadings[id] = []
      const standardHeadingIds = []
      const extraHeadingIndices = []

      content.forEach(contentId => {
        const visibleInMemo = isStandardHeadingVisibleInPublished(contentId, context, memoData)

        if (visibleInMemo) {
          standardHeadingIds.push(contentId)
        }
      })

      memoData[extraHeaderTitle]?.forEach((headingObject, index) => {
        const visibleInMemo = isExtraHeadingVisibleInPublished(extraHeaderTitle, index, memoData)

        if (visibleInMemo) {
          extraHeadingIndices.push(index)
        }
      })

      const isEmptySection = standardHeadingIds.length === 0 && extraHeadingIndices.length === 0

      sectionsAndHeadings.push({
        id,
        standardHeadingIds,
        extraHeaderTitle,
        extraHeadingIndices,
        isEmptySection,
      })
    })

  return sectionsAndHeadings
}
