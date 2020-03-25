import React from 'react'

import { Button } from 'reactstrap'

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
      <p>
        {courseMemoItems.map(({ label, action, active }) => {
          return active ? (
            <Button key={label} className="menu" color="link" disabled>
              {label}
            </Button>
          ) : (
            <Button key={label} className="menu" color="link" onClick={() => action()}>
              {label}
            </Button>
          )
        })}
      </p>
      <p>Slutföra ej avklarad kurs</p>
      <p>Kursens utveckling och historik</p>
    </div>
  )
}

export default SideMenu
