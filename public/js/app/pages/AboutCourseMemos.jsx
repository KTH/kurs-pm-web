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
    if (siteNameElement) siteNameElement.textContent = translate.aboutCourseMemos
  }

  render() {
    const { routerStore } = this.props
    const translate = i18n.messages[routerStore.userLanguageIndex]

    return (
      <Container fluid>
        <Row className="d-print-none">{breadcrumbs(routerStore.language, '')}</Row>
        <Row>
          <SideMenu
            courseCode=""
            courseMemoItems={[]}
            aboutCourseMemo
            backLink={sideMenuBackLink[routerStore.language]}
            labels={translate.sideMenuLabels}
            language={routerStore.language}
          />
          <Col className="col-print-12" lang={routerStore.memoLanguage}>
            <main>
              <Row>
                <Col>
                  <h1 className="course-header-title">{translate.messages.aboutCourseMemos}</h1>
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
