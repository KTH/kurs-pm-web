import React from 'react'
// import { useWebContext } from '../context/WebContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { render, screen } from '@testing-library/react'
import { WebContextProvider } from '../../context/WebContext'

import '@testing-library/jest-dom/extend-expect'

import CourseMemo from '../CourseMemo'

const { getAllByRole } = screen

describe('Component <CourseMemo>', () => {
  test('renders a course memo', () => {
    const context = {
      browserConfig: { imageStorageUri: 'localhost://' },
      memoData: {
        courseTitle: '',
        visibleInMemo: {},
      },
      memoDatas: [
        {
          semester: '',
          ladokRoundIds: [],
          memoCommonLangAbbr: '',
        },
      ],
      userLanguageIndex: 0,
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

describe('Page CourseMemo', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern')
    jest.setSystemTime(new Date(2020, 1, 1))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  test('renders a side menu', done => {
    const spring181 = { memoEndPoint: '181', semester: '20181', ladokRoundIds: [1], memoCommonLangAbbr: 'en' }
    const spring1823 = { memoEndPoint: '1823', semester: '20181', ladokRoundIds: [2, 3], memoCommonLangAbbr: 'en' }
    const spring184 = { memoEndPoint: '184', semester: '20181', ladokRoundIds: [4], memoCommonLangAbbr: 'en' }
    const spring1924 = { memoEndPoint: '1924', semester: '20191', ladokRoundIds: [2, 4], memoCommonLangAbbr: 'en' }
    const spring193 = { memoEndPoint: '193', semester: '20191', ladokRoundIds: [3], memoCommonLangAbbr: 'en' }
    const fall190 = { memoEndPoint: '190', semester: '20192', ladokRoundIds: [], memoCommonLangAbbr: 'en' }
    const memoDatas = [spring181, spring1823, spring184, spring1924, spring193, fall190]
    const context = {
      browserConfig: { imageStorageUri: 'localhost://' },
      noMemoData: () => false,
      memoData: { ...memoDatas[memoDatas.length - 1], courseTitle: '', visibleInMemo: {} },
      memoDatas,
      memoLanguageIndex: 0,
      userLanguageIndex: 0,
      activeMemoEndPoint: id => id === '181',
      roundIds: [],
      courseCode: 'TEST',
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

    const links = getAllByRole('link', { name: /Course memo.*\d*-\d*/i })
    expect(links.length).toEqual(6)

    done()
  })
})
