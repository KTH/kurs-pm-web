import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import Section from '../Section'

describe('Component <Section>', () => {
  test('renders', () => {
    render(<Section contentId="test" />)
  })
})
