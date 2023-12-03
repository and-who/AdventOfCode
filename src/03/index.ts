import { importFile } from "../common/fileImporter";

const symbolRegex = /([^.\d])/g;
const gearRegex = /\*/g;
const numberRegex = /(\d+)/g;
const fullNumberRegex = /\d*/g;

const main = () => {
  const inputData = importFile("./src/03/input.txt");
  if (inputData === undefined) return;

  const grid = inputData.split("\n").map((line) => line.split(""));

  const getNumbersAround = (x: number, y: number) => {
    let numbers: { x: number; y: number }[] = [];

    for (let i = x - 1; i <= x + 1; i++) {
      if (grid[i] === undefined) continue;
      for (let j = y - 1; j <= y + 1; j++) {
        if (grid[i][j] === undefined) continue;
        if (i === x && j === y) continue;
        if (grid[i][j].match(numberRegex)) {
          const alredyFound = numbers.find(
            (n) => n.x === i && (n.y === j + 1 || n.y === j - 1)
          );
          if (alredyFound) {
            const filteredArray = numbers.filter(
              (number) =>
                number.x !== alredyFound.x || number.y !== alredyFound.y
            );
            console.log("Already found", {
              numbers,
              alredyFound,
              i,
              j,
              filteredArray,
            });

            numbers = filteredArray;
          }
          numbers.push({ x: i, y: j });
        }
      }
    }
    return numbers;
  };

  const getNumberStartIndex: (x: number, y: number) => number = (x, y) => {
    if (y <= -1) return 0;

    if (Number.isNaN(parseInt(grid[x][y]))) return y + 1;

    return getNumberStartIndex(x, y - 1);
  };

  const getFullNumber = (x: number, y: number) => {
    //if (x === 9 && y === 2) debugger;
    let startY = getNumberStartIndex(x, y);
    const fullNumberString = grid[x]
      .join("")
      .substring(startY)
      .match(fullNumberRegex)?.[0];

    if (fullNumberString === undefined) throw new Error("No full number found");

    const fullNumber = parseInt(fullNumberString);
    console.log(`Full number: ${fullNumber} at ${x},${y} with start ${startY}`);
    return fullNumber;
  };

  let result1 = 0;

  grid.forEach((line, x) => {
    line.forEach((char, y) => {
      if (char.match(symbolRegex)) {
        console.log(
          `Symbol found: '${char}'(${char.charCodeAt(0)}) at ${x},${y}`
        );
        const numbers = getNumbersAround(x, y);
        console.log(`Numbers around: ${JSON.stringify(numbers)}`);
        numbers.forEach((n) => {
          const fullNumber = getFullNumber(n.x, n.y);
          result1 += fullNumber;
        });
      }
    });
  });

  console.log(`Result 1: ${result1}`);

  let result2 = 0;
  grid.forEach((line, x) => {
    line.forEach((char, y) => {
      if (char.match(gearRegex)) {
        const numbers = getNumbersAround(x, y);
        const fullNumbers = numbers.map((n) => getFullNumber(n.x, n.y));
        if (fullNumbers.length !== 2) return;
        result2 += fullNumbers[0] * fullNumbers[1];
      }
    });
  });

  console.log(`Result 2: ${result2}`);
};

main();

// 608276
// 525911
