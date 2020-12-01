import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import CourseFacts from '../CourseFacts'

import i18n from '../../../../../i18n'

const { courseFactsLabels } = i18n.messages[0]

describe('Component <CourseFacts>', () => {
  test('renders a facts section', (done) => {
    render(<CourseFacts labels={courseFactsLabels} />)
    done()
  })
})
