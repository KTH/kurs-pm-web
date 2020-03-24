/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/no-danger */
import React from 'react'

const SideMenu = ({ courseCode = '', courseMemoLabels = [] }) => {
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
        {courseMemoLabels.map((label) => (
          <li key={label}>{label}</li>
        ))}
      </ul>
      <p>Slutföra ej avklarad kurs</p>
      <p>Kursens utveckling och historik</p>
    </div>
  )
}

export default SideMenu
