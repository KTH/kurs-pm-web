/* eslint-disable react/no-danger */
import React from 'react'

const defaultThumbnailUrl = 'https://www.kth.se/files/thumbnail/'
const size = { w: '31', h: '31' }

// TODO Remove this component if it isn't used anymore
const Thumbnail = ({ url = defaultThumbnailUrl, username = '', itemprop = 'image' }) => {
  return (
    <span>
      <img src={`${url}${username}`} alt="" width={size.w} height={size.h} itemProp={itemprop} />
    </span>
  )
}

export default Thumbnail
