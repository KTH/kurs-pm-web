import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Container, Row, Col } from 'reactstrap'

import { sections } from '../util/fieldsByType'
import CoursePresentation from '../components/CoursePresentation'
import SideMenu from '../components/SideMenu'
import i18n from '../../../../i18n'
import CourseHeader from '../components/CourseHeader'
import CourseContacts from '../components/CourseContacts'
import CourseFacts from '../components/CourseFacts'
import CourseLinks from '../components/CourseLinks'

const renderAllSections = ({ memoData }) => {
  return memoData ? (
    sections.map((section) => (
      <Section key={section.id} id={section.id} title={section.title} content={section.content} memoData={memoData} />
    ))
  ) : (
    <h2>Inga publicerade kurs-pm</h2>
  )
}

const Section = ({ id, title, content, memoData }) => (
  <>
    <h2 id={id} key={'header-' + id}>
      {title}
    </h2>
    {content.map((contentId) => {
      // eslint-disable-next-line react/no-danger
      return <div key={contentId} className="text-break" dangerouslySetInnerHTML={{ __html: memoData[contentId] }} />
    })}
  </>
)

const englishTranslations = i18n.messages[0].messages
const swedishTranslations = i18n.messages[1].messages

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

    return (
      <Container className="kip-container">
        <Row>
          <Col lg="3">
            <SideMenu
              courseCode={this.courseCode}
              courseMemoItems={routerStore.memoDatas.map((m) => {
                const label = m.memoEndPoint
                return {
                  label,
                  active: routerStore.activeMemoEndPoint(label),
                  action: () => {
                    routerStore.setMemoEndPoint(label)
                  }
                }
              })}
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
                <CourseFacts language={this.language} department={this.department} memoData={routerStore.memoData} />
                <CourseLinks language={this.language} />
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
