export const routerStore = {
  activeMemoEndPoint: (id) => false,
  noMemoData: () => false,
  browserConfig: { imageStorageUri: 'localhost://' },
  memoData: {
    courseTitle: '',
    visibleInMemo: {}
  },
  memoDatas: [
    {
      semester: '',
      ladokRoundIds: [],
      memoCommonLangAbbr: ''
    }
  ],
  memoLanguageIndex: 0,
  userLanguageIndex: 0,
  roundIds: []
}
