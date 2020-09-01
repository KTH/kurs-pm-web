import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import AboutCourseContacts from '../AboutCourseContacts'

describe('Component <AboutCourseContacts>', () => {
  test('renders a course contacts info box', () => {
    render(<AboutCourseContacts />)
  })
})
