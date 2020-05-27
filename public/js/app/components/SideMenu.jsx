import React from 'react'

import { aboutCourseLink, aboutCourseMemoLink } from '../util/links'

const beforeChoosingCourse = (courseCode, labels) =>
  courseCode ? (
    <p>
      <b>{`${labels.aboutCourse} ${courseCode}`}</b>
    </p>
  ) : null

const SideMenu = ({ courseCode, courseMemoItems, backLink, labels, language }) => {
  return (
    <div>
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
        <p>
          <a className="sideMenuLink" href={aboutCourseMemoLink(courseCode)}>
            {labels.aboutCourseMemos}
          </a>
        </p>
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
      <p>{labels.finishCourse}</p>
      <p>{labels.courseDevelopmentAndHistory}</p>
    </div>
  )
}

export default SideMenu
