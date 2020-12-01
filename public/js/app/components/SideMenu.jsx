/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import {
  aboutCourseLink,
  aboutCourseMemoLink,
  linkToCourseDevelopment,
  linkToArchive,
  sideMenuBackLink
} from '../util/links'

const removedOutdated = (courseMemoItem) => !courseMemoItem.outdated

const SideMenu = ({ labels, courseCode, language, aboutCourseMemo, courseMemoItems, archivedMemo }) =>
  archivedMemo ? (
    <nav
      id="mainMenu"
      aria-label={labels.subMenuAriaLabel}
      className="col col-lg-3 navbar navbar-expand-lg navbar-light d-print-none"
    >
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="nav">
          <li className="parentLink">
            <a href={linkToArchive(courseCode, language)}>{labels.archive}</a>
          </li>
        </ul>
      </div>
    </nav>
  ) : (
    <nav
      id="mainMenu"
      aria-label={labels.subMenuAriaLabel}
      className="col col-lg-3 navbar navbar-expand-lg navbar-light d-print-none"
    >
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="nav">
          <li className="parentLink">
            <a href={sideMenuBackLink[language]}>{labels.directory}</a>
          </li>
        </ul>
        <ul className="nav nav-list expandable">
          <li className="nav-item ancestor">
            <a aria-current="page" className="nav-link active" href={aboutCourseLink(courseCode, language)}>
              {courseCode ? `${labels.aboutCourse} ${courseCode}` : labels.aboutCourseMemos}
            </a>
          </li>
          <li className="nav-item leaf">
            <a className="nav-link" href={aboutCourseLink(courseCode, language)}>
              {labels.beforeChoosingCourse}
            </a>
          </li>
          <li className="nav-item node selected expanded">
            <a className="nav-link">{labels.courseMemo}</a>
            <ul className="nav nav-list">
              <li className={`nav-item leaf ${aboutCourseMemo ? 'selected' : ''}`}>
                <a href={aboutCourseMemo ? null : aboutCourseMemoLink(courseCode)} className="nav-link">
                  {labels.aboutCourseMemos}
                </a>
              </li>
              {courseMemoItems.filter(removedOutdated).map(({ label, url, active }) => (
                <li key={label} className={`nav-item leaf ${active ? 'selected' : ''}`}>
                  <a href={active ? null : url} className="nav-link">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </li>
          <li className="nav-item leaf">
            <a className="nav-link" href={linkToCourseDevelopment(courseCode, language)}>
              {labels.courseDevelopment}
            </a>
          </li>
          <li className="nav-item leaf">
            <a className="nav-link" href={linkToArchive(courseCode, language)}>
              {labels.archive}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )

export default SideMenu
