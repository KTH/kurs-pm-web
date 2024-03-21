import React from 'react'

import { Container, Row, Col } from 'reactstrap'

import i18n from '../../../../i18n'
import { sideMenuBackLink } from '../util/links'
import { useWebContext } from '../context/WebContext'

import SideMenu from '../components/SideMenu'

function AboutCourseMemos() {
  const [webContext] = useWebContext()
  const translate = i18n.messages[webContext.userLanguageIndex]
  const { courseCode, language } = webContext

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
        <Col className="col-print-12" lang={language}>
          <main>
            <Row>
              <Col>
                <h1 className="course-header-title">{translate.messages.memoLabel}</h1>
              </Col>
            </Row>
          </main>
        </Col>
      </Row>
    </Container>
  )
}

export default AboutCourseMemos
