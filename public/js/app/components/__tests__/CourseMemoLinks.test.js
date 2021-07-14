import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import CourseMemoLinks from '../CourseMemoLinks'

import i18n from '../../../../../i18n'

const { courseMemoLinksLabels } = i18n.messages[0]

describe('Component <CourseMemoLinks>', () => {
  test('renders a links aside', done => {
    render(<CourseMemoLinks labels={courseMemoLinksLabels} />)
    done()
  })
})
