import axios from 'axios'

// eslint-disable-next-line consistent-return
async function getTermsWithCourseRounds(courseCode) {
  try {
    const result = await axios.get(`/termsWithCourseRounds/${courseCode}`)
    if (result) {
      if (result.status >= 400) {
        return 'ERROR-INTERN-API' + result.status
      }
      const { data } = result
      return data
    }
  } catch (error) {
    if (error.response) {
      throw new Error('Unexpected error from intern API ' + error.message)
    }
    throw error
  }
}

export default getTermsWithCourseRounds
