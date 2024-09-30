import React from 'react'

import { Row, Col } from 'reactstrap'

import i18n from '../../../../i18n'
import { sideMenuBackLink } from '../util/links'
import { useWebContext } from '../context/WebContext'

import SideMenu from '../components/SideMenu'

/**
 * Page displayed when accessing this app without course code.
 */
function AboutCourseMemos() {
  const [webContext] = useWebContext()
  const translate = i18n.messages[webContext.userLanguageIndex]
  const { language } = webContext

  return (
    <Row>
      <SideMenu
        courseCode=""
        courseMemoItems={[]}
        aboutCourseMemo
        backLink={sideMenuBackLink[language]}
        labels={translate.sideMenuLabels}
        language={language}
      />
      <Col id="mainContent" className="col-print-12" lang={language}>
        <main>
          <h1 className="course-header-title">{translate.messages.memoLabel}</h1>
        </main>
      </Col>
    </Row>
  )
}

export default AboutCourseMemos
