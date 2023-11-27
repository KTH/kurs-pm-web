import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { WebContextProvider } from './context/WebContext'
import { uncompressData } from './context/compress'
// Sass
import '../../css/kurs-pm-web.scss'

// Pages
import CourseMemo from './pages/CourseMemo'
import AboutCourseMemo from './pages/AboutCourseMemo'
import AboutCourseMemos from './pages/AboutCourseMemos'

_renderOnClientSide()

function _renderOnClientSide() {
  const isClientSide = typeof window !== 'undefined'
  if (!isClientSide) {
    return
  }

  const webContext = {}
  uncompressData(webContext)

  const basename = webContext.proxyPrefixPath.uri

  const app = <BrowserRouter basename={basename}>{appFactory({}, webContext)}</BrowserRouter>

  const domElement = document.getElementById('app')
  ReactDOM.hydrateRoot(domElement, app)
}

function appFactory(applicationStore, context) {
  return (
    <WebContextProvider configIn={context}>
      <Routes>
        <Route exact path="/" element={<AboutCourseMemos />} />
        <Route exact path="/old/:courseCode/:memoEndPoint/:version" element={<CourseMemo />} />
        <Route exact path="/:courseCode" element={<CourseMemo />} />
        <Route exact path="/:courseCode/om-kurs-pm" element={<AboutCourseMemo />} />
        <Route exact path="/:courseCode/:id" element={<CourseMemo />} />
        <Route exact path="/:courseCode/:semester/:id" element={<CourseMemo />} />
      </Routes>
    </WebContextProvider>
  )
}

export default appFactory
