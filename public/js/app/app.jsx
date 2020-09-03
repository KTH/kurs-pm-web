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

import i18n from '../../../i18n'

function appFactory() {
  const routerStore = new RouterStore()

  if (typeof window !== 'undefined') {
    routerStore.initializeStore('routerStore')
  }

  return (
    <Provider routerStore={routerStore}>
      <Switch>
        <Route exact path="/kurs-pm/" component={AboutCourseMemos} />
        <Route exact path="/kurs-pm/:courseCode" render={(props) => <CourseMemo {...props} i18n={i18n} />} />
        <Route exact path="/kurs-pm/:courseCode/om-kurs-pm" component={AboutCourseMemo} />
        <Route exact path="/kurs-pm/:courseCode/:id" render={(props) => <CourseMemo {...props} i18n={i18n} />} />
        <Route
          exact
          path="/kurs-pm/:courseCode/:semester/:id"
          render={(props) => <CourseMemo {...props} i18n={i18n} />}
        />
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
