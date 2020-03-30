/* eslint-disable react/no-danger */
import React from 'react'
import i18n from '../../../../i18n'
import { IconContext } from 'react-icons'
import { MdLaunch } from 'react-icons/md'

const englishTranslations = i18n.messages[0].messages
const swedishTranslations = i18n.messages[1].messages

const schedule = (language, scheduleUrls) =>
  scheduleUrls.map(
    (s) =>
      !s.url || (
        <p key={s.id}>
          <a href={s.url}>
            {language === 'sv' ? swedishTranslations.scheduleLabel : englishTranslations.scheduleLabel}
          </a>
        </p>
      )
  )

const CourseLinks = ({ language, roundInfos }) => (
  <div className="text-break" style={{ backgroundColor: '#f4f4f4' }}>
    <IconContext.Provider value={{ size: '1.8em' }}>
      <MdLaunch />
    </IconContext.Provider>
    {schedule(
      language,
      roundInfos.map((r) => {
        return { id: r.round ? r.round.ladokRoundId : '0', url: r.schemaUrl }
      })
    )}
  </div>
)

export default CourseLinks
