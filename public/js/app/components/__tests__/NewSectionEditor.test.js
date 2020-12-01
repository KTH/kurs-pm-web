import React from 'react'
import { Provider } from 'mobx-react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import NewSectionEditor from '../NewSectionEditor'

describe('Component <NewSectionEditor>', () => {
  test('renders', (done) => {
    render(
      <Provider routerStore={{}}>
        <NewSectionEditor />
      </Provider>
    )
    done()
  })
})
