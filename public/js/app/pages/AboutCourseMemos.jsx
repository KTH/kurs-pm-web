import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import { inject, observer } from 'mobx-react'
import { Container, Row, Col } from 'reactstrap'
import { Breadcrumbs } from '@kth/kth-kip-style-react-components'

import i18n from '../../../../i18n'
import { sideMenuBackLink } from '../util/links'

import SideMenu from '../components/SideMenu'

const englishTranslations = i18n.messages[0].messages
const swedishTranslations = i18n.messages[1].messages

function renderBreadcrumbsIntoKthHeader(courseCode, language) {
  const breadcrumbContainer = document.getElementById('breadcrumbs-header')

  if (breadcrumbContainer)
    ReactDOM.render(
      <Breadcrumbs include="directory" courseCode={courseCode} language={language} />,
      breadcrumbContainer
    )
}

@inject(['routerStore'])
@observer
class CourseMemo extends Component {
  componentDidMount() {
    const { routerStore } = this.props
    const siteNameElement = document.querySelector('.block.siteName a')
    const translate = routerStore.language === 'en' ? englishTranslations : swedishTranslations
    if (siteNameElement) siteNameElement.textContent = translate.aboutCourseMemos
    renderBreadcrumbsIntoKthHeader(routerStore.courseCode, routerStore.language)
  }

  render() {
    const { routerStore } = this.props
    const translate = i18n.messages[routerStore.userLanguageIndex]

    return (
      <Container fluid>
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
