import { parse } from "path";
import { importFile } from "../common/fileImporter";

const transpose = (matrix: any[][]) => {
  return matrix[0].map((col, i) => matrix.map((row) => row[i]));
};

const arrayIsEual = (array1: boolean[], array2: boolean[]) => {
  const array1Value = array1.reduce((acc, bool) => (acc << 1) | +bool, 0);
  const array2Value = array2.reduce((acc, bool) => (acc << 1) | +bool, 0);

  return array1Value === array2Value;
};

const findHorizontalMirror = (pattern: boolean[][]) => {
  let horizontalMirrorIndex;
  pattern.forEach((line, index) => {
    if (index > 0) {
      // Find two Matching Lines
      if (arrayIsEual(line, pattern[index - 1])) {
        // Check if all Mirrors
        const upperPattern = pattern.slice(0, index - 1).reverse();
        const lowerPattern = pattern.slice(index + 1);
        let isMirror = true;
        for (
          let i = 0;
          i < Math.min(upperPattern.length, lowerPattern.length);
          i++
        ) {
          if (!arrayIsEual(upperPattern[i], lowerPattern[i])) {
            isMirror = false;
            break;
          }
        }
        if (isMirror) {
          horizontalMirrorIndex = index;
        }
      }
    }
  });
  return horizontalMirrorIndex;
};

const main = () => {
  const inputData = importFile("./src/13/input.txt");
  if (inputData === undefined) return;
  const model = inputData.split("\n\n").map((grid) => {
    const lines = grid.split("\n");
    const pattern = lines.map((line) => {
      return [...line].map((char) => {
        return char === "#" ? true : false;
      });
    });
    return pattern;
  });

  // let result01 = 0;

  // model.forEach((pattern) => {
  //   const horizontalMirrorIndex = findHorizontalMirror(pattern);
  //   const verticalMirrorIndex = findHorizontalMirror(transpose(pattern));

  //   console.log({ horizontalMirrorIndex, verticalMirrorIndex });

  //   if (horizontalMirrorIndex) {
  //     result01 += horizontalMirrorIndex * 100;
  //   }
  //   if (verticalMirrorIndex) {
  //     result01 += verticalMirrorIndex;
  //   }
  // });

  // console.log({ result01 });

  let result01 = 0;

  let result02 = 0;
  model.forEach((pattern, index) => {
    let smugeResult = 0;
    const horizontalMirrorIndexOriginal = findHorizontalMirror(pattern);
    const verticalMirrorIndexOriginal = findHorizontalMirror(
      transpose(pattern)
    );

    if (horizontalMirrorIndexOriginal) {
      smugeResult += horizontalMirrorIndexOriginal * 100;
    }
    if (verticalMirrorIndexOriginal) {
      smugeResult += verticalMirrorIndexOriginal;
    }

    result01 = smugeResult + result01;

    let resultFound = false;
    let foundIndexPairs = [];
    console.log("Pattern", index);
    pattern.forEach((line, y) => {
      line.forEach((bool, x) => {
        let cleanedResult = 0;

        const patternCopy = pattern.map((line) => [...line]);
        patternCopy[y][x] = !bool;
        const horizontalMirrorIndex = findHorizontalMirror(patternCopy);
        const verticalMirrorIndex = findHorizontalMirror(
          transpose(patternCopy)
        );
        const mirrorIndexPair = `${horizontalMirrorIndex}-${verticalMirrorIndex}`;
        if (foundIndexPairs.includes(mirrorIndexPair)) {
          return;
        }
        foundIndexPairs.push(mirrorIndexPair);

        if (
          horizontalMirrorIndex &&
          horizontalMirrorIndex !== horizontalMirrorIndexOriginal
        ) {
          cleanedResult += horizontalMirrorIndex * 100;
        }
        if (
          verticalMirrorIndex &&
          verticalMirrorIndex !== verticalMirrorIndexOriginal
        ) {
          cleanedResult += verticalMirrorIndex;
        }
        if (cleanedResult !== 0) {
          resultFound = true;
          result02 = cleanedResult + result02;
          console.log({
            pattern,
            patternCopy,
            x,
            y,
            horizontalMirrorIndexOriginal,
            horizontalMirrorIndex,
            verticalMirrorIndexOriginal,
            verticalMirrorIndex,
            smugeResult,
            cleanedResult,
            result02,
          });
        }
      });
    });
  });

  console.log({ result01, result02: result02 });
};

main();

//34918

// Result 2
// 34323 to high

// 29001 to Low
