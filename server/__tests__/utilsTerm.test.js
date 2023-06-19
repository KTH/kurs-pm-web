const { extractTerm } = require('../utils/term')

describe('extractTerm', () => {
  it('should extract a correct term', () => {
    expect(extractTerm('AK1214', 'AK121420221-45001')).toStrictEqual('20221')
    expect(extractTerm('AK1210', 'AK121020002-434001')).toStrictEqual('20002')
    expect(extractTerm('MG10001', 'MG1000120231-2')).toStrictEqual('20231')
  })
})
