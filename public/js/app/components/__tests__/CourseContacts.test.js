import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'

import CourseContacts from '../CourseContacts'

describe('Component <CourseContacts>', () => {
  test('renders a contacts section', done => {
    render(<CourseContacts />)
    done()
  })
})
