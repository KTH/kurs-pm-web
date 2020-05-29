import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { StaticRouter } from 'react-router'
import { Provider } from 'mobx-react'

// Sass
import '../../css/node-web.scss'

// Store
import RouterStore from './stores/RouterStore'

// Pages
import CourseMemo from './pages/CourseMemo'
import AboutCourseMemo from './pages/AboutCourseMemo'
import AboutCourseMemos from './pages/AboutCourseMemos'

function appFactory() {
  const routerStore = new RouterStore()

  if (typeof window !== 'undefined') {
    routerStore.initializeStore('routerStore')
  }

  return (
    <Provider routerStore={routerStore}>
      <Switch>
        <Route exact path="/kurs-pm/" component={AboutCourseMemos} />
        <Route exact path="/kurs-pm/:courseCode" component={CourseMemo} />
        <Route exact path="/kurs-pm/:courseCode/om-kurs-pm" component={AboutCourseMemo} />
        <Route exact path="/kurs-pm/:courseCode/:id" component={CourseMemo} />
        <Route exact path="/kurs-pm/:courseCode/:semester/:id" component={CourseMemo} />
      </Switch>
    </Provider>
  )
}

function staticRender(context, location) {
  return (
    <StaticRouter location={location} context={context}>
      {appFactory()}
    </StaticRouter>
  )
}

if (typeof window !== 'undefined') {
  ReactDOM.render(<BrowserRouter>{appFactory()}</BrowserRouter>, document.getElementById('app'))
}

export { appFactory, staticRender }
