/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

// eslint-disable-next-line no-unused-vars

function setBrowserConfig(config, paths, apiHost, thisHostBaseUrl) {
  this.browserConfig = config
  this.paths = paths
  this.apiHost = apiHost
  this.thisHostBaseUrl = thisHostBaseUrl
}

function createServerSideContext() {
  const context = {
    browserConfig: {},
    courseCode: '',
    courseMainSubjects: '',
    language: 'sv',
    memoData: {},
    memoDatas: [],
    memoEndPoint: '',
    memoLanguage: 'sv',
    title: '',
    credits: '',
    creditUnitAbbr: '',
    infoContactName: '',
    semester: '',
    examiners: '',
    userLanguageIndex: 1,
    termsWithCourseRounds: [],
    ..._createLatestMemoAddition(),
    setBrowserConfig,
  }
  return context
}

function _createLatestMemoAddition() {
  return {
    latestMemoLabel: '',
  }
}

module.exports = { createServerSideContext }
