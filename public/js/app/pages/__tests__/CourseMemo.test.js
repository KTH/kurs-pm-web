import React from 'react'
import { Provider } from 'mobx-react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import CourseMemo from '../CourseMemo'

const mockRouterStore = {
  activeMemoEndPoint: (id) => false,
  noMemoData: () => false,
  browserConfig: { imageStorageUri: 'localhost://' },
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
  roundIds: []
}

describe('Component <CourseMemo>', () => {
  test('renders a course memo', () => {
    render(
      <Provider routerStore={mockRouterStore}>
        <CourseMemo />
      </Provider>
    )
  })
})
