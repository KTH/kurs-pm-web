import { getStandardContentVisibility, getExtraContentVisibility, MemoViewMode } from '../visibilityUtils'

const memoData = {
  courseContent: '<p>Some text</p>',
  literature: '',
  learningActivities: '',
  scheduleDetails: '<p>Some text</p>',
  prerequisites: '',
  additionalRegulations: '',
  otherRequirementsForFinalGrade: '<p>Some text</p>',
  examinationSubSection: '<p>Some text</p>',
  ethicalApproachSubSection: '',
  permanentDisabilitySubSection: '<p>Some text</p>',
  extraHeaders1: [
    { title: 'Extra Heading 1', htmlContent: '', visibleInMemo: true },
    { title: 'Extra Heading 2', htmlContent: '<p>Some text</p>', visibleInMemo: true },
    { title: 'Extra Heading 3', htmlContent: '<p>Some text</p>', visibleInMemo: false },
  ],
  extraHeaders2: [],
  visibleInMemo: {
    prerequisites: true,
    permanentDisabilitySubSection: false,
    additionalRegulations: true,
    examinationSubSection: true,
    ethicalApproachSubSection: true,
  },
}

describe('getStandardContentVisibility for published', () => {
  test.each(['courseContent', 'literature'])(
    'if type is mandatory or mandatoryAndEditable or mandatoryAndEditableWithoutDefault, return true',
    contentId => {
      const visibleInMemo = getStandardContentVisibility(contentId, memoData, MemoViewMode.Published)
      expect(visibleInMemo).toBe(true)
    }
  )

  describe('if type is not mandatory or mandatoryAndEditable or mandatoryAndEditableWithoutDefault', () => {
    test.each(['learningActivities', 'prerequisites', 'ethicalApproachSubSection', 'additionalRegulations'])(
      'if html does not have content, return false',
      contentId => {
        const visibleInMemo = getStandardContentVisibility(contentId, memoData, MemoViewMode.Published)
        expect(visibleInMemo).toBe(false)
      }
    )

    test.each(['otherRequirementsForFinalGrade'])(
      'if html has content and type is mandatoryForSome, return true',
      contentId => {
        const visibleInMemo = getStandardContentVisibility(contentId, memoData, MemoViewMode.Published)
        expect(visibleInMemo).toBe(true)
      }
    )

    test.each(['examinationSubSection'])(
      'if html has content and visibility is stored as true in db, return true',
      contentId => {
        const visibleInMemo = getStandardContentVisibility(contentId, memoData, MemoViewMode.Published)
        expect(visibleInMemo).toBe(true)
      }
    )

    test.each(['scheduleDetails'])(
      'if html has content, visibility is not stored or is stored as false in db and type is not mandatoryForSome, return false',
      contentId => {
        const visibleInMemo = getStandardContentVisibility(contentId, memoData, MemoViewMode.Published)
        expect(visibleInMemo).toBe(false)
      }
    )
  })
})

describe('getExtraContentVisibility for published', () => {
  test.each([{ extraHeaderTitle: 'extraHeaders1', index: 0 }])(
    'if html does not have content and visibility is stored as true in db, return false',
    ({ extraHeaderTitle, index }) => {
      const visibleInMemo = getExtraContentVisibility(extraHeaderTitle, index, memoData, MemoViewMode.Published)
      expect(visibleInMemo).toBe(false)
    }
  )

  test.each([{ extraHeaderTitle: 'extraHeaders1', index: 1 }])(
    'if html has content and visibility is stored as true in db, return true',
    ({ extraHeaderTitle, index }) => {
      const visibleInMemo = getExtraContentVisibility(extraHeaderTitle, index, memoData, MemoViewMode.Published)
      expect(visibleInMemo).toBe(true)
    }
  )

  test.each([{ extraHeaderTitle: 'extraHeaders1', index: 2 }])(
    'if html has content and visibility is stored as false in db, return false',
    ({ extraHeaderTitle, index }) => {
      const visibleInMemo = getExtraContentVisibility(extraHeaderTitle, index, memoData, MemoViewMode.Published)
      expect(visibleInMemo).toBe(false)
    }
  )
})
