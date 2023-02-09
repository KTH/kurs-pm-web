import React from 'react'
// import { useWebContext } from '../context/WebContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { render, screen } from '@testing-library/react'
import { WebContextProvider } from '../../context/WebContext'

import '@testing-library/jest-dom/extend-expect'

import CourseMemo, { redirectToAbout } from '../CourseMemo'
import { formatCredits } from '../../util/helpers'

const { getAllByRole } = screen

describe('Redirect function in <CourseMemo>', () => {
  test('return data for redirect for the link from the personal meny', () => {
    const locationUrlAboutMemo = { pathname: '/MF2140/om-kurs-pm' }
    const data = redirectToAbout('MF2140', locationUrlAboutMemo)
    expect(data).toBeNull()
  })
  test('return data for redirect for the link from the personal meny', () => {
    const locationUrlFromPersonalMenu = { pathname: '/MF2140/20222/1' }
    const { noMemoData, semester, roundIds } = redirectToAbout('MF2140', locationUrlFromPersonalMenu)
    expect(noMemoData).toBeTruthy()
    expect(semester).toBe('20222')
    expect(roundIds).toStrictEqual(['1'])
  })
  test('return data for redirect for the link with the memos endpoint which is missing', () => {
    const locationUrlWithMissingMemoEndpoint = { pathname: '/SF1624/SF162420231-1' }
    const { noMemoData, semester, roundIds } = redirectToAbout('SF1624', locationUrlWithMissingMemoEndpoint)
    expect(noMemoData).toBeTruthy()
    expect(semester).toBe('20231')
    expect(roundIds).toStrictEqual(['1'])
  })
  test('return data with two rounds for redirect for the link with memo endpoint which is missing', () => {
    const locationUrlWithMissingMemoEndpoint = { pathname: '/SF1624/SF162420232-5-6' }
    const { noMemoData, semester, roundIds } = redirectToAbout('SF1624', locationUrlWithMissingMemoEndpoint)
    expect(noMemoData).toBeTruthy()
    expect(semester).toBe('20232')
    expect(roundIds).toStrictEqual(['5', '6'])
  })

  test('return data for redirect for the full link from the personal meny', () => {
    const locationUrlFromPersonalMenu = { pathname: '/kurs-pm/MF2140/20222/1' }
    const { noMemoData, semester, roundIds } = redirectToAbout('MF2140', locationUrlFromPersonalMenu)
    expect(noMemoData).toBeTruthy()
    expect(semester).toBe('20222')
    expect(roundIds).toStrictEqual(['1'])
  })

  test('return data for redirect for the link with the memos endpoint which is missing', () => {
    const locationUrlWithMissingMemoEndpoint = { pathname: '/kurs-pm/SF1624/SF162420231-1' }
    const { noMemoData, semester, roundIds } = redirectToAbout('SF1624', locationUrlWithMissingMemoEndpoint)
    expect(noMemoData).toBeTruthy()
    expect(semester).toBe('20231')
    expect(roundIds).toStrictEqual(['1'])
  })
  test('return data with two rounds for redirect for the link with memo endpoint which is missing', () => {
    const locationUrlWithMissingMemoEndpoint = { pathname: '/kurs-pm/SF1624/SF162420232-5-6' }
    const { noMemoData, semester, roundIds } = redirectToAbout('SF1624', locationUrlWithMissingMemoEndpoint)
    expect(noMemoData).toBeTruthy()
    expect(semester).toBe('20232')
    expect(roundIds).toStrictEqual(['5', '6'])
  })
})

// {"pathname":"/MF2140/om-kurs-pm","search":"","hash":"","state":{"noMemoData":true,"semester":"20222","roundIds":["1"]},"key":"1wefohoy"}
describe('Component <CourseMemo>', () => {
  test('renders a course memo', () => {
    const context = {
      browserConfig: { imageStorageUri: 'localhost://' },
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
      userLanguageIndex: 0,
      credits: 7.5,
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
  memoEndPoint: '12345',
  semester: '20181',
  applicationCodes: [12345],
  memoCommonLangAbbr: 'en',
  credits: 7.5,
  lastChangeDate: 'Fri Jan 27 2018 12:04:37 GMT+0000 (Coordinated Universal Time)',
  version: 2,
  syllabusValid: { validFromTerm: '20181' },
}
const spring1823 = {
  courseCode: 'TEST121',
  memoEndPoint: '34567',
  semester: '20181',
  applicationCodes: [23456, 34567],
  memoCommonLangAbbr: 'en',
  credits: 7.5,
  lastChangeDate: 'Fri Dec 1 2017 12:04:37 GMT+0000 (Coordinated Universal Time)',
  version: 6,
  syllabusValid: { validFromTerm: '20181' },
}
const spring184 = {
  courseCode: 'TEST121',
  memoEndPoint: '45678',
  semester: '20181',
  applicationCodes: [45678],
  memoCommonLangAbbr: 'en',
  credits: 7.5,
  syllabusValid: { validFromTerm: '20181' },
}
const spring1924 = {
  courseCode: 'TEST121',
  memoEndPoint: '34567',
  semester: '20191',
  applicationCodes: [23456, 34567],
  memoCommonLangAbbr: 'en',
  credits: 7.5,
  syllabusValid: { validFromTerm: '20191' },
}
const spring193 = {
  courseCode: 'TEST121',
  memoEndPoint: '34567',
  semester: '20191',
  applicationCodes: [34567],
  memoCommonLangAbbr: 'en',
  credits: 7.5,
  syllabusValid: { validFromTerm: '20191' },
}
const fall190 = {
  courseCode: 'TEST121',
  memoEndPoint: '190',
  semester: '20192',
  applicationCodes: [],
  memoCommonLangAbbr: 'en',
  credits: 7.5,
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
      browserConfig: { imageStorageUri: 'localhost://' },
      memoData: { ...spring181, courseTitle: '', visibleInMemo: {} },
      memoDatas,
      memoLanguageIndex: 0,
      userLanguageIndex: 0,
      credits: 7.5,
      activeMemoEndPoint: id => id === '12345',
      roundIds: [2, 3],
      applicationCodes: ['12345'],
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
      browserConfig: { imageStorageUri: 'localhost://' },
      memoData: { ...spring181, courseTitle: '', visibleInMemo: {} },
      memoDatas,
      memoLanguageIndex: 0,
      userLanguageIndex: 0,
      credits: 7.5,
      activeMemoEndPoint: id => id === '12345',
      roundIds: [],
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
    expect(links.length).toEqual(4)
    const expectedLinks = [
      ['Course memo Spring 2018-12345', '/kurs-pm/TEST121/12345'],
      ['Course memo Spring 2018-23456...', '/kurs-pm/TEST121/34567'],
      ['Course memo Spring 2018-45678', '/kurs-pm/TEST121/45678'],
      ['Course memo Autumn 2019-undefined', '/kurs-pm/TEST121/190'],
    ]

    links.forEach((l, index) => {
      expect(l.getAttribute('aria-label')).toBe(expectedLinks[index][0])
      expect(l.textContent).toBe(expectedLinks[index][0])
      expect(l.href).toBe(`http://localhost${expectedLinks[index][1]}`)
    })

    done()
  })
})
