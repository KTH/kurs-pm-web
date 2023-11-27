import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'

import CoursePresentation from '../CoursePresentation'

import i18n from '../../../../../i18n'

const { coursePresentationLabels } = i18n.messages[0]

describe('Component <CoursePresentation>', () => {
  test('renders a links aside', done => {
    render(<CoursePresentation labels={coursePresentationLabels} />)
    done()
  })
})
