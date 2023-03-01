jest.mock('../configuration', () => ({
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

const { sortBySemesterAndName } = require('../kursPmDataApi')

describe('Sort memoDatas', () => {
  test('with empty list', done => {
    const memoDatas = []
    memoDatas.sort(sortBySemesterAndName)
    done()
  })
  test('by semester', done => {
    const spring18 = { semester: '20181' }
    const spring19 = { semester: '20191' }
    const fall19 = { semester: '20192' }
    const memoDatas = [spring19, spring18, fall19]
    memoDatas.sort(sortBySemesterAndName)
    expect(memoDatas).toEqual([fall19, spring19, spring18])
    done()
  })
  test('by ladok round id', done => {
    const spring181 = { semester: '20181', applicationCodes: [1] }
    const spring1823 = { semester: '20181', applicationCodes: [2, 3] }
    const spring184 = { semester: '20181', applicationCodes: [4] }
    const spring1924 = { semester: '20191', applicationCodes: [2, 4] }
    const spring193 = { semester: '20191', applicationCodes: [3] }
    const fall190 = { semester: '20192', applicationCodes: [] }
    const memoDatas = [spring1823, spring1924, spring181, spring184, fall190, spring193]
    memoDatas.sort(sortBySemesterAndName)
    expect(memoDatas).toEqual([fall190, spring1924, spring193, spring181, spring1823, spring184])
    done()
  })
})
