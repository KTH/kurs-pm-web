/* eslint-disable react/no-danger */
import React from 'react'
import Thumbnail from './Thumbnail'

const defaultProfileUrl = 'https://www.kth.se/profile/'
const itemTypeSchemaUrl = 'http://schema.org/Person'

const Contact = ({ username, givenName, lastName }) => {
  if (!username || !givenName || !lastName) return null

  const displayName = `${givenName} ${lastName}`

  return (
    <>
      <span itemsScope="" itemType={itemTypeSchemaUrl}>
        <a href={`${defaultProfileUrl}${username}`} itemProp="url">
          <Thumbnail itemProp="image" username={username} />
          <span itemProp="name">{displayName}</span>
        </a>
      </span>
    </>
  )
}

export default Contact
