import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import { ContentHead, ExtraHeaderHead, SubSectionHeaderMessage } from '../ContentHead'

describe('Component <ContentHead>', () => {
  test('renders a header', () => {
    render(<ContentHead memoLangIndex={0} fromSyllabus={{}} />)
  })
})

describe('Component <ExtraHeaderHead>', () => {
  test('renders a header', () => {
    render(<ExtraHeaderHead />)
  })
})

describe('Component <SubSectionHeaderMessage>', () => {
  test('renders a header message', () => {
    render(<SubSectionHeaderMessage />)
  })
})
