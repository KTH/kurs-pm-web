import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Container, Row, Col, Breadcrumb, BreadcrumbItem, Alert } from 'reactstrap'
import { Redirect } from 'react-router'

import i18n from '../../../../i18n'
import { context, sections } from '../util/fieldsByType'
import { breadcrumbLinks, aboutCourseLink, sideMenuBackLink } from '../util/links'
import { aboutCourseStr, concatMemoName } from '../util/helpers'
import { EMPTY } from '../util/constants'

import CoursePresentation from '../components/CoursePresentation'
import SideMenu from '../components/SideMenu'
import CourseHeader from '../components/CourseHeader'
import CourseContacts from '../components/CourseContacts'
import CourseFacts from '../components/CourseFacts'
import CourseLinks from '../components/CourseLinks'
import CourseMemoLinks from '../components/CourseMemoLinks'
import Section from '../components/Section'
import NewSectionEditor from '../components/NewSectionEditor'
import CoverPage from '../components/print/CoverPage'
import Contacts from '../components/print/Contacts'

const englishTranslations = i18n.messages[0].messages
const swedishTranslations = i18n.messages[1].messages

const renderAllSections = ({ memoData, memoLanguageIndex }) => {
  if (!memoData || Object.keys(memoData).length === 0) {
    return <Alert color="info">{i18n.messages[memoLanguageIndex].messages.noPublishedMemo}</Alert>
  }
  const { sectionsLabels } = i18n.messages[memoLanguageIndex]

  // TODO Refactor logic for visible sections
  const sectionsWithContent = []
  sections.forEach(({ id, content, extraHeaderTitle }) => {
    content.forEach((contentId) => {
      const { isRequired, type } = context[contentId]
      let contentHtml = memoData[contentId]
      let visibleInMemo = memoData.visibleInMemo[contentId]
      if (typeof visibleInMemo === 'undefined') {
        visibleInMemo = true
      }

      if (isRequired && (type === 'mandatory' || type === 'mandatoryAndEditable') && !contentHtml) {
        contentHtml = EMPTY[memoLanguageIndex]
      } else if (isRequired && type === 'mandatoryForSome' && !contentHtml) {
        visibleInMemo = false
      } else if (!contentHtml) {
        visibleInMemo = false
      }
      if (visibleInMemo && !sectionsWithContent.includes(id)) {
        sectionsWithContent.push(id)
      }
    })

    if (extraHeaderTitle && Array.isArray(memoData[extraHeaderTitle])) {
      memoData[extraHeaderTitle].forEach((m) => {
        if (m.visibleInMemo && !sectionsWithContent.includes(id)) {
          sectionsWithContent.push(id)
        }
      })
    }
  })

  // TODO Refactor logic for visible sections
  return sections.map(({ id, content, extraHeaderTitle }) => {
    if (!sectionsWithContent.includes(id)) {
      return (
        <section key={id} aria-labelledby={id}>
          <h2 id={id} key={'header-' + id}>
            {sectionsLabels[id]}
          </h2>
          <p>{EMPTY[memoLanguageIndex]}</p>
        </section>
      )
    }

    return (
      id !== 'contacts' && (
        <section key={id} aria-labelledby={id}>
          <h2 id={id} key={'header-' + id}>
            {sectionsLabels[id]}
          </h2>
          {content.map((contentId) => {
            const menuId = id + '-' + contentId

            const { isRequired, type } = context[contentId]
            let contentHtml = memoData[contentId]
            let visibleInMemo = memoData.visibleInMemo[contentId]
            if (typeof visibleInMemo === 'undefined') {
              visibleInMemo = true
            }

            if (isRequired && (type === 'mandatory' || type === 'mandatoryAndEditable') && !contentHtml) {
              contentHtml = EMPTY[memoLanguageIndex]
            } else if (isRequired && type === 'mandatoryForSome' && !contentHtml) {
              visibleInMemo = false
            } else if (!contentHtml) {
              visibleInMemo = false
            }

            return (
              visibleInMemo && (
                <Section
                  memoLangIndex={memoLanguageIndex}
                  contentId={contentId}
                  menuId={menuId}
                  key={contentId}
                  visibleInMemo={visibleInMemo}
                  html={contentHtml}
                />
              )
            )
          })}
          {extraHeaderTitle &&
            Array.isArray(memoData[extraHeaderTitle]) &&
            memoData[extraHeaderTitle].map(({ title, htmlContent, visibleInMemo, isEmptyNew, uKey }) => {
              return (
                <NewSectionEditor
                  contentId={extraHeaderTitle}
                  // eslint-disable-next-line react/no-array-index-key
                  key={uKey}
                  initialTitle={title}
                  initialValue={htmlContent}
                  visibleInMemo={visibleInMemo}
                  isEmptyNew={isEmptyNew}
                  uKey={uKey}
                  onEditorChange={() => {}}
                  onBlur={() => {}}
                  onRemove={() => {}}
                />
              )
            })}
        </section>
      )
    )
  })
}

export const breadcrumbs = (language, courseCode) => (
  <Breadcrumb lang={language}>
    <BreadcrumbItem>
      <a href={breadcrumbLinks.university[language]}>
        {language === 'en'
          ? englishTranslations.breadCrumbLabels.university
          : swedishTranslations.breadCrumbLabels.university}
      </a>
    </BreadcrumbItem>
    <BreadcrumbItem>
      <a href={breadcrumbLinks.student[language]}>
        {language === 'en'
          ? englishTranslations.breadCrumbLabels.student
          : swedishTranslations.breadCrumbLabels.student}
      </a>
    </BreadcrumbItem>
    <BreadcrumbItem>
      <a href={breadcrumbLinks.directory[language]}>
        {language === 'en'
          ? englishTranslations.breadCrumbLabels.directory
          : swedishTranslations.breadCrumbLabels.directory}
      </a>
    </BreadcrumbItem>
    <BreadcrumbItem>
      <a href={aboutCourseLink(courseCode, language)}>
        {language === 'en'
          ? `${englishTranslations.breadCrumbLabels.aboutCourse} ${courseCode}`
          : `${swedishTranslations.breadCrumbLabels.aboutCourse} ${courseCode}`}
      </a>
    </BreadcrumbItem>
  </Breadcrumb>
)

// Logic copied from kursinfo-web
export const resolveCourseImage = (imageFromAdmin, courseMainSubjects = '', language) => {
  let courseImage = ''
  // If course administrator has set own picture, use that
  if (imageFromAdmin && imageFromAdmin.length > 4) {
    courseImage = imageFromAdmin
    // Course administrator has not set own picture, get one based on course’s main subjects
  } else {
    let mainSubjects = courseMainSubjects.split(',').map((s) => s.trim())

    // If main subjects exist, and the language is English, get Swedish translations of main subjects
    if (mainSubjects && mainSubjects.length > 0 && language === 'en') {
      mainSubjects = mainSubjects.map((subject) => englishTranslations.courseMainSubjects[subject])
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

const determineContentFlexibility = () => {
  const lastColLastElem = document.getElementById('last-element-which-determines-styles')
  if (lastColLastElem) {
    const lastElBottomPx = lastColLastElem.getBoundingClientRect().bottom
    const allCenterSections = document.getElementById('flexible-content-of-center').querySelectorAll('article')
    allCenterSections.forEach((section) => {
      const topOfSection = section.getBoundingClientRect().top
      if (topOfSection > lastElBottomPx) section.classList.add('flexible-section-style')
    })
  }
}

@inject(['routerStore'])
@observer
class CourseMemo extends Component {
  componentDidMount() {
    const { routerStore } = this.props
    const siteNameElement = document.querySelector('.block.siteName a')
    const translate = routerStore.language === 'en' ? englishTranslations : swedishTranslations
    if (siteNameElement) siteNameElement.textContent = aboutCourseStr(translate, routerStore.courseCode)
    //Decide which content can have wider content (exempel tables, to make them more readable)
    determineContentFlexibility()
  }

  render() {
    const { routerStore } = this.props
    if (routerStore.noMemoData()) {
      return <Redirect to={`/kurs-pm/${routerStore.courseCode}/om-kurs-pm`} />
    }
    const allSections = renderAllSections(routerStore)
    const courseImage = resolveCourseImage(
      routerStore.imageFromAdmin,
      routerStore.courseMainSubjects,
      routerStore.memoLanguage
    )
    const courseImageUrl = `${routerStore.browserConfig.imageStorageUri}${courseImage}`
    const {
      coverPageLabels,
      courseFactsLabels,
      courseMemoLinksLabels,
      extraInfo,
      coursePresentationLabels,
      courseLinksLabels,
      courseContactsLabels
    } = i18n.messages[routerStore.memoLanguageIndex]
    const { courseHeaderLabels, sideMenuLabels } = i18n.messages[routerStore.userLanguageIndex]

    let courseMemoItems = routerStore.memoDatas.map((m) => {
      const id = m.memoEndPoint
      const label = concatMemoName(m.semester, m.ladokRoundIds, m.memoCommonLangAbbr)
      const active = routerStore.activeMemoEndPoint(id)
      return {
        id,
        label,
        active,
        url: `/kurs-pm/${routerStore.courseCode}/${id}`
      }
    })
    // Duplicate id’s filtered out
    courseMemoItems = courseMemoItems.filter((item, index, self) => index === self.findIndex((t) => t.id === item.id))

    return (
      <Container fluid>
        <CoverPage
          labels={coverPageLabels}
          language={routerStore.memoLanguage}
          courseTitle={routerStore.memoData.courseTitle}
          courseCode={routerStore.courseCode}
          memoName={concatMemoName(routerStore.semester, routerStore.roundIds, routerStore.memoLanguage)}
          version={routerStore.memoData.version}
          lastChangeDate={routerStore.memoData.lastChangeDate}
          rounds={routerStore.memoData.memoName}
          departmentName={routerStore.memoData.departmentName}
          languageOfInstruction={routerStore.memoData.languageOfInstructions}
          syllabusValid={routerStore.memoData.syllabusValid}
          url={routerStore.url}
        />
        <Row className="d-print-none">{breadcrumbs(routerStore.language, routerStore.courseCode)}</Row>
        <Row>
          <Col lg="3" className="d-print-none side-menu">
            <SideMenu
              courseCode={routerStore.courseCode}
              courseMemoItems={courseMemoItems}
              backLink={sideMenuBackLink[routerStore.language]}
              labels={sideMenuLabels}
              language={routerStore.language}
            />
          </Col>
          <Col lg="9" className="col-print-12" lang={routerStore.memoLanguage}>
            <main aria-labelledby="memo-title memo-subtitle">
              <CourseHeader
                courseMemoName={concatMemoName(routerStore.semester, routerStore.roundIds, routerStore.memoLanguage)}
                courseTitle={routerStore.memoData.courseTitle}
                courseCode={routerStore.courseCode}
                labels={courseHeaderLabels}
                language={routerStore.memoLanguage}
              />
              <Row>
                <Col id="flexible-content-of-center" lg="8" className="text-break col-print-12 content-center">
                  <CoursePresentation
                    courseImageUrl={courseImageUrl}
                    introText={routerStore.sellingText}
                    labels={coursePresentationLabels}
                  />
                  {allSections}
                  <Contacts
                    language={routerStore.memoLanguage}
                    memoData={routerStore.memoData}
                    labels={courseContactsLabels}
                  />
                </Col>
                <Col lg="4" className="d-print-none content-right">
                  <Row className="mb-lg-4">
                    <Col>
                      <CourseFacts
                        language={routerStore.memoLanguage}
                        labels={courseFactsLabels}
                        memoData={routerStore.memoData}
                      />
                      <CourseFacts
                        language={routerStore.memoLanguage}
                        labels={courseFactsLabels}
                        memoData={routerStore.memoData}
                      />
                      <CourseFacts
                        language={routerStore.memoLanguage}
                        labels={courseFactsLabels}
                        memoData={routerStore.memoData}
                      />
                    </Col>
                  </Row>
                  <Row className="my-lg-4">
                    <Col>
                      <CourseMemoLinks
                        language={routerStore.memoLanguageIndex}
                        labels={courseMemoLinksLabels}
                        extraInfo={extraInfo}
                        memoData={routerStore.memoData}
                        courseMemoName={concatMemoName(
                          routerStore.semester,
                          routerStore.roundIds,
                          routerStore.memoLanguage
                        )}
                      />
                    </Col>
                  </Row>
                  <Row className="mt-lg-4">
                    <Col>
                      <CourseLinks language={routerStore.memoLanguage} labels={courseLinksLabels} />
                    </Col>
                  </Row>
                  <Row id="row-for-the-last-element-which-determines-styles" className="mt-lg-4">
                    <Col>
                      <CourseContacts
                        styleId="last-element-which-determines-styles"
                        language={routerStore.memoLanguage}
                        memoData={routerStore.memoData}
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
}

export default CourseMemo
