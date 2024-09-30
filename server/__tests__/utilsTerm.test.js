const { convertTermToLadokPeriod } = require('../utils/term')

describe('convertTermToLadokPeriod', () => {
  it('should convert term to Ladok period format', () => {
    expect(convertTermToLadokPeriod('20221')).toStrictEqual('VT2022')
    expect(convertTermToLadokPeriod('20002')).toStrictEqual('HT2000')
    expect(convertTermToLadokPeriod('20231')).toStrictEqual('VT2023')
  })
})
