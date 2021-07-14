/* eslint-disable react/no-danger */
import React from 'react'

const CoursePresentation = ({ courseImageUrl = '', introText = '', labels }) => (
  <section className="d-print-none" aria-labelledby="course-presentation">
    <h2 id="course-presentation" className="sr-only">
      {labels.coursePresentation}
    </h2>
    <img id="course-presentation-image" className="float-sm-left" src={courseImageUrl} alt="" />
    <article dangerouslySetInnerHTML={{ __html: introText }} aria-labelledby="course-presentation" />
  </section>
)

export default CoursePresentation
