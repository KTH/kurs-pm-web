import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render, screen, within } from '@testing-library/react'
import '@testing-library/jest-dom'
import { WebContextProvider } from '../../context/WebContext'

import AboutCourseMemo from '../AboutCourseMemo'
import { mockMixLadokApi, mockMixKursPmDataApi } from '../mockApis'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: 'localhost:3000/example/path',
  }),
}))

const { getAllByRole, getAllByText, getByText } = screen

describe('User language: Swedish. Component <AboutCourseMemo> show all memos: pdf- and web-based', () => {
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
          courseCode: 'KIP2720',
          applicationCodes: ['1'],
          semester: '20192',
          memoEndPoint: 'KIP272020192-1',
          memoCommonLangAbbr: 'en',
          outdated: false,
        },
        {
          courseCode: 'KIP2720',
          applicationCodes: ['1'],
          semester: '20202',
          memoEndPoint: 'KIP272020202-1',
          memoCommonLangAbbr: 'en',
          outdated: false,
        },
      ],
      allTypeMemos: mockMixKursPmDataApi(),
      allRoundInfos: mockMixLadokApi(),
      language: 'sv',
      userLanguageIndex: 1,
      activeMemoEndPoint: () => false,
      examiners:
        '<p class = "person">\n      <img ' +
        'src="https://www.kth.se/files/thumbnail/kkkkkkkkkk" alt="Profile ' +
        'picture" width="31" height="31">\n      <a ' +
        'href="/profile/kkkkkkkkkk/" target="_blank" ' +
        'property="teach:teacher">\n          Kip TestTeacher \n      ' +
        '</a> \n    </p>',
    }

    render(
      <MemoryRouter>
        <WebContextProvider configIn={context}>
          <AboutCourseMemo location={{}} />
        </WebContextProvider>
      </MemoryRouter>
    )
  })
  test('renders a course memo About page with a list of memos', done => {
    done()
  })

  test('renders and check all H1 headers on the place and correct', done => {
    const allH1Headers = getAllByRole('heading', { level: 1 })
    expect(allH1Headers.length).toBe(1)
    expect(allH1Headers[0]).toHaveTextContent('Kurs-PM')
    done()
  })

  test('renders h2 ', () => {
    const mainContent = screen.getByRole('main')
    const allH2Headers = within(mainContent).getAllByRole('heading', { level: 2 })
    expect(allH2Headers.length).toBe(2)
    const expectedh2ds = ['Publicerade kurs-PM', 'Kontakter']
    expectedh2ds.map((h2, index) => expect(allH2Headers[index]).toHaveTextContent(h2))
  })

  test('renders h3 ', () => {
    const mainContent = screen.getByRole('main')
    const allH3Headers = within(mainContent).getAllByRole('heading', { level: 3 })
    expect(allH3Headers.length).toBe(4)
    const expectedh3ds = [
      'Kursomgångar som startar HT 2020',
      'Kursomgångar som startar HT 2019',
      'Tidigare kursomgångar',
    ]
    expectedh3ds.map((h3, index) => expect(allH3Headers[index]).toHaveTextContent(h3))
  })

  test('renders h4 ', () => {
    const allH4Headers = getAllByRole('heading', { level: 4 })
    expect(allH4Headers.length).toBe(3)
    const expectedh4ds = [
      'HT 2020 (Startdatum 2023-01-17)',
      'HT 2019 (Startdatum 2023-01-17)',
      'HT 2019 (Startdatum 2023-01-17)',
    ]
    expectedh4ds.map((h4, index) => expect(allH4Headers[index]).toHaveTextContent(h4))
  })

  test('renders menu link of web-based memo as expected', done => {
    const menuItems = getAllByText('Course memo Autumn 2019-1')
    expect(menuItems.length).toBe(2)
    expect(menuItems[0]).toBeInTheDocument()
    expect(menuItems[0].href).toBe('http://localhost/kurs-pm/KIP2720/KIP272020192-1')
    expect(menuItems[1]).toBeInTheDocument()
    expect(menuItems[1].href).toBe('http://localhost/kurs-pm/KIP2720/KIP272020192-1')
    done()
  })

  test('renders menu link of web-based memo as expected', done => {
    const menuItems = getAllByText('Course memo Autumn 2020-1')
    expect(menuItems.length).toBe(2)
    expect(menuItems[0]).toBeInTheDocument()
    expect(menuItems[0].href).toBe('http://localhost/kurs-pm/KIP2720/KIP272020202-1')
    expect(menuItems[1]).toBeInTheDocument()
    expect(menuItems[1].href).toBe('http://localhost/kurs-pm/KIP2720/KIP272020202-1')
    done()
  })

  test('renders menu link Before course selection', done => {
    const menuItems = getAllByText('Inför kursval')
    expect(menuItems.length).toBe(2)
    expect(menuItems[0]).toBeInTheDocument()
    expect(menuItems[0].href).toBe('http://localhost/student/kurser/kurs/KIP2720')
    expect(menuItems[1]).toBeInTheDocument()
    expect(menuItems[1].href).toBe('http://localhost/student/kurser/kurs/KIP2720')
    done()
  })

  test('renders menu link Kursens utveckling', done => {
    const menuItems = getAllByText('Kursens utveckling')
    expect(menuItems.length).toBe(2)
    expect(menuItems[0]).toBeInTheDocument()
    expect(menuItems[0].href).toBe('http://localhost/kursutveckling/KIP2720')
    expect(menuItems[1]).toBeInTheDocument()
    expect(menuItems[1].href).toBe('http://localhost/kursutveckling/KIP2720')
    done()
  })

  test('renders menu link Arkiv', done => {
    const menuItems = getAllByText('Arkiv')
    expect(menuItems.length).toBe(4)
    menuItems.forEach(menuItem => {
      expect(menuItem.href).toBe('http://localhost/kursutveckling/KIP2720/arkiv')
    })
    done()
  })

  test('renders menu link Administrera Om kursen', done => {
    const menuItem = getByText('Administrera Om kursen')
    expect(menuItem).toBeInTheDocument()
    expect(menuItem.href).toBe('http://localhost/kursinfoadmin/kurser/kurs/KIP2720?l=sv')
    done()
  })

  test('renders "about memo" list, check pdf-based link as expected, user language', done => {
    const listItem = getByText('Kurs-PM KIP2720 HT 2019-2')
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
    expect(links.length).toBe(15)
    const expectedlinks = [
      'Kurs- och programkatalogen',
      'Inför kursval',
      'Förbereda och gå kurs',
      'Kurs-PM',
      'Course memo Autumn 2019-1',
      'Course memo Autumn 2020-1',
      'Kursens utveckling',
      'Arkiv',
      'Administrera Om kursen',
      'Arkiv',
      'Course memo KIP2720 Autumn 2020-1',
      'Kurs-PM KIP2720 HT 2019-2',
      'Course memo KIP2720 Autumn 2019-1',
      'Arkiv',
      'Kip TestTeacher',
    ]
    expectedlinks.map((link, index) => expect(links[index]).toHaveTextContent(link))
    done()
  })
})

describe('User language: Swedish. Component <AboutCourseMemo> when there are no course memos', () => {
  beforeEach(() => {
    const context = {
      courseCode: 'KIP9999',
      browserConfig: { memoStorageUri: 'kursinfostorage/' },
      memoData: {
        courseTitle: 'KIP9999 Påhittad kurs',
        visibleInMemo: {},
      },
      memoDatas: [], // no memos
      allTypeMemos: {}, // empty
      allRoundInfos: [], // no rounds
      language: 'sv',
      userLanguageIndex: 1,
    }

    render(
      <MemoryRouter>
        <WebContextProvider configIn={context}>
          <AboutCourseMemo location={{}} />
        </WebContextProvider>
      </MemoryRouter>
    )
  })

  test('renders "no memos" message', () => {
    expect(screen.getByText('Denna kurs har inga publicerade kurs-PM.')).toBeInTheDocument()
  })

  test('does not render any h4 memo headings', () => {
    expect(screen.queryAllByRole('heading', { level: 4 }).length).toBe(0)
  })

  test('renders Archive page link even if no memos', () => {
    const archiveLinks = screen.getAllByText('Arkiv')
    expect(archiveLinks.length).toBeGreaterThan(0)
    archiveLinks.forEach(link => {
      expect(link).toHaveAttribute('href', expect.stringContaining('/arkiv'))
    })
  })
})
