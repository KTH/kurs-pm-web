import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { render, screen } from '@testing-library/react'
import { WebContextProvider } from '../../context/WebContext'

import '@testing-library/jest-dom'

import CourseMemo, { redirectToAbout } from '../CourseMemo'

const { getAllByRole } = screen

describe('Redirect function in <CourseMemo>', () => {
  test('return data for redirect for the link from the personal meny', () => {
    const locationUrlAboutMemo = { pathname: '/MF2140/om-kurs-pm' }
    const data = redirectToAbout('MF2140', locationUrlAboutMemo)
    expect(data).toBeNull()
  })
  test('return data for redirect for the link from the personal meny', () => {
    const locationUrlFromPersonalMenu = { pathname: '/MF2140/20222/1' }
    const { noMemoData, semester, applicationCodes } = redirectToAbout('MF2140', locationUrlFromPersonalMenu)
    expect(noMemoData).toBeTruthy
    expect(semester).toBe('20222')
    expect(applicationCodes).toStrictEqual(['1'])
  })
  test('return data for redirect for the link with the memos endpoint which is missing', () => {
    const locationUrlWithMissingMemoEndpoint = { pathname: '/SF1624/SF162420231-1' }
    const { noMemoData, semester, applicationCodes } = redirectToAbout('SF1624', locationUrlWithMissingMemoEndpoint)
    expect(noMemoData).toBeTruthy()
    expect(semester).toBe('20231')
    expect(applicationCodes).toStrictEqual(['1'])
  })
  test('return data with two rounds for redirect for the link with memo endpoint which is missing', () => {
    const locationUrlWithMissingMemoEndpoint = { pathname: '/SF1624/SF162420232-5-6' }
    const { noMemoData, semester, applicationCodes } = redirectToAbout('SF1624', locationUrlWithMissingMemoEndpoint)
    expect(noMemoData).toBeTruthy()
    expect(semester).toBe('20232')
    expect(applicationCodes).toStrictEqual(['5', '6'])
  })

  test('return data for redirect for the full link from the personal meny', () => {
    const locationUrlFromPersonalMenu = { pathname: '/kurs-pm/MF2140/20222/1' }
    const { noMemoData, semester, applicationCodes } = redirectToAbout('MF2140', locationUrlFromPersonalMenu)
    expect(noMemoData).toBeTruthy()
    expect(semester).toBe('20222')
    expect(applicationCodes).toStrictEqual(['1'])
  })

  test('return data for redirect for the link with the memos endpoint which is missing', () => {
    const locationUrlWithMissingMemoEndpoint = { pathname: '/kurs-pm/SF1624/SF162420231-1' }
    const { noMemoData, semester, applicationCodes } = redirectToAbout('SF1624', locationUrlWithMissingMemoEndpoint)
    expect(noMemoData).toBeTruthy()
    expect(semester).toBe('20231')
    expect(applicationCodes).toStrictEqual(['1'])
  })
  test('return data with two rounds for redirect for the link with memo endpoint which is missing', () => {
    const locationUrlWithMissingMemoEndpoint = { pathname: '/kurs-pm/SF1624/SF162420232-5-6' }
    const { noMemoData, semester, applicationCodes } = redirectToAbout('SF1624', locationUrlWithMissingMemoEndpoint)
    expect(noMemoData).toBeTruthy()
    expect(semester).toBe('20232')
    expect(applicationCodes).toStrictEqual(['5', '6'])
  })
})

describe('Component <CourseMemo>', () => {
  test('renders a course memo', () => {
    const context = {
      browserConfig: {},
      memoData: {
        courseTitle: '',
        visibleInMemo: {},
        syllabusValid: { validFromTerm: '20181' },
      },
      memoDatas: [
        {
          semester: '',
          applicationCodes: [],
          memoCommonLangAbbr: '',
          syllabusValid: { validFromTerm: '20181' },
        },
      ],
      title: '',
      userLanguageIndex: 0,
      creditsLabel: '7.5 credits',
      syllabusValid: { validFromTerm: '20181' },
    }
    render(
      <BrowserRouter basename={'/'} location={{}}>
        <WebContextProvider configIn={context}>
          <Routes>
            <Route path="/" element={<CourseMemo />} />
          </Routes>
        </WebContextProvider>
      </BrowserRouter>
    )
  })
})

const spring181 = {
  courseCode: 'TEST121',
  memoEndPoint: '181',
  semester: '20181',
  applicationCodes: [1],
  memoCommonLangAbbr: 'en',
  creditsLabel: '7.5 credits',
  version: 2,
  syllabusValid: { validFromTerm: '20181' },
}
const spring1823 = {
  courseCode: 'TEST121',
  memoEndPoint: '1823',
  semester: '20181',
  applicationCodes: [2, 3],
  memoCommonLangAbbr: 'en',
  creditsLabel: '7.5 credits',
  lastChangeDate: 'Fri Dec 1 2017 12:04:37',
  version: 6,
  syllabusValid: { validFromTerm: '20181' },
}
const spring184 = {
  courseCode: 'TEST121',
  memoEndPoint: '184',
  semester: '20181',
  applicationCodes: [4],
  memoCommonLangAbbr: 'en',
  creditsLabel: '7.5 credits',
  syllabusValid: { validFromTerm: '20181' },
}
const spring1924 = {
  courseCode: 'TEST121',
  memoEndPoint: '1924',
  semester: '20191',
  applicationCodes: [2, 4],
  memoCommonLangAbbr: 'en',
  creditsLabel: '7.5 credits',
  syllabusValid: { validFromTerm: '20191' },
}
const spring193 = {
  courseCode: 'TEST121',
  memoEndPoint: '193',
  semester: '20191',
  applicationCodes: [3],
  memoCommonLangAbbr: 'en',
  creditsLabel: '7.5 credits',
  syllabusValid: { validFromTerm: '20191' },
}
const fall190 = {
  courseCode: 'TEST121',
  memoEndPoint: '190',
  semester: '20192',
  applicationCodes: [],
  memoCommonLangAbbr: 'en',
  creditsLabel: '7.5 credits',
  syllabusValid: { validFromTerm: '20191' },
}

describe('Page CourseMemo', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern')
    jest.setSystemTime(new Date(2020, 1, 1))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  test('renders a side menu and a page structure', done => {
    const memoDatas = [spring181, spring1823, spring184, spring1924, spring193, fall190]
    const context = {
      browserConfig: {},
      memoData: { ...spring181, courseTitle: '', visibleInMemo: {} },
      memoDatas,
      memoLanguageIndex: 0,
      userLanguageIndex: 0,
      creditsLabel: '7.5 credits',
      title: '',
      activeMemoEndPoint: id => id === '181',
      applicationCodes: [2, 3],
      courseCode: 'TEST121',
    }

    const { asFragment } = render(
      <BrowserRouter basename={'/'} location={{}}>
        <WebContextProvider configIn={context}>
          <Routes>
            <Route path="/" element={<CourseMemo />} />
          </Routes>
        </WebContextProvider>
      </BrowserRouter>
    )
    expect(asFragment()).toMatchSnapshot()

    done()
  })

  test('renders a side menu links', done => {
    const memoDatas = [spring181, spring1823, spring184, spring1924, spring193, fall190]
    const context = {
      browserConfig: {},
      memoData: { ...spring181, courseTitle: '', visibleInMemo: {} },
      memoDatas,
      memoLanguageIndex: 0,
      userLanguageIndex: 0,
      credits: 7.5,
      title: '',
      activeMemoEndPoint: id => id === '181',
      courseCode: 'TEST121',
      applicationCodes: [],
    }

    const { asFragment } = render(
      <BrowserRouter basename={'/'} location={{}}>
        <WebContextProvider configIn={context}>
          <Routes>
            <Route path="/" element={<CourseMemo />} />
          </Routes>
        </WebContextProvider>
      </BrowserRouter>
    )

    const links = getAllByRole('link', { name: /Course memo.*\d*-\d*/i })
    expect(links.length).toEqual(6)
    const expectedLinks = [
      ['Course memo Spring 2018-1', '/kurs-pm/TEST121/181'],
      ['Course memo Spring 2018-2...', '/kurs-pm/TEST121/1823'],
      ['Course memo Spring 2018-4', '/kurs-pm/TEST121/184'],
      ['Course memo Spring 2019-2...', '/kurs-pm/TEST121/1924'],
      ['Course memo Spring 2019-3', '/kurs-pm/TEST121/193'],
      ['Course memo Autumn 2019-', '/kurs-pm/TEST121/190'],
    ]

    links.forEach((l, index) => {
      expect(l).toHaveAccessibleName(expectedLinks[index][0])
      expect(l.textContent).toBe(expectedLinks[index][0])
      expect(l.href).toBe(`http://localhost${expectedLinks[index][1]}`)
    })

    done()
  })
})
