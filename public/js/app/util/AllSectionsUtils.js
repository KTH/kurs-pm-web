const sectionAllowedToBeShownEvenIfNoContent = (isRequired, type) => {
  const mandatoryTypes = ['mandatory', 'mandatoryAndEditable']
  return isRequired && mandatoryTypes.includes(type)
}

const sectionHasContent = contentHtml => contentHtml !== undefined && contentHtml !== ''

export const sectionShouldBeShown = ({ isRequired, type, contentHtml, visibleInMemo = true }) => {
  if (sectionHasContent(contentHtml) || sectionAllowedToBeShownEvenIfNoContent(isRequired, type)) {
    return visibleInMemo
  }

  return false
}
