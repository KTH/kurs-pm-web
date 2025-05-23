import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render, screen, within } from '@testing-library/react'
import '@testing-library/jest-dom'
import { WebContextProvider } from '../../context/WebContext'

import AboutCourseMemo from '../AboutCourseMemo'
import { mockMixLadokApi, mockMixKursPmDataApi } from '../mockApis'

const { getAllByRole, getAllByText, getByText } = screen
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: 'localhost:3000/example/path',
  }),
}))
describe('User language: English. Component <AboutCourseMemo> show all memos: pdf- and web-based', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern')
    jest.setSystemTime(new Date(2007, 8, 1))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  beforeEach(() => {
    const context = {
      courseCode: 'KIP2720',
      browserConfig: { memoStorageUri: 'kursinfostorage/' },
      memoData: {
        courseTitle: 'KIP2720 Projektstyrning 7,5 hp',
        visibleInMemo: {},
      },
      memoDatas: [
        {
          applicationCodes: ['1'],
          semester: '20192',
          memoEndPoint: 'KIP272020192-1',
          memoCommonLangAbbr: 'en',
          outdated: false,
          courseCode: 'KIP2720',
        },
        {
          applicationCodes: ['1'],
          semester: '20202',
          memoEndPoint: 'KIP272020202-1',
          memoCommonLangAbbr: 'en',
          outdated: false,
          courseCode: 'KIP2720',
        },
      ],
      allTypeMemos: mockMixKursPmDataApi(),
      allRoundInfos: mockMixLadokApi(),
      language: 'en',
      userLanguageIndex: 0,
    }
    render(
      <MemoryRouter>
        <WebContextProvider configIn={context}>
          <AboutCourseMemo location={{}} />
        </WebContextProvider>
      </MemoryRouter>
    )
  })

  test('renders a course memo About page with a list of memos', () => {})

  test('renders and check all H1 headers on the place and correct', () => {
    const allH1Headers = getAllByRole('heading', { level: 1 })
    expect(allH1Headers.length).toBe(1)
    expect(allH1Headers[0]).toHaveTextContent('Course memo')
  })

  test('renders h2 ', () => {
    const mainContent = screen.getByRole('main')

    const allH2Headers = within(mainContent).getAllByRole('heading', { level: 2 })
    expect(allH2Headers.length).toBe(2)
    const expectedh2ds = ['Published course memos', 'Contacts']
    expectedh2ds.map((h2, index) => expect(allH2Headers[index]).toHaveTextContent(h2))
  })

  test('renders h3 ', () => {
    const mainContent = screen.getByRole('main')

    const allH3Headers = within(mainContent).getAllByRole('heading', { level: 3 })
    expect(allH3Headers.length).toBe(4)
    const expectedh3ds = [
      'Course offerings starting Autumn 2020',
      'Course offerings starting Autumn 2019',
      'Previous course offerings',
    ]
    expectedh3ds.map((h3, index) => expect(allH3Headers[index]).toHaveTextContent(h3))
  })

  test('renders h4 ', () => {
    const allH4Headers = getAllByRole('heading', { level: 4 })
    expect(allH4Headers.length).toBe(3)
    const expectedh4ds = [
      'Autumn 2020 (Start date 17 Jan 2023)',
      'Autumn 2019 (Start date 17 Jan 2023)',
      'Autumn 2019 (Start date 17 Jan 2023)',
    ]
    expectedh4ds.map((h4, index) => expect(allH4Headers[index]).toHaveTextContent(h4))
  })

  test('renders text about empty fields (Course Contact, Examiner) ', () => {
    const noInfo = getAllByText('No information inserted')
    expect(noInfo.length).toBe(1)
  })

  test('renders menu link of web-based memo as expected', () => {
    const menuItems = getAllByText('Course memo Autumn 2019-1')
    expect(menuItems.length).toBe(2)

    expect(menuItems[0]).toBeInTheDocument()
    expect(menuItems[0].href).toBe('http://localhost/kurs-pm/KIP2720/KIP272020192-1')
    expect(menuItems[1]).toBeInTheDocument()
    expect(menuItems[1].href).toBe('http://localhost/kurs-pm/KIP2720/KIP272020192-1')
  })

  test('renders menu link of web-based memo as expected', () => {
    const menuItems = getAllByText('Course memo Autumn 2020-1')
    expect(menuItems.length).toBe(2)

    expect(menuItems[0]).toBeInTheDocument()
    expect(menuItems[0].href).toBe('http://localhost/kurs-pm/KIP2720/KIP272020202-1')
    expect(menuItems[1]).toBeInTheDocument()
    expect(menuItems[1].href).toBe('http://localhost/kurs-pm/KIP2720/KIP272020202-1')
  })

  test('renders menu link Before course selection', () => {
    const menuItems = getAllByText('Before course selection')
    expect(menuItems.length).toBe(2)

    expect(menuItems[0]).toBeInTheDocument()
    expect(menuItems[0].href).toBe('http://localhost/student/kurser/kurs/KIP2720?l=en')
    expect(menuItems[1]).toBeInTheDocument()
    expect(menuItems[1].href).toBe('http://localhost/student/kurser/kurs/KIP2720?l=en')
  })

  test('renders menu link Course development', () => {
    const menuItems = getAllByText('Course development')
    expect(menuItems.length).toBe(2)

    expect(menuItems[0]).toBeInTheDocument()
    expect(menuItems[0].href).toBe('http://localhost/kursutveckling/KIP2720?l=en')
    expect(menuItems[1]).toBeInTheDocument()
    expect(menuItems[1].href).toBe('http://localhost/kursutveckling/KIP2720?l=en')
  })

  test('renders menu link Archive', () => {
    const menuItems = getAllByText('Archive')

    expect(menuItems.length).toBe(2)
    menuItems.forEach(menuItem => {
      expect(menuItem.href).toBe('http://localhost/kursutveckling/KIP2720/arkiv?l=en')
    })
  })

  test('renders menu link Archive', () => {
    const menuItems = getAllByText('Archive page')
    expect(menuItems.length).toBe(2)
    menuItems.forEach(menuItem => {
      expect(menuItem.href).toBe('http://localhost/kursutveckling/KIP2720/arkiv?l=en')
    })
  })

  test('renders menu link Administer About course', () => {
    const menuItem = getByText('Administer About course')
    expect(menuItem).toBeInTheDocument()
    expect(menuItem.href).toBe('http://localhost/kursinfoadmin/kurser/kurs/KIP2720?l=en')
  })

  test('renders "about memo" list, check pdf-based link as expected, user language', () => {
    const listItem = getByText('Course memo KIP2720 Autumn 2019-2')
    expect(listItem).toBeInTheDocument()
    expect(listItem.href).toBe('http://localhost/kursinfostorage/memo-KIP272020192-14341833da79.pdf')
  })

  test('renders "about memo" list, check web-based link as expected,  memo language', () => {
    const listItem = getByText('Course memo KIP2720 Autumn 2019-1')
    expect(listItem).toBeInTheDocument()
    expect(listItem.href).toBe('http://localhost/kurs-pm/KIP2720/KIP272020192-1')
  })

  test('renders "about memo" list, check web-based link as expected, memo language', () => {
    const listItem = getByText('Course memo KIP2720 Autumn 2020-1')
    expect(listItem).toBeInTheDocument()
    expect(listItem.href).toBe('http://localhost/kurs-pm/KIP2720/KIP272020202-1')
  })

  test('renders all links and check its number and labels', () => {
    const links = getAllByRole('link')
    expect(links.length).toBe(14)
    const expectedlinks = [
      'Course and programme directory',
      'Before course selection',
      'Prepare and take course',
      'Course memo',
      'Course memo Autumn 2019-1',
      'Course memo Autumn 2020-1',
      'Course development',
      'Archive',
      'Administer About course',
      'Archive',
      'Course memo KIP2720 Autumn 2020-1',
      'Course memo KIP2720 Autumn 2019-2',
      'Course memo KIP2720 Autumn 2019-1',
      'Archive',
    ]
    expectedlinks.map((link, index) => expect(links[index]).toHaveTextContent(link))
  })
})
