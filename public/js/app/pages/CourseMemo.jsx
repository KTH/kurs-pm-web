import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Row, Col } from 'reactstrap'

import i18n from '../../../../i18n'
import { concatMemoName, memoNameWithoutApplicationCode, seasonStr } from '../util/helpers'
import { sideMenuBackLink } from '../util/links'
import { menuItemsForCurrentMemo } from '../util/menu-memo-items'

import { useWebContext } from '../context/WebContext'

import SideMenu from '../components/SideMenu'
import CourseHeader from '../components/CourseHeader'
import CourseContacts from '../components/CourseContacts'
import CourseFacts from '../components/CourseFacts'
import CourseLinks from '../components/CourseLinks'
import CourseMemoLinks from '../components/CourseMemoLinks'
import CoverPage from '../components/print/CoverPage'
import Contacts from '../components/print/Contacts'
import AllSections from '../components/AllSections'

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

export const redirectToAbout = (courseCode, location) => {
  const { pathname } = location

  if (pathname.includes('/om-kurs-pm')) return null

  const memopath = pathname.replace('/kurs-pm', '')
  const fromPersonalMenu = `/${courseCode}/\\d*/\\d*`
  const withMemoEndPoint = `/${courseCode}/\\w*\\d*-\\d*`
  if (memopath.match(fromPersonalMenu)) {
    const semesterAndRoundApplicationCode = memopath.replace(`/${courseCode}/`, '')
    const [semester, applicationCode] = semesterAndRoundApplicationCode.split('/')
    const applicationCodes = [applicationCode]
    return { noMemoData: true, semester, applicationCodes }
  }
  if (memopath.match(withMemoEndPoint)) {
    const potentialMemoEndPoint = memopath.replace(`/${courseCode}/`, '')
    const potentialMemoEndPointParts = potentialMemoEndPoint.split('-')
    if (potentialMemoEndPointParts.length > 1) {
      const [potentialCourseCodeAndSemester] = potentialMemoEndPointParts
      const semester = potentialCourseCodeAndSemester.replace(`${courseCode}`, '') || ''
      const applicationCodes = potentialMemoEndPointParts.slice(1) || []
      return { noMemoData: true, semester, applicationCodes }
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
    title,
    creditsLabel,
  } = webContext

  const { semester: memoSemester, syllabusValid = {}, applicationCodes = [] } = memo
  const semester = querySemester || memoSemester
  const { validFromTerm = '' } = syllabusValid

  const location = useLocation()

  const [sourceUrl, setSourceUrl] = useState(null)

  function hasNoMemoData() {
    return Object.keys(memo).length === 0 && memo.constructor === Object
  }

  useEffect(() => {
    let isMounted = true
    if (isMounted) {
      if (hasNoMemoData()) {
        const stateForRedirect = redirectToAbout(courseCode, location)
        navigate(`/${courseCode}/om-kurs-pm`, { state: stateForRedirect })
      }
      // Decide which content can have wider content (exempel tables, to make them more readable)
      determineContentFlexibility()

      setSourceUrl(getUrl())
    }
    return () => (isMounted = false)
  }, [])

  const memoLanguageIndex = getLangIndex(memoLanguage)
  const courseTitle = `${courseCode} ${title} ${creditsLabel}`

  const {
    coverPageLabels,
    courseFactsLabels,
    courseMemoLinksLabels,
    extraInfo,
    courseLinksLabels,
    courseContactsLabels,
    sectionsLabels,
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

  const [latestMemoUrl, setLatestMemoUrl] = useState(null)

  useEffect(() => {
    setLatestMemoUrl(resolveLatestMemoUrl())
  }, [])

  return (
    <>
      <CoverPage
        labels={coverPageLabels}
        language={memoLanguage}
        courseTitle={courseTitle}
        courseCode={courseCode}
        memoName={concatMemoName(semester, applicationCodes, memoLanguage)}
        version={memo.version}
        lastChangeDate={memo.lastChangeDate}
        rounds={memo.memoName}
        departmentName={memo.departmentName}
        languageOfInstruction={memo.languageOfInstructions}
        syllabusValid={memo.syllabusValid}
        url={sourceUrl}
        startDate={memo.firstTuititionDate}
      />
      <Row className={`p-print-4 ${isMemoArchived() ? 'archivedMemoPage' : ''}`}>
        <SideMenu
          courseCode={courseCode}
          courseMemoItems={courseMemoItems}
          backLink={sideMenuBackLink[language]}
          labels={sideMenuLabels}
          language={language}
          archivedMemo={isMemoArchived()}
        />
        <main id="mainContent" className="col col-print-12" lang={memoLanguage}>
          <CourseHeader
            courseMemoName={memoNameWithoutApplicationCode(semester, memoLanguage)}
            courseTitle={courseTitle}
            courseCode={courseCode}
            labels={courseHeaderLabels}
            language={memoLanguage}
            oldMemo={isMemoOld()}
            outdatedMemo={isMemoOutdated()}
            latestMemoLabel={webContext.latestMemoLabel}
            latestMemoUrl={latestMemoUrl}
          />
          <Row>
            <Col id="flexible-content-of-center" lg="8" className="text-break col-print-12 content-center">
              <p className="mb-4">
                {sectionsLabels.asterisk} {seasonStr(extraInfo, validFromTerm)}
              </p>
              <AllSections memoData={memo} memoLanguageIndex={memoLanguageIndex} />
              <Contacts language={memoLanguage} memoData={memo} labels={courseContactsLabels} />
            </Col>
            <Col lg="4" className="d-print-none content-right">
              <CourseFacts language={memoLanguage} labels={courseFactsLabels} memoData={memo} />
              <CourseMemoLinks
                language={memoLanguageIndex}
                labels={courseMemoLinksLabels}
                extraInfo={extraInfo}
                memoData={memo}
                courseMemoName={concatMemoName(semester, applicationCodes, memoLanguage)}
                archivedMemo={isMemoArchived()}
              />
              <CourseLinks language={memoLanguage} labels={courseLinksLabels} />
              <CourseContacts
                styleId="last-element-which-determines-styles"
                language={memoLanguage}
                memoData={memo}
                labels={courseContactsLabels}
              />
            </Col>
          </Row>
        </main>
      </Row>
    </>
  )
}

export default CourseMemo
