import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { WebContextProvider } from '../../context/WebContext'

import ContentFromNewSectionEditor from '../ContentFromNewSectionEditor'

describe('Component <ContentFromNewSectionEditor>', () => {
  test('renders', () => {
    render(
      <WebContextProvider configIn={{}}>
        <ContentFromNewSectionEditor />
      </WebContextProvider>
    )
  })
})
