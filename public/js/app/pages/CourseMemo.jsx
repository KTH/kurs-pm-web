import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Container, Row, Col } from 'reactstrap'

import { sections } from '../util/fieldsByType'
import CoursePresentation from '../components/CoursePresentation'
import i18n from '../../../../i18n'

const renderAllSections = memoData => {
  return sections.map(section => <Section key={section.id} memoData={memoData} {...section} />)
}

const Section = ({ id, title, content, memoData }) => (
  <>
    <h2 id={id} key={'header-' + id}>
      {title}
    </h2>
    {content.map(contentId => {
      // eslint-disable-next-line react/no-danger
      return <div key={contentId} dangerouslySetInnerHTML={{ __html: memoData[contentId] }} />
    })}
  </>
)

// Logic copied from kursinfo-web
export const resolveCourseImage = (imageFromAdmin, courseMainSubjects = '', language = 'sv') => {
  let courseImage = ''
  // If course administrator has set own picture, use that
  if (imageFromAdmin && imageFromAdmin.length > 4) {
    courseImage = imageFromAdmin
    // Course administrator has not set own picture, get one based on course’s main subjects
  } else {
    const englishTranslations = i18n.messages[0].messages
    const swedishTranslations = i18n.messages[1].messages
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

@inject(['routerStore'])
@observer
class CourseMemo extends Component {
  memoData = this.props.routerStore.memoData.length > 0 ? this.props.routerStore.memoData[0] : {}

  courseCode = this.props.routerStore.courseCode ? this.props.routerStore.courseCode : []

  semester = this.props.routerStore.semester ? this.props.routerStore.semester : ''

  language = this.props.routerStore.language ? this.props.routerStore.language : 'sv'

  imageFromAdmin = this.props.routerStore.imageFromAdmin ? this.props.routerStore.imageFromAdmin : ''

  courseMainSubjects = this.props.routerStore.courseMainSubjects ? this.props.routerStore.courseMainSubjects : ''

  introText = this.props.routerStore.sellingText ? this.props.routerStore.sellingText : { en: '', sv: '' }

  render() {
    const allSections = renderAllSections(this.memoData)
    const courseImage = resolveCourseImage(this.imageFromAdmin, this.courseMainSubjects, this.language)
    const courseImageUrl = `${this.props.routerStore.browserConfig.imageStorageUri}${courseImage}`

    return (
      <Container className="kip-container">
        <Row>
          <Col lg="12">
            <h1>Inför kursval</h1>
          </Col>
        </Row>
        <Row>
          <Col lg="12">
            <CoursePresentation
              introText={typeof this.introText === 'object' ? this.introText[this.language] : this.introText}
              courseImageUrl={courseImageUrl}
              semester={this.semester}
              language={this.language}
              courseCode={this.courseCode}
            />
          </Col>
        </Row>
        <Row>
          <Col lg="3">
            <h2>Side Menu</h2>
          </Col>
          <Col lg="6">{allSections}</Col>
          <Col lg="3">
            <h2>Sidebar</h2>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default CourseMemo
