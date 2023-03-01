import { Breadcrumbs, HeadingAsteriskModal } from '@kth/kth-reactstrap/dist/components/utbildningsinfo'
import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { Col, Container, Row } from 'reactstrap'

import { useLocation } from 'react-router-dom'
import i18n from '../../../../i18n'
import { useWebContext } from '../context/WebContext'

import {
  doubleSortOnAnArrayOfObjects,
  memoNameWithCourseCode,
  removeDuplicates,
  roundShortNameWithStartdate,
  seasonStr,
} from '../util/helpers'
import { linkToArchive, linkToPublishedMemo, sideMenuBackLink } from '../util/links'
import { menuItemsForAboutMemo } from '../util/menu-memo-items'
import { getCurrentTerm } from '../util/term'

import AboutAlert from '../components/AboutAlert'
import AboutCourseContacts from '../components/AboutCourseContacts'
import AboutHeader from '../components/AboutHeader'
import SideMenu from '../components/SideMenu'

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

function removePdfMemosDuplicates(flattenMemosList) {
  let tmpUniqueMemosList = []
  let tmpPdfMemos = []

  flattenMemosList.map(round => {
    if (round.isPdf) {
      if (
        tmpPdfMemos.some(element => {
          if (element.courseMemoFileName === round.courseMemoFileName) return true
          return false
        })
      ) {
        const index = tmpPdfMemos.findIndex(element => {
          if (element.courseMemoFileName === round.courseMemoFileName) return true
          return false
        })
        tmpPdfMemos[index].applicationCodes = tmpPdfMemos[index].applicationCodes.concat(round.applicationCodes)
      } else {
        tmpPdfMemos.push(round)
      }
    } else {
      tmpUniqueMemosList.push(round)
    }
  })
  return tmpUniqueMemosList.concat(tmpPdfMemos)
}

function removeRoundsDuplicates(allTermRounds) {
  const tmpUniqueRound = []
  return allTermRounds.filter(round => {
    if (round.applicationCode && tmpUniqueRound.includes(round.applicationCode)) return false
    if (round.applicationCode && !tmpUniqueRound.includes(round.applicationCode))
      tmpUniqueRound.push(round.applicationCode)
    return true
  })
}

function extendPdfMemosShortName(cleanAllMemo, allTempRounds, extraInfo) {
  let arr = [...cleanAllMemo]

  cleanAllMemo.map(memo => {
    if (memo.isPdf === true && memo.applicationCodes.length > 1) {
      let extendedShortNames = []
      allTempRounds.map(round => {
        if (memo.applicationCodes.includes(round.applicationCode)) {
          if (round.shortName && round.shortName !== '') {
            extendedShortNames.push(round.shortName.replace(/ m.fl./g, ''))
          } else {
            extendedShortNames.push(seasonStr(extraInfo, round.term))
          }
        }
      })
      memo.shortName = extendedShortNames.join(', ')
    }
  })
  return cleanAllMemo
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

function doesArrIncludesElem(arr, element) {
  if (arr.filter(elem => elem.includes(element)).length > 0) return true
  return false
}

function isCurrentMemoIsUnqiue(memoList, round, memoToCheck) {
  const memo = memoList.find(x => x.applicationCodes.includes(round.applicationCode))
  const refMemos = JSON.parse(JSON.stringify(memoToCheck.current))
  if (memo) {
    if (refMemos.length > 0) {
      const refMemo = refMemos.find(x => JSON.stringify(x.applicationCodes) === JSON.stringify(memo.applicationCodes))
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
  if (memo.isPdf !== true || (memo.isPdf === true && memo.applicationCodes.length == 1))
    memo.shortName = round.shortName
  memo.firstTuitionDate = round.firstTuitionDate

  return memo
}

function makeAllSemestersRoundsWithMemos(
  webAndPdfMiniMemos,
  allRoundsMockOrReal,
  memoToCheck,
  langAbbr = 'sv',
  extraInfo,
  memoDatas
) {
  const langIndex = langAbbr === 'en' ? 0 : 1
  const locale = ['en-GB', 'sv-SE']
  const allSemestersRoundsWithMemos = []
  const allActiveTerms = removeDuplicates(allRoundsMockOrReal.map(t => t.term))
  const allMemosSemesters = Object.keys(webAndPdfMiniMemos)

  allActiveTerms.map(semester => {
    memoToCheck.current = []
    if (doesArrIncludesElem(allMemosSemesters, semester)) {
      const semesterMemos = webAndPdfMiniMemos[semester]
      const flattenMemosList = removeKeysAndFlattenToArray(semesterMemos)
      const cleanFlatMemosList = removeWebMemosDuplicates(flattenMemosList)
      const cleanAllMemos = removePdfMemosDuplicates(cleanFlatMemosList)
      const allSemesterMemosApplicationCodes = cleanAllMemos.map(memo => memo.applicationCodes)
      const allTermRounds = allRoundsMockOrReal.filter(round => round.term.toString() === semester.toString()).reverse()
      const allTermRoundsClean = removeRoundsDuplicates(allTermRounds)
      const extendedAllMemo = extendPdfMemosShortName(cleanAllMemos, allTermRoundsClean, extraInfo)

      allTermRoundsClean.map(round => {
        doesArrIncludesElem(allSemesterMemosApplicationCodes, round.applicationCode)
          ? isCurrentMemoIsUnqiue(extendedAllMemo, round, memoToCheck)
            ? allSemestersRoundsWithMemos.push(
                extendMemo(
                  extendedAllMemo.find(memo => memo.applicationCodes.includes(round.applicationCode)),
                  round
                )
              )
            : ''
          : allSemestersRoundsWithMemos.push(round)
      })
    } else {
      allSemestersRoundsWithMemos.push(allRoundsMockOrReal.find(round => round.term.toString() === semester.toString()))
    }
  })
  const arrDateFormat = allSemestersRoundsWithMemos.map(obj => {
    return { ...obj, firstTuitionDate: new Date(obj.firstTuitionDate) }
  })

  const sortedArrayDateFormat = doubleSortOnAnArrayOfObjects(arrDateFormat, 'firstTuitionDate', 'shortName', langIndex)

  const sortedAscAllSemestersRoundsWithMemos = sortedArrayDateFormat.map(obj => {
    return {
      ...obj,
      firstTuitionDate: obj.firstTuitionDate.toLocaleString(locale[langIndex], {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
    }
  })
  return sortedAscAllSemestersRoundsWithMemos
}

function AboutCourseMemo({ mockKursPmDataApi = false, mockMixKoppsApi = false }) {
  const location = useLocation()

  const [webContext] = useWebContext()

  const {
    allTypeMemos,
    memoDatas,
    courseCode,
    language: userLangAbbr,
    userLanguageIndex,
    allRoundsFromKopps,
  } = webContext

  const isThisTest = !!mockKursPmDataApi

  const [allRounds, setAllRounds] = useState(allRoundsFromKopps)

  const webAndPdfMiniMemos = isThisTest ? mockKursPmDataApi : allTypeMemos
  const allRoundsMockOrReal = isThisTest ? mockMixKoppsApi : allRounds
  const { sideMenuLabels, aboutHeaderLabels, aboutMemoLabels, courseContactsLabels, extraInfo, courseMemoLinksLabels } =
    i18n.messages[userLanguageIndex]

  const menuMemoItems = menuItemsForAboutMemo(memoDatas)

  const memoToCheck = useRef([])

  const allActiveTerms = removeDuplicates(allRoundsMockOrReal.map(t => t.term))

  const semestersMemosAndRounds = makeAllSemestersRoundsWithMemos(
    webAndPdfMiniMemos,
    allRoundsMockOrReal,
    memoToCheck,
    userLangAbbr,
    extraInfo,
    memoDatas
  )
  useEffect(() => {
    setAllRounds(allRoundsMockOrReal)
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
                    applicationCodes={location.state.applicationCodes}
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
                          .filter(round => round.term === semester || Number(round.semester) === semester)
                          .map(memo => (
                            <div key={memo.memoEndPoint || memo.courseMemoFileName || memo.applicationCodes}>
                              {'isPdf' in memo ? (
                                (memo.isPdf && (
                                  <div className="mb-3">
                                    <h4>{roundShortNameWithStartdate(memo, userLangAbbr)}</h4>
                                    <a
                                      className="pdf-link"
                                      href={`${webContext.browserConfig.memoStorageUri}${memo.courseMemoFileName}`}
                                    >
                                      {memoNameWithCourseCode(
                                        courseCode,
                                        memo.semester,
                                        memo.applicationCodes,
                                        userLangAbbr
                                      )}
                                    </a>
                                  </div>
                                )) || (
                                  <div className="mb-3">
                                    <h4>{roundShortNameWithStartdate(memo, userLangAbbr)}</h4>
                                    <a href={linkToPublishedMemo(courseCode || memo.courseCode, memo.memoEndPoint)}>
                                      {memoNameWithCourseCode(
                                        courseCode,
                                        memo.semester,
                                        memo.applicationCodes,
                                        memo.memoCommonLangAbbr
                                      )}
                                    </a>
                                  </div>
                                )
                              ) : (
                                <div className="mb-3">
                                  <h4>{roundShortNameWithStartdate(memo, userLangAbbr)}</h4>
                                  <i>{`${aboutHeaderLabels.memoLabel} ${aboutMemoLabels.notPublished}`}</i>
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
