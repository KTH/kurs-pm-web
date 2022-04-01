import React from 'react'
import ReactDOM from 'react-dom'
import { Container, Row, Col } from 'reactstrap'
import { Breadcrumbs, HeadingAsteriskModal } from '@kth/kth-reactstrap/dist/components/utbildningsinfo'

import axios from 'axios'
import i18n from '../../../../i18n'
import { useWebContext } from '../context/WebContext'

import { resolveCourseImage } from '../util/course-image'
import { sideMenuBackLink, linkToPublishedMemo, linkToArchive } from '../util/links'
import { concatMemoName, memoNameWithCourseCode, seasonStr } from '../util/helpers'
import { getCurrentTerm } from '../util/term'
import { menuItemsForAboutMemo } from '../util/menu-memo-items'

import SideMenu from '../components/SideMenu'
import AboutHeader from '../components/AboutHeader'
import AboutCourseContacts from '../components/AboutCourseContacts'
import AboutAlert from '../components/AboutAlert'

function renderBreadcrumbsIntoKthHeader(courseCode, languageAbbr) {
  const breadcrumbContainer = document.getElementById('breadcrumbs-header')
  if (breadcrumbContainer) {
    ReactDOM.render(
      <Breadcrumbs include={'aboutCourse'} courseCode={courseCode} language={languageAbbr} />,
      breadcrumbContainer
    )
  }
}

function removeKeysAndFlattenToArray(memosWithRoundKeys) {
  return Object.keys(memosWithRoundKeys).map(roundid => memosWithRoundKeys[roundid])
}

function removeWebMemosDuplicates(flattenMemosList) {
  const tmpUniqueKeys = []
  return flattenMemosList.filter(({ memoEndPoint }) => {
    if (memoEndPoint && tmpUniqueKeys.includes(memoEndPoint)) return false
    if (memoEndPoint && !tmpUniqueKeys.includes(memoEndPoint)) tmpUniqueKeys.push(memoEndPoint)
    // if web-based memo is unique or if it's pdf memo, then return grue
    return true
  })
}

const getWebAndPdfMemos = async courseCode => {
  const URL_KURS_PM_INTERNAL_API = `/kurs-pm/to-kurs-pm-api/${courseCode}`
  try {
    const result = await axios.get(URL_KURS_PM_INTERNAL_API)

    if (result) {
      if (result.status >= 400) {
        return 'ERROR-getWebAndPdfMemos-' + result.status
      }
    }
    return result.data
  } catch (error) {
    if (error.response) {
      throw new Error('getWebAndPdfMemos ' + error.message)
    }
    throw error
  }
}

function resolveFirstVisibleSemesterInMenu(menuMemoItems) {
  // First visible semester according to left meny or getCurrentTerm

  return menuMemoItems
    .filter(m => !m.outdated)
    .reduce((firstSemester, menuItem) => {
      const menuItemSemester = Number.parseInt(menuItem.semester, 10)

      if (menuItemSemester < firstSemester) {
        return menuItemSemester
      }
      return firstSemester
    }, getCurrentTerm()) // 21001
}

async function AboutCourseMemo({ location, mockKursPmDataApi }) {
  const [webContext] = useWebContext()
  const { courseCode, language: userLangAbbr, userLanguageIndex } = webContext

  const isThisTest = !!mockKursPmDataApi

  const webAndPdfMiniMemos = isThisTest ? mockKursPmDataApi : await getWebAndPdfMemos(courseCode)

  const { sideMenuLabels, aboutHeaderLabels, aboutMemoLabels, courseContactsLabels, extraInfo } =
    i18n.messages[userLanguageIndex]

  const menuMemoItems = menuItemsForAboutMemo(webContext.memoDatas)

  const firstVisibleSemester = resolveFirstVisibleSemesterInMenu(menuMemoItems)

  useEffect(() => {
    let isMounted = true
    if (isMounted) {
      renderBreadcrumbsIntoKthHeader(courseCode, userLangAbbr)
    }
    return () => (isMounted = false)
  }, [])

  return (
    // Class preview-container, or equivalent, not needed
    <Container className="kip-container about-container" fluid>
      <Row>
        <SideMenu
          courseCode={courseCode}
          courseMemoItems={menuMemoItems}
          aboutCourseMemo
          backLink={sideMenuBackLink[userLangAbbr]}
          labels={sideMenuLabels}
          language={userLangAbbr}
        />
        <Col className="col-print-12">
          <main id="mainContent">
            <AboutHeader
              courseCode={courseCode}
              title={webContext.title}
              credits={webContext.credits}
              creditUnitAbbr={webContext.creditUnitAbbr}
              labels={aboutHeaderLabels}
              language={userLangAbbr}
            />
            <Row>
              <Col>
                <section>
                  <p>{aboutMemoLabels.aboutMemosText1}</p>
                  <p>{aboutMemoLabels.aboutMemosText2}</p>
                </section>
              </Col>
            </Row>
            {location.state && location.state.noMemoData && (
              <Row>
                <Col>
                  <AboutAlert
                    courseCode={courseCode}
                    semester={location.state.semester}
                    roundIds={location.state.roundIds}
                    language={userLangAbbr}
                  />
                </Col>
              </Row>
            )}
            <Row>
              <Col lg="8" className="text-break">
                <section>
                  {/* <span className="about-memo-header">
                      <h2>{aboutMemoLabels.currentMemos}</h2>
                      <InfoModalButton
                        modalId="current-memos-title"
                        modalLabels={{
                          header: aboutMemoLabels.currentMemos,
                          body: aboutMemoLabels.currentMemosInfo,
                          btnClose: aboutMemoLabels.btnClose,
                          ariaLabel: aboutMemoLabels.ariaLabel,
                        }}
                      />
                    </span> */}
                  <HeadingAsteriskModal
                    headingTag="h2"
                    langAbbr={userLangAbbr}
                    modalId="current-memos-title"
                    modalBtnAriaLabel={aboutMemoLabels.ariaLabel}
                    titleAndInfo={{
                      header: aboutMemoLabels.currentMemos,
                      body: aboutMemoLabels.currentMemosInfo,
                    }}
                    btnClose={aboutMemoLabels.btnClose}
                    withModal
                  />
                  {Object.keys(webAndPdfMiniMemos)
                    .reverse()
                    .map(semester => {
                      if (Number.parseInt(semester, 10) < firstVisibleSemester) {
                        return null
                      }

                      const semesterMemos = webAndPdfMiniMemos[semester]
                      const flattenMemosList = removeKeysAndFlattenToArray(semesterMemos)
                      const cleanFlatMemosList = removeWebMemosDuplicates(flattenMemosList)

                      return (
                        <React.Fragment key={semester}>
                          <h3>{`${aboutMemoLabels.currentOfferings} ${seasonStr(extraInfo, semester)}`}</h3>
                          <ul>
                            {cleanFlatMemosList.map(
                              ({
                                courseMemoFileName: pdfFileName,
                                isPdf,
                                ladokRoundIds,
                                memoCommonLangAbbr,
                                memoEndPoint,
                                semester: itemSemester,
                              }) => (
                                <li key={memoEndPoint || pdfFileName}>
                                  {(isPdf && (
                                    <a
                                      className="pdf-link"
                                      href={`${webContext.browserConfig.memoStorageUri}${pdfFileName}`}
                                    >
                                      {memoNameWithCourseCode(courseCode, itemSemester, ladokRoundIds, userLangAbbr)}
                                    </a>
                                  )) || (
                                    <a href={linkToPublishedMemo(courseCode, memoEndPoint)}>
                                      {memoNameWithCourseCode(
                                        courseCode,
                                        itemSemester,
                                        ladokRoundIds,
                                        memoCommonLangAbbr
                                      )}
                                    </a>
                                  )}
                                </li>
                              )
                            )}
                          </ul>
                        </React.Fragment>
                      )
                    })}
                  <h3>{aboutMemoLabels.previousOfferings}</h3>
                  <ul>
                    <li>
                      <a href={linkToArchive(courseCode, userLangAbbr)}>{sideMenuLabels.archive}</a>
                    </li>
                  </ul>
                </section>
              </Col>
              <Col lg="4" className="content-right">
                <section>
                  <h2>{courseContactsLabels.courseContactsTitle}</h2>
                  <AboutCourseContacts
                    languageIndex={userLanguageIndex}
                    infoContactName={webContext.infoContactName}
                    examiners={webContext.examiners}
                    labels={courseContactsLabels}
                  />
                </section>
              </Col>
            </Row>
          </main>
        </Col>
      </Row>
    </Container>
  )
}

export default AboutCourseMemo
