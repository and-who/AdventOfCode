import { parse } from "path";
import { importFile } from "../common/fileImporter";

const main = () => {
  const inputData = importFile("./src/06/input.txt");
  if (inputData === undefined) return;

  const lines = inputData.split("\n").map((line) => line.replace(/\s+/g, " "));

  console.log({ lines });

  const times = lines[0]
    .split(": ")[1]
    .split(" ")
    .map((x) => parseInt(x));

  const records = lines[1]
    .split(": ")[1]
    .split(" ")
    .map((x) => parseInt(x));

  times.forEach((time, index) => {
    let bottom = 0;
    let top = 0;
    for (let i = 1; i < time; i++) {
      const distance = (time - i) * i;
      if (distance > records[index]) {
        console.log("bottom", { i, distance });
        bottom = i;
        break;
      }
    }
    for (let i = time; i > 0; i--) {
      const distance = (time - i) * i;
      if (distance > records[index]) {
        console.log("top", { i, distance });
        top = i;
        break;
      }
    }
    console.log("sumSolutions", top - bottom + 1);
  });
};

main();
