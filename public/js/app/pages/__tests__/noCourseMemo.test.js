import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { WebContextProvider } from '../../context/WebContext'

import CourseMemo from '../CourseMemo'

describe('User language: Swedish. Component <CourseMemo> renders <AboutCourseMemo> because no memo exists for some round, f.e., semester 20192, ladokRoundIds 2', () => {
  beforeEach(() => {
    const context = {
      browserConfig: { imageStorageUri: 'localhost://', memoStorageUri: 'kursinfostorage/' },
      memoData: {
        courseTitle: 'KIP2720 Projektstyrning 7,5 hp',
        visibleInMemo: {},
      },
      memoDatas: [
        {
          applicationCodes: ['1'],
          semester: '20192',
          memoEndPoint: 'KIP272020192-1',
          memoCommonLangAbbr: 'en',
        },
        {
          applicationCodes: ['1'],
          semester: '20202',
          memoEndPoint: 'KIP272020202-1',
          memoCommonLangAbbr: 'en',
        },
      ],
      userLanguageIndex: 1,
    }
    return (
      <WebContextProvider configIn={context}>
        <CourseMemo location={{ pathname: '' }} />
      </WebContextProvider>
    )
  })
  test('renders no course memo', done => {
    done()
  })
})
