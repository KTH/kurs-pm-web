import React from 'react'
import { Provider } from 'mobx-react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import CourseMemo from '../CourseMemo'

describe('Component <CourseMemo>', () => {
  test('renders a course memo', (done) => {
    const routerStore = {
      browserConfig: { imageStorageUri: 'localhost://' },
      noMemoData: () => false,
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
      activeMemoEndPoint: () => false,
      roundIds: []
    }
    render(
      <Provider routerStore={routerStore}>
        <CourseMemo />
      </Provider>
    )
    done()
  })
})
