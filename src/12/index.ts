import { parse } from "path";
import { importFile } from "../common/fileImporter";

const isValidSpringList = (springList: string[], springCountList: number[]) => {
  const calculatedSpringCountList = [];
  let springCount = 0;
  springList.forEach((spring, index) => {
    if (spring === "#") {
      springCount++;
    } else if (springCount > 0) {
      calculatedSpringCountList.push(springCount);
      springCount = 0;
    }
  });
  if (springCount > 0) {
    calculatedSpringCountList.push(springCount);
  }

  const arraysAreEqual =
    calculatedSpringCountList.toString() === springCountList.toString();

  return arraysAreEqual;
};

const calcPossileSolutions = (
  springListWithErrors: string[],
  springCountList: number[]
) => {
  const numberOfUnknownSprings = springListWithErrors.reduce((acc, spring) => {
    if (spring === "?") {
      acc++;
    }
    return acc;
  }, 0);

  const maxValue = Math.pow(2, numberOfUnknownSprings);
  const numberOfSpringsToFill = springCountList.reduce((acc, springCount) => {
    acc += springCount;
    return acc;
  }, 0);

  let sumSolutions = 0;

  var baseArray = Array([...maxValue.toString(2)].length - 1).fill(".");
  for (let index = 0; index < Math.pow(2, numberOfUnknownSprings); index++) {
    const possibleFillIns = [...index.toString(2)].map((char) =>
      char === "1" ? "#" : "."
    );
    let totalNumberSprings = springListWithErrors.reduce((acc, spring) => {
      if (spring === "#") {
        acc++;
      }
      return acc;
    }, 0);
    totalNumberSprings += possibleFillIns.reduce((acc, spring) => {
      if (spring === "#") {
        acc++;
      }
      return acc;
    }, 0);

    const numbersMatch = totalNumberSprings === numberOfSpringsToFill;

    if (!numbersMatch) {
      continue;
    }

    const extendedPossibleFillIns = [
      ...baseArray.slice(possibleFillIns.length),
      ...possibleFillIns,
    ];
    const extendedPossibleFillInsCopy = [...extendedPossibleFillIns];
    const exampleSpringList = springListWithErrors.map((spring, index) => {
      if (spring === "?") {
        return extendedPossibleFillInsCopy.shift();
      }
      return spring;
    });

    if (isValidSpringList(exampleSpringList, springCountList)) {
      sumSolutions++;
    }
  }
  console.log({ sumSolutionsLine: sumSolutions });
  return sumSolutions;
};

const main = () => {
  const inputData = importFile("./src/12/input.txt");
  if (inputData === undefined) return;
  const model = inputData.split("\n").map((line) => {
    const [springListWithErrors, springCountList] = line.split(" ");
    const singleSpringCountList = springCountList
      .split(",")
      .map((springCount) => parseInt(springCount));
    // return {
    //   springListWithErrors: [...springListWithErrors],
    //   springCountList: singleSpringCountList,
    // };
    return {
      springListWithErrors: [
        ...springListWithErrors,
        ...springListWithErrors,
        ...springListWithErrors,
        ...springListWithErrors,
        ...springListWithErrors,
      ],
      springCountList: [
        ...singleSpringCountList,
        ...singleSpringCountList,
        ...singleSpringCountList,
        ...singleSpringCountList,
        ...singleSpringCountList,
      ],
    };
  });

  console.log(model);

  let totalSumSolutions = 0;

  model.forEach((line) => {
    totalSumSolutions += calcPossileSolutions(
      line.springListWithErrors,
      line.springCountList
    );
  });

  console.log({ totalSumSolutions });
};

main();

//8193
