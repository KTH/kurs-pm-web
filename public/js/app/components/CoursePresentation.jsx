import React from 'react'

const CoursePresentation = props => {
  return (
    <>
      <div style={{ backgroundColor: 'lightgray', height: '12rem' }}>
        <b>Information About Course</b>
        <br />
        {props.courseCode}
        <br />
        {props.semester}
        <br />
        {props.language}
      </div>
      <hr />
    </>
  )
}

export default CoursePresentation
