import React from 'react'

import { MainMenu } from '../components-shared/MainMenu'

import {
  aboutCourseLink,
  aboutCourseMemoLink,
  linkToCourseDevelopment,
  linkToArchive,
  sideMenuBackLink,
} from '../util/links'

const removedOutdated = courseMemoItem => !courseMemoItem.outdated

const SideMenu = ({ labels, courseCode, language, aboutCourseMemo, courseMemoItems, archivedMemo }) => {
  const classNames = 'kth-local-navigation col col-lg-3 d-print-none'
  const title = `${labels.aboutCourse} ${courseCode}`
  const ancestorItem = {
    label: labels.directory,
    href: sideMenuBackLink[language],
  }

  return archivedMemo ? (
    <nav className={classNames}>
      <a href={linkToArchive(courseCode, language)} className="kth-button back">
        {labels.archive}
      </a>
    </nav>
  ) : (
    <MainMenu title={title} ancestorItem={ancestorItem}>
      <ul>
        <li>
          <a href={aboutCourseLink(courseCode, language)}> {labels.beforeChoosingCourse}</a>
        </li>

        <li className="kth-local-navigation__submenu">
          <h3>{labels.courseMemo}</h3>
          <ul>
            <li>
              <a href={aboutCourseMemoLink(courseCode)} {...(aboutCourseMemo ? { 'aria-current': 'page' } : {})}>
                {labels.aboutCourseMemos}
              </a>
            </li>
            {courseMemoItems.filter(removedOutdated).map(({ label, url, active }) => (
              <li key={label}>
                <a href={url} {...(active ? { 'aria-current': 'page' } : {})}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </li>

        <li>
          <a href={linkToCourseDevelopment(courseCode, language)}>{labels.courseDevelopment}</a>
        </li>

        <li>
          <a href={linkToArchive(courseCode, language)}>{labels.archive}</a>
        </li>
      </ul>
    </MainMenu>
  )
}

export default SideMenu
