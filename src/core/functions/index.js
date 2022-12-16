const reelOdds = [
  [1, 2, 3, 4, 5, 6, 7, 2, 1, 1, 7, 3, 1, 3, 2, 5, 4, 6],
  [1, 2, 3, 4, 5, 6, 7, 4, 5, 1, 2, 3, 6, 3, 1, 3, 1, 5],
  [1, 2, 3, 4, 5, 6, 7, 2, 3, 6, 3, 4, 3, 4, 5, 1, 2, 2],
  [1, 2, 3, 4, 5, 6, 7, 1, 3, 5, 1, 5, 3, 2, 4, 2, 4, 2],
  [1, 2, 3, 4, 5, 6, 7, 2, 3, 2, 2, 5, 1, 1, 4, 3, 6, 1]
],
Bet = 1,
RTP = .95,
Rows = 3;

const generate = () => {
  let reelResult = [];
  reelOdds.forEach((reel, reelIndex) => {
    for(let row = 0; row < 3; row++){
      reelResult[reelIndex] = reelOdds[Math.floor(Math.random() * reel.length)];
    }
  })

  printResult(reelResult);
}

const printResult = (result) => {
  console.log(printResult);
}