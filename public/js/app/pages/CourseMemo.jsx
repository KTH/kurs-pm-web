import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

const parseSemester = (semesterCode, language) => {
  const semesterNumber = semesterCode.slice(semesterCode.length - 1)
  const year = semesterCode.slice(0, semesterCode.length - 1)

  if (language === 'sv') {
    return (semesterNumber === 1 ? 'VT' : 'HT') + year
  }
  return (semesterNumber === 1 ? 'Spring' : 'Autumn') + year
}

@inject(['routerStore'])
@observer
class CourseMemo extends Component {
  memoData = this.props.routerStore.memoData ? this.props.routerStore.memoData : {}

  courseCode = this.props.routerStore.courseCode ? this.props.routerStore.courseCode : []

  semester = this.props.routerStore.semester ? this.props.routerStore.semester : ''

  language = this.props.routerStore.language ? this.props.routerStore.language : 'sv'

  render() {
    console.log('render')
    console.log(this.props.routerStore)
    return <h1>{'Kurs-pm ' + parseSemester(this.semester, this.language) + ' ' + this.courseCode}</h1>
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
