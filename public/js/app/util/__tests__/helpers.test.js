import {
  seasonStr,
  getDateFormat,
  concatMemoName,
  memoNameWithoutApplicationCode,
  roundShortNameWithStartdate,
  doubleSortOnAnArrayOfObjects,
} from '../helpers'

describe('seasonStr', () => {
  test('produces a semester string correctly  according to the language and format', () => {
    expect(seasonStr('sv', 20241)).toEqual('VT 2024')
    expect(seasonStr('sv', 20242)).toEqual('HT 2024')
    expect(seasonStr('en', 20241)).toEqual('Spring 2024')
    expect(seasonStr('en', 20242)).toEqual('Autumn 2024')
    expect(seasonStr('sv', 'VT2024')).toEqual('VT 2024')
    expect(seasonStr('sv', 'HT2024')).toEqual('HT 2024')
    expect(seasonStr('en', 'VT2024')).toEqual('Spring 2024')
    expect(seasonStr('en', 'HT2024')).toEqual('Autumn 2024')
    expect(seasonStr('en', undefined)).toEqual('')
  })
})
describe('getDateFormat', () => {
  test('returns the original date when language is Swedish (1)', () => {
    expect(getDateFormat('20/12/2023', 1)).toBe('20/12/2023')
  })

  test('returns the original date when language is "Svenska"', () => {
    expect(getDateFormat('20/12/2023', 'Svenska')).toBe('20/12/2023')
  })

  test('returns the original date when language is "Swedish"', () => {
    expect(getDateFormat('20/12/2023', 'Swedish')).toBe('20/12/2023')
  })

  test('returns the original date when language is "sv"', () => {
    expect(getDateFormat('20/12/2023', 'sv')).toBe('20/12/2023')
  })

  test('parses dd/mm/yyyy format correctly', () => {
    const result = getDateFormat('20/12/2023', 'en')
    // en-GB format → "20 Dec 2023"
    expect(result).toBe('20 Dec 2023')
  })

  test('parses ISO date format correctly', () => {
    const result = getDateFormat('2023/12/20', 'en')
    expect(result).toBe('20 Dec 2023')
  })

  test('handles invalid date strings gracefully', () => {
    const result = getDateFormat('invalid-date', 'en')
    // Date.parse("invalid-date") is NaN → new Date(NaN).toLocaleDateString() returns "Invalid Date"
    expect(result).toBe('Invalid Date')
  })
})

describe('concatMemoName', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('returns correct format when no application codes (sv default)', () => {
    const result = concatMemoName('HT2020', [])
    expect(result).toBe('Kurs-PM HT 2020-')
  })

  test('returns correct format when no application codes (en)', () => {
    const result = concatMemoName('VT2020', [], 'en')
    expect(result).toBe('Course memo Spring 2020-')
  })

  test('handles single application code', () => {
    const result = concatMemoName('20202', ['ABC123'])
    expect(result).toBe('Kurs-PM HT 2020-ABC123')
  })

  test('handles multiple application codes (ellipsis after first)', () => {
    const result = concatMemoName('20201', ['ABC123', 'DEF456'])
    expect(result).toBe('Kurs-PM VT 2020-ABC123...')
  })

  test('parses semester formats: HT2020, VT2020, 20202, 20201', () => {
    expect(concatMemoName('HT2020', ['X'], 'en')).toBe('Course memo Autumn 2020-X')
    expect(concatMemoName('VT2020', ['X'], 'en')).toBe('Course memo Spring 2020-X')
    expect(concatMemoName('20202', ['X'], 'en')).toBe('Course memo Autumn 2020-X')
    expect(concatMemoName('20201', ['X'], 'en')).toBe('Course memo Spring 2020-X')
  })
})

describe('memoNameWithoutApplicationCode', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('returns correct Swedish memo name (default)', () => {
    const result = memoNameWithoutApplicationCode('HT2020')
    expect(result).toBe('Kurs-PM HT 2020')
  })

  test('returns correct English memo name', () => {
    const result = memoNameWithoutApplicationCode('VT2020', 'en')
    expect(result).toBe('Course memo Spring 2020')
  })

  test('handles semester formats: HT2020, VT2020, 20202, 20201', () => {
    expect(memoNameWithoutApplicationCode('HT2020', 'en')).toBe('Course memo Autumn 2020')
    expect(memoNameWithoutApplicationCode('VT2020', 'en')).toBe('Course memo Spring 2020')
    expect(memoNameWithoutApplicationCode('20202', 'en')).toBe('Course memo Autumn 2020')
    expect(memoNameWithoutApplicationCode('20201', 'en')).toBe('Course memo Spring 2020')
  })
})

describe('roundShortNameWithStartdate', () => {
  // ------------------------------
  // CASE 1 — round.memoName exists
  // ------------------------------
  test('returns memoName when present (Swedish default)', () => {
    const round = {
      memoName: 'MemoNameHere',
      firstTuitionDate: '2020-01-15',
    }

    const result = roundShortNameWithStartdate(round)

    expect(result).toBe('MemoNameHere (Startdatum 2020-01-15)')
  })

  test('returns memoName when present (English)', () => {
    const round = {
      memoName: 'MemoNameHere',
      firstTuitionDate: '2020-01-15',
    }

    const result = roundShortNameWithStartdate(round, 'en')

    expect(result).toBe('MemoNameHere (Start date 15 Jan 2020)')
  })

  // -----------------------------------------------------
  // CASE 2 — shortName exists AND matches the pattern
  // -----------------------------------------------------
  test('uses seasonStr when shortName matches pattern', () => {
    const round = {
      shortName: 'HT 2020-1', // matches the pattern
      firstTuitionDate: '2020-08-28',
      term: 'HT2020',
    }

    const result = roundShortNameWithStartdate(round)

    expect(result).toBe('HT 2020 (Startdatum 2020-08-28)')
  })

  // -----------------------------------------------------
  // CASE 3 — shortName exists but does NOT match pattern
  // -----------------------------------------------------
  test('uses cleaned shortName when not matching pattern', () => {
    const round = {
      shortName: 'ABC m.fl.',
      firstTuitionDate: '2020-08-28',
    }

    const result = roundShortNameWithStartdate(round)

    // "m.fl." should be removed
    expect(result).toBe('ABC (Startdatum 2020-08-28)')
  })

  // -----------------------------------------------------
  // CASE 4 — fallback: no memoName, no shortName
  // -----------------------------------------------------
  test('fallback to seasonStr when no memoName and no shortName', () => {
    const round = {
      firstTuitionDate: '2020-02-10',
      semester: '20201',
    }

    const result = roundShortNameWithStartdate(round)

    expect(result).toBe('VT 2020 (Startdatum 2020-02-10)')
  })
})

describe('doubleSortOnAnArrayOfObjects', () => {
  test('strips parentheses, removes "m.fl.", splits, sorts and rewrites memoName', () => {
    const input = [
      {
        memoName: 'HT 2020-1 (old) m.fl., Zeta, Alpha',
        shortName: 'something',
        term: 'HT2020',
      },
    ]

    const result = doubleSortOnAnArrayOfObjects(input, 'memoName', 'shortName', 1)

    expect(result[0]).toEqual({
      memoName: 'Alpha, HT 2020, Zeta',
      shortName: 'Alpha', // first sorted element
      term: 'HT2020',
    })
  })
  test('replaces pattern-matching memo elements with seasonStr output', () => {
    const input = [
      {
        memoName: 'HT 2020-1, SomethingElse',
        term: 'HT2020',
      },
    ]

    const result = doubleSortOnAnArrayOfObjects(input, 'memoName', 'shortName', 0)

    expect(result[0].memoName).toBe('Autumn 2020, SomethingElse')
  })
  test('returns round unchanged when memoName is not present', () => {
    const input = [
      {
        shortName: 'ABC',
        term: 'VT2020',
      },
    ]

    const result = doubleSortOnAnArrayOfObjects(input, 'memoName', 'shortName', 1)

    expect(result[0]).toEqual({
      shortName: 'ABC',
      term: 'VT2020',
    })
  })
})
