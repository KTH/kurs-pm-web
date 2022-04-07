jest.mock('../../kursPmDataApi', () => ({
  getMemoDataById: () => {},
  getMiniMemosPdfAndWeb: () => {},
}))
jest.mock('../../kursInfoApi', () => ({ getCourseInfo: () => {} }))
jest.mock('../../koppsApi', () => ({ getDetailedInformation: () => {} }))
jest.mock('../../api', () => {})
jest.mock('../../server', () => ({
  getPaths: () => [],
}))
jest.mock('../../configuration', () => ({
  server: {
    nodeApi: {},
    logging: {
      log: {
        level: 'debug',
      },
    },
    proxyPrefixPath: {
      uri: 'kurs-pm',
    },
    session: { sessionOptions: { secret: '' }, key: 'kurs-pm' },
    sessionSecret: '1234',
    blockApi: { blockUrl: 'http://localhost' },
    cache: {
      cortinaBlock: {
        redis: 'http://localhost',
      },
    },
  },
}))

const { markOutdatedMemoDatas } = require('../memoCtrl')

xdescribe('Mark Outdated Memo Datas', () => {
  test('Handles empy arguments', done => {
    const markedOutDatedMemoDatas = markOutdatedMemoDatas()
    expect(markedOutDatedMemoDatas).toEqual([])
    done()
  })
  test('Handles empy arguments', done => {
    const markedOutDatedMemoDatas = markOutdatedMemoDatas()
    expect(markedOutDatedMemoDatas).toEqual([])
    done()
  })
})
