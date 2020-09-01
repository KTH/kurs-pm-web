import React from 'react'
import { Provider } from 'mobx-react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import NewSectionEditor from '../NewSectionEditor'

describe('Component <NewSectionEditor>', () => {
  test('renders', () => {
    render(
      <Provider routerStore={{}}>
        <NewSectionEditor />
      </Provider>
    )
  })
})
