import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import { ContentHead, ExtraHeaderHead, SubSectionHeaderMessage } from '../ContentHead'

describe('Component <ContentHead>', () => {
  test('renders a header', (done) => {
    render(<ContentHead memoLangIndex={0} fromSyllabus={{}} />)
    done()
  })
})

describe('Component <ExtraHeaderHead>', () => {
  test('renders a header', (done) => {
    render(<ExtraHeaderHead />)
    done()
  })
})

describe('Component <SubSectionHeaderMessage>', () => {
  test('renders a header message', (done) => {
    render(<SubSectionHeaderMessage />)
    done()
  })
})
