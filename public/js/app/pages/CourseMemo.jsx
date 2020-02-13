import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

@inject(['routerStore'])
@observer
class CourseMemo extends Component {
  render() {
    return <h1>Course Memo</h1>
  }
}

export default CourseMemo
