import React from 'react'
import { Provider } from 'mobx-react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { WebContextProvider } from '../../context/WebContext'

import AboutCourseMemo from '../AboutCourseMemo'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: 'localhost:3000/example/path',
  }),
}))

const mockMixKursPmDataApi = () => ({
  20192: [
    {
      courseCode: 'KIP2720',
      courseMemoFileName: 'memo-KIP272020192-14341833da79.pdf',
      applicationCodes: ['23456'],
      semester: '20192',
      isPdf: true,
    },
    {
      courseCode: 'KIP2720',
      applicationCodes: ['12345'],
      semester: '20192',
      memoEndPoint: 'KIP272020192-12345',
      memoCommonLangAbbr: 'en',
      memoName: 'Autumn 2019-1 (Start date 26/08/2019, English)',
      isPdf: false,
    },
  ],
  20202: [
    {
      courseCode: 'KIP2720',
      applicationCodes: ['12345'],
      semester: '20202',
      memoEndPoint: 'KIP272020202-12345',
      memoCommonLangAbbr: 'en',
      memoName: 'Autumn 2020-1 (Start date 24/08/2020, English)',
      isPdf: false,
    },
  ],
})

const mockMixKoppsApi = () => [
  {
    shortName: '',
    applicationCodes: ['12345'],
    firstTuitionDate: '2023-01-17',
    lastTuitionDate: '2023-03-17',
    term: '20212',
  },

  {
    shortName: '',
    applicationCodes: ['12345'],
    firstTuitionDate: '2023-01-17',
    lastTuitionDate: '2023-03-17',
    term: '20202',
  },
  {
    shortName: '',
    applicationCodes: ['12345'],
    firstTuitionDate: '2023-01-17',
    lastTuitionDate: '2023-03-17',
    term: '20192',
  },
  {
    shortName: '',
    applicationCodes: ['23456'],
    firstTuitionDate: '2023-01-17',
    lastTuitionDate: '2023-03-17',
    term: '20192',
  },
]

const { getAllByRole, getAllByText, getByText } = screen

describe('User language: Swedish. Component <AboutCourseMemo> show all memos: pdf- and web-based', () => {
  beforeEach(() => {
    const context = {
      courseCode: 'KIP2720',
      browserConfig: { imageStorageUri: 'localhost://', memoStorageUri: 'kursinfostorage/' },
      memoData: {
        courseTitle: 'KIP2720 Projektstyrning 7,5 hp',
        visibleInMemo: {},
      },
      memoDatas: [
        {
          courseCode: 'KIP2720',
          applicationCodes: ['12345'],
          semester: '20192',
          memoEndPoint: 'KIP272020192-12345',
          memoCommonLangAbbr: 'en',
          outdated: false,
        },
        {
          courseCode: 'KIP2720',
          applicationCodes: ['12345'],
          semester: '20202',
          memoEndPoint: 'KIP272020202-12345',
          memoCommonLangAbbr: 'en',
          outdated: false,
        },
      ],
      // memoLanguageIndex: 0,
      language: 'sv',
      userLanguageIndex: 1,
      activeMemoEndPoint: () => false,
      roundIds: [],
      examiners:
        '<p class = "person">\n      <img ' +
        'src="https://www.kth.se/files/thumbnail/kkkkkkkkkk" alt="Profile ' +
        'picture" width="31" height="31">\n      <a ' +
        'href="/profile/kkkkkkkkkk/" target="_blank" ' +
        'property="teach:teacher">\n          Kip TestTeacher \n      ' +
        '</a> \n    </p>',
    }
    render(
      <WebContextProvider configIn={context}>
        <AboutCourseMemo mockKursPmDataApi={mockMixKursPmDataApi()} mockMixKoppsApi={mockMixKoppsApi()} location={{}} />
      </WebContextProvider>
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
    const allH2Headers = getAllByRole('heading', { level: 2 })
    expect(allH2Headers.length).toBe(2)
    const expectedh2ds = ['Publicerade kurs-PM', 'Kontakter']
    expectedh2ds.map((h2, index) => expect(allH2Headers[index]).toHaveTextContent(h2))
  })

  test('renders h3 ', () => {
    const allH3Headers = getAllByRole('heading', { level: 3 })
    expect(allH3Headers.length).toBe(6)
    const expectedh3ds = [
      'Kursomgångar som startar HT 2021',
      'Kursomgångar som startar HT 2020',
      'Kursomgångar som startar HT 2019',
      'Tidigare kursomgångar',
    ]
    expectedh3ds.map((h3, index) => expect(allH3Headers[index]).toHaveTextContent(h3))
  })

  test('renders h4 ', () => {
    const allH4Headers = getAllByRole('heading', { level: 4 })
    expect(allH4Headers.length).toBe(1)
    const expectedh4ds = ['HT 2021 (Startdatum 2023-01-17)']
    expectedh4ds.map((h4, index) => expect(allH4Headers[index]).toHaveTextContent(h4))
  })

  test('renders text about empty fields (Kontaktperson) ', () => {
    const noInfo = getAllByText('Ingen information tillagd')
    expect(noInfo.length).toBe(1)
  })

  xtest('renders menu link of web-based memo as expected', done => {
    const menuItem = getByText('Course memo Autumn 2019-12345')
    expect(menuItem).toBeInTheDocument()
    expect(menuItem.href).toBe('http://localhost/kurs-pm/KIP2720/KIP272020192-12345')

    done()
  })

  test('renders menu link of web-based memo as expected', done => {
    const menuItem = getByText('Course memo Autumn 2020-12345')
    expect(menuItem).toBeInTheDocument()
    expect(menuItem.href).toBe('http://localhost/kurs-pm/KIP2720/KIP272020202-12345')
    done()
  })

  test('renders menu link Before course selection', done => {
    const menuItem = getByText('Inför kursval')
    expect(menuItem).toBeInTheDocument()
    expect(menuItem.href).toBe('http://localhost/student/kurser/kurs/KIP2720')
    done()
  })

  test('renders menu link Kursens utveckling', done => {
    const menuItem = getByText('Kursens utveckling')
    expect(menuItem).toBeInTheDocument()
    expect(menuItem.href).toBe('http://localhost/kursutveckling/KIP2720')
    done()
  })

  test('renders menu link Arkiv', done => {
    const menuItems = getAllByText('Arkiv')
    expect(menuItems.length).toBe(2)
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

  xtest('renders "about memo" list, check pdf-based link as expected, user language', done => {
    const listItem = getByText('Kurs-PM KIP2720 HT 2019-23456')
    expect(listItem).toBeInTheDocument()
    expect(listItem.href).toBe('http://localhost/kursinfostorage/memo-KIP272020192-14341833da79.pdf')
    done()
  })

  xtest('renders "about memo" list, check web-based link as expected,  memo language', done => {
    const listItem = getByText('Course memo KIP2720 Autumn 2019-12345')
    expect(listItem).toBeInTheDocument()
    expect(listItem.href).toBe('http://localhost/kurs-pm/KIP2720/KIP272020192-12345')
    done()
  })

  xtest('renders "about memo" list, check web-based link as expected, memo language', done => {
    const listItem = getByText('Course memo KIP2720 Autumn 2020-12345')
    expect(listItem).toBeInTheDocument()
    expect(listItem.href).toBe('http://localhost/kurs-pm/KIP2720/KIP272020202-12345')
    done()
  })

  test('renders all links and check its number and labels', done => {
    const links = getAllByRole('link')
    expect(links.length).toBe(10)
    const expectedlinks = [
      'Kurs- och programkatalogen',
      'Om kursen KIP2720',
      'Inför kursval',
      'Course memo Autumn 2019-12345',
      'Course memo Autumn 2020-12345',
      'Kursens utveckling',
      'Arkiv',
      'Administrera Om kursen',
      'Arkiv',
      'Kip TestTeacher',
    ]
    expectedlinks.map((link, index) => expect(links[index]).toHaveTextContent(link))
    done()
  })
})
