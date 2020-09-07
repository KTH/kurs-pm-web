jest.mock('../../configuration', () => ({
  server: {
    logging: { log: { level: 'info' } },
    proxyPrefixPath: {},
    session: { options: { sessionOptions: { secret: '' } } }
  }
}))
jest.mock('../../api', () => {})
jest.mock('../../server', () => ({
  getPaths: () => []
}))
jest.mock('../../koppsApi', () => ({}))
// jest.mock('../../kursInfoApi', () => ({
//   getCourseInfo: () => {}
// }))
// jest.mock('../../kursPmDataApi', () => ({
//   getMemoDataById: () => {}
// }))

const memoCtrl = require('../memoCtrl')

describe('Course introduction', () => {
  test('use selling text from kursinfo-api, if availaible in memo language', (done) => {
    const sellingText = { en: 'sellingText', sv: 'säljandeText' }
    const recruitmentText = 'recruitmentText'
    const memoLanguage = 'en'
    const text = memoCtrl.resolveSellingText(sellingText, recruitmentText, memoLanguage)
    expect(text).toBe(sellingText[memoLanguage])
    done()
  })
  test('use recruitment text, if selling text from kursinfo-api is not availaible in memo language', (done) => {
    const sellingText = { en: 'sellingText', sv: '' }
    const recruitmentText = 'recruitmentText'
    const memoLanguage = 'sv'
    const text = memoCtrl.resolveSellingText(sellingText, recruitmentText, memoLanguage)
    expect(text).toBe(recruitmentText)
    done()
  })
})
