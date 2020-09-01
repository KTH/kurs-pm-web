import React from 'react'
import { Provider } from 'mobx-react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import CourseMemo from './CourseMemo'

describe('Component <CourseMemo>', () => {
  xtest('renders a course memo', () => {
    const routerStore = {
      noMemoData: () => false,
      memoLanguageIndex: 0,
      browserConfig: { imageStorageUri: 'localhost://' }
    }
    render(
      <Provider routerStore={routerStore}>
        <CourseMemo />
      </Provider>
    )
  })
})
