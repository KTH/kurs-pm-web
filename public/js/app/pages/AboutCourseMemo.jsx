import React, { memo, useEffect, useState, useRef } from 'react'
import ReactDOM from 'react-dom'
import { Container, Row, Col } from 'reactstrap'
import { Breadcrumbs, HeadingAsteriskModal } from '@kth/kth-reactstrap/dist/components/utbildningsinfo'

import axios from 'axios'
import i18n from '../../../../i18n'
import { useWebContext } from '../context/WebContext'
import { useLocation } from 'react-router-dom'

import { resolveCourseImage } from '../util/course-image'
import { sideMenuBackLink, linkToPublishedMemo, linkToArchive } from '../util/links'
import { concatMemoName, memoNameWithCourseCode, seasonStr, roundShortNameWithStartdate } from '../util/helpers'
import { getCurrentTerm } from '../util/term'
import { menuItemsForAboutMemo } from '../util/menu-memo-items'
import getTermsWithCourseRounds from '../util/internApi'

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

function removeDuplicates(allActiveTerms) {
  return allActiveTerms.filter((term, index) => allActiveTerms.indexOf(term) === index)
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

function isDateWithinCurrentSemester(checkDate) {
  //checking if lastTuitionDate is within current semester
  const currentSemester = getCurrentTerm().slice(-1)
  const dateToCheck = new Date(checkDate)
  const today = new Date()
  const currentYear = today.getFullYear()
  const startDateOfStartWeekAutumnSemester = `${currentYear}-08-28`
  const endDateOfStartWeekAutumnSemester = `${currentYear}-09-03`
  const startDateOfAutumnSemester = getDateOfMondayOfTheWeek(startDateOfStartWeekAutumnSemester)

  const endDateOfAutumnSemester = addDays(startDateOfAutumnSemester, 140)
  const startDateOfSpringSemester = addDays(endDateOfAutumnSemester, 1)
  const endDateOfSpringSemester = addDays(startDateOfSpringSemester, 140)

  if (currentSemester == 2) {
    if (
      dateToCheck > startDateOfAutumnSemester ||
      (dateToCheck > startDateOfAutumnSemester && dateToCheck < endDateOfAutumnSemester)
    ) {
      return true
    }
  } else {
    if (
      dateToCheck > startDateOfSpringSemester ||
      (dateToCheck > startDateOfSpringSemester && dateToCheck < endDateOfSpringSemester)
    ) {
      return true
    }
  }
  return false
}

function getDateOfMondayOfTheWeek(startDate) {
  const currentDate = new Date(startDate)
  const first = currentDate.getDate() - currentDate.getDay() + 1
  const firstMondayOfSpringSemester = new Date(currentDate.setDate(first))
  return firstMondayOfSpringSemester
}

function addDays(date, days) {
  // return date.setDate(date.getDate() + days)
  const copy = new Date(Number(date))
  copy.setDate(date.getDate() + days)
  return copy
}

function addElement(element) {
  const arrWithObject = []
  arrWithObject.push(element)
  return arrWithObject
}

function doesArrIncludesElem(arr, element) {
  if (arr.filter(elem => elem.includes(element)).length > 0) return true
  return false
}

function isCurrentMemoIsUnqiue(memoList, round, memoToCheck) {
  const memo = memoList.find(x => x.ladokRoundIds.includes(round.ladokRoundId))
  const refMemos = JSON.parse(JSON.stringify(memoToCheck.current))
  if (memo) {
    if (refMemos.length > 0) {
      const refMemo = refMemos.find(x => JSON.stringify(x.ladokRoundIds) === JSON.stringify(memo.ladokRoundIds))
      if (refMemo) {
        return false
      }
    }
  }
  if (memo) {
    refMemos.push(memo)
  }
  memoToCheck.current = refMemos
  return true
}

function extendMemo(memo, round) {
  memo.shortName = round.shortName
  memo.firstTuitionDate = round.firstTuitionDate

  return memo
}

function makeAllSemestersRoundsWithMemos(webAndPdfMiniMemos, allRoundsMockOrReal, memoToCheck) {
  const allSemestersRoundsWithMemos = []
  const allActiveTerms = removeDuplicates(allRoundsMockOrReal.map(t => t.term))
  const allMemosSemesters = Object.keys(webAndPdfMiniMemos)

  allActiveTerms.map(semester => {
    memoToCheck.current = []
    if (doesArrIncludesElem(allMemosSemesters, semester)) {
      const semesterMemos = webAndPdfMiniMemos[semester]
      const flattenMemosList = removeKeysAndFlattenToArray(semesterMemos)
      const cleanFlatMemosList = removeWebMemosDuplicates(flattenMemosList)
      const allSemesterMemosLadokRoundIds = cleanFlatMemosList.map(memo => memo.ladokRoundIds)
      const allTermRounds = allRoundsMockOrReal.filter(round => round.term === semester).reverse()
      const allTermLadokIds = allTermRounds.map(round => round.ladokRoundId)

      allTermRounds.map(round => {
        doesArrIncludesElem(allSemesterMemosLadokRoundIds, round.ladokRoundId)
          ? isCurrentMemoIsUnqiue(cleanFlatMemosList, round, memoToCheck)
            ? allSemestersRoundsWithMemos.push(
                extendMemo(
                  cleanFlatMemosList.find(memo => memo.ladokRoundIds.includes(round.ladokRoundId)),
                  round
                )
              )
            : ''
          : allSemestersRoundsWithMemos.push(round)
      })
    } else {
      allSemestersRoundsWithMemos.push(allRoundsMockOrReal.find(round => round.term === semester))
    }
  })
  console.log(allSemestersRoundsWithMemos)
  return allSemestersRoundsWithMemos
}

function AboutCourseMemo({ mockKursPmDataApi = false, mockMixKoppsApi = false }) {
  const [allRounds, setAllRounds] = useState([])
  const location = useLocation()

  const [webContext] = useWebContext()

  const { allTypeMemos, courseCode, language: userLangAbbr, userLanguageIndex } = webContext
  const isThisTest = !!mockKursPmDataApi

  const webAndPdfMiniMemos = isThisTest ? mockKursPmDataApi : allTypeMemos
  const allRoundsMockOrReal = isThisTest ? mockMixKoppsApi : allRounds

  const { sideMenuLabels, aboutHeaderLabels, aboutMemoLabels, courseContactsLabels, extraInfo, courseMemoLinksLabels } =
    i18n.messages[userLanguageIndex]

  const menuMemoItems = menuItemsForAboutMemo(webContext.memoDatas)

  const firstVisibleSemester = resolveFirstVisibleSemesterInMenu(menuMemoItems)

  const memoToCheck = useRef([])

  const allActiveTerms = removeDuplicates(allRoundsMockOrReal.map(t => t.term))

  const semestersMemosAndRounds = makeAllSemestersRoundsWithMemos(webAndPdfMiniMemos, allRoundsMockOrReal, memoToCheck)

  useEffect(() => {
    getTermsWithCourseRounds(courseCode).then(data => {
      let allTempRounds = []
      data.forEach(t => {
        const rounds = []
        t.rounds.forEach(round => {
          if (isDateWithinCurrentSemester(round.lastTuitionDate)) {
            round.term = t.term
            rounds.push(round)
          }
        })
        allTempRounds = allTempRounds.concat(rounds)
      })
      setAllRounds(allTempRounds)
    })
    let isMounted = true
    if (isMounted) {
      renderBreadcrumbsIntoKthHeader(courseCode, userLangAbbr)
    }
    return () => (isMounted = false)
  }, [])

  return (
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
                  {allActiveTerms.map(semester => {
                    return (
                      <React.Fragment key={semester}>
                        <h3>{`${aboutMemoLabels.currentOfferings} ${seasonStr(extraInfo, semester)}`}</h3>
                        {semestersMemosAndRounds
                          .filter(round => round.term === semester || round.semester === semester)
                          .map(memo => (
                            <div key={memo.memoEndPoint || memo.courseMemoFileName}>
                              {'isPdf' in memo ? (
                                (memo.isPdf && (
                                  <div className="mb-3">
                                    <p>
                                      <h4>{roundShortNameWithStartdate(memo, userLangAbbr)}</h4>
                                    </p>
                                    <a
                                      className="pdf-link"
                                      href={`${webContext.browserConfig.memoStorageUri}${memo.courseMemoFileName}`}
                                    >
                                      {memoNameWithCourseCode(
                                        courseCode,
                                        memo.semester,
                                        memo.ladokRoundIds,
                                        userLangAbbr
                                      )}
                                    </a>
                                  </div>
                                )) || (
                                  <div className="mb-3">
                                    <p>
                                      <h4>{roundShortNameWithStartdate(memo, userLangAbbr)}</h4>
                                    </p>
                                    <a href={linkToPublishedMemo(courseCode || memo.courseCode, memo.memoEndPoint)}>
                                      {memoNameWithCourseCode(
                                        courseCode,
                                        memo.semester,
                                        memo.ladokRoundIds,
                                        memo.memoCommonLangAbbr
                                      )}
                                    </a>
                                  </div>
                                )
                              ) : (
                                <div className="mb-3">
                                  <p>
                                    <h4>{roundShortNameWithStartdate(memo, userLangAbbr)}</h4>
                                  </p>
                                  <p>
                                    <i>{`${aboutHeaderLabels.memoLabel} ${aboutMemoLabels.notPublished}`}</i>
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                      </React.Fragment>
                    )
                  })}
                  <h3>{aboutMemoLabels.previousOfferings}</h3>
                  <ul>
                    <li>
                      {aboutMemoLabels.previousOfferingsText}
                      <a href={linkToArchive(courseCode, userLangAbbr)}>{courseMemoLinksLabels.archivePageLabel}</a>
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
