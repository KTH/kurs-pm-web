/* eslint-disable react/no-danger */
import React from 'react'

const deafultIntroText = `<p>Spicy jalapeno bacon ipsum dolor amet drumstick tempor swine, excepteur quis flank tail incididunt venison burgdoggen brisket adipisicing ad non. Tenderloin excepteur minim andouille meatball id cillum cow pariatur flank fugiat. Burgdoggen drumstick pariatur est leberkas, veniam shankle pork loin cow occaecat dolore aliquip ea bresaola. Esse deserunt pig, in aute ball tip cupim quis. Reprehenderit veniam cow eu, sausage labore ball tip. Biltong sed ham tempor shankle tri-tip burgdoggen.</p>

<p>Dolor drumstick pork belly, minim short loin officia turducken ground round lorem cow. Sed prosciutto picanha, ham consequat shank hamburger in. Spare ribs excepteur et ad in esse ut filet mignon ham hock turducken irure tri-tip. Id porchetta swine, rump dolor drumstick magna dolore leberkas aliquip. Turducken swine voluptate ball tip spare ribs t-bone id sausage pork belly incididunt pancetta bacon frankfurter excepteur.</p>

<p>Ad shoulder filet mignon sed, pork cupim veniam jerky burgdoggen. Spare ribs ground round beef ribs laborum doner, sirloin fugiat meatball. Id alcatra ham hock cow venison commodo shoulder cupidatat spare ribs. In pastrami cillum exercitation.</p>

<p>Nisi chuck sirloin nulla, cupidatat ex officia frankfurter fatback sed. Strip steak esse shank dolore, biltong chuck chislic laboris turducken chicken ullamco. Ham hock lorem ad in, ut pig tri-tip cupidatat boudin mollit chuck. Capicola nisi pork chop pariatur sed venison. Filet mignon ut in sint capicola.</p>`

const defaultCourseImageUrl = 'https://picsum.photos/400/300'

const courseImageStyle = { float: 'left', height: '300px', width: '400px', margin: '0 10px 10px 0' }

const CoursePresentation = ({ courseImageUrl = defaultCourseImageUrl, introText = deafultIntroText, title = '' }) => {
  return (
    <>
      <img src={courseImageUrl} alt={title} title={title} style={courseImageStyle} />
      <div dangerouslySetInnerHTML={{ __html: introText }} />
      <hr />
    </>
  )
}

export default CoursePresentation
