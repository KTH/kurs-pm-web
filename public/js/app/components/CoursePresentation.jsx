/* eslint-disable react/no-danger */
import React from 'react'

const CoursePresentation = ({ courseImageUrl = '', introText = '', labels }) => {
  return (
    <section style={{ minHeight: '160px' }} aria-label={labels.coursePresentation}>
      <img
        // >= lg : float left, x margins spacer * .5
        // < lg : x margins auto, display block
        className="float-lg-left mr-lg-4 mb-lg-3 mx-sm-auto d-sm-block"
        height="auto"
        width="150px"
        src={courseImageUrl}
        alt=""
      />
      <div dangerouslySetInnerHTML={{ __html: introText }} />
    </section>
  )
}

export default CoursePresentation
