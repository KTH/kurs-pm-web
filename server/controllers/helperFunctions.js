const createRoundInfos = ladokRounds => {
  return ladokRounds.map(ladokRound => {
    const {
      forstaUndervisningsdatum,
      sistaUndervisningsdatum,
      utbildningstillfalleskod,
      kortnamn,
      startperiod,
      installt,
    } = ladokRound
    return {
      round: {
        firstTuitionDate: forstaUndervisningsdatum.date,
        lastTuitionDate: sistaUndervisningsdatum.date,
        startWeek: forstaUndervisningsdatum,
        endWeek: sistaUndervisningsdatum,
        applicationCode: utbildningstillfalleskod,
        shortName: kortnamn,
        startTerm: {
          term: startperiod.inDigits,
        },
        cancelled: installt,
      },
    }
  })
}

module.exports = {
  createRoundInfos,
}
