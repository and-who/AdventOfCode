import { importFile } from "../common/fileImporter";

const numbersStringMap = {
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  0: "0",
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
  zero: "0",
};

type numberType = keyof typeof numbersStringMap;

function getAllIndexes(str: string, val: numberType) {
  const indexes: number[] = [];
  let i = 0;

  while (i != -1) {
    i = str.indexOf("" + val, i);
    if (i != -1) {
      if (!indexes.includes(i)) {
        indexes.push(i);
      }

      i = i + 1;
    } else if (i === -1) {
      break;
    }
  }

  return indexes;
}

const getPositionIndizes = (str: string) => {
  console.log("getPositionIndizes", str);
  const positionIndizes: {
    index: number;
    key: numberType;
  }[] = [];

  (Object.keys(numbersStringMap) as numberType[]).forEach((key) => {
    console.log({ key });
    const allIndizes = getAllIndexes(str, key);
    console.log({ allIndizes });
    allIndizes.forEach((index) => {
      positionIndizes.push({ index, key });
    });
  });

  const sortedPositionIndizes = positionIndizes
    .filter((item) => item)
    .sort((a, b) => (a && b ? a.index - b.index : 0)) as {
    index: number;
    key: numberType;
  }[];

  if (!sortedPositionIndizes.length) {
    return [];
  }
  return sortedPositionIndizes;
};

const numberExtractor = (strings: string[]) => {
  let sum = 0;
  strings.forEach((line) => {
    const positionIndizes = getPositionIndizes(line);
    if (!positionIndizes.length) {
      return;
    }
    const firstNumber = numbersStringMap[positionIndizes[0].key];
    const lastNumber =
      numbersStringMap[positionIndizes[positionIndizes.length - 1].key];
    const combinedNumber = parseInt(firstNumber) * 10 + parseInt(lastNumber);
    sum += combinedNumber;
    console.log("*********** LineResult:");
    console.log(line, positionIndizes, firstNumber, lastNumber, combinedNumber);
  });

  return sum;
};

const main = () => {
  const inputData = importFile("./src/01/input.txt");

  if (!inputData) return;

  // split inputData into array of strings
  const lines = inputData.split("\n");

  //   const linesCleaned = lines.map(stringToNumberReplacer);

  //const result1 = numberExtractor(lines);
  const result2 = numberExtractor(lines);

  //console.log(`***********Result 1: ${result1}`);
  console.log(`***********Result 2: ${result2}`);
};

main();

//54225
//54249
