import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'

import { Container, Row, Col } from 'reactstrap'
import { Breadcrumbs } from '@kth/kth-reactstrap/dist/components/utbildningsinfo'

import i18n from '../../../../i18n'
import { sideMenuBackLink } from '../util/links'
import { useWebContext } from '../context/WebContext'

import SideMenu from '../components/SideMenu'

function renderBreadcrumbsIntoKthHeader(courseCode, languageAbbr) {
  const breadcrumbContainer = document.getElementById('breadcrumbs-header')
  if (breadcrumbContainer) {
    ReactDOM.render(
      <Breadcrumbs include={'aboutCourse'} courseCode={courseCode} language={languageAbbr} />,
      breadcrumbContainer
    )
  }
}

function CourseMemo() {
  const [webContext] = useWebContext()
  const translate = i18n.messages[webContext.userLanguageIndex]
  const { courseCode, language, memoLanguage } = webContext

  useEffect(() => {
    let isMounted = true
    if (isMounted) {
      renderBreadcrumbsIntoKthHeader(courseCode, language)
    }
    return () => (isMounted = false)
  }, [])

  return (
    <Container fluid>
      <Row>
        <SideMenu
          courseCode=""
          courseMemoItems={[]}
          aboutCourseMemo
          backLink={sideMenuBackLink[language]}
          labels={translate.sideMenuLabels}
          language={language}
        />
        <Col className="col-print-12" lang={memoLanguage}>
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

export default CourseMemo
