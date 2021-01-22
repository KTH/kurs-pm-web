import React from 'react'
import { Provider } from 'mobx-react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { StaticRouter } from 'react-router'

import CourseMemo from '../CourseMemo'

describe('User language: Swedish. Component <CourseMemo> renders <AboutCourseMemo> because no memo exists for some round, f.e., semester 20192, ladokRoundIds 2', () => {
  beforeEach(() => {
    const routerStore = {
      browserConfig: { imageStorageUri: 'localhost://', memoStorageUri: 'kursinfostorage/' },
      noMemoData: () => true,
      memoData: {
        courseTitle: 'KIP2720 Projektstyrning 7,5 hp',
        visibleInMemo: {}
      },
      memoDatas: [
        {
          ladokRoundIds: ['1'],
          semester: '20192',
          memoEndPoint: 'KIP272020192-1',
          memoCommonLangAbbr: 'en'
        },
        {
          ladokRoundIds: ['1'],
          semester: '20202',
          memoEndPoint: 'KIP272020202-1',
          memoCommonLangAbbr: 'en'
        }
      ],
      userLanguageIndex: 1,
      activeMemoEndPoint: () => false,
      roundIds: []
    }
    render(
      <StaticRouter>
        <Provider routerStore={routerStore}>
          <CourseMemo location={{ pathname: '' }} />
        </Provider>
      </StaticRouter>
    )
  })
  test('renders no course memo', (done) => {
    done()
  })
})
