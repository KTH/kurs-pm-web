/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react'

const SideMenu = ({ courseCode = '', courseMemoItems = [] }) => {
  return (
    <div>
      <p>
        &lsaquo; <a href="https://www.kth.se/student/kurser/kurser-inom-program">Kurs- och programkatalogen</a>
      </p>
      <p>
        <b>Om kursen {courseCode}</b>
      </p>
      <hr />
      <p>Inför kursval</p>
      <p>
        <b>Förbereda, gå (kurs-pm)</b>
      </p>
      <ul>
        {courseMemoItems.map(({ label, action, active }) => {
          return active ? (
            <b>
              <li key={label}>{label}</li>
            </b>
          ) : (
            <li key={label}>
              <a onClick={() => action()}>{label}</a>
            </li>
          )
        })}
      </ul>
      <p>Slutföra ej avklarad kurs</p>
      <p>Kursens utveckling och historik</p>
    </div>
  )
}

export default SideMenu
