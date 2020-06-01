import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Container, Row, Col, Breadcrumb, BreadcrumbItem, Alert } from 'reactstrap'

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
import { Redirect } from 'react-router'

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

      if (isRequired && type === 'mandatory' && !contentHtml) {
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
        <span key={id}>
          <h2 id={id} key={'header-' + id}>
            {sectionsLabels[id]}
          </h2>
          {EMPTY[memoLanguageIndex]}
        </span>
      )
    }

    return (
      id !== 'contacts' && (
        <span key={id}>
          <h2 id={id} key={'header-' + id}>
            {sectionsLabels[id]}
          </h2>
          {content.map((contentId) => {
            const menuId = id + '-' + contentId
            const { isRequired } = context[contentId]
            const initialValue = memoData[contentId]
            const visibleInMemo = isRequired ? true : !!initialValue

            return (
              visibleInMemo && (
                <Section
                  memoLangIndex={memoLanguageIndex}
                  contentId={contentId}
                  menuId={menuId}
                  key={contentId}
                  visibleInMemo={visibleInMemo}
                  html={initialValue}
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
        </span>
      )
    )
  })
}

export const breadcrumbs = (language, courseCode) => (
  <nav>
    <Breadcrumb>
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
  </nav>
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

@inject(['routerStore'])
@observer
class CourseMemo extends Component {
  componentDidMount() {
    const { routerStore } = this.props
    const siteNameElement = document.querySelector('.block.siteName a')
    const translate = routerStore.language === 'en' ? englishTranslations : swedishTranslations
    siteNameElement.textContent = aboutCourseStr(translate, routerStore.courseCode)
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
      sideMenuLabels,
      courseFactsLabels,
      courseMemoLinksLabels,
      extraInfo,
      courseHeaderLabels,
      coursePresentationLabels,
      courseLinksLabels,
      courseContactsLabels
    } = i18n.messages[routerStore.memoLanguageIndex]

    let courseMemoItems = routerStore.memoDatas.map((m) => {
      const id = m.memoEndPoint
      const active = routerStore.activeMemoEndPoint(id)
      const label = concatMemoName(m.semester, m.ladokRoundIds, active ? m.memoLanguage : routerStore.language)
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
      // Class preview-container, or equivalent, not needed
      <Container className="kip-container" fluid>
        <Row>{breadcrumbs(routerStore.language, routerStore.courseCode)}</Row>
        <Row>
          <Col lg="3" className="side-menu">
            <SideMenu
              courseCode={routerStore.courseCode}
              courseMemoItems={courseMemoItems}
              backLink={sideMenuBackLink[routerStore.language]}
              labels={sideMenuLabels}
            />
          </Col>
          <Col lg="9">
            <CourseHeader
              courseMemo={concatMemoName(routerStore.semester, routerStore.roundIds, routerStore.memoLanguageIndex)}
              courseCode={routerStore.courseCode}
              title={routerStore.title}
              credits={routerStore.credits}
              creditUnitAbbr={routerStore.creditUnitAbbr}
              labels={courseHeaderLabels}
              language={routerStore.memoLanguage}
            />
            <Row>
              <Col lg="8" className="text-break content-center">
                <CoursePresentation
                  courseImageUrl={courseImageUrl}
                  introText={routerStore.sellingText}
                  labels={coursePresentationLabels}
                />
                {allSections}
              </Col>
              <Col lg="4" className="content-right">
                <Row className="mb-4">
                  <Col>
                    <CourseFacts
                      language={routerStore.memoLanguage}
                      labels={courseFactsLabels}
                      department={routerStore.department}
                      memoData={routerStore.memoData}
                    />
                  </Col>
                </Row>
                <Row className="my-4">
                  <Col>
                    <CourseMemoLinks
                      language={routerStore.memoLanguageIndex}
                      labels={courseMemoLinksLabels}
                      extraInfo={extraInfo}
                      memoData={routerStore.memoData}
                      validFromTerm={routerStore.validFromTerm}
                    />
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Col>
                    <CourseLinks language={routerStore.memoLanguage} labels={courseLinksLabels} />
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Col>
                    <CourseContacts
                      language={routerStore.memoLanguage}
                      memoData={routerStore.memoData}
                      labels={courseContactsLabels}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default CourseMemo
