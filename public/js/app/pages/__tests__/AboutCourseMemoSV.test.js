import React from 'react'
import { Provider } from 'mobx-react'
import { hydrate, render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { StaticRouter } from 'react-router'

import AboutCourseMemo from '../AboutCourseMemo'

const mockMixKursPmDataApi = (courseCode) => ({
  20192: [
    {
      courseCode: 'KIP2720',
      courseMemoFileName: 'memo-KIP272020192-14341833da79.pdf',
      ladokRoundIds: ['2'],
      semester: '20192',
      isPdf: true
    },
    {
      courseCode: 'KIP2720',
      ladokRoundIds: ['1'],
      semester: '20192',
      memoEndPoint: 'KIP272020192-1',
      memoCommonLangAbbr: 'en',
      memoName: 'Autumn 2019-1 (Start date 26/08/2019, English)',
      isPdf: false
    }
  ],
  20202: [
    {
      courseCode: 'KIP2720',
      ladokRoundIds: ['1'],
      semester: '20202',
      memoEndPoint: 'KIP272020202-1',
      memoCommonLangAbbr: 'en',
      memoName: 'Autumn 2020-1 (Start date 24/08/2020, English)',
      isPdf: false
    }
  ]
})

const { getAllByRole, getAllByTestId, getAllByText, getByTestId, getByText } = screen

describe('User language: Swedish. Component <AboutCourseMemo> show all memos: pdf- and web-based', () => {
  beforeEach(() => {
    const routerStore = {
      courseCode: 'KIP2720',
      browserConfig: { imageStorageUri: 'localhost://', memoStorageUri: 'kursinfostorage/' },
      noMemoData: () => true,
      memoData: {
        courseTitle: 'KIP2720 Projektstyrning 7,5 hp',
        visibleInMemo: {}
      },
      memoDatas: [
        {
          ladokRoundIds: ['1'],
          semester: '20192',
          memoEndPoint: 'KIP272020192-1',
          memoCommonLangAbbr: 'en'
        },
        {
          ladokRoundIds: ['1'],
          semester: '20202',
          memoEndPoint: 'KIP272020202-1',
          memoCommonLangAbbr: 'en'
        }
      ],
      // memoLanguageIndex: 0,
      language: 'sv',
      userLanguageIndex: 1,
      activeMemoEndPoint: (id) => false,
      roundIds: [],
      examiners:
        '<p class = "person">\n      <img ' +
        'src="https://www.kth.se/files/thumbnail/kkkkkkkkkk" alt="Profile ' +
        'picture" width="31" height="31">\n      <a ' +
        'href="/profile/kkkkkkkkkk/" target="_blank" ' +
        'property="teach:teacher">\n          Kip TestTeacher \n      ' +
        '</a> \n    </p>'
    }
    render(
      <StaticRouter>
        <Provider routerStore={routerStore}>
          <AboutCourseMemo mockKursPmDataApi={mockMixKursPmDataApi()} />
        </Provider>
      </StaticRouter>
    )
  })
  test('renders a course memo About page with a list of memos', (done) => {
    done()
  })

  test('renders and check all H1 headers on the place and correct', (done) => {
    const allH1Headers = getAllByRole('heading', { level: 1 })
    expect(allH1Headers.length).toBe(1)
    expect(allH1Headers[0]).toHaveTextContent('Om kurs-PM')
    done()
  })

  test('renders h2 ', () => {
    const allH2Headers = getAllByRole('heading', { level: 2 })
    expect(allH2Headers.length).toBe(2)
    const expectedh2ds = ['Aktuella kurs-PM', 'Kontakter']
    expectedh2ds.map((h2, index) => expect(allH2Headers[index]).toHaveTextContent(h2))
  })

  test('renders h3 ', () => {
    const allH3Headers = getAllByRole('heading', { level: 3 })
    expect(allH3Headers.length).toBe(2)
    const expectedh3ds = ['HT 2019', 'HT 2020']
    expectedh3ds.map((h3, index) => expect(allH3Headers[index]).toHaveTextContent(h3))
  })

  test('renders h4 ', () => {
    const allH4Headers = getAllByRole('heading', { level: 4 })
    expect(allH4Headers.length).toBe(2)
    const expectedh4ds = ['Kontaktperson', 'Examinator']
    expectedh4ds.map((h4, index) => expect(allH4Headers[index]).toHaveTextContent(h4))
  })

  test('renders text about empty fields (Kontaktperson) ', () => {
    const noInfo = getAllByText('Ingen information tillagd')
    expect(noInfo.length).toBe(1)
  })

  test('renders menu link of web-based memo as expected', (done) => {
    const menuItem = getByText('Course memo Autumn 2019-1')
    expect(menuItem).toBeInTheDocument()
    expect(menuItem.href).toBe('http://localhost/kurs-pm/KIP2720/KIP272020192-1')

    done()
  })

  test('renders menu link of web-based memo as expected', (done) => {
    const menuItem = getByText('Course memo Autumn 2020-1')
    expect(menuItem).toBeInTheDocument()
    expect(menuItem.href).toBe('http://localhost/kurs-pm/KIP2720/KIP272020202-1')
    done()
  })

  test('renders menu link Before choosing course', (done) => {
    const menuItem = getByText('Inför kursval')
    expect(menuItem).toBeInTheDocument()
    expect(menuItem.href).toBe('http://localhost/student/kurser/kurs/KIP2720')
    done()
  })

  test('renders menu link Kursens utveckling och historik', (done) => {
    const menuItem = getByText('Kursens utveckling och historik')
    expect(menuItem).toBeInTheDocument()
    expect(menuItem.href).toBe('http://localhost/kursutveckling/KIP2720')
    done()
  })

  test('renders menu link Administrera Om kursen', (done) => {
    const menuItem = getByText('Administrera Om kursen')
    expect(menuItem).toBeInTheDocument()
    expect(menuItem.href).toBe('http://localhost/kursinfoadmin/kurser/kurs/KIP2720?l=sv')
    done()
  })

  test('renders "about memo" list, check pdf-based link as expected, user language', (done) => {
    const listItem = getByText('Kurs-PM KIP2720 HT 2019-2')
    expect(listItem).toBeInTheDocument()
    expect(listItem.href).toBe('http://localhost/kursinfostorage/memo-KIP272020192-14341833da79.pdf')
    done()
  })

  test('renders "about memo" list, check web-based link as expected,  memo language', (done) => {
    const listItem = getByText('Course memo KIP2720 Autumn 2019-1')
    expect(listItem).toBeInTheDocument()
    expect(listItem.href).toBe('http://localhost/kurs-pm/KIP2720/KIP272020192-1')
    done()
  })

  test('renders "about memo" list, check web-based link as expected, memo language', (done) => {
    const listItem = getByText('Course memo KIP2720 Autumn 2020-1')
    expect(listItem).toBeInTheDocument()
    expect(listItem.href).toBe('http://localhost/kurs-pm/KIP2720/KIP272020202-1')
    done()
  })

  test('renders all links and check its number and labels', () => {
    const links = getAllByRole('link')
    expect(links.length).toBe(13)
    const expectedlinks = [
      'KTH',
      'Student på KTH',
      'Kurs- och programkatalogen',
      'Kurs- och programkatalogen',
      'Inför kursval',
      'Course memo Autumn 2019-1',
      'Course memo Autumn 2020-1',
      'Kursens utveckling och historik',
      'Administrera Om kursen',
      'Kurs-PM KIP2720 HT 2019-2',
      'Course memo KIP2720 Autumn 2019-1',
      'Course memo KIP2720 Autumn 2020-1',
      'Kip TestTeacher'
    ]
    expectedlinks.map((link, index) => expect(links[index]).toHaveTextContent(link))
  })
})