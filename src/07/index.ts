import { parse } from "path";
import { importFile } from "../common/fileImporter";

const cardValueMap = {
  A: 13,
  K: 12,
  Q: 11,
  J: 1,
  T: 10,
  "10": 10,
  "9": 9,
  "8": 8,
  "7": 7,
  "6": 6,
  "5": 5,
  "4": 4,
  "3": 3,
  "2": 2,
};

const calcScore = (hand: number[]) => {
  const counts = {};
  for (const num of hand) {
    counts[num] = counts[num] ? counts[num] + 1 : 1;
  }

  let numJokers = counts[1] || 0;

  if (numJokers && numJokers != 5) {
    delete counts[1];
    console.log("Joker", numJokers);
    let highestFace = Object.keys(counts)[0];
    let highestFacePower = counts[Object.keys(counts)[0]];

    Object.keys(counts).forEach((key) => {
      if (counts[key] > highestFacePower) {
        highestFace = key;
        highestFacePower = counts[key];
      }
    });

    console.log({ highestFace });
    counts[highestFace] = counts[highestFace] + numJokers;
  }

  let score = 0;
  Object.keys(counts).forEach((key) => {
    score = score + Math.pow(10, counts[key]);
  });

  score = score * 1000000000000;

  hand.forEach((card, index) => {
    score = score + card * Math.pow(10, (5 - index) * 2);
  });

  console.log({ hand, counts, score });
  return score;
};

const main = () => {
  const inputData = importFile("./src/07/input.txt");
  if (inputData === undefined) return;

  const hands = inputData.split("\n").map((line) => {
    const splitedLine = line.split(" ");
    return {
      hand: [...splitedLine[0]].map((card) => cardValueMap[card]),
      //.sort((a, b) => b - a),
      bid: parseInt(splitedLine[1]),
    };
  });

  const handsWithScore = hands
    .map((hand) => {
      return { hand: hand.hand, bid: hand.bid, score: calcScore(hand.hand) };
    })
    .sort((a, b) => b.score - a.score);

  const result1 = handsWithScore.reduce((acc, curr, index) => {
    return acc + curr.bid * (handsWithScore.length - index);
    return acc;
  }, 0);

  console.log({ handsWithScore, result1 });
};

main();

//250081330

//250577675 to high
// 250506580
