const createRoundInfos = (ladokRounds, koppsRoundInfos) => {
  return ladokRounds.map(ladokRound => {
    const { round: koppsRound } = koppsRoundInfos.find(roundInfo => roundInfo?.round?.ladokUID === ladokRound.uid) || {}
    const { forstaUndervisningsdatum, sistaUndervisningsdatum, kortnamn, startperiod } = ladokRound
    const { applicationCodes, shortName } = koppsRound || {}
    return {
      round: {
        firstTuitionDate: forstaUndervisningsdatum.date,
        lastTuitionDate: sistaUndervisningsdatum.date,
        startWeek: forstaUndervisningsdatum,
        endWeek: sistaUndervisningsdatum,
        applicationCodes,
        shortName: kortnamn || shortName,
        startTerm: {
          term: startperiod.code,
        },
      },
    }
  })
}

module.exports = {
  createRoundInfos,
}
