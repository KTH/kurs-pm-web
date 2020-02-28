import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Container, Row, Col } from 'reactstrap'

import { sections } from '../util/fieldsByType'

const parseSemester = (semesterCode, language) => {
  const semesterNumber = semesterCode.slice(semesterCode.length - 1)
  const year = semesterCode.slice(0, semesterCode.length - 1)

  if (language === 'sv') {
    return (semesterNumber === 1 ? 'VT' : 'HT') + year
  }
  return (semesterNumber === 1 ? 'Spring' : 'Autumn') + year
}

const renderAllSections = memoData => {
  return sections.map(section => (
    <span key={section.id}>
      <h2 id={section.id} key={'header-' + section.id}>
        {section.title}
      </h2>
      {section.content.map(contentId => {
        // eslint-disable-next-line react/no-danger
        return <div dangerouslySetInnerHTML={{ __html: memoData[contentId] }} />
      })}
    </span>
  ))
}

@inject(['routerStore'])
@observer
class CourseMemo extends Component {
  memoData = this.props.routerStore.memoData ? this.props.routerStore.memoData : {}

  courseCode = this.props.routerStore.courseCode ? this.props.routerStore.courseCode : []

  semester = this.props.routerStore.semester ? this.props.routerStore.semester : ''

  language = this.props.routerStore.language ? this.props.routerStore.language : 'sv'

  render() {
    const allSections = renderAllSections(this.memoData)
    return (
      <Container className="kip-container">
        <Row>
          <Col lg="12">
            <h1>{'Kurs-pm ' + parseSemester(this.semester, this.language) + ' ' + this.courseCode}</h1>
          </Col>
        </Row>
        <Row>
          <Col lg="12">
            <div style={{ backgroundColor: 'lightgray', height: '12rem' }}>Information about course</div>
            <hr />
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

// function useStores() {
//   return React.useContext(MobXProviderContext)
// }

// const CourseMemo = observer(() => {
//   const { courseCode = 'SF1624', semester = '20191', language = 'sv' } = useStores()
//   return <h1>{'Kurs-pm ' + parseSemester(semester, language) + ' ' + courseCode}</h1>
// })

export default CourseMemo
