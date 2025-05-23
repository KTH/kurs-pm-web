const { enrichMemoDatasWithOutdatedFlag, getMemoRoundFromRoundInfosOrApi } = require('../memoCtrlHelpers')

jest.mock('../../kursPmDataApi', () => ({
  getMemoDataById: () => {},
  getMiniMemosPdfAndWeb: () => {},
}))

jest.mock('@kth/log', () => ({ error: jest.fn(), debug: jest.fn }))

jest.mock('../../ladokApi', () => ({ getCourseRoundsForPeriod: jest.fn() }))
jest.mock('../../api', () => {})
jest.mock('../../server', () => ({
  getPaths: () => [],
}))
jest.mock('../../configuration', () => ({
  server: {
    nodeApi: {},
    logging: {
      log: {
        level: 'debug',
      },
    },
    proxyPrefixPath: {
      uri: 'kurs-pm',
    },
    session: { sessionOptions: { secret: '' }, key: 'kurs-pm' },
    sessionSecret: '1234',
    blockApi: { blockUrl: 'http://localhost' },
    cache: {
      cortinaBlock: {
        redis: 'http://localhost',
      },
    },
  },
}))

const { getCourseRoundsForPeriod } = require('../../ladokApi')
const log = require('@kth/log')

const matchingTuitionDate = '2017-01-01'

getCourseRoundsForPeriod.mockResolvedValue([
  {
    round: {
      applicationCode: '45001',
      startTerm: {
        term: '20171',
      },
      firstTuitionDate: matchingTuitionDate,
    },
  },
])

describe('getMemoRoundFromRoundInfosOrApi', () => {
  const roundInfosForFindStartDate = [
    {
      round: {
        applicationCode: '45008',
        startTerm: {
          term: '20231',
        },
        firstTuitionDate: '2023-06-01',
      },
    },
    {
      round: {
        applicationCode: '45000',
        startTerm: {
          term: '20222',
        },
        firstTuitionDate: '2022-06-01',
      },
    },
  ]

  const memoMatchingRoundInfos = {
    semester: '20222',
    applicationCodes: ['45000'],
    courseCode: 'SF1624',
  }

  const memoMatchingCourseRoundTerms = {
    semester: '20171',
    applicationCodes: ['45001'],
    courseCode: 'SF1615',
  }

  it('should return matching round with startDate if there is one in roundInfos', async () => {
    const result = await getMemoRoundFromRoundInfosOrApi(memoMatchingRoundInfos, roundInfosForFindStartDate)
    expect(result?.firstTuitionDate).toStrictEqual('2022-06-01')
  })

  it('should not call getCourseRoundsForPeriod if matching round in roundInfos', async () => {
    await getMemoRoundFromRoundInfosOrApi(memoMatchingRoundInfos, roundInfosForFindStartDate)
    expect(getCourseRoundsForPeriod).not.toHaveBeenCalled()
  })

  it('should call getCourseRoundsForPeriod with courseCode if no matching round in roundInfos', async () => {
    await getMemoRoundFromRoundInfosOrApi(memoMatchingCourseRoundTerms, roundInfosForFindStartDate, 'sv')
    expect(getCourseRoundsForPeriod).toHaveBeenCalledWith('SF1615', 'VT2017', 'sv')
  })

  describe('when result from getCourseRoundsForPeriod do not contain a matching round for courseCode and term', () => {
    const memoNotMatchingTerm = {
      semester: '20172',
      applicationCodes: ['45001'],
      courseCode: 'SF1615',
    }
    it('should log to error', async () => {
      await getMemoRoundFromRoundInfosOrApi(memoNotMatchingTerm, roundInfosForFindStartDate)
      expect(log.error).toHaveBeenCalledWith(
        'Could not find matching round for courseCode: SF1615, semester: 20172 and applicationCode: 45001'
      )
    })

    it('should return undefined as as round', async () => {
      const result = await getMemoRoundFromRoundInfosOrApi(memoNotMatchingTerm, roundInfosForFindStartDate)
      expect(result).toStrictEqual(undefined)
    })
  })

  describe('when result from getCourseRoundsForPeriod  do not contain a matching round for courseCode and applicationCodes', () => {
    const memoMatchingTermButNotApplicationCode = {
      semester: '20171',
      applicationCodes: ['39000', '39001'],
      courseCode: 'SF1615',
    }
    it('should log to error', async () => {
      await getMemoRoundFromRoundInfosOrApi(memoMatchingTermButNotApplicationCode, roundInfosForFindStartDate)
      expect(log.error).toHaveBeenCalledWith(
        'Could not find matching round for courseCode: SF1615, semester: 20171 and applicationCode: 39000,39001'
      )
    })
    it('should return undefined as as round', async () => {
      const result = await getMemoRoundFromRoundInfosOrApi(
        memoMatchingTermButNotApplicationCode,
        roundInfosForFindStartDate
      )
      expect(result).toStrictEqual(undefined)
    })
  })

  it('should return matching startDate if it can be found in courseRoundTerms', async () => {
    const round = await getMemoRoundFromRoundInfosOrApi(memoMatchingCourseRoundTerms, roundInfosForFindStartDate)
    expect(round?.firstTuitionDate).toStrictEqual(matchingTuitionDate)
  })
})

describe('enrichMemoDatasWithOutdatedFlag', () => {
  test('Handles empy arguments', done => {
    const markedOutDatedMemoDatas = enrichMemoDatasWithOutdatedFlag()
    expect(markedOutDatedMemoDatas).toEqual([])
    done()
  })
  test('Handles empy arguments', done => {
    const markedOutDatedMemoDatas = enrichMemoDatasWithOutdatedFlag()
    expect(markedOutDatedMemoDatas).toEqual([])
    done()
  })

  test('Correct memos are marked as outdated 2023-05-19', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-05-19'))

    const result = enrichMemoDatasWithOutdatedFlag(memoDatas, roundInfosForEnrichMemoDatas)

    const outDatedInfo = result.map(({ outdated, semester }) => {
      return {
        outdated,
        semester,
      }
    })

    expect(outDatedInfo).toStrictEqual([
      { outdated: false, semester: '20242' },
      { outdated: false, semester: '20241' },
      { outdated: true, semester: '20232' },
      { outdated: true, semester: '20222' },
      { outdated: true, semester: '20212' },
      { outdated: true, semester: '20202' },
    ])

    jest.useRealTimers()
  })

  test('Correct memos are marked as outdated 2023-01-19', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-19'))

    const result = enrichMemoDatasWithOutdatedFlag(memoDatas, roundInfosForEnrichMemoDatas)

    const outDatedInfo = result.map(({ outdated, semester }) => {
      return {
        outdated,
        semester,
      }
    })

    expect(outDatedInfo).toStrictEqual([
      { outdated: false, semester: '20242' },
      { outdated: false, semester: '20241' },
      { outdated: true, semester: '20232' }, // Is this a discrepancy?
      { outdated: true, semester: '20222' },
      { outdated: true, semester: '20212' },
      { outdated: true, semester: '20202' },
    ])

    jest.useRealTimers()
  })

  test('Correct memos are marked as outdated 2022-01-19', () => {
    jest.useFakeTimers().setSystemTime(new Date('2022-01-19'))

    const result = enrichMemoDatasWithOutdatedFlag(memoDatas, roundInfosForEnrichMemoDatas)

    const outDatedInfo = result.map(({ outdated, semester }) => {
      return {
        outdated,
        semester,
      }
    })

    expect(outDatedInfo).toStrictEqual([
      { outdated: false, semester: '20242' },
      { outdated: false, semester: '20241' },
      { outdated: false, semester: '20232' }, // Is this a discrepancy?
      { outdated: false, semester: '20222' },
      { outdated: true, semester: '20212' },
      { outdated: true, semester: '20202' },
    ])

    jest.useRealTimers()
  })
})

const memoDatas = [
  {
    semester: '20242',
    applicationCodes: ['45000, 45001'],
  },
  {
    semester: '20241',
    applicationCodes: ['45003, 45004'],
  },
  {
    semester: '20232',
    applicationCodes: ['45000'],
  },
  {
    semester: '20222',
    applicationCodes: ['45000'],
  },
  {
    semester: '20212',
    applicationCodes: ['45000'],
  },
  {
    semester: '20202',
    applicationCodes: ['45000'],
  },
]

const roundInfosForEnrichMemoDatas = [
  {
    round: {
      applicationCodes: ['45000'],
      startTerm: { term: '20242' },
      startWeek: {
        year: 2024,
      },
      endWeek: {
        year: 2024,
      },
      firstTuitionDate: '2024-06-01',
      lastTuitionDate: '2024-06-30',
    },
  },
  {
    round: {
      applicationCodes: ['45003'],
      startTerm: { term: '20241' },
      startWeek: {
        year: 2024,
      },
      endWeek: {
        year: 2024,
      },
      firstTuitionDate: '2024-01-01',
      lastTuitionDate: '2024-01-30',
    },
  },
  {
    round: {
      applicationCodes: ['45000'],
      startTerm: { term: '20221' },
      startWeek: {
        year: 2022,
      },
      endWeek: {
        year: 2022,
      },
      firstTuitionDate: '2022-01-01',
      lastTuitionDate: '2022-01-30',
    },
  },
]
