import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Container, Row, Col } from 'reactstrap'

import { sections } from '../util/fieldsByType'
import CoursePresentation from '../components/CoursePresentation'
import SideMenu from '../components/SideMenu'
import i18n from '../../../../i18n'
import CourseHeader from '../components/CourseHeader'

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

const englishTranslations = i18n.messages[0].messages
const swedishTranslations = i18n.messages[1].messages

// Logic copied from kursinfo-web
export const resolveCourseImage = (imageFromAdmin, courseMainSubjects = '', language = 'sv') => {
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

@inject(['routerStore'])
@observer
class CourseMemo extends Component {
  memoData = this.props.routerStore.memoData.length > 0 ? this.props.routerStore.memoData[0] : {}

  courseCode = this.props.routerStore.courseCode ? this.props.routerStore.courseCode : []

  semester = this.props.routerStore.semester ? this.props.routerStore.semester : ''

  language = this.props.routerStore.language ? this.props.routerStore.language : 'sv'

  title = this.props.routerStore.title ? this.props.routerStore.title : ''

  credits = this.props.routerStore.credits ? this.props.routerStore.credits : ''

  creditUnitAbbr = this.props.routerStore.creditUnitAbbr ? this.props.routerStore.creditUnitAbbr : ''

  imageFromAdmin = this.props.routerStore.imageFromAdmin ? this.props.routerStore.imageFromAdmin : ''

  courseMainSubjects = this.props.routerStore.courseMainSubjects ? this.props.routerStore.courseMainSubjects : ''

  introText = this.props.routerStore.sellingText ? this.props.routerStore.sellingText : ''

  render() {
    const allSections = renderAllSections(this.memoData)
    const courseImage = resolveCourseImage(this.imageFromAdmin, this.courseMainSubjects, this.language)
    const courseImageUrl = `${this.props.routerStore.browserConfig.imageStorageUri}${courseImage}`

    return (
      <Container className="kip-container">
        <Row>
          <Col lg="3">
            <SideMenu courseCode={this.courseCode} />
          </Col>
          <Col>
            <Row>
              <Col>
                <CourseHeader
                  courseCode={this.courseCode}
                  title={this.title}
                  credits={this.credits}
                  creditUnitAbbr={this.creditUnitAbbr}
                  language={this.language}
                />
                <CoursePresentation
                  introText={this.introText}
                  courseImageUrl={courseImageUrl}
                  semester={this.semester}
                  language={this.language}
                  courseCode={this.courseCode}
                />
              </Col>
            </Row>
            <Row className="w-100 p-1" style={{ borderBottom: '1px solid lightgray' }} />
            <Row>
              <Col>{allSections}</Col>
              <Col lg="4">
                <h2>
                  {this.language === 'en'
                    ? englishTranslations.courseInformationTitle
                    : swedishTranslations.courseInformationTitle}
                </h2>
                <div className="text-muted">
                  Spicy jalapeno bacon ipsum dolor amet velit aliquip tempor ea cupim tongue flank chislic burgdoggen
                  tail proident kevin dolore. Commodo shoulder culpa eu kielbasa, pork belly voluptate dolore. Quis ham
                  enim bresaola, buffalo venison sausage jowl dolore lorem ball tip chicken picanha. Flank cupim id
                  tempor pancetta in t-bone voluptate burgdoggen ullamco spare ribs. In do labore buffalo occaecat beef
                  ribs short ribs. Short loin hamburger frankfurter spare ribs nulla t-bone shoulder.
                </div>
                <div className="text-muted">
                  Nisi shoulder ex, chuck sed t-bone pork exercitation burgdoggen chislic officia quis turkey. Sed velit
                  pariatur, kevin strip steak sirloin turkey duis lorem brisket beef ribs pork loin aute. Meatball jowl
                  tail pork loin t-bone aute eu duis tri-tip. Picanha pork meatball culpa id.
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default CourseMemo
