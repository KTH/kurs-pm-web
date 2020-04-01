import React from 'react'

const SideMenu = ({ courseCode = '', courseMemoItems = [] }) => {
  return (
    <div>
      <p>
        &lsaquo;&nbsp;
        <a href="https://www.kth.se/student/kurser/kurser-inom-program">Kurs- och programkatalogen</a>
      </p>
      <p>
        <b>
          Om kursen&nbsp;
          {courseCode}
        </b>
      </p>
      <hr />
      <p>Inför kursval</p>
      <p>
        <b>Förbereda, gå (kurs-pm)</b>
      </p>
      <hr />
      <div className="menu-memos">
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
      <p>Slutföra ej avklarad kurs</p>
      <p>Kursens utveckling och historik</p>
    </div>
  )
}

export default SideMenu
