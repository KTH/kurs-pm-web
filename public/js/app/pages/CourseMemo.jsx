import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { useLocation, useNavigate } from 'react-router-dom'

import { Container, Row, Col } from 'reactstrap'
import { Breadcrumbs } from '@kth/kth-reactstrap/dist/components/utbildningsinfo'

import i18n from '../../../../i18n'
import { concatMemoName } from '../util/helpers'
import { sideMenuBackLink } from '../util/links'
import { resolveCourseImage } from '../util/course-image'
import { menuItemsForCurrentMemo } from '../util/menu-memo-items'

import { useWebContext } from '../context/WebContext'

import CoursePresentation from '../components/CoursePresentation'
import SideMenu from '../components/SideMenu'
import CourseHeader from '../components/CourseHeader'
import CourseContacts from '../components/CourseContacts'
import CourseFacts from '../components/CourseFacts'
import CourseLinks from '../components/CourseLinks'
import CourseMemoLinks from '../components/CourseMemoLinks'
import CoverPage from '../components/print/CoverPage'
import Contacts from '../components/print/Contacts'
import AllSections from '../components/AllSections'

function renderBreadcrumbsIntoKthHeader(courseCode, languageAbbr) {
  const breadcrumbContainer = document.getElementById('breadcrumbs-header')
  if (breadcrumbContainer) {
    ReactDOM.render(
      <Breadcrumbs include={'aboutCourse'} courseCode={courseCode} language={languageAbbr} />,
      breadcrumbContainer
    )
  }
}

const determineContentFlexibility = () => {
  const lastColLastElem = document.getElementById('last-element-which-determines-styles')
  if (lastColLastElem) {
    const lastElBottomPx = lastColLastElem.getBoundingClientRect().bottom
    const allCenterSections = document.getElementById('flexible-content-of-center').querySelectorAll('article')
    allCenterSections.forEach(section => {
      const topOfSection = section.getBoundingClientRect().top
      if (topOfSection > lastElBottomPx) section.classList.add('flexible-section-style')
    })
  }
}

function getUrl() {
  if (typeof window !== 'undefined') {
    return window.location.href
  }
  return null
}

const redirectToAbout = (courseCode, location) => {
  const { pathname } = location
  const fromPersonalMenu = `/${courseCode}/\\d*/\\d*`
  const withMemoEndPoint = `/${courseCode}/\\w*\\d*-\\d*`
  if (pathname.match(fromPersonalMenu)) {
    const courseAndSemesterAndRoundId = pathname.replace(`/kurs-pm/${courseCode}/`, '')
    const [, , semester, roundId] = courseAndSemesterAndRoundId.split('/')
    const roundIds = [roundId]
    return { noMemoData: true, semester, roundIds }
  }
  if (pathname.match(withMemoEndPoint)) {
    const potentialMemoEndPoint = pathname.replace(`/kurs-pm/${courseCode}/`, '')
    const potentialMemoEndPointParts = potentialMemoEndPoint.split('-')
    if (potentialMemoEndPointParts.length > 1) {
      const [potentialCourseCodeAndSemester] = potentialMemoEndPointParts
      const semester = potentialCourseCodeAndSemester.replace(courseCode, '') || ''
      const roundIds = potentialMemoEndPointParts.slice(1) || []
      return { noMemoData: true, semester, roundIds }
    }
  }
  return null
}

function getLangIndex(language) {
  return language === 'en' ? 0 : 1
}

function CourseMemo() {
  const [webContext] = useWebContext()
  const navigate = useNavigate()

  const {
    courseCode,
    language,
    memoData: memo,
    memoDatas,
    memoEndPoint,
    memoLanguage,
    semester: querySemester,
    userLanguageIndex,
  } = webContext

  const { ladokRoundIds = [], semester: memoSemester } = memo
  const semester = querySemester || memoSemester

  const location = useLocation()

  useEffect(() => {
    let isMounted = true
    if (isMounted) {
      if (hasNoMemoData()) {
        const stateForRedirect = redirectToAbout(courseCode, location)
        navigate(`/${courseCode}/om-kurs-pm`, { state: stateForRedirect })
      }
      renderBreadcrumbsIntoKthHeader(courseCode, language)
      // Decide which content can have wider content (exempel tables, to make them more readable)
      determineContentFlexibility()
    }
    return () => (isMounted = false)
  }, [])

  const courseImage = resolveCourseImage(webContext.imageFromAdmin, webContext.courseMainSubjects, memoLanguage)
  const courseImageUrl = `${webContext.browserConfig.imageStorageUri}${courseImage}`
  const memoLanguageIndex = getLangIndex(memoLanguage)

  const {
    coverPageLabels,
    courseFactsLabels,
    courseMemoLinksLabels,
    extraInfo,
    coursePresentationLabels,
    courseLinksLabels,
    courseContactsLabels,
  } = i18n.messages[memoLanguageIndex]

  const { courseHeaderLabels, sideMenuLabels } = i18n.messages[userLanguageIndex]

  const courseMemoItems = menuItemsForCurrentMemo(memoDatas, memoEndPoint)

  function isMemoOld() {
    return memo.status === 'old'
  }

  function isMemoOutdated() {
    return memo.outdated
  }

  function isMemoArchived() {
    return isMemoOld() || isMemoOutdated()
  }

  function hasNoMemoData() {
    return Object.keys(memo).length === 0 && memo.constructor === Object
  }

  function resolveLatestMemoUrl() {
    if (typeof window !== 'undefined') {
      return (
        window.location.protocol +
        '//' +
        window.location.host +
        '/kurs-pm/' +
        courseCode +
        '/' +
        memoEndPoint +
        window.location.search
      )
    }
    return null
  }

  return (
    <Container fluid>
      <CoverPage
        labels={coverPageLabels}
        language={memoLanguage}
        courseTitle={memo.courseTitle}
        courseCode={courseCode}
        memoName={concatMemoName(semester, ladokRoundIds, memoLanguage)}
        version={memo.version}
        lastChangeDate={memo.lastChangeDate}
        rounds={memo.memoName}
        departmentName={memo.departmentName}
        languageOfInstruction={memo.languageOfInstructions}
        syllabusValid={memo.syllabusValid}
        url={getUrl()}
      />
      <Row>
        <SideMenu
          courseCode={courseCode}
          courseMemoItems={courseMemoItems}
          backLink={sideMenuBackLink[language]}
          labels={sideMenuLabels}
          language={language}
          archivedMemo={isMemoArchived()}
        />
        <Col className="col-print-12" lang={memoLanguage}>
          <main id="mainContent">
            <CourseHeader
              courseMemoName={concatMemoName(semester, ladokRoundIds, memoLanguage)}
              courseTitle={memo.courseTitle}
              courseCode={courseCode}
              labels={courseHeaderLabels}
              language={memoLanguage}
              oldMemo={isMemoOld()}
              outdatedMemo={isMemoOutdated()}
              latestMemoLabel={webContext.latestMemoLabel}
              latestMemoUrl={resolveLatestMemoUrl()}
            />
            <Row>
              <Col id="flexible-content-of-center" lg="8" className="text-break col-print-12 content-center">
                <CoursePresentation
                  courseImageUrl={courseImageUrl}
                  introText={webContext.sellingText}
                  labels={coursePresentationLabels}
                />
                <AllSections memoData={memo} memoLanguageIndex={memoLanguageIndex} />
                <Contacts language={memoLanguage} memoData={memo} labels={courseContactsLabels} />
              </Col>
              <Col lg="4" className="d-print-none content-right">
                <Row className="mb-lg-4">
                  <Col>
                    <CourseFacts language={memoLanguage} labels={courseFactsLabels} memoData={memo} />
                  </Col>
                </Row>
                <Row className="my-lg-4">
                  <Col>
                    <CourseMemoLinks
                      language={memoLanguageIndex}
                      labels={courseMemoLinksLabels}
                      extraInfo={extraInfo}
                      memoData={memo}
                      courseMemoName={concatMemoName(semester, ladokRoundIds, memoLanguage)}
                      archivedMemo={isMemoArchived()}
                    />
                  </Col>
                </Row>
                <Row className="mt-lg-4">
                  <Col>
                    <CourseLinks language={memoLanguage} labels={courseLinksLabels} />
                  </Col>
                </Row>
                <Row id="row-for-the-last-element-which-determines-styles" className="mt-lg-4">
                  <Col>
                    <CourseContacts
                      styleId="last-element-which-determines-styles"
                      language={memoLanguage}
                      memoData={memo}
                      labels={courseContactsLabels}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </main>
        </Col>
      </Row>
    </Container>
  )
}

export default CourseMemo
