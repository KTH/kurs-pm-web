const redirectToAboutCourseConfig = (state, hostUrl, proxiPrefixPathUri, courseCode) => {
  const url = new URL(`${proxiPrefixPathUri}/${courseCode}/om-kurs-pm`, hostUrl)
  url.search = new URLSearchParams(state)

  return [302, url.href]
}

module.exports = {
  redirectToAboutCourseConfig,
}
