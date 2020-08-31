import React from 'react'
import { render } from '@testing-library/react'

import CourseHeader from './CourseHeader'

describe('Component <CourseHeader>', () => {
  test('renders a course header', () => {
    render(<CourseHeader />)
  })
})
