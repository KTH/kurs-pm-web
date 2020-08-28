/* eslint-disable react/no-danger */
import React from 'react'

const CoursePresentation = ({ courseImageUrl = '', introText = '', labels }) => {
  return (
    <section style={{ minHeight: '160px' }} aria-labelledby="course-presentation">
      <h2 id="course-presentation" className="sr-only">
        {labels.coursePresentation}
      </h2>
      <img
        // >= lg : float left, x margins spacer * .5
        // < lg : x margins auto, display block
        className="float-lg-left mr-lg-4 mb-lg-3 mx-sm-auto d-sm-block"
        height="auto"
        width="150px"
        src={courseImageUrl}
        alt=""
      />
      <article dangerouslySetInnerHTML={{ __html: introText }} aria-labelledby="course-presentation" />
    </section>
  )
}

export default CoursePresentation
