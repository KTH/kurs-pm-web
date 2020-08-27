import React from 'react'

import { aboutCourseLink, aboutCourseMemoLink, linkToCourseDevelopmentAndHistory } from '../util/links'

const beforeChoosingCourse = (courseCode, labels) =>
  courseCode ? (
    <p>
      <b>{`${labels.aboutCourse} ${courseCode}`}</b>
    </p>
  ) : null

const SideMenu = ({ courseCode, courseMemoItems, aboutCourseMemo, backLink, labels, language }) => {
  return (
    <div role="navigation" aria-label="main">
      <p>
        &lsaquo;&nbsp;
        <a href={backLink}>{labels.directory}</a>
      </p>
      {beforeChoosingCourse(courseCode, labels)}
      <hr />
      <p>
        <a className="sideMenuLink" href={aboutCourseLink(courseCode, language)}>
          {labels.beforeChoosingCourse}
        </a>
      </p>
      <p>
        <b>{labels.courseMemo}</b>
      </p>
      <hr />
      <div className="menu-memos">
        {aboutCourseMemo ? (
          <p className="active">{labels.aboutCourseMemos}</p>
        ) : (
          <p>
            <a className="sideMenuLink" href={aboutCourseMemoLink(courseCode)}>
              {labels.aboutCourseMemos}
            </a>
          </p>
        )}
        {courseMemoItems.map(({ label, url, active }) => {
          return active ? (
            <p key={label} className="active">
              {label}
            </p>
          ) : (
            <p key={label}>
              <a href={url}>{label}</a>
            </p>
          )
        })}
      </div>
      {/* <p>{labels.finishCourse}</p> */}
      <p>
        <a
          className="sideMenuLink"
          id="course-development-history-link"
          title={labels.courseDevelopmentAndHistory}
          href={linkToCourseDevelopmentAndHistory(courseCode, language)}
        >
          {labels.courseDevelopmentAndHistory}
        </a>
      </p>
    </div>
  )
}

export default SideMenu
