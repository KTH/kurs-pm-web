import axios from 'axios'

function _getThisHost(url) {
  return url.slice(-1) === '/' ? url.slice(0, -1) : url
}
// eslint-disable-next-line consistent-return
async function getTermsWithCourseRounds(
  courseCode,
  thisHostBaseUrl = 'https://kth.se',
  proxyPrefixPath = { uri: '/kurs-pm' }
) {
  try {
    let hostUrl = thisHostBaseUrl
    if (origin.includes('app')) {
      hostUrl = hostUrl.replace('www', 'app')
    }
    const proxyUrl = `${_getThisHost(hostUrl)}${proxyPrefixPath.uri}`

    // example http://localhost:3000/kurs-pm/internApi/termsWithCourseRounds/${courseCode}
    const url = `${proxyUrl}/internApi/termsWithCourseRounds/${courseCode}`
    console.info('getTermsWithCourseRounds internal url', url)

    const result = await axios.get(url)

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
