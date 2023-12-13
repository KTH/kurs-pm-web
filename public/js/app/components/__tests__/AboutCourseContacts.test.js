import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'

import AboutCourseContacts from '../AboutCourseContacts'

describe('Component <AboutCourseContacts>', () => {
  test('renders a course contacts info box', done => {
    render(<AboutCourseContacts />)
    done()
  })
})
