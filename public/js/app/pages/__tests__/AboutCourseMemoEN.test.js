import React from 'react'
import { Provider } from 'mobx-react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { StaticRouter } from 'react-router'

import AboutCourseMemo from '../AboutCourseMemo'
// import { getWebAndPdfMemos } from '../AboutCourseMemo'

const mockMixKursPmDataApi = () => ({
  20192: [
    {
      courseCode: 'KIP2720',
      courseMemoFileName: 'memo-KIP272020192-14341833da79.pdf',
      ladokRoundIds: ['2'],
      semester: '20192',
      isPdf: true,
    },
    {
      courseCode: 'KIP2720',
      ladokRoundIds: ['1'],
      semester: '20192',
      memoEndPoint: 'KIP272020192-1',
      memoCommonLangAbbr: 'en',
      memoName: 'Autumn 2019-1 (Start date 26/08/2019, English)',
      isPdf: false,
    },
  ],
  20202: [
    {
      courseCode: 'KIP2720',
      ladokRoundIds: ['1'],
      semester: '20202',
      memoEndPoint: 'KIP272020202-1',
      memoCommonLangAbbr: 'en',
      memoName: 'Autumn 2020-1 (Start date 24/08/2020, English)',
      isPdf: false,
    },
  ],
})

const { getAllByRole, getAllByText, getByText } = screen

describe('User language: English. Component <AboutCourseMemo> show all memos: pdf- and web-based', () => {
  beforeEach(() => {
    const routerStore = {
      courseCode: 'KIP2720',
      browserConfig: { imageStorageUri: 'localhost://', memoStorageUri: 'kursinfostorage/' },
      noMemoData: () => true,
      memoData: {
        courseTitle: 'KIP2720 Projektstyrning 7,5 hp',
        visibleInMemo: {},
      },
      memoDatas: [
        {
          ladokRoundIds: ['1'],
          semester: '20192',
          memoEndPoint: 'KIP272020192-1',
          memoCommonLangAbbr: 'en',
          outdated: false,
        },
        {
          ladokRoundIds: ['1'],
          semester: '20202',
          memoEndPoint: 'KIP272020202-1',
          memoCommonLangAbbr: 'en',
          outdated: false,
        },
      ],
      language: 'en',
      userLanguageIndex: 0,
      activeMemoEndPoint: () => false,
      roundIds: [],
    }
    render(
      <StaticRouter>
        <Provider routerStore={routerStore}>
          <AboutCourseMemo mockKursPmDataApi={mockMixKursPmDataApi()} location={{}} />
        </Provider>
      </StaticRouter>
    )
  })
  test('renders a course memo About page with a list of memos', done => {
    done()
  })

  test('renders and check all H1 headers on the place and correct', done => {
    const allH1Headers = getAllByRole('heading', { level: 1 })
    expect(allH1Headers.length).toBe(1)
    expect(allH1Headers[0]).toHaveTextContent('Course memo')
    done()
  })

  test('renders h2 ', () => {
    const allH2Headers = getAllByRole('heading', { level: 2 })
    expect(allH2Headers.length).toBe(2)
    const expectedh2ds = ['Published course memos', 'Contacts']
    expectedh2ds.map((h2, index) => expect(allH2Headers[index]).toHaveTextContent(h2))
  })

  test('renders h3 ', () => {
    const allH3Headers = getAllByRole('heading', { level: 3 })
    expect(allH3Headers.length).toBe(5)
    const expectedh3ds = [
      'Course offerings starting Autumn 2020',
      'Course offerings starting Autumn 2019',
      'Previous course offerings',
    ]
    expectedh3ds.map((h3, index) => expect(allH3Headers[index]).toHaveTextContent(h3))
  })

  test('renders text about empty fields (Course Contact, Examiner) ', () => {
    const noInfo = getAllByText('No information inserted')
    expect(noInfo.length).toBe(2)
  })

  test('renders menu link of web-based memo as expected', done => {
    const menuItem = getByText('Course memo Autumn 2019-1')
    expect(menuItem).toBeInTheDocument()
    expect(menuItem.href).toBe('http://localhost/kurs-pm/KIP2720/KIP272020192-1')

    done()
  })

  test('renders menu link of web-based memo as expected', done => {
    const menuItem = getByText('Course memo Autumn 2020-1')
    expect(menuItem).toBeInTheDocument()
    expect(menuItem.href).toBe('http://localhost/kurs-pm/KIP2720/KIP272020202-1')
    done()
  })

  test('renders menu link Before course selection', done => {
    const menuItem = getByText('Before course selection')
    expect(menuItem).toBeInTheDocument()
    expect(menuItem.href).toBe('http://localhost/student/kurser/kurs/KIP2720?l=en')
    done()
  })

  test('renders menu link Course development', done => {
    const menuItem = getByText('Course development')
    expect(menuItem).toBeInTheDocument()
    expect(menuItem.href).toBe('http://localhost/kursutveckling/KIP2720?l=en')
    done()
  })

  test('renders menu link Archive', done => {
    const menuItems = getAllByText('Archive')
    expect(menuItems.length).toBe(2)
    menuItems.forEach(menuItem => {
      expect(menuItem.href).toBe('http://localhost/kursutveckling/KIP2720/arkiv?l=en')
    })
    done()
  })

  test('renders menu link Administrate About course', done => {
    const menuItem = getByText('Administrate About course')
    expect(menuItem).toBeInTheDocument()
    expect(menuItem.href).toBe('http://localhost/kursinfoadmin/kurser/kurs/KIP2720?l=en')
    done()
  })

  test('renders "about memo" list, check pdf-based link as expected, user language', done => {
    const listItem = getByText('Course memo KIP2720 Autumn 2019-2')
    expect(listItem).toBeInTheDocument()
    expect(listItem.href).toBe('http://localhost/kursinfostorage/memo-KIP272020192-14341833da79.pdf')
    done()
  })

  test('renders "about memo" list, check web-based link as expected,  memo language', done => {
    const listItem = getByText('Course memo KIP2720 Autumn 2019-1')
    expect(listItem).toBeInTheDocument()
    expect(listItem.href).toBe('http://localhost/kurs-pm/KIP2720/KIP272020192-1')
    done()
  })

  test('renders "about memo" list, check web-based link as expected, memo language', done => {
    const listItem = getByText('Course memo KIP2720 Autumn 2020-1')
    expect(listItem).toBeInTheDocument()
    expect(listItem.href).toBe('http://localhost/kurs-pm/KIP2720/KIP272020202-1')
    done()
  })

  test('renders all links and check its number and labels', done => {
    const links = getAllByRole('link')
    expect(links.length).toBe(12)
    const expectedlinks = [
      'Course and programme directory',
      'About course KIP2720',
      'Before course selection',
      'Course memo Autumn 2019-1',
      'Course memo Autumn 2020-1',
      'Course development',
      'Archive',
      'Administrate About course',
      'Course memo KIP2720 Autumn 2020-1',
      'Course memo KIP2720 Autumn 2019-2',
      'Course memo KIP2720 Autumn 2019-1',
      'Archive',
    ]
    expectedlinks.map((link, index) => expect(links[index]).toHaveTextContent(link))
    done()
  })
})
