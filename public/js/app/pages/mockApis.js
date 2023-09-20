export const mockMixKursPmDataApi = () => ({
  20192: [
    {
      courseCode: 'KIP2720',
      courseMemoFileName: 'memo-KIP272020192-14341833da79.pdf',
      applicationCodes: ['2'],
      semester: '20192',
      isPdf: true,
      state: 'FULL',
    },
    {
      courseCode: 'KIP2720',
      applicationCodes: ['1'],
      semester: '20192',
      memoEndPoint: 'KIP272020192-1',
      memoCommonLangAbbr: 'en',
      memoName: 'Autumn 2019-1 (Start date 26/08/2019, English)',
      isPdf: false,
      state: 'CANCELLED',
    },
  ],
  20202: [
    {
      courseCode: 'KIP2720',
      applicationCodes: ['1'],
      semester: '20202',
      memoEndPoint: 'KIP272020202-1',
      memoCommonLangAbbr: 'en',
      memoName: 'Autumn 2020-1 (Start date 24/08/2020, English)',
      isPdf: false,
      state: 'APPROVED',
    },
  ],
})

export const mockMixKoppsApi = () => [
  {
    shortName: '',
    applicationCode: '1',
    firstTuitionDate: '2023-01-17',
    lastTuitionDate: '2023-03-17',
    term: '20212',
    state: 'CANCELLED',
  },
  {
    shortName: '',
    applicationCode: '1',
    firstTuitionDate: '2023-01-17',
    lastTuitionDate: '2023-03-17',
    term: '20202',
    state: 'APPROVED',
  },
  {
    shortName: '',
    applicationCode: '1',
    firstTuitionDate: '2023-01-17',
    lastTuitionDate: '2023-03-17',
    term: '20192',
    state: 'APPROVED',
  },
  {
    shortName: '',
    applicationCode: '2',
    firstTuitionDate: '2023-01-17',
    lastTuitionDate: '2023-03-17',
    term: '20192',
    state: 'APPROVED',
  },
]
