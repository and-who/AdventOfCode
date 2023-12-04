import { parse } from "path";
import { importFile } from "../common/fileImporter";

const main = () => {
  const inputData = importFile("./src/04/input.txt");
  if (inputData === undefined) return;

  const result1 = inputData
    .split("\n")
    .map((line) => {
      const lineContent = line
        .split(": ")[1]
        .replaceAll("  ", " ")
        .split(" | ");

      const winningNumbers = lineContent[0].split(" ").map((number) => {
        return parseInt(number);
      });

      const drawnNumbers = lineContent[1].split(" ").map((number) => {
        return parseInt(number);
      });

      const score = drawnNumbers.reduce((acc, number) => {
        if (winningNumbers.includes(number)) {
          if (acc === 0) {
            return 1;
          }
          return acc * 2;
        }
        return acc;
      }, 0);
      console.log(score);
      return score;
    })
    .reduce((acc, score) => {
      return acc + score;
    });

  console.log({ result1 });

  const originalScratchCards = inputData.split("\n").map((line, index) => {
    const lineContent = line.split(": ")[1].replaceAll("  ", " ").split(" | ");

    const winningNumbers = lineContent[0].split(" ").map((number) => {
      return parseInt(number);
    });

    const drawnNumbers = lineContent[1].split(" ").map((number) => {
      return parseInt(number);
    });

    const score = drawnNumbers.reduce((acc, number) => {
      if (winningNumbers.includes(number)) {
        return acc + 1;
      }
      return acc;
    }, 0);

    console.log(score);
    return { winningNumbers, drawnNumbers, index, score };
  });

  let index = 0;
  const totalScratchCards = [...originalScratchCards];

  while (index < totalScratchCards.length) {
    const card = totalScratchCards[index];

    for (let i = 1; i <= card.score; i++) {
      totalScratchCards.push(originalScratchCards[card.index + i]);
    }

    index++;
  }

  const result2 = totalScratchCards.length;

  console.log({ result2 });
};

main();

// 21088
