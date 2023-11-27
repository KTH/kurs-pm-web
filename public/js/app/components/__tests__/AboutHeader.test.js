import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'

import AboutHeader from '../AboutHeader'

describe('Component <AboutHeader>', () => {
  test('renders a header', done => {
    render(<AboutHeader />)
    done()
  })
})
