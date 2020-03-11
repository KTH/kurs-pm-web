/* eslint-disable react/no-danger */
import React from 'react'

const CoursePresentation = ({ courseImageUrl = '', introText = '', title = '' }) => {
  return (
    <>
      <img
        // >= lg : float left, x margins spacer * .5
        // < lg : x margins auto, display block
        className="float-lg-left mx-lg-2 mx-sm-auto d-sm-block"
        height="300px"
        width="400px"
        src={courseImageUrl}
        alt={title}
        title={title}
      />
      <div dangerouslySetInnerHTML={{ __html: introText }} />
      <hr />
    </>
  )
}

export default CoursePresentation
