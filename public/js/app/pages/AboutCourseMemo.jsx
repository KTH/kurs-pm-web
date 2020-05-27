import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Container, Row, Col, Breadcrumb, BreadcrumbItem } from 'reactstrap'

import i18n from '../../../../i18n'
import { breadcrumbLinks, sideMenuBackLink } from '../util/links'
import { aboutCourseStr, concatMemoName } from '../util/helpers'

import SideMenu from '../components/SideMenu'
import AboutHeader from '../components/AboutHeader'

const englishTranslations = i18n.messages[0].messages
const swedishTranslations = i18n.messages[1].messages

export const breadcrumbs = (language) => (
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
    const { sideMenuLabels, aboutHeaderLabels, aboutMemoLabels, courseContactsLabels } = i18n.messages[
      routerStore.memoLanguageIndex
    ]

    let courseMemoItems = routerStore.memoDatas.map((m) => {
      const id = m.memoEndPoint
      const label = concatMemoName(m.semester, m.ladokRoundIds, m.memoLanguageIndex)
      return {
        id,
        label,
        active: routerStore.activeMemoEndPoint(id),
        url: `/kurs-pm/${routerStore.courseCode}/${id}`
      }
    })
    // Duplicate id’s filtered out
    courseMemoItems = courseMemoItems.filter((item, index, self) => index === self.findIndex((t) => t.id === item.id))

    return (
      // Class preview-container, or equivalent, not needed
      <Container className="kip-container" fluid>
        <Row>{breadcrumbs(routerStore.language)}</Row>
        <Row>
          <Col lg="3" className="side-menu">
            <SideMenu
              courseCode={routerStore.courseCode}
              courseMemoItems={courseMemoItems}
              aboutCourseMemo
              backLink={sideMenuBackLink[routerStore.language]}
              labels={sideMenuLabels}
            />
          </Col>
          <Col lg="9">
            <AboutHeader
              courseCode={routerStore.courseCode}
              title={routerStore.title}
              credits={routerStore.credits}
              creditUnitAbbr={routerStore.creditUnitAbbr}
              labels={aboutHeaderLabels}
              language={routerStore.language}
            />
            {aboutMemoLabels.aboutMemosText}
            <Row>
              <Col lg="8" className="text-break">
                <h2>{aboutMemoLabels.currentRounds}</h2>
              </Col>
              <Col lg="4" className="content-right">
                <h2>{courseContactsLabels.courseContactsTitle}</h2>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default CourseMemo
