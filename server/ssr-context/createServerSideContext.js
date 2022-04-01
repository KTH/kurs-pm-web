/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

// eslint-disable-next-line no-unused-vars

function setBrowserConfig(config, paths, apiHost, thisHostBaseUrl) {
  this.browserConfig = config
  this.paths = paths
  this.apiHost = apiHost
  this.thisHostBaseUrl = thisHostBaseUrl
}

function resolveMemoLanguage() {
  return this.memoData.memoCommonLangAbbr || this.language
}

function createServerSideContext() {
  const context = {
    browserConfig: {},
    courseCode: '',
    courseMainSubjects: '',
    imageFromAdmin: '',
    language: 'sv',
    memoDatas: [],
    memoEndPoint: '',
    memoLanguage: 'sv',
    title: '',
    credits: '',
    creditUnitAbbr: '',
    infoContactName: '',
    sellingText: '',
    semester: '',
    examiners: '',
    userLanguageIndex: 1,
    ..._createLatestMemoAddition(),
    resolveMemoLanguage,
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
