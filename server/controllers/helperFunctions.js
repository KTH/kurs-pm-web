const createRoundInfos = ladokRounds => {
  return ladokRounds.map(ladokRound => {
    const { forstaUndervisningsdatum, sistaUndervisningsdatum, utbildningstillfalleskod, kortnamn, startperiod } =
      ladokRound
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
      },
    }
  })
}

module.exports = {
  createRoundInfos,
}
