import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import CourseHeader from '../CourseHeader'

describe('Component <CourseHeader>', () => {
  test('renders a course header', (done) => {
    render(<CourseHeader />)
    done()
  })

  test('renders a course header with heading h1', (done) => {
    const courseMemoName = 'testHeader'
    render(<CourseHeader courseMemoName={courseMemoName} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(courseMemoName)
    done()
  })
})
