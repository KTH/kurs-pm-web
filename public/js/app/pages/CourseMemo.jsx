import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

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
      <>
        <h1>{'Kurs-pm ' + parseSemester(this.semester, this.language) + ' ' + this.courseCode}</h1>
        {allSections}
      </>
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
