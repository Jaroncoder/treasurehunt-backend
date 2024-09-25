const incrementRound = round => {
  if (round === '1A') {
    return '1B';
  } else if (round === '1B') {
    return '2';
  }
  const roundNumber = parseInt(round);
  const nextRound = roundNumber + 1;
  return nextRound.toString();
}

module.exports = incrementRound
