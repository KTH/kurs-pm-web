import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { WebContextProvider } from '../../context/WebContext'

import { MemoryRouter, Route, Routes } from 'react-router-dom'
import AboutCourseMemo from '../AboutCourseMemo'
import { mockMixKoppsApi, mockMixKursPmDataApi } from '../mockApis'
import { render, screen } from '@testing-library/react'

const Language = {
  SV: {
    userLanguageIndex: 1,
    language: 'sv',
  },
  EN: {
    userLanguageIndex: 0,
    language: 'en',
  },
}

const renderWithOptions = (memoDatas, languageSetting, applicationCodes = []) => {
  const { userLanguageIndex, language } = languageSetting

  let applicationCodesString = ''
  if (applicationCodes.length > 0) {
    applicationCodesString = applicationCodes
      .map(applicationCode => {
        return `&applicationCodes=${applicationCode}`
      })
      .join('')
  }

  const context = {
    browserConfig: { imageStorageUri: 'localhost://', memoStorageUri: 'kursinfostorage/' },
    memoData: {
      courseTitle: 'DD2380 Artificiell intelligens 6.0 hp',
      visibleInMemo: {},
    },
    courseCode: 'DD2380',
    memoDatas,
    userLanguageIndex,
    language,
  }

  render(
    <MemoryRouter initialEntries={[`/DD2380/om-kurs-pm?noMemoData=true&semester=20232${applicationCodesString}`]}>
      <WebContextProvider configIn={context}>
        <Routes>
          <Route
            path={'/:courseCode/om-kurs-pm'}
            element={
              <AboutCourseMemo
                mockKursPmDataApi={mockMixKursPmDataApi()}
                mockMixKoppsApi={mockMixKoppsApi()}
                location={{}}
              />
            }
          ></Route>
        </Routes>
      </WebContextProvider>
    </MemoryRouter>
  )
}

describe('User language: Swedish. Component <AboutCourseMemo> with non-matching course memos', () => {
  const { getByText } = screen

  test('if course memo does not have any course memos, renders information about that', () => {
    renderWithOptions([], Language.SV)
    getByText('Det finns inga publicerade Kurs-PM för DD2380')
  })

  test('if course memo does not have a matching memo, but other memos, renders information about that', () => {
    const memoDatas = [
      {
        courseCode: 'DD2380',
        applicationCodes: ['1'],
        semester: '20192',
        memoEndPoint: 'DD23802020192-1',
        memoCommonLangAbbr: 'en',
        outdated: false,
      },
    ]

    renderWithOptions(memoDatas, Language.SV, [2])
    getByText('Kurs-PM för HT 2023-2 är inte publicerat')
  })

  test('if course memo does not have a matching memo (multiple application codes), but other memos, renders information about that', () => {
    const memoDatas = [
      {
        courseCode: 'DD2380',
        applicationCodes: ['1'],
        semester: '20192',
        memoEndPoint: 'DD23802020192-1',
        memoCommonLangAbbr: 'en',
        outdated: false,
      },
    ]

    renderWithOptions(memoDatas, Language.SV, [40000, 40002])
    getByText('Kurs-PM för HT 2023-40000-40002 är inte publicerat')
  })
})

describe('User language: English. Component <AboutCourseMemo> with non-matching course memos', () => {
  const { getByText } = screen

  test('if course memo does not have any course memos, renders information about that', () => {
    renderWithOptions([], Language.EN)
    getByText('There are no published course memos for DD2380')
  })

  test('if course memo does not have a matching memo, but other memos, renders information about that', () => {
    const memoDatas = [
      {
        courseCode: 'DD2380',
        applicationCodes: ['1'],
        semester: '20192',
        memoEndPoint: 'DD23802020192-1',
        memoCommonLangAbbr: 'en',
        outdated: false,
      },
    ]

    renderWithOptions(memoDatas, Language.EN, [2])
    getByText('Course memo for Autumn 2023-2 is not published')
  })

  test('if course memo does not have a matching memo (multiple application codes), but other memos, renders information about that', () => {
    const memoDatas = [
      {
        courseCode: 'DD2380',
        applicationCodes: ['1'],
        semester: '20192',
        memoEndPoint: 'DD23802020192-1',
        memoCommonLangAbbr: 'en',
        outdated: false,
      },
    ]

    renderWithOptions(memoDatas, Language.EN, [40000, 40002])
    getByText('Course memo for Autumn 2023-40000-40002 is not published')
  })
})
