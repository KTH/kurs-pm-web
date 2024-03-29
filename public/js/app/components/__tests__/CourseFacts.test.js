import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import CourseFacts from '../CourseFacts'

import i18n from '../../../../../i18n'

const { courseFactsLabels } = i18n.messages[0]

const TEST_MEMO_DATA_1_ROUND = {
  startDate: '2020-10-17',
  applicationCodes: ['1'],
  memoName: 'CDEPR1 (Startdatum 2020-10-17, Svenska)',
  languageOfInstructions: '',
  departmentName: '',
  semester: '20202',
}

const TEST_MEMO_DATA_2_ROUNDS = {
  startDate: '2020-10-17',
  applicationCodes: ['1', '2'],
  memoName: 'CDEPR1 (Startdatum 2020-10-17, Svenska), CMEDT1 (Startdatum 2020-10-17, Svenska)',
  languageOfInstructions: 'Svenska',
  departmentName: 'SCI/Matematik',
  semester: '20202',
}

describe('Component <CourseFacts>', () => {
  test('renders a facts section', done => {
    render(<CourseFacts labels={courseFactsLabels} />)
    done()
  })

  test('renders Missing mandatory information if field is empty ', done => {
    render(<CourseFacts labels={courseFactsLabels} memoData={TEST_MEMO_DATA_1_ROUND} />)
    const missing = screen.getAllByText('Missing mandatory information')
    expect(missing.length).toBe(2)
    done()
  })

  test('renders course memo name as one round ', done => {
    render(<CourseFacts labels={courseFactsLabels} memoData={TEST_MEMO_DATA_1_ROUND} />)
    const round = screen.getByText('CDEPR1 HT 2020-1')
    expect(round).toBeInTheDocument()
    done()
  })

  test('renders course memo name as two rounds', done => {
    render(<CourseFacts labels={courseFactsLabels} memoData={TEST_MEMO_DATA_2_ROUNDS} />)
    const round1 = screen.getByText('CDEPR1 HT 2020-1')
    expect(round1).toBeInTheDocument()
    const round2 = screen.getByText('CMEDT1 HT 2020-2')
    expect(round2).toBeInTheDocument()
    done()
  })
})
