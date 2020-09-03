import React from 'react'
import { Provider } from 'mobx-react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import CourseMemo from '../CourseMemo'

import i18n from '../../../../../i18n'
import { language, labels, i18n as mocki18n } from '../__mocks__/mocki18n'
import { routerStore as mockRouterStore } from '../__mocks__/mockRouterStore'

describe('Component <CourseMemo>', () => {
  test('renders a course memo', () => {
    render(
      <Provider routerStore={mockRouterStore}>
        <CourseMemo i18n={i18n} />
      </Provider>
    )
  })

  test('renders component labels in correct language', () => {
    render(
      <Provider
        routerStore={{
          ...mockRouterStore,
          ...{ userLanguageIndex: language.englishLanguageIndex, memoLanguageIndex: language.swedishLanguageIndex }
        }}
      >
        <CourseMemo i18n={mocki18n} />
      </Provider>
    )
    // breadcrumbs – userLanguageIndex
    expect(screen.getByText(labels.englishBreadCrumbLabel)).toBeInTheDocument()
    // SideMenu – userLanguageIndex
    expect(screen.getByText(labels.englishSideMenuLabel)).toBeInTheDocument()
    // CourseHeader – userLanguageIndex for admin link
    expect(screen.getByText(labels.englishCourseHeaderLabel)).toBeInTheDocument()
    // CoursePresentation – memoLanguageIndex
    expect(screen.getByText(labels.swedishCoursePresentationLabel)).toBeInTheDocument()
    // Sections – memoLanguageIndex
    expect(screen.getByText(labels.swedishSectionLabel)).toBeInTheDocument()
    // CourseFacts – memoLanguageIndex
    expect(screen.getByText(labels.swedishCourseFactsLabel)).toBeInTheDocument()
    // CourseMemoLinks – memoLanguageIndex
    expect(screen.getByText(labels.swedishCourseMemoLinksLabel)).toBeInTheDocument()
    // CourseLinks – memoLanguageIndex
    expect(screen.getByText(labels.swedishCourseLinksLabel)).toBeInTheDocument()
    // CourseContacts – memoLanguageIndex
    expect(screen.getByText(labels.swedishCourseContactsLabel)).toBeInTheDocument()
  })
})
