import { parse } from "path";
import { importFile } from "../common/fileImporter";

const predictNextValues = (sensorDataLines: number[][]) => {
  let sum = 0;

  sensorDataLines.forEach((line) => {
    const currentSensorDataLine = [line];

    while (
      !currentSensorDataLine[currentSensorDataLine.length - 1].every(
        (element) => element === 0
      )
    ) {
      currentSensorDataLine.push([]);
      currentSensorDataLine[currentSensorDataLine.length - 2].forEach(
        (value, index) => {
          if (index !== 0) {
            currentSensorDataLine[currentSensorDataLine.length - 1].push(
              value -
                currentSensorDataLine[currentSensorDataLine.length - 2][
                  index - 1
                ]
            );
          }
        }
      );
    }
    currentSensorDataLine[currentSensorDataLine.length - 1].push(0);

    for (let i = currentSensorDataLine.length - 2; i >= 0; i--) {
      currentSensorDataLine[i].push(
        currentSensorDataLine[i + 1][currentSensorDataLine[i + 1].length - 1] +
          currentSensorDataLine[i][currentSensorDataLine[i].length - 1]
      );
    }

    sum += currentSensorDataLine[0][currentSensorDataLine[0].length - 1];
  });

  console.log({ sum });
};

const main = () => {
  const inputData = importFile("./src/09/input.txt");
  if (inputData === undefined) return;

  const sensorDataLines = inputData
    .split("\n")
    .map((line) => line.split(" ").map((value) => parseInt(value)));

  const reversedSensorDataLines = inputData.split("\n").map((line) =>
    line
      .split(" ")
      .map((value) => parseInt(value))
      .reverse()
  );

  predictNextValues(sensorDataLines);
  predictNextValues(reversedSensorDataLines);
};

main();

//2175229268 to high
