import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { inject, observer } from 'mobx-react'
import { Container, Row, Col } from 'reactstrap'
import { Breadcrumbs, InfoModalButton } from '@kth/kth-kip-style-react-components'

import axios from 'axios'
import i18n from '../../../../i18n'

import { sideMenuBackLink, linkToPublishedMemo, linkToArchive } from '../util/links'

import { concatMemoName, memoNameWithCourseCode, seasonStr } from '../util/helpers'

import { getCurrentTerm } from '../util/term'

import SideMenu from '../components/SideMenu'
import AboutHeader from '../components/AboutHeader'
import AboutCourseContacts from '../components/AboutCourseContacts'
import AboutAlert from '../components/AboutAlert'

const englishTranslations = i18n.messages[0].messages
const swedishTranslations = i18n.messages[1].messages

function renderBreadcrumbsIntoKthHeader(courseCode, language) {
  const breadcrumbContainer = document.getElementById('breadcrumbs-header')
  if (breadcrumbContainer)
    ReactDOM.render(
      <Breadcrumbs include="aboutCourse" courseCode={courseCode} language={language} />,
      breadcrumbContainer
    )
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

// Logic copied from kursinfo-web
export const resolveCourseImage = (imageFromAdmin, courseMainSubjects = '', language) => {
  let courseImage = ''
  // If course administrator has set own picture, use that
  if (imageFromAdmin && imageFromAdmin.length > 4) {
    courseImage = imageFromAdmin
    // Course administrator has not set own picture, get one based on course’s main subjects
  } else {
    let mainSubjects = courseMainSubjects.split(',').map(s => s.trim())

    // If main subjects exist, and the language is English, get Swedish translations of main subjects
    if (mainSubjects && mainSubjects.length > 0 && language === 'en') {
      mainSubjects = mainSubjects.map(subject => englishTranslations.courseMainSubjects[subject])
    }
    // Get picture according to Swedish translation of first main subject
    courseImage = swedishTranslations.courseImage[mainSubjects.sort()[0]]
    // If no picture is available for first main subject, use default picture for language
    courseImage =
      courseImage ||
      (language === 'en' ? englishTranslations.courseImage.default : swedishTranslations.courseImage.default)
  }
  return courseImage
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

@inject(['routerStore'])
@observer
class AboutCourseMemo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      webAndPdfMiniMemos: {},
    }
  }

  async componentDidMount() {
    const { routerStore, mockKursPmDataApi } = this.props
    const { courseCode, language } = routerStore
    const isThisTest = !!mockKursPmDataApi
    const webAndPdMemos = isThisTest ? mockKursPmDataApi : await getWebAndPdfMemos(courseCode)
    if (webAndPdMemos) {
      this.setState({ webAndPdfMiniMemos: webAndPdMemos })
    }
    renderBreadcrumbsIntoKthHeader(courseCode, language)
  }

  render() {
    const { routerStore, location } = this.props
    const { webAndPdfMiniMemos } = this.state
    const { courseCode, language: userLangAbbr, userLanguageIndex } = routerStore
    const { sideMenuLabels, aboutHeaderLabels, aboutMemoLabels, courseContactsLabels, extraInfo } =
      i18n.messages[userLanguageIndex]

    let menuMemoItems = routerStore.memoDatas.map(m => {
      const { outdated, memoEndPoint: id } = m
      const label = concatMemoName(m.semester, m.ladokRoundIds, m.memoCommonLangAbbr)
      return {
        id,
        semester: m.semester,
        label,
        active: false,
        url: `/kurs-pm/${courseCode}/${id}`,
        outdated,
      }
    })
    // Duplicate id’s filtered out
    menuMemoItems = menuMemoItems.filter((item, index, self) => index === self.findIndex(t => t.id === item.id))

    // First visible semester according to left meny or getCurrentTerm
    const firstVisibleSemester = menuMemoItems
      .filter(m => !m.outdated)
      .reduce((firstSemester, menuItem) => {
        const menuItemSemester = Number.parseInt(menuItem.semester, 10)

        if (menuItemSemester < firstSemester) {
          return menuItemSemester
        }
        return firstSemester
      }, getCurrentTerm()) // 21001

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
                title={routerStore.title}
                credits={routerStore.credits}
                creditUnitAbbr={routerStore.creditUnitAbbr}
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
                      courseCode={routerStore.courseCode}
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
                    <span className="about-memo-header">
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
                    </span>
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
                                        href={`${routerStore.browserConfig.memoStorageUri}${pdfFileName}`}
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
                      infoContactName={routerStore.infoContactName}
                      examiners={routerStore.examiners}
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
}

export default AboutCourseMemo
