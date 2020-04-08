import { observable, action, computed } from 'mobx'

class RouterStore {
  @observable courseCode

  @observable semester

  @observable language = 'sv'

  @observable allRoundInfos = []

  @observable memoDatas = []

  // This is really the current memo id
  @observable memoEndPoint = ''

  @observable imageFromAdmin

  @observable courseMainSubjects

  @observable title

  @observable credits

  @observable creditUnitAbbr

  @observable department

  @observable examiners

  @observable sellingText

  @computed get memoData() {
    const memoData = this.memoDatas.find((m) => m.memoEndPoint === this.memoEndPoint)
    return memoData || {}
  }

  @computed get roundIds() {
    return this.memoData.ladokRoundIds || []
  }

  @computed get roundInfos() {
    return this.allRoundInfos.filter((r) => r.round && this.roundIds.includes(r.round.ladokRoundId))
  }

  @action setBrowserConfig(config, paths, apiHost, profileBaseUrl) {
    this.browserConfig = config
    this.paths = paths
    this.apiHost = apiHost
    this.profileBaseUrl = profileBaseUrl
  }

  @action SSRsetCookieHeader(cookieHeader) {
    if (typeof window === 'undefined') {
      this.cookieHeader = cookieHeader || ''
    }
  }

  @computed get memoLanguage() {
    return this.memoData.memoCommonLangAbbr || this.language
  }

  @computed get memoLanguageIndex() {
    return this.memoLanguage === 'en' ? 0 : 1
  }

  initializeStore(storeName) {
    const store = this

    if (typeof window !== 'undefined' && window.__initialState__ && window.__initialState__[storeName]) {
      /* TODO:
        const util = globalRegistry.getUtility(IDeserialize, 'kursinfo-web')
        const importData = JSON.parse(decodeURIComponent(window.__initialState__[storeName]))
        console.log("importData",importData, "util",util)
        for (let key in importData) {
          // Deserialize so we get proper ObjectPrototypes
          // NOTE! We need to escape/unescape each store to avoid JS-injection
          store[key] = util.deserialize(importData[key])
        }
        delete window.__initialState__[storeName] */

      const tmp = JSON.parse(decodeURIComponent(window.__initialState__[storeName]))

      Object.keys(tmp).map((key) => {
        store[key] = tmp[key]
        delete tmp[key]
      })

      // Just a nice helper message
      if (Object.keys(window.__initialState__).length === 0) {
        window.__initialState__ = 'Mobx store state initialized'
      }
    }
  }

  activeMemoEndPoint(memoEndPoint) {
    return this.memoEndPoint === memoEndPoint
  }
}

export default RouterStore
