exports.incrementRound = round => {
  if (round === '1a') {
    return '1b';
  } else if (round === '1b') {
    return '2';
  }
  const roundNumber = parseInt(round);
  const nextRound = roundNumber + 1;
  return nextRound.toString();
}
