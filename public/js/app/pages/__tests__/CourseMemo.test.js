import React from 'react'
import { Provider } from 'mobx-react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import CourseMemo from '../CourseMemo'

describe('Component <CourseMemo>', () => {
  test('renders a course memo', () => {
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
      activeMemoEndPoint: (id) => false,
      roundIds: []
    }
    render(
      <Provider routerStore={routerStore}>
        <CourseMemo />
      </Provider>
    )
  })
})
