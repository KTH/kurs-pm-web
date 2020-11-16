import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import Section from '../Section'

describe('Component <Section>', () => {
  test('renders', (done) => {
    render(<Section contentId="test" />)
    done()
  })
})
