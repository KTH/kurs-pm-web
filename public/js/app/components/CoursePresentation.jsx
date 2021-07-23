import React from 'react'
import HtmlWrapper from './HtmlWrapper'

const CoursePresentation = ({ courseImageUrl = '', introText = '', labels }) => (
  <section className="d-print-none" aria-labelledby="course-presentation">
    <h2 id="course-presentation" className="sr-only">
      {labels.coursePresentation}
    </h2>
    <img id="course-presentation-image" className="float-sm-left" src={courseImageUrl} alt="" />
    <article aria-labelledby="course-presentation">
      <HtmlWrapper html={introText} />
    </article>
  </section>
)

export default CoursePresentation
