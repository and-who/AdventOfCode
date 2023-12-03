import { importFile } from "../common/fileImporter";

const redValueRegex = /(?<=.)(\d*)(?= red)/g;
const blueValueRegex = /(?<=.)(\d*)(?= blue)/g;
const greenValueRegex = /(?<=.)(\d*)(?= green)/g;

const maxCubes = {
  red: 12,
  green: 13,
  blue: 14,
};

const main = () => {
  const inputData = importFile("./src/02/input.txt");
  if (inputData === undefined) return;

  const lines = inputData.split("\n");

  const result1 = lines
    .reduce<number[]>((acc, line, index) => {
      const maxValues = line.split(";").reduce(
        (acc, turn) => {
          const red = parseInt(turn.match(redValueRegex)?.[0] || "0");
          const green = parseInt(turn.match(greenValueRegex)?.[0] || "0");
          const blue = parseInt(turn.match(blueValueRegex)?.[0] || "0");
          return {
            red: Math.max(acc.red, red),
            green: Math.max(acc.green, green),
            blue: Math.max(acc.blue, blue),
          };
        },
        { red: 0, green: 0, blue: 0 }
      );

      if (
        maxValues.red <= maxCubes.red &&
        maxValues.green <= maxCubes.green &&
        maxValues.blue <= maxCubes.blue
      ) {
        return [...acc, index + 1];
      } else {
        return acc;
      }
    }, [])
    .reduce((acc, val) => acc + val, 0);

  const result2 = lines.reduce<number>((acc, line, index) => {
    const maxValues = line.split(";").reduce(
      (acc, turn) => {
        const red = parseInt(turn.match(redValueRegex)?.[0] || "0");
        const green = parseInt(turn.match(greenValueRegex)?.[0] || "0");
        const blue = parseInt(turn.match(blueValueRegex)?.[0] || "0");
        return {
          red: Math.max(acc.red, red),
          green: Math.max(acc.green, green),
          blue: Math.max(acc.blue, blue),
        };
      },
      { red: 0, green: 0, blue: 0 }
    );

    const powerOfTurn = maxValues.red * maxValues.green * maxValues.blue;

    return acc + powerOfTurn;
  }, 0);

  console.log("Result1", result1);
  console.log("Result2", result2);
};

main();

//Result1 2551
//Result2 62811
