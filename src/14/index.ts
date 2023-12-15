import { parse } from "path";
import { importFile } from "../common/fileImporter";

const display2DArray = (array: any[][]) => {
  array.forEach((line) => {
    console.log(line.join(""));
  });
};

const transpose = (matrix: any[][]) => {
  return matrix[0].map((col, i) => matrix.map((row) => row[i]));
};

const rotate = (matrix: any[][]) => {
  return matrix.reverse().map((_, i) => matrix.map((row) => row[i]));
};

let result = 0;

const tiltModel = (model: string[][]) => {
  result = 0;
  return model.map((line) => {
    let leftmostIndex = line.length;
    const newLine = [...line];
    line.forEach((char, index) => {
      if (char === "." && index < leftmostIndex) {
        leftmostIndex = index;
      }
      if (char === "O") {
        if (index > leftmostIndex) {
          newLine[leftmostIndex] = char;
          newLine[index] = ".";
          leftmostIndex++;
        } else {
          if (index === leftmostIndex) {
            leftmostIndex++;
          }
        }

        const newIndex = Math.min(index, leftmostIndex - 1);
        const weight = line.length - newIndex;
        result += weight;
        //        console.log({ lineLength: line.length, newIndex, weight });
      }
      if (char === "#" && index >= leftmostIndex) {
        leftmostIndex = index + 1;
      }
    });
    return newLine;
  });
};

const main = () => {
  const inputData = importFile("./src/14/input.txt");
  if (inputData === undefined) return;
  const model = inputData.split("\n").map((line) => {
    return [...line];
  });

  let transposedModel = model;

  for (let i = 0; i < 3 * 4; i++) {
    console.log(display2DArray(transposedModel));
    transposedModel = rotate(transposedModel);
    transposedModel = tiltModel(transposedModel);
  }

  console.log({ result });
};

main();
