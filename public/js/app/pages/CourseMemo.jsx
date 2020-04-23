import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Container, Row, Col, Breadcrumb, BreadcrumbItem, Alert } from 'reactstrap'

import i18n from '../../../../i18n'
import { context, sections } from '../util/fieldsByType'
import { breadcrumbLinks, aboutCourseLink, sideMenuBackLink } from '../util/links'

import CoursePresentation from '../components/CoursePresentation'
import SideMenu from '../components/SideMenu'
import CourseHeader from '../components/CourseHeader'
import CourseContacts from '../components/CourseContacts'
import CourseFacts from '../components/CourseFacts'
import CourseLinks from '../components/CourseLinks'
import CourseMemoLinks from '../components/CourseMemoLinks'
import Section from '../components/Section'
import NewSectionEditor from '../components/NewSectionEditor'

const englishTranslations = i18n.messages[0].messages
const swedishTranslations = i18n.messages[1].messages

const renderAllSections = ({ memoData, memoLanguageIndex }) => {
  if (!memoData || Object.keys(memoData).length === 0) {
    return <Alert color="info">{i18n.messages[memoLanguageIndex].messages.noPublishedMemo}</Alert>
  }
  const { sectionsLabels } = i18n.messages[memoLanguageIndex]

  return sections.map(({ id, content, extraHeaderTitle }) => {
    const obsoleteData = !Array.isArray(memoData[extraHeaderTitle])

    return (
      <span key={id}>
        {obsoleteData && <Alert color="danger">{i18n.messages[memoLanguageIndex].messages.obsoleteData}</Alert>}
        <h2 id={id} key={'header-' + id}>
          {sectionsLabels[id]}
        </h2>
        {content.map((contentId) => {
          const menuId = id + '-' + contentId
          const { isRequired } = context[contentId]
          const initialValue = memoData[contentId]
          const visibleInMemo = isRequired ? true : !!initialValue

          return (
            <Section
              memoLangIndex={memoLanguageIndex}
              contentId={contentId}
              menuId={menuId}
              key={contentId}
              visibleInMemo={visibleInMemo}
              html={initialValue}
            />
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
  courseCode = this.props.routerStore.courseCode ? this.props.routerStore.courseCode : []

  semester = this.props.routerStore.semester ? this.props.routerStore.semester : ''

  language = this.props.routerStore.language ? this.props.routerStore.language : 'sv'

  title = this.props.routerStore.title ? this.props.routerStore.title : ''

  credits = this.props.routerStore.credits ? this.props.routerStore.credits : ''

  creditUnitAbbr = this.props.routerStore.creditUnitAbbr ? this.props.routerStore.creditUnitAbbr : ''

  department = this.props.routerStore.department ? this.props.routerStore.department : ''

  examiners = this.props.routerStore.examiners ? this.props.routerStore.examiners : ''

  imageFromAdmin = this.props.routerStore.imageFromAdmin ? this.props.routerStore.imageFromAdmin : ''

  courseMainSubjects = this.props.routerStore.courseMainSubjects ? this.props.routerStore.courseMainSubjects : ''

  introText = this.props.routerStore.sellingText ? this.props.routerStore.sellingText : ''

  render() {
    const { routerStore } = this.props
    const allSections = renderAllSections(routerStore)
    const courseImage = resolveCourseImage(this.imageFromAdmin, this.courseMainSubjects, routerStore.memoLanguage)
    const courseImageUrl = `${routerStore.browserConfig.imageStorageUri}${courseImage}`
    const { courseFactsLabels, courseMemoLinksLabels, extraInfo } = i18n.messages[routerStore.memoLanguageIndex]

    return (
      <Container className="kip-container">
        <Row>{breadcrumbs(this.language, this.courseCode)}</Row>
        <Row>
          <Col lg="3">
            <SideMenu
              courseCode={this.courseCode}
              courseMemoItems={routerStore.memoDatas.map((m) => {
                const label = m.memoEndPoint
                return {
                  label,
                  active: routerStore.activeMemoEndPoint(label),
                  url: `/kurs-pm/${routerStore.courseCode}/${label}`
                }
              })}
              backLink={sideMenuBackLink[routerStore.language]}
              labels={
                routerStore.language === 'en' ? englishTranslations.sideMenuLabels : swedishTranslations.sideMenuLabels
              }
            />
          </Col>
          <Col>
            <Row>
              <CourseHeader
                courseMemo={routerStore.memoEndPoint}
                courseCode={this.courseCode}
                title={this.title}
                credits={this.credits}
                creditUnitAbbr={this.creditUnitAbbr}
                language={routerStore.language}
              />
            </Row>
            <Row>
              <Col>
                <CoursePresentation
                  introText={this.introText}
                  courseImageUrl={courseImageUrl}
                  semester={this.semester}
                />
                {allSections}
              </Col>
              <Col lg="3">
                <CourseFacts
                  language={routerStore.memoLanguage}
                  labels={courseFactsLabels}
                  department={this.department}
                  memoData={routerStore.memoData}
                />
                <CourseMemoLinks
                  language={routerStore.memoLanguage}
                  labels={courseMemoLinksLabels}
                  extraInfo={extraInfo}
                  memoData={routerStore.memoData}
                  validFromTerm={routerStore.validFromTerm}
                />
                <CourseLinks language={routerStore.memoLanguage} />
                <CourseContacts language={routerStore.memoLanguage} memoData={routerStore.memoData} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default CourseMemo
