import { HeadingAsteriskModal } from '@kth/kth-reactstrap/dist/components/utbildningsinfo'
import React, { useEffect, useRef, useState } from 'react'
import { Col, Row } from 'reactstrap'

import { useSearchParams } from 'react-router-dom'
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

import AboutAlert from '../components/AboutAlert'
import AboutCourseContacts from '../components/AboutCourseContacts'
import AboutHeader from '../components/AboutHeader'
import SideMenu from '../components/SideMenu'

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
  cleanAllMemo.map(memo => {
    if (memo.isPdf) {
      const extendedShortNames = []
      allTempRounds.map(round => {
        const { shortName = '', applicationCode = '', term } = round
        if (memo.applicationCodes.includes(applicationCode)) {
          if (shortName) {
            extendedShortNames.push(shortName.replace(/ m.fl./g, ''))
          } else {
            extendedShortNames.push(seasonStr(extraInfo, term))
          }
        }
      })
      memo.shortName = extendedShortNames.join(', ')
    }
  })
  return cleanAllMemo
}

function doesArrIncludesElem(arr, element) {
  if (arr.filter(elem => elem.includes(element)).length > 0) return true
  return false
}

function isCurrentMemoIsUnqiue(memoList, round, memoToCheck) {
  const { applicationCode = '' } = round
  const memo = memoList.find(x => x.applicationCodes.includes(applicationCode))
  const refMemos = JSON.parse(JSON.stringify(memoToCheck.current))
  if (memo) {
    const { applicationCodes = [] } = memo
    if (refMemos.length > 0) {
      const refMemo = refMemos.some(x => JSON.stringify(x.applicationCodes) === JSON.stringify(applicationCodes))
      if (refMemo) {
        return false
      }
    }
    refMemos.push(memo)
  }
  memoToCheck.current = refMemos
  return true
}

function extendMemo(memo, round) {
  if (!memo.isPdf) {
    memo.shortName = round.shortName
  }
  memo.firstTuitionDate = round.firstTuitionDate
  memo.state = round.state
  return memo
}

function makeAllSemestersRoundsWithMemos(
  webAndPdfMiniMemos,
  allRoundsMockOrReal,
  allActiveTerms,
  memoToCheck,
  langAbbr = 'sv',
  extraInfo
) {
  const langIndex = langAbbr === 'en' ? 0 : 1
  const locale = ['en-GB', 'sv-SE']
  const allSemestersRoundsWithMemos = []
  const allMemosSemesters = Object.keys(webAndPdfMiniMemos)

  allActiveTerms.forEach(semester => {
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
        const { applicationCode = '' } = round
        if (doesArrIncludesElem(allSemesterMemosApplicationCodes, applicationCode)) {
          if (isCurrentMemoIsUnqiue(extendedAllMemo, round, memoToCheck)) {
            allSemestersRoundsWithMemos.push(
              extendMemo(
                extendedAllMemo.find(memo => memo.applicationCodes.includes(applicationCode)),
                round
              )
            )
          }
        } else {
          allSemestersRoundsWithMemos.push(round)
        }
      })
    } else {
      allSemestersRoundsWithMemos.push(
        ...allRoundsMockOrReal.filter(round => round.term.toString() === semester.toString())
      )
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
  const [paramsString, setSearchParams] = useSearchParams()

  const [noMemoAlert, setNoMemoAlert] = useState(null)

  useEffect(() => {
    if (paramsString) {
      const searchParams = new URLSearchParams(paramsString)
      searchParams.get('noMemoData')

      const nonEmptyApplicationCodes = searchParams
        .getAll('applicationCodes')
        .filter(applicationCode => applicationCode !== '')

      const newNoMemoAlert = {
        noMemoData: searchParams.get('noMemoData'),
        semester: searchParams.get('semester'),
        applicationCodes: nonEmptyApplicationCodes,
      }

      setNoMemoAlert(newNoMemoAlert)

      setSearchParams(searchParams.get('l') !== null ? { l: searchParams.get('l') } : {})
    }
  }, [])

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
    allActiveTerms,
    memoToCheck,
    userLangAbbr,
    extraInfo
  )

  const allActiveTermsWithRounds = []

  allActiveTerms.forEach(semester => {
    const memos = semestersMemosAndRounds.filter(
      round =>
        (round.term
          ? round.term.toString() === semester.toString()
          : round.semester.toString() === semester.toString()) && round.state !== 'CANCELLED'
    )

    if (memos.length > 0) {
      allActiveTermsWithRounds.push({
        semester,
        memos,
      })
    }
  })

  useEffect(() => {
    setAllRounds(allRoundsMockOrReal)
  }, [])

  return (
    <Row>
      <SideMenu
        courseCode={courseCode}
        courseMemoItems={menuMemoItems}
        aboutCourseMemo
        backLink={sideMenuBackLink[userLangAbbr]}
        labels={sideMenuLabels}
        language={userLangAbbr}
      />
      <main id="mainContent" className="col col-print-12 about-container">
        <AboutHeader
          courseCode={courseCode}
          title={webContext.title}
          credits={webContext.credits}
          creditUnitAbbr={webContext.creditUnitAbbr}
          labels={aboutHeaderLabels}
          language={userLangAbbr}
        />
        <section className="prose">
          <p>{aboutMemoLabels.aboutMemosText1}</p>
          <p>
            {aboutMemoLabels.aboutMemosText2}
            <a href={linkToArchive(courseCode, userLangAbbr)}>{courseMemoLinksLabels.archivePageLabel}</a>
          </p>
        </section>

        {noMemoAlert && noMemoAlert.noMemoData && (
          <AboutAlert
            courseCode={courseCode}
            semester={noMemoAlert.semester}
            applicationCodes={noMemoAlert.applicationCodes ?? []}
            language={userLangAbbr}
            courseMemosExist={memoDatas.length > 0}
          />
        )}
        <Row>
          <Col lg="8" className="text-break">
            <section className="prose">
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
              {allActiveTermsWithRounds.map(({ semester, memos }) => {
                return (
                  <React.Fragment key={semester}>
                    <h3>{`${aboutMemoLabels.currentOfferings} ${seasonStr(extraInfo, semester)}`}</h3>
                    {memos.map(memo => (
                      <React.Fragment key={memo.memoEndPoint || memo.courseMemoFileName || memo.applicationCodes}>
                        <h4>{roundShortNameWithStartdate(memo, userLangAbbr)}</h4>
                        {'isPdf' in memo ? (
                          (memo.isPdf && (
                            <a
                              className="pdf-link"
                              href={`${webContext.browserConfig.memoStorageUri}${memo.courseMemoFileName}`}
                            >
                              {memoNameWithCourseCode(courseCode, memo.semester, memo.applicationCodes, userLangAbbr)}
                            </a>
                          )) || (
                            <a href={linkToPublishedMemo(courseCode || memo.courseCode, memo.memoEndPoint)}>
                              {memoNameWithCourseCode(
                                courseCode,
                                memo.semester,
                                memo.applicationCodes,
                                memo.memoCommonLangAbbr
                              )}
                            </a>
                          )
                        ) : (
                          <i>{`${aboutHeaderLabels.memoLabel} ${aboutMemoLabels.notPublished}`}</i>
                        )}
                      </React.Fragment>
                    ))}
                  </React.Fragment>
                )
              })}
              <h3>{aboutMemoLabels.previousOfferings}</h3>
              <p>
                {aboutMemoLabels.previousOfferingsText}
                <a href={linkToArchive(courseCode, userLangAbbr)}>{courseMemoLinksLabels.archivePageLabel}</a>
              </p>
            </section>
          </Col>
          <Col lg="4" className="content-right">
            <section>
              <h2>{courseContactsLabels.courseContactsTitle}</h2>
              <AboutCourseContacts
                languageIndex={userLanguageIndex}
                examiners={webContext.examiners}
                labels={courseContactsLabels}
              />
            </section>
          </Col>
        </Row>
      </main>
    </Row>
  )
}

export default AboutCourseMemo
