import { headingShouldBeShown } from '../AllSectionsUtils'

describe('headingShouldBeShown', () => {
  test.each([
    { isRequired: true, type: 'mandatory', contentHtml: 'someContent', visibleInMemo: true },
    { isRequired: true, type: 'mandatory', contentHtml: 'someContent', visibleInMemo: false },
    { isRequired: true, type: 'mandatory', contentHtml: '', visibleInMemo: true },
    { isRequired: true, type: 'mandatory', contentHtml: '', visibleInMemo: false },
    { isRequired: true, type: 'mandatoryAndEditable', contentHtml: 'someContent', visibleInMemo: true },
    { isRequired: true, type: 'mandatoryAndEditable', contentHtml: 'someContent', visibleInMemo: false },
    { isRequired: true, type: 'mandatoryAndEditable', contentHtml: '', visibleInMemo: true },
    { isRequired: true, type: 'mandatoryAndEditable', contentHtml: '', visibleInMemo: false },
  ])(
    'if isRequired and type is mandatory or mandatoryAndEditable, return visibleInMemo, regardless if contentHTML is empty or not',
    params => {
      expect(headingShouldBeShown(params)).toBe(params.visibleInMemo)
    }
  )

  test.each([
    { isRequired: true, type: 'mandatory', contentHtml: 'someContent', visibleInMemo: undefined },
    { isRequired: true, type: 'mandatory', contentHtml: '', visibleInMemo: undefined },
    { isRequired: true, type: 'mandatoryAndEditable', contentHtml: 'someContent', visibleInMemo: undefined },
    { isRequired: true, type: 'mandatoryAndEditable', contentHtml: '', visibleInMemo: undefined },
  ])(
    'if isRequired, type is mandatory or mandatoryAndEditable and visibleInMemo is undefined, return true, regardless if contentHTML is empty or not',
    params => {
      expect(headingShouldBeShown(params)).toBe(true)
    }
  )

  test.each([
    { isRequired: true, type: 'mandatoryForSome', contentHtml: '', visibleInMemo: true },
    { isRequired: true, type: 'mandatoryForSome', contentHtml: '', visibleInMemo: false },
    { isRequired: true, type: 'mandatoryForSome', contentHtml: '', visibleInMemo: undefined },
    { isRequired: true, type: 'mandatoryForSome', contentHtml: undefined, visibleInMemo: true },
    { isRequired: true, type: 'mandatoryForSome', contentHtml: undefined, visibleInMemo: false },
    { isRequired: true, type: 'mandatoryForSome', contentHtml: undefined, visibleInMemo: undefined },
  ])('if is required, and mandatoryForSome but no contentHTML, should return false', params => {
    expect(headingShouldBeShown(params)).toBe(false)
  })

  test.each([
    { isRequired: true, type: 'mandatoryForSome', contentHtml: 'someContent', visibleInMemo: true },
    { isRequired: true, type: 'somethingElse', contentHtml: 'someContent', visibleInMemo: true },
    { isRequired: false, type: 'mandatory', contentHtml: 'someContent', visibleInMemo: true },
    { isRequired: false, type: 'mandatoryForSome', contentHtml: 'someContent', visibleInMemo: true },
    { isRequired: false, type: 'mandatoryAndEditable', contentHtml: 'someContent', visibleInMemo: true },
    { isRequired: false, type: 'somethingElse', contentHtml: 'someContent', visibleInMemo: true },
    { isRequired: undefined, type: 'mandatory', contentHtml: 'someContent', visibleInMemo: true },
    { isRequired: undefined, type: 'mandatoryForSome', contentHtml: 'someContent', visibleInMemo: true },
    { isRequired: undefined, type: 'mandatoryAndEditable', contentHtml: 'someContent', visibleInMemo: true },
    { isRequired: undefined, type: 'somethingElse', contentHtml: 'someContent', visibleInMemo: true },
  ])('if visibleInMemo and has content, return true regardless of isRequired and type', params => {
    expect(headingShouldBeShown(params)).toBe(true)
  })

  test.each([
    { isRequired: true, type: 'mandatoryForSome', contentHtml: 'someContent', visibleInMemo: undefined },
    { isRequired: true, type: 'somethingElse', contentHtml: 'someContent', visibleInMemo: undefined },
    { isRequired: false, type: 'mandatory', contentHtml: 'someContent', visibleInMemo: undefined },
    { isRequired: false, type: 'mandatoryForSome', contentHtml: 'someContent', visibleInMemo: undefined },
    { isRequired: false, type: 'mandatoryAndEditable', contentHtml: 'someContent', visibleInMemo: undefined },
    { isRequired: false, type: 'somethingElse', contentHtml: 'someContent', visibleInMemo: undefined },
    { isRequired: undefined, type: 'mandatory', contentHtml: 'someContent', visibleInMemo: undefined },
    { isRequired: undefined, type: 'mandatoryForSome', contentHtml: 'someContent', visibleInMemo: undefined },
    { isRequired: undefined, type: 'mandatoryAndEditable', contentHtml: 'someContent', visibleInMemo: undefined },
    { isRequired: undefined, type: 'somethingElse', contentHtml: 'someContent', visibleInMemo: undefined },
  ])('if visibleInMemo is undefined and has content, return true regardless of isRequired and type', params => {
    expect(headingShouldBeShown(params)).toBe(true)
  })

  test.each([
    { isRequired: true, type: 'mandatoryForSome', contentHtml: 'someContent', visibleInMemo: false },
    { isRequired: true, type: 'somethingElse', contentHtml: 'someContent', visibleInMemo: false },
    { isRequired: true, type: 'somethingElse', contentHtml: '', visibleInMemo: false },
    { isRequired: false, type: 'mandatory', contentHtml: 'someContent', visibleInMemo: false },
    { isRequired: false, type: 'mandatory', contentHtml: '', visibleInMemo: false },
    { isRequired: false, type: 'mandatoryForSome', contentHtml: 'someContent', visibleInMemo: false },
    { isRequired: false, type: 'mandatoryForSome', contentHtml: '', visibleInMemo: false },
    { isRequired: false, type: 'mandatoryAndEditable', contentHtml: 'someContent', visibleInMemo: false },
    { isRequired: false, type: 'mandatoryAndEditable', contentHtml: '', visibleInMemo: false },
    { isRequired: false, type: 'somethingElse', contentHtml: 'someContent', visibleInMemo: false },
    { isRequired: false, type: 'somethingElse', contentHtml: '', visibleInMemo: false },
    { isRequired: undefined, type: 'mandatory', contentHtml: 'someContent', visibleInMemo: false },
    { isRequired: undefined, type: 'mandatory', contentHtml: '', visibleInMemo: false },
    { isRequired: undefined, type: 'mandatoryForSome', contentHtml: 'someContent', visibleInMemo: false },
    { isRequired: undefined, type: 'mandatoryForSome', contentHtml: '', visibleInMemo: false },
    { isRequired: undefined, type: 'mandatoryAndEditable', contentHtml: 'someContent', visibleInMemo: false },
    { isRequired: undefined, type: 'mandatoryAndEditable', contentHtml: '', visibleInMemo: false },
    { isRequired: undefined, type: 'somethingElse', contentHtml: 'someContent', visibleInMemo: false },
    { isRequired: undefined, type: 'somethingElse', contentHtml: '', visibleInMemo: false },
  ])('if visibleInMemo is false, return false regardless of isRequired, type and contentHTML', params => {
    expect(headingShouldBeShown(params)).toBe(false)
  })

  test.each([
    { isRequired: undefined, type: 'mandatory', contentHtml: '', visibleInMemo: true },
    { isRequired: undefined, type: 'mandatory', contentHtml: '', visibleInMemo: undefined },
    { isRequired: undefined, type: 'mandatoryForSome', contentHtml: '', visibleInMemo: true },
    { isRequired: undefined, type: 'mandatoryForSome', contentHtml: '', visibleInMemo: undefined },
    { isRequired: undefined, type: 'mandatoryAndEditable', contentHtml: '', visibleInMemo: true },
    { isRequired: undefined, type: 'mandatoryAndEditable', contentHtml: '', visibleInMemo: undefined },
    { isRequired: undefined, type: 'somethingElse', contentHtml: '', visibleInMemo: true },
    { isRequired: undefined, type: 'somethingElse', contentHtml: '', visibleInMemo: undefined },
  ])('if isRequired is undefined (false) and contentHtml is empty, return false', params => {
    expect(headingShouldBeShown(params)).toBe(false)
  })

  test.each([
    { isRequired: false, type: 'somethingElse', contentHtml: '', visibleInMemo: true },
    { isRequired: false, type: 'somethingElse', contentHtml: '', visibleInMemo: undefined },
    { isRequired: true, type: 'somethingElse', contentHtml: '', visibleInMemo: true },
    { isRequired: true, type: 'somethingElse', contentHtml: '', visibleInMemo: undefined },
  ])('if type is somethingElse and contentHtml is empty, return false', params => {
    expect(headingShouldBeShown(params)).toBe(false)
  })

  test.each([
    { isRequired: false, type: 'mandatory', contentHtml: '', visibleInMemo: true },
    { isRequired: false, type: 'mandatory', contentHtml: '', visibleInMemo: undefined },
    { isRequired: false, type: 'mandatoryForSome', contentHtml: '', visibleInMemo: true },
    { isRequired: false, type: 'mandatoryForSome', contentHtml: '', visibleInMemo: undefined },
    { isRequired: false, type: 'mandatoryAndEditable', contentHtml: '', visibleInMemo: true },
    { isRequired: false, type: 'mandatoryAndEditable', contentHtml: '', visibleInMemo: undefined },
  ])('if isRequired is false, type is one of the special types and contentHtml is empty, return false', params => {
    expect(headingShouldBeShown(params)).toBe(false)
  })
})
