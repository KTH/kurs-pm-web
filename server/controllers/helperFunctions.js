const createRoundInfos = (ladokRounds, koppsRoundInfos) => {
  return ladokRounds.map(ladokRound => {
    const { round: koppsRound } = koppsRoundInfos.find(roundInfo => roundInfo?.round?.ladokUID === ladokRound.uid) || {}
    const { forstaUndervisningsdatum, sistaUndervisningsdatum, kortnamn, startperiod } = ladokRound
    const { applicationCodes } = koppsRound || {}
    return {
      round: {
        firstTuitionDate: forstaUndervisningsdatum.date,
        lastTuitionDate: sistaUndervisningsdatum.date,
        startWeek: forstaUndervisningsdatum,
        endWeek: sistaUndervisningsdatum,
        applicationCodes,
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
