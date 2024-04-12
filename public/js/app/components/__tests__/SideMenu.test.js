import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'

import SideMenu from '../SideMenu'

import i18n from '../../../../../i18n'

const { sideMenuLabels } = i18n.messages[0]

const mockCourseMemoItems = [
  {
    id: '1',
    label: '1',
    active: false,
    url: 'https://test.com',
    outdated: false,
  },
  {
    id: '2',
    label: '2',
    active: true,
    url: 'https://test.com',
    outdated: false,
  },
  {
    id: '3',
    label: '3',
    active: false,
    url: 'https://test.com',
    outdated: true,
  },
  {
    id: '4',
    label: '4',
    active: false,
    url: 'https://test.com',
    outdated: false,
  },
]

describe('Component <SideMenu>', () => {
  test('renders', done => {
    render(<SideMenu labels={sideMenuLabels} courseMemoItems={[]} />)
    done()
  })
  test('renders memos', done => {
    const { getAllByRole } = render(<SideMenu labels={sideMenuLabels} courseMemoItems={mockCourseMemoItems} />)
    const listItems = getAllByRole('listitem')
    expect(listItems).toHaveLength(8)
    done()
  })
})
