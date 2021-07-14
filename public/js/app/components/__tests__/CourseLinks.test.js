import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import CourseLinks from '../CourseLinks'

import i18n from '../../../../../i18n'

const { courseLinksLabels } = i18n.messages[0]

describe('Component <CourseLinks>', () => {
  test('renders a links aside', done => {
    render(<CourseLinks labels={courseLinksLabels} />)
    done()
  })
})
