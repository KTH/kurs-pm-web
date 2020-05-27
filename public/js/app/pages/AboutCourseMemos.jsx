import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Container, Row, Col, Breadcrumb, BreadcrumbItem } from 'reactstrap'

import i18n from '../../../../i18n'
import { breadcrumbLinks, sideMenuBackLink } from '../util/links'

import SideMenu from '../components/SideMenu'

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
      <BreadcrumbItem>
        {language === 'en'
          ? `${englishTranslations.breadCrumbLabels.aboutCourseMemos}`
          : `${swedishTranslations.breadCrumbLabels.aboutCourseMemos}`}
      </BreadcrumbItem>
    </Breadcrumb>
  </nav>
)

@inject(['routerStore'])
@observer
class CourseMemo extends Component {
  componentDidMount() {
    const { routerStore } = this.props
    const siteNameElement = document.querySelector('.block.siteName a')
    const translate = routerStore.language === 'en' ? englishTranslations : swedishTranslations
    siteNameElement.textContent = translate.aboutCourseMemos
  }

  render() {
    const { routerStore } = this.props
    const translate = i18n.messages[routerStore.userLanguageIndex]

    return (
      <Container className="kip-container">
        <Row>{breadcrumbs(routerStore.language, '')}</Row>
        <Row>
          <Col lg="3">
            <SideMenu
              courseCode=""
              courseMemoItems={[]}
              labels={translate.sideMenuLabels}
              backLink={sideMenuBackLink[routerStore.language]}
            />
          </Col>
          <Col>
            <Row>
              <Col>
                <h1 className="course-header-title">{translate.aboutCourseMemos}</h1>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default CourseMemo
